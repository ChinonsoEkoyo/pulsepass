import { NextRequest } from "next/server";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { success, error } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const { qrUuid } = await request.json();
    if (!qrUuid) return error("qrUuid is required");

    const ticket = await db.ticketInstance.findUnique({
      where: { qrUuid },
      include: {
        order: { include: { event: true } },
        ticketType: true,
      },
    });

    if (!ticket) {
      return success({ status: "INVALID", message: "Ticket not found" });
    }

    if (ticket.validationStatus === "USED") {
      return success({ status: "USED", message: "Ticket already used" });
    }

    if (ticket.validationStatus === "INVALID") {
      return success({ status: "INVALID", message: "Ticket is invalid" });
    }

    const event = ticket.order.event;
    if (event.organizerId !== user.userId) {
      return error("Forbidden", 403);
    }

    await db.ticketInstance.update({
      where: { id: ticket.id },
      data: { validationStatus: "USED", validatedAt: new Date() },
    });

    await db.attendee.upsert({
      where: { ticketInstanceId: ticket.id },
      update: { checkedInAt: new Date() },
      create: {
        eventId: event.id,
        userId: ticket.order.userId,
        ticketInstanceId: ticket.id,
        checkedInAt: new Date(),
      },
    });

    return success({
      status: "VALID",
      message: "Check-in successful",
      ticket: {
        id: ticket.id,
        eventTitle: event.title,
        ticketName: ticket.ticketType.name,
      },
    });
  } catch (e) {
    console.error("Validate ticket error:", e);
    return error("Internal server error", 500);
  }
}
