import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import styles from "./page.module.css";

interface SearchParams {
  search?: string;
  location?: string;
  date?: string;
}

async function getEvents(searchParams: SearchParams) {
  const where: Record<string, unknown> = { status: "PUBLISHED" };

  if (searchParams.search) {
    where.title = { contains: searchParams.search, mode: "insensitive" };
  }
  if (searchParams.location) {
    where.venue = { contains: searchParams.location, mode: "insensitive" };
  }
  if (searchParams.date) {
    const dayStart = new Date(searchParams.date);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    where.dateTime = { gte: dayStart, lt: dayEnd };
  }

  return db.event.findMany({
    where: where as any,
    include: { ticketTypes: true },
    orderBy: { dateTime: "asc" },
    take: 20,
  });
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const events = await getEvents(sp);
  const hasFilters = !!(sp.search || sp.location || sp.date);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/images/PulsePass-purple-logo.png" alt="PulsePass" width={140} height={35} className={styles.logoDesktop} />
          <Image src="/images/small-logo-purple.png" alt="PulsePass" width={32} height={32} className={styles.logoMobile} />
        </Link>
        <nav className={styles.nav}>
          <Link href="/events" className={styles.navLink}>Events</Link>
          <Link href="/login" className={styles.navLink}>Sign In</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>
            {hasFilters ? "Search Results" : "Upcoming Events"}
          </h1>
          {hasFilters && (
            <Link href="/events" className={styles.clearButton}>
              Clear Filters
            </Link>
          )}
        </div>

        {hasFilters && (
          <div className={styles.activeFilters}>
            {sp.search && (
              <span className={styles.filterTag}>
                Search: &ldquo;{sp.search}&rdquo;
              </span>
            )}
            {sp.location && (
              <span className={styles.filterTag}>
                Location: {sp.location}
              </span>
            )}
            {sp.date && (
              <span className={styles.filterTag}>
                Date: {new Date(sp.date).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </span>
            )}
          </div>
        )}

        {events.length === 0 ? (
          <div className={styles.empty}>
            <p>No events found{hasFilters ? " matching your criteria" : ""}.</p>
            {hasFilters && (
              <Link href="/events" className={styles.clearButton}>Clear Filters</Link>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className={styles.card}>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{event.title}</h2>
                  <p className={styles.cardVenue}>{event.venue}</p>
                  <p className={styles.cardDate}>
                    {new Date(event.dateTime).toLocaleDateString("en-US", {
                      weekday: "short", month: "long", day: "numeric", year: "numeric",
                    })}
                  </p>
                  <p className={styles.cardDesc}>{event.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.price}>
                    {event.ticketTypes.length > 0
                      ? `From ₦${Math.min(...event.ticketTypes.map((t) => Number(t.price)))}`
                      : "Free"}
                  </span>
                  <span className={styles.category}>{event.category}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
