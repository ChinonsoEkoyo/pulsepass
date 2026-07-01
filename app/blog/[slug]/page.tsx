import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import MobileMenu from "@/components/MobileMenu";
import styles from "./page.module.css";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

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
        <Link href="/blog" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        <div className={styles.banner}>
          <Image src={post.image} alt={post.title} fill className={styles.bannerImage} />
        </div>

        <div className={styles.content}>
          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.date}>{post.date}</span>
            <span className={styles.author}>By {post.author}</span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.body}>
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
