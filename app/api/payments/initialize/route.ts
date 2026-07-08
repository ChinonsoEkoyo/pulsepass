import { NextRequest } from "next/server";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { initiatePayment } from "@/lib/flutterwave";
import { success, error } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendTicketPurchaseEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  eventId: z.string(),
  ticketTypeIds: z.array(z.string()),
  quantities: z.record(z.string(), z.number().int().positive()),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const limit = checkRateLimit(`payment:${user.userId}:${ip}`);
    if (!limit.allowed) {
      return error("Too many requests. Try again later.", 429);
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return error(parsed.error.errors[0].message);
    }

    const { eventId, ticketTypeIds, quantities } = parsed.data;

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { ticketTypes: true },
    });
    if (!event) return error("Event not found", 404);

    let totalAmount = 0;
    for (const ttId of ticketTypeIds) {
      const ticketType = event.ticketTypes.find((t) => t.id === ttId);
      if (!ticketType) return error(`Ticket type ${ttId} not found`);
      const qty = quantities[ttId] || 0;
      totalAmount += Number(ticketType.price) * qty;
    }

    if (totalAmount <= 0) return error("Invalid amount");

    const txRef = `PP-${Date.now()}-${user.userId.slice(0, 8)}`;

    const order = await db.order.create({
      data: {
        userId: user.userId,
        eventId,
        amount: totalAmount,
        ticketQuantities: quantities,
        paymentStatus: "PENDING",
      },
    });

    if (totalAmount === 0) {
      await db.order.update({
        where: { id: order.id },
        data: { paymentStatus: "COMPLETED" },
      });

      const ticketInstances = [];
      for (const [ttId, qty] of Object.entries(quantities)) {
        for (let i = 0; i < qty; i++) {
          ticketInstances.push({
            orderId: order.id,
            ticketTypeId: ttId,
            qrUuid: `${order.id}-${ttId}-${i}`,
            qrCode: `PP-${order.id}-${ttId}-${i}`,
          });
        }
      }

      await db.ticketInstance.createMany({ data: ticketInstances });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const freeTickets = ticketInstances.map((t) => ({
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${appUrl}/dashboard/tickets?ticket=${t.qrUuid}`)}`,
        ticketTypeName: "General",
      }));
      const initAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const initEventDate = new Date(event.dateTime);
      await sendTicketPurchaseEmail(
        user.email,
        user.name || user.email,
        event.title,
        initEventDate.toLocaleDateString("en-US", {
          weekday: "long", month: "long", day: "numeric", year: "numeric",
        }),
        initEventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        event.venue,
        order.id,
        ticketInstances.length,
        "Free",
        freeTickets,
        initAppUrl,
      );

      return success({ orderId: order.id, paymentLink: null });
    }

    const paymentResult = await initiatePayment({
      txRef,
      amount: totalAmount,
      email: user.email,
      name: user.email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/events/${eventId}?order_id=${order.id}`,
    });

    if (paymentResult.status !== "success" || !paymentResult.data) {
      await db.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });
      return error(paymentResult.message || "Payment initialization failed", 500);
    }

    await db.payment.create({
      data: {
        orderId: order.id,
        flutterwaveTxnRef: txRef,
        amount: totalAmount,
        status: "PENDING",
      },
    });

    return success({
      orderId: order.id,
      paymentLink: paymentResult.data.link,
    });
  } catch (e) {
    console.error("Payment init error:", e);
    return error("Internal server error", 500);
  }
}
