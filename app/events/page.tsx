import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import styles from "./page.module.css";

async function getEvents() {
  return db.event.findMany({
    where: { status: "PUBLISHED" },
    include: { ticketTypes: true },
    orderBy: { dateTime: "asc" },
    take: 20,
  });
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/images/PulsePass-purple-logo.png" alt="PulsePass" width={140} height={35} className={styles.logo} />
        </Link>
        <nav className={styles.nav}>
          <Link href="/events" className={styles.navLink}>Events</Link>
          <Link href="/login" className={styles.navLink}>Sign In</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Upcoming Events</h1>

        {events.length === 0 ? (
          <p className={styles.empty}>No events yet. Be the first to create one!</p>
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
