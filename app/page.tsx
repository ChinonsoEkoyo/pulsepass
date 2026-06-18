import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
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
          <Image
            src="/images/Pulsepass-white-logo.png"
            alt="PulsePass"
            width={100}
            height={25}
            className={styles.logo}
            priority
          />
          <nav className={styles.nav}>
            <Link href="/events" className={styles.navLink}>Events</Link>
            <Link href="/login" className={styles.navLink}>Sign In</Link>
            <Link href="/register" className={styles.ctaButton}>Get Started</Link>
          </nav>
        </header>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            The event infrastructure platform for Africa
          </h1>
          <p className={styles.heroSubtitle}>
            Create, manage, and monetize events with seamless ticketing, payments, and check-in.
          </p>
          <div className={styles.heroActions}>
            <Link href="/register" className={styles.primaryButton}>Get Started</Link>
            <Link href="/events" className={styles.secondaryButton}>Browse Events</Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything you need to run events</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>Event Creation</h3>
            <p>Build beautiful event pages in minutes with our simple creation wizard.</p>
          </div>
          <div className={styles.feature}>
            <h3>Secure Payments</h3>
            <p>Accept payments via Flutterwave with instant confirmation.</p>
          </div>
          <div className={styles.feature}>
            <h3>QR Check-In</h3>
            <p>Validate tickets instantly with QR scanning.</p>
          </div>
          <div className={styles.feature}>
            <h3>Real-time Analytics</h3>
            <p>Track sales, attendance, and revenue in real-time.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} PulsePass. All rights reserved.</p>
      </footer>
    </div>
  );
}
