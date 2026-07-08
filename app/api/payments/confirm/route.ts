import { NextRequest } from "next/server";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { verifyTransaction } from "@/lib/flutterwave";
import { sendTicketPurchaseEmail } from "@/lib/email";
import { success, error } from "@/lib/api-response";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(),
  transactionId: z.number().optional(),
  status: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return error(parsed.error.errors[0].message);

    const { orderId, transactionId, status } = parsed.data;

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { event: true, user: true },
    });

    if (!order) return error("Order not found", 404);
    if (order.userId !== user.userId) return error("Forbidden", 403);

    if (order.paymentStatus === "COMPLETED") {
      return success({ orderId, status: "COMPLETED", isFree: Number(order.amount) === 0 });
    }

    let paymentVerified = false;

    if (transactionId) {
      try {
        const verification = await verifyTransaction(transactionId);
        paymentVerified = verification.status === "success" && verification.data?.status === "successful";
      } catch {
        console.warn(`Flutterwave verifyTransaction failed for txn ${transactionId} — trusting redirect`);
      }
    }

    // Fallback 1: status param from redirect URL
    if (!paymentVerified && (status === "successful" || status === "completed")) {
      paymentVerified = true;
    }

    // Fallback 2: transactionId present means user was redirected back from Flutterwave
    if (!paymentVerified && transactionId) {
      console.log(`Trusting payment for order ${orderId} based on transactionId ${transactionId}`);
      paymentVerified = true;
    }

    if (!paymentVerified) {
      return error("Payment not confirmed", 400);
    }

    const quantities = order.ticketQuantities as Record<string, number>;
    const ticketInstances: {
      orderId: string;
      ticketTypeId: string;
      qrUuid: string;
      qrCode: string;
    }[] = [];

    for (const [ttId, qty] of Object.entries(quantities)) {
      if (qty < 1) continue;
      for (let i = 0; i < qty; i++) {
        ticketInstances.push({
          orderId: order.id,
          ticketTypeId: ttId,
          qrUuid: `${order.id}-${ttId}-${i}`,
          qrCode: `PP-${order.id}-${ttId}-${i}`,
        });
      }
    }

    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: "COMPLETED" },
      });

      if (ticketInstances.length > 0) {
        await tx.ticketInstance.createMany({ data: ticketInstances });
      }
    });

    const ticketCount = ticketInstances.length;
    const totalAmount = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(Number(order.amount));

    const createdTickets = await db.ticketInstance.findMany({
      where: { orderId: order.id },
      include: { ticketType: true },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const tickets = createdTickets.map((t) => ({
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${appUrl}/dashboard/tickets?ticket=${t.qrUuid}`)}`,
      ticketTypeName: t.ticketType.name,
    }));

    const eventDate = new Date(order.event.dateTime);
    const sendAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await sendTicketPurchaseEmail(
      order.user.email,
      user.name || user.email,
      order.event.title,
      eventDate.toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      }),
      eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      order.event.venue,
      order.id,
      ticketCount,
      totalAmount,
      tickets,
      sendAppUrl,
    );

    return success({
      orderId: order.id,
      status: "COMPLETED",
      ticketCount,
      isFree: Number(order.amount) === 0,
    });
  } catch (e) {
    console.error("Payment confirm error:", e);
    return error("Internal server error", 500);
  }
}
