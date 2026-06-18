import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const events = await db.event.findMany({
      where: { organizerId: user.userId },
      include: {
        ticketTypes: true,
        orders: {
          where: { paymentStatus: "COMPLETED" },
          include: { ticketInstances: true },
        },
        attendees: true,
      },
    });

    const totalEvents = events.length;
    const totalRevenue = events.reduce(
      (sum, e) => sum + e.orders.reduce((s, o) => s + Number(o.amount), 0),
      0
    );
    const totalAttendees = events.reduce(
      (sum, e) => sum + e.attendees.length,
      0
    );
    const totalTicketsSold = events.reduce(
      (sum, e) =>
        sum +
        e.orders.reduce((s, o) => s + o.ticketInstances?.length || 0, 0),
      0
    );

    return success({
      totalEvents,
      totalRevenue,
      totalAttendees,
      totalTicketsSold,
    });
  } catch (e) {
    console.error("Analytics error:", e);
    return error("Internal server error", 500);
  }
}
