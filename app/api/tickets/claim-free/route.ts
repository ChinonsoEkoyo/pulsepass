import { NextRequest } from "next/server";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { getAppUrl } from "@/lib/app-url";
import { success, error } from "@/lib/api-response";
import { sendTicketPurchaseEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  eventId: z.string(),
  ticketTypeId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return error(parsed.error.errors[0].message);

    const { eventId, ticketTypeId } = parsed.data;

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { ticketTypes: true },
    });
    if (!event) return error("Event not found", 404);

    const ticketType = event.ticketTypes.find((t) => t.id === ticketTypeId);
    if (!ticketType) return error("Ticket type not found", 404);
    if (Number(ticketType.price) !== 0) return error("Ticket is not free", 400);

    const order = await db.order.create({
      data: {
        userId: user.userId,
        eventId,
        amount: 0,
        ticketQuantities: { [ticketTypeId]: 1 },
        paymentStatus: "COMPLETED",
      },
    });

    const ticketInstance = await db.ticketInstance.create({
      data: {
        orderId: order.id,
        ticketTypeId: ticketType.id,
        qrUuid: `${order.id}-${ticketType.id}-0`,
        qrCode: `PP-${order.id}-${ticketType.id}-0`,
      },
      include: {
        order: { include: { event: true } },
        ticketType: true,
      },
    });

    const appUrl = getAppUrl(request);
    const claimTickets = [{
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${appUrl}/dashboard/tickets?ticket=${ticketInstance.qrUuid}`)}`,
      ticketTypeName: ticketInstance.ticketType?.name || "General",
    }];
    const claimAppUrl = getAppUrl(request);
    const claimEventDate = new Date(event.dateTime);
    await sendTicketPurchaseEmail(
      user.email,
      user.name || user.email,
      event.title,
      claimEventDate.toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      }),
      claimEventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      event.venue,
      order.id,
      1,
      "Free",
      claimTickets,
      claimAppUrl,
    ).catch((e) => console.error("Email send failed:", e));

    return success({ orderId: order.id, ticket: ticketInstance }, 201);
  } catch (e) {
    console.error("Claim free ticket error:", e);
    return error("Internal server error", 500);
  }
}
