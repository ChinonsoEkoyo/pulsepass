import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { db } from "@/db";
import MobileMenu from "@/components/MobileMenu";
import { ImageCarousel } from "@/components/ImageCarousel";
import { getCurrentUser } from "@/lib/auth";
import OrderConfirmation from "./OrderConfirmation";
import styles from "./page.module.css";

async function getEvent(id: string) {
  return db.event.findUnique({
    where: { id },
    include: { ticketTypes: true },
  });
}

async function getRelatedEvents(category: string, excludeId: string) {
  return db.event.findMany({
    where: { status: "PUBLISHED", category, id: { not: excludeId } },
    include: { ticketTypes: true },
    orderBy: { dateTime: "asc" },
    take: 6,
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const relatedEvents = await getRelatedEvents(event.category, event.id);

  const user = await getCurrentUser();

  const minPrice = event.ticketTypes.length > 0
    ? Math.min(...event.ticketTypes.map((t) => Number(t.price)))
    : 0;

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

      <Suspense fallback={null}><OrderConfirmation /></Suspense>

      <div className={styles.banner}>
        <ImageCarousel
          images={(event.images as string[]) || []}
          fallbackUrl={event.bannerUrl || "/images/Concertimage.png"}
          title={event.title}
        />
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <Link href="/events" className={styles.backLink}>
            <ArrowLeft size={16} />
            All Events
          </Link>
          <span className={styles.bannerCategory}>{event.category}</span>
          <h1 className={styles.bannerTitle}>{event.title}</h1>
          <div className={styles.bannerMeta}>
            <span className={styles.bannerMetaItem}>
              <MapPin size={14} />
              {event.venue}
            </span>
            <span className={styles.bannerMetaItem}>
              <Clock size={14} />
              {new Date(event.dateTime).toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
              })}{" "}
              at{" "}
              {new Date(event.dateTime).toLocaleTimeString("en-US", {
                hour: "numeric", minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.content}>
          <section className={styles.description}>
            <h2>About This Event</h2>
            <p>{event.description}</p>
          </section>

          <section className={styles.tickets}>
            <h2>Tickets</h2>
            {event.ticketTypes.length === 0 ? (
              <p className={styles.noTickets}>No tickets available.</p>
            ) : (
              <div className={styles.ticketList}>
                {event.ticketTypes.map((ticket) => {
                  return (
                    <div key={ticket.id} className={styles.ticketCard}>
                      <div className={styles.ticketInfo}>
                        <h3>{ticket.name}</h3>
                        <p className={styles.ticketQty}>
                          {ticket.quantity} available
                        </p>
                      </div>
                      <p className={styles.ticketPrice}>
                        {Number(ticket.price) === 0 ? "Free" : `₦${Number(ticket.price).toLocaleString()}`}
                      </p>
                    </div>
                  );
                })}
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

        {relatedEvents.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>Other events you may like</h2>
            <div className={styles.relatedGrid}>
              {relatedEvents.map((re) => {
                const reMinPrice = re.ticketTypes.length > 0
                  ? Math.min(...re.ticketTypes.map((t) => Number(t.price)))
                  : 0;
                return (
                  <Link key={re.id} href={`/events/${re.id}`} className={styles.relatedCard}>
                    <div className={styles.eventCardImage} style={(re.images as string[])?.length ? { backgroundImage: `url(${(re.images as string[])[0]})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                      {(!(re.images as string[])?.length) && <div className={styles.eventCardImagePlaceholder}></div>}
                      <span className={styles.eventCardImageBadge}>{re.category}</span>
                    </div>
                    <div className={styles.relatedCardBody}>
                      <h3 className={styles.relatedCardTitle}>{re.title}</h3>
                      <p className={styles.relatedCardVenue}>{re.venue}</p>
                      <p className={styles.relatedCardDate}>
                        {new Date(re.dateTime).toLocaleDateString("en-US", {
                          weekday: "short", month: "long", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className={styles.relatedCardFooter}>
                      <span className={styles.relatedPrice}>
                        {reMinPrice > 0 ? `From ₦${reMinPrice}` : "Free"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
