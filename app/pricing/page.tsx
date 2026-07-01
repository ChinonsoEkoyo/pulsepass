import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import styles from "./page.module.css";

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/images/PulsePass-purple.png" alt="PulsePass" width={100} height={25} className={styles.logoDesktop} />
          <Image src="/images/Pulsepass-logo-purple.png" alt="PulsePass" width={32} height={32} className={styles.logoMobile} />
        </Link>
        <nav className={styles.nav}>
          <Link href="/events" className={styles.navLink}>Events</Link>
          <Link href="/pricing" className={styles.navLink}>Pricing</Link>
          <Link href="/login" className={styles.navLink}>Sign In</Link>
          <Link href="/register" className={styles.ctaButton}>Get Started</Link>
        </nav>
        <MobileMenu />
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Simple, transparent pricing</h1>
          <p className={styles.subtitle}>Free for free events. Only pay when you sell tickets.</p>
        </section>

        <section className={styles.cards}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Free Events</h2>
            <p className={styles.price}>
              <span className={styles.amount}>₦0</span>
            </p>
            <p className={styles.cardDesc}>No charge for hosting free events. Create unlimited free events at no cost.</p>
            <Link href="/register" className={styles.cta}>Get Started</Link>
            <ul className={styles.features}>
              {[
                "Unlimited free events",
                "Unlimited private events",
                "Custom event page",
                "Attendee check-in",
                "Email support",
              ].map((f) => (
                <li key={f} className={styles.feature}>
                  <Check size={16} className={styles.checkIcon} /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.card} ${styles.cardFeatured}`}>
            <h2 className={styles.cardTitle}>Paid Events</h2>
            <p className={styles.price}>
              <span className={styles.amount}>5% + ₦100</span>
            </p>
            <p className={styles.cardDesc}>Per paid ticket. You can pass the fee to your attendees.</p>
            <Link href="/register" className={`${styles.cta} ${styles.ctaPrimary}`}>Create Event</Link>
            <ul className={styles.features}>
              {[
                "Unlimited paid events",
                "Multiple ticket tiers",
                "Discount codes",
                "Sales dashboard & analytics",
                "Bank transfer & card payments",
                "Mobile attendee check-in",
                "Custom checkout fields",
                "Email & chat support",
              ].map((f) => (
                <li key={f} className={styles.feature}>
                  <Check size={16} className={styles.checkIcon} /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Enterprise</h2>
            <p className={styles.price}>
              <span className={styles.amount}>Custom</span>
            </p>
            <p className={styles.cardDesc}>Tailored pricing for large events, festivals, and organisations.</p>
            <Link href="/contact" className={styles.cta}>Contact Us</Link>
            <ul className={styles.features}>
              {[
                "White-label ticketing",
                "API access",
                "Dedicated account manager",
                "On-site support",
                "Custom payout schedule",
                "Priority support",
              ].map((f) => (
                <li key={f} className={styles.feature}>
                  <Check size={16} className={styles.checkIcon} /> {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.faq}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>Is PulsePass really free for free events?</h3>
              <p>Yes. If you're not charging for tickets, there are no fees whatsoever.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Can I pass the fee to my attendees?</h3>
              <p>Yes. You can choose to transfer the 5% + ₦100 fee to your ticket buyers, so your revenue stays intact.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>When do I get paid?</h3>
              <p>Payouts are processed weekly, even if your event hasn't happened yet. You can also request early payouts.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Are there any hidden fees?</h3>
              <p>No. The only fee is 5% + ₦100 per paid ticket. Bank transfer fees may apply on payouts.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <Image src="/images/PulsePass-white.png" alt="PulsePass" width={170.7} height={28.7} className={styles.footerLogo} />
            <p className={styles.footerDesc}>PulsePass is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events that fuel their passions and enrich their lives.</p>
            <div className={styles.socialRow}>
              <a href="#" className={styles.socialIcon}><Image src="/images/facebook.png" alt="Facebook" width={32} height={32} /></a>
              <a href="#" className={styles.socialIcon}><Image src="/images/x-twitter-logo.png" alt="X/Twitter" width={32} height={32} /></a>
              <a href="#" className={styles.socialIcon}><Image src="/images/linkedin.png" alt="LinkedIn" width={32} height={32} /></a>
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
            <p className={styles.footerNews}>Join our mailing list to stay in the loop with our newest for Event and concert</p>
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
