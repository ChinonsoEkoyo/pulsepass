import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { isEventUpcoming, getNextOccurrence } from "@/lib/event-utils";
import TicketsClient from "./TicketsClient";
import styles from "./page.module.css";

export default async function TicketsPage() {
  const user = await getCurrentUser();
  const userId = user?.userId;

  const tickets = !userId ? [] : await db.ticketInstance.findMany({
    where: { order: { userId } },
    include: {
      order: { include: { event: true } },
      ticketType: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const grouped: Record<string, {
    eventTitle: string;
    eventDate: Date;
    eventVenue: string;
    eventBanner: string | null;
    orderId: string;
    isUpcoming: boolean;
    tickets: typeof tickets;
  }> = {};

  for (const t of tickets) {
    const event = t.order.event;
    if (!event) continue;
    const key = `${t.orderId}-${event.id}`;
    if (!grouped[key]) {
      const upcoming = isEventUpcoming(event.dateTime, event.endDate, event.recurrence, (event.recurrenceDays as number[]) || []);
      const nextDate = getNextOccurrence(event.dateTime, event.endDate, event.recurrence, (event.recurrenceDays as number[]) || []);
      grouped[key] = {
        eventTitle: event.title,
        eventDate: nextDate?.date || event.dateTime,
        eventVenue: event.venue,
        eventBanner: ((event.images as string[]) || [])[0] || null,
        orderId: t.orderId,
        isUpcoming: upcoming,
        tickets: [],
      };
    }
    grouped[key].tickets.push(t);
  }

  const groups = Object.values(grouped);

  return (
    <div className={styles.page}>
      <TicketsClient groups={groups.map(g => ({
        ...g,
        eventDate: g.eventDate.toISOString(),
        tickets: g.tickets.map(t => ({
          id: t.id,
          qrCode: t.qrCode,
          validationStatus: t.validationStatus,
          ticketTypeName: t.ticketType?.name || "Standard",
          ticketTypePrice: Number(t.ticketType?.price || 0),
          createdAt: t.createdAt.toISOString(),
        })),
      }))} />
    </div>
  );
}
