import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import MobileMenu from "@/components/MobileMenu";
import styles from "./page.module.css";

export default function BlogPage() {
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
          <Link href="/login" className={styles.navLink}>Sign In</Link>
        </nav>
        <MobileMenu />
      </header>

      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className={styles.headerSection}>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>
            Tips, guides, and insights for event creators.
          </p>
        </div>

        <div className={styles.grid}>
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
              <div className={styles.cardImage}>
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 320px" />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardCategory}>{post.category}</span>
                  <span className={styles.cardDate}>{post.date}</span>
                </div>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.cardDesc}>{post.description}</p>
                <div className={styles.cardFooter}>
                  <span>By</span>
                  <span className={styles.cardAuthor}>{post.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
