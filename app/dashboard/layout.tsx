import Link from "next/link";
import Image from "next/image";
import styles from "./layout.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link href="/dashboard" className={styles.logo}>
          <Image src="/images/PulsePass-purple-logo.png" alt="PulsePass" width={140} height={35} />
        </Link>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>Overview</Link>
          <Link href="/dashboard/events" className={styles.navLink}>My Events</Link>
          <Link href="/create" className={styles.navLink}>Create Event</Link>
          <Link href="/dashboard/analytics" className={styles.navLink}>Analytics</Link>
          <Link href="/dashboard/revenue" className={styles.navLink}>Revenue</Link>
          <Link href="/dashboard/scanner" className={styles.navLink}>Scanner</Link>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
