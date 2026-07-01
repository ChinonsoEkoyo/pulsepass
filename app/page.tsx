import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { EventFilters } from "@/components/EventFilters";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { blogPosts } from "@/data/blog-posts";
import BlogCarousel from "@/components/BlogCarousel";
import MobileMenu from "@/components/MobileMenu";
import styles from "./page.module.css";

async function getEvents() {
  return db.event.findMany({
    include: { ticketTypes: true },
    orderBy: { dateTime: "asc" },
    take: 9,
  });
}

export default async function Home() {
  const [events, user] = await Promise.all([getEvents(), getCurrentUser()]);
  const isLoggedIn = !!user;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/Concertimage.png"
          alt=""
          fill
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroGradient} />

        <header className={styles.header}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/images/PulsePass-white.png"
              alt="PulsePass"
              width={100}
              height={25}
              className={styles.logoDesktop}
              priority
            />
            <Image
              src="/images/Pulsepass-logo-white.png"
              alt="PulsePass"
              width={32}
              height={32}
              className={styles.logoMobile}
              priority
            />
          </Link>
          <nav className={styles.nav}>
            <Link href="/events" className={styles.navLink}>Events</Link>
            <Link href="/pricing" className={styles.navLink}>Pricing</Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className={styles.ctaButton}>Go to Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className={styles.navLink}>Sign In</Link>
                <Link href="/register" className={styles.ctaButton}>Get Started</Link>
              </>
            )}
          </nav>
          <MobileMenu isLoggedIn={isLoggedIn} />
        </header>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            The Event Infrastructure<br />Platform For Africa
          </h1>
          <p className={styles.heroSubtitle}>
            Create, manage, and monetize events with seamless ticketing, payments, and check-in.
          </p>
          <div className={styles.heroActions}>
            {isLoggedIn ? (
              <Link href="/dashboard" className={styles.primaryButton}>Go to Dashboard</Link>
            ) : (
              <Link href="/register" className={styles.primaryButton}>Get Started</Link>
            )}
            <Link href="/events" className={styles.secondaryButton}>Learn More</Link>
          </div>
        </div>
      </section>

      <form action="/events" className={styles.searchContainer}>
        <div className={styles.searchField}>
          <label className={styles.searchLabel}>Search Event</label>
          <input type="text" name="search" placeholder="Search events..." className={styles.searchInput} />
        </div>
        <div className={styles.searchField}>
          <label className={styles.searchLabel}>Location</label>
          <input type="text" name="location" placeholder="Location..." className={styles.searchInput} />
        </div>
        <div className={styles.searchField}>
          <label className={styles.searchLabel}>Date</label>
          <div className={styles.dateWrapper}>
            <input type="date" name="date" className={styles.searchInput} />
            <CalendarDays size={18} className={styles.calendarIcon} />
          </div>
        </div>
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>

      <section className={styles.upcoming}>
        <div className={styles.upcomingHeader}>
          <h2 className={styles.upcomingTitle}>Upcoming Events</h2>
          <div className={styles.upcomingFilters}>
            <EventFilters />
          </div>
        </div>

        <div className={styles.eventGrid}>
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className={styles.eventCard}>
              <div className={styles.eventCardImage} style={(event.images as string[])?.length ? { backgroundImage: `url(${(event.images as string[])[0]})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                {(!(event.images as string[])?.length) && <div className={styles.eventCardImagePlaceholder}></div>}
                <span className={styles.eventCardImageBadge}>{event.category}</span>
              </div>
              <div className={styles.eventCardBody}>
                <h3 className={styles.eventCardTitle}>{event.title}</h3>
                <div className={styles.eventCardMeta}>
                  <MapPin size={14} className={styles.metaIcon} />
                  <p className={styles.eventCardVenue}>{event.venue}</p>
                </div>
                <div className={styles.eventCardMeta}>
                  <CalendarDays size={14} className={styles.metaIcon} />
                  <p className={styles.eventCardDate}>
                    {new Date(event.dateTime).toLocaleDateString("en-US", {
                      weekday: "short", month: "long", day: "numeric", year: "numeric",
                    })}
                    <span className={styles.eventCardTime}>
                      {new Date(event.dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </p>
                </div>
              </div>
              <div className={styles.eventCardFooter}>
                <span className={styles.eventPrice}>
                  {event.ticketTypes.length > 0
                    ? `From ₦${Math.min(...event.ticketTypes.map((t) => Number(t.price)))}`
                    : "Free"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.loadMoreWrapper}>
          <Link href="/events" className={styles.loadMoreButton}>Load More</Link>
        </div>
      </section>

      <section className={styles.illustrationSection}>
        <div className={styles.illustrationContainer}>
          <div className={styles.illustrationBadge}>
            <Image
              src="/images/ilustration.png"
              alt=""
              width={280}
              height={280}
              className={styles.illustrationImage}
            />
          </div>
          <div className={styles.illustrationContent}>
            <h2 className={styles.illustrationTitle}>Make your own Event</h2>
            <p className={styles.illustrationDesc}>
              Set up ticketing, manage attendees and<br />collect payments seamlessly.
            </p>
            <Link href="/register" className={styles.illustrationButton}>Create Events</Link>
          </div>
        </div>
      </section>

      <section className={styles.blogSection}>
        <h2 className={styles.blogSectionTitle}>Our Blog</h2>
        <BlogCarousel posts={blogPosts} />
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <Image
              src="/images/PulsePass-white.png"
              alt="PulsePass"
              width={170.7}
              height={28.7}
              className={styles.footerLogo}
            />
            <p className={styles.footerDesc}>
              PulsePass is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events that fuel their passions and enrich their lives.
            </p>
            <div className={styles.socialRow}>
              <a href="#" className={styles.socialIcon}>
                <Image src="/images/facebook.png" alt="Facebook" width={32} height={32} />
              </a>
              <a href="#" className={styles.socialIcon}>
                <Image src="/images/x-twitter-logo.png" alt="X/Twitter" width={32} height={32} />
              </a>
              <a href="#" className={styles.socialIcon}>
                <Image src="/images/linkedin.png" alt="LinkedIn" width={32} height={32} />
              </a>
            </div>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerTitle}>Plan Events</h4>
            <nav className={styles.footerLinks}>
              <Link href="#">Create and Set Up</Link>
              <Link href="#">Sell Tickets</Link>
              <Link href="#">Online RSVP</Link>
              <Link href="#">Online Events</Link>
            </nav>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerTitle}>PulsePass</h4>
            <nav className={styles.footerLinks}>
              <Link href="/about">About Us</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/how-it-works">How it Works</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/help">Help Center</Link>
              <Link href="/terms">Terms & Conditions</Link>
              <Link href="/privacy">Privacy Policy</Link>
            </nav>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerTitle}>Stay In The Loop</h4>
            <p className={styles.footerNews}>
              Join our mailing list to stay in the loop with our newest for Event and concert
            </p>
            <form className={styles.subscribeForm}>
              <input type="email" placeholder="Enter your email address.." className={styles.subscribeInput} required />
              <button type="submit" className={styles.subscribeButton}>Subscribe Now</button>
            </form>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>Copyright &copy; 2026 PulsePass</p>
        </div>
      </footer>
    </div>
  );
}
