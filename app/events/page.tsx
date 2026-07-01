import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { CalendarDays, MapPin } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { getCurrentUser } from "@/lib/auth";
import styles from "./page.module.css";

interface SearchParams {
  search?: string;
  location?: string;
  date?: string;
  type?: string;
  category?: string;
}

async function getEvents(searchParams: SearchParams) {
  const where: Record<string, unknown> = {};

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
  if (searchParams.category && searchParams.category !== "All") {
    where.category = { equals: searchParams.category, mode: "insensitive" };
  }
  if (searchParams.type && searchParams.type !== "All") {
    where.title = where.title || {};
    (where.title as any).contains = (where.title as any).contains || undefined;
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
  const hasFilters = !!(sp.search || sp.location || sp.date || sp.type || sp.category);
  const user = await getCurrentUser();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/images/PulsePass-purple.png" alt="PulsePass" width={140} height={35} className={styles.logoDesktop} />
          <Image src="/images/Pulsepass-logo-purple.png" alt="PulsePass" width={32} height={32} className={styles.logoMobile} />
        </Link>
        <nav className={styles.nav}>
          <Link href="/events" className={styles.navLink}>Events</Link>
          <Link href="/pricing" className={styles.navLink}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className={styles.dashboardButton}>Go to Dashboard</Link>
          ) : (
            <Link href="/login" className={styles.navLink}>Sign In</Link>
          )}
        </nav>
        <MobileMenu />
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
                <div className={styles.eventCardImage} style={(event.images as string[])?.length ? { backgroundImage: `url(${(event.images as string[])[0]})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                  {(!(event.images as string[])?.length) && <div className={styles.eventCardImagePlaceholder}></div>}
                  <span className={styles.eventCardImageBadge}>{event.category}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{event.title}</h3>
                  <div className={styles.eventCardMeta}>
                    <MapPin size={14} className={styles.metaIcon} />
                    <p className={styles.cardVenue}>{event.venue}</p>
                  </div>
                  <div className={styles.eventCardMeta}>
                    <CalendarDays size={14} className={styles.metaIcon} />
                    <p className={styles.cardDate}>
                      {new Date(event.dateTime).toLocaleDateString("en-US", {
                        weekday: "short", month: "long", day: "numeric", year: "numeric",
                      })}
                      <span className={styles.cardTime}>
                        {new Date(event.dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </p>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.price}>
                    {event.ticketTypes.length > 0
                      ? `From ₦${Math.min(...event.ticketTypes.map((t) => Number(t.price)))}`
                      : "Free"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
