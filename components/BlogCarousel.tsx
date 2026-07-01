"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPost } from "@/data/blog-posts";
import styles from "./BlogCarousel.module.css";

export default function BlogCarousel({ posts }: { posts: BlogPost[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <div className={styles.carousel}>
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => scroll("left")} aria-label="Previous">
        <ChevronLeft size={24} />
      </button>
      <div className={styles.track} ref={scrollRef}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.cardImage}>
              <Image src={post.image} alt={post.title} fill sizes="340px" />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <p className={styles.cardDesc}>{post.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardDate}>{post.date}</span>
                <span className={styles.cardAuthor}>{post.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => scroll("right")} aria-label="Next">
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
