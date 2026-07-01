"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  isLoggedIn?: boolean;
}

export default function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button className={styles.menuButton} onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mounted && open && createPortal(
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <nav className={styles.mobileNav} onClick={(e) => e.stopPropagation()}>
          <Link href="/events" className={styles.navLink} onClick={() => setOpen(false)}>Events</Link>
          <Link href="/pricing" className={styles.navLink} onClick={() => setOpen(false)}>Pricing</Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className={styles.ctaButton} onClick={() => setOpen(false)}>Go to Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className={styles.navLink} onClick={() => setOpen(false)}>Sign In</Link>
              <Link href="/register" className={styles.ctaButton} onClick={() => setOpen(false)}>Get Started</Link>
            </>
          )}
          </nav>
        </div>,
        document.body
      )}
    </>
  );
}
