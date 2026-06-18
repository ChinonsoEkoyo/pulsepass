import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/db";
import styles from "./page.module.css";

async function getEvent(id: string) {
  const event = await db.event.findUnique({
    where: { id },
    include: { ticketTypes: true },
  });
  return event;
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

  const minPrice = event.ticketTypes.length > 0
    ? Math.min(...event.ticketTypes.map((t) => Number(t.price)))
    : 0;

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
        <div className={styles.content}>
          <h1 className={styles.title}>{event.title}</h1>
          <p className={styles.meta}>
            {new Date(event.dateTime).toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric", year: "numeric",
            })}{" "}
            at{" "}
            {new Date(event.dateTime).toLocaleTimeString("en-US", {
              hour: "numeric", minute: "2-digit",
            })}
          </p>
          <p className={styles.venue}>{event.venue}</p>
          <p className={styles.category}>{event.category}</p>
          <div className={styles.desc}>
            <p>{event.description}</p>
          </div>

          <section className={styles.tickets}>
            <h2>Tickets</h2>
            {event.ticketTypes.length === 0 ? (
              <p>No tickets available.</p>
            ) : (
              <div className={styles.ticketList}>
                {event.ticketTypes.map((ticket) => (
                  <div key={ticket.id} className={styles.ticketCard}>
                    <div>
                      <h3>{ticket.name}</h3>
                      <p className={styles.ticketQty}>
                        {ticket.quantity} available
                      </p>
                    </div>
                    <p className={styles.ticketPrice}>
                      {Number(ticket.price) === 0
                        ? "Free"
                        : `₦${Number(ticket.price).toLocaleString()}`}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Link
              href={`/events/${event.id}/checkout`}
              className={styles.checkoutBtn}
            >
              {minPrice === 0 ? "RSVP / Get Ticket" : "Get Tickets"}
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
