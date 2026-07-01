"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGrid, Ticket, CalendarDays, User, Menu, X } from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";
import styles from "./layout.module.css";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/events", label: "Events", icon: Ticket },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/dashboard/account", label: "Account", icon: User },
];

export default function DashboardShell({
  headerLeft,
  children,
}: {
  headerLeft: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");

  const activeLink = links.find((link) => isActive(link.href));
  const pageTitle = activeLink?.label || "";

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          {headerLeft}
        </div>
        <nav className={styles.sidebarNav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.sidebarLink} ${isActive(link.href) ? styles.sidebarActive : ""}`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <SignOutButton />
        </div>
      </aside>
      <div className={styles.contentArea}>
        <div className={styles.mobileHeader}>
          <Link href="/" className={styles.mobileLogoLink}>
            <Image src="/images/Pulsepass-logo-purple.png" alt="PulsePass" width={28} height={28} />
          </Link>
          <button className={styles.menuToggle} onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)}>
            <div className={styles.mobileOverlayContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.mobileOverlayHeader}>
                <Image src="/images/Pulsepass-logo-white.png" alt="PulsePass" width={32} height={32} />
                <button className={styles.menuClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>
              <nav className={styles.mobileOverlayNav}>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.mobileOverlayLink} ${isActive(link.href) ? styles.mobileOverlayActive : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <link.icon size={22} />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
              <div className={styles.mobileOverlayFooter}>
                <SignOutButton />
              </div>
            </div>
          </div>
        )}

        <div className={styles.mainWrapper}>
          {pageTitle && (
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{pageTitle}</h1>
            </div>
          )}
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </div>
  );
}
