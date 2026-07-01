import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { CalendarDays, Edit3, Plus } from "lucide-react";
import Link from "next/link";
import EventsTabDropdown from "./EventsTabDropdown";
import styles from "./page.module.css";

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export default async function DashboardEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  const userId = user?.userId;
  const sp = await searchParams;
  const activeTab = sp.tab || "all";

  const allEvents = !userId ? [] : await db.event.findMany({
    where: { organizerId: userId },
    include: { ticketTypes: true },
    orderBy: { dateTime: "desc" },
  });

  const now = new Date();

  const events = allEvents.filter((e) => {
    const eventDate = new Date(e.dateTime);
    if (activeTab === "published") return e.status === "PUBLISHED" && eventDate >= now;
    if (activeTab === "draft") return e.status === "DRAFT";
    if (activeTab === "ended") return e.status === "PUBLISHED" && eventDate < now;
    return true;
  });

  const years = [...new Set(allEvents.map((e) => new Date(e.dateTime).getFullYear()))].sort();

  const tabs = [
    { key: "all", label: "All Events" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Draft" },
    { key: "ended", label: "Ended" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/dashboard/events${tab.key === "all" ? "" : `?tab=${tab.key}`}`}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
          >
            {tab.label}
          </Link>
        ))}
        <EventsTabDropdown activeTab={activeTab} />
        <div className={styles.createBtnWrapper}>
          <Link href="/create" className={styles.createBtn}>
            <Plus size={16} /> Create Event
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No {activeTab !== "all" ? activeTab : ""} events yet</h2>
          <p className={styles.emptyDesc}>
            {activeTab === "all" ? "Create your first event to see it here." : `No events match the "${activeTab}" filter.`}
          </p>
          {activeTab === "all" ? (
            <Link href="/create" className={styles.createBtn}>Create Event</Link>
          ) : (
            <Link href="/dashboard/events" className={styles.createBtn}>View All Events</Link>
          )}
        </div>
      ) : (
        <div className={styles.eventGrid}>
          {events.map((event) => {
            const eventDate = new Date(event.dateTime);
            const isPublished = event.status === "PUBLISHED";
            const isDraft = event.status === "DRAFT";
            const isEnded = eventDate < now;
            const statusLabel = isDraft ? "Draft" : isPublished && isEnded ? "Ended" : isPublished ? "Published" : "Draft";
            const statusClass = isDraft ? styles.statusDraft : isEnded && isPublished ? styles.statusEnded : styles.statusPublished;
            const minPrice = event.ticketTypes.length > 0
              ? Math.min(...event.ticketTypes.map((t) => Number(t.price)))
              : 0;
            const images = (event.images as string[]) || [];
            const imageUrl = images.length > 0 ? images[0] : null;

            return (
              <Link href={`/dashboard/events/${event.id}/edit`} className={styles.eventCard} key={event.id}>
                <div className={styles.eventImage} style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                  <span className={styles.eventBadge}>{event.category}</span>
                  <div className={styles.editOverlay}>
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </div>
                </div>
                <div className={styles.eventContent}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventVenue}>{event.venue}</p>
                  <div className={styles.eventMeta}>
                    <span className={styles.eventDate}>
                      <CalendarDays size={14} /> {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className={styles.eventPrice}>{formatCurrency(minPrice)}</span>
                  </div>
                  <div className={styles.eventFooter}>
                    <span className={`${styles.eventStatus} ${statusClass}`}>{statusLabel}</span>
                    <span className={styles.eventTickets}>{event.ticketTypes.reduce((s, t) => s + t.quantity, 0)} tickets</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
