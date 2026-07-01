"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  fallbackUrl: string;
  title: string;
}

export function ImageCarousel({ images, fallbackUrl, title }: ImageCarouselProps) {
  const allImages = images.length > 0 ? images : [fallbackUrl];
  const [current, setCurrent] = useState(0);

  function prev() { setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1)); }
  function next() { setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1)); }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <Image
        src={allImages[current]}
        alt={`${title} - image ${current + 1}`}
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
      {allImages.length > 1 ? (
        <>
          <button
            onClick={prev}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.8)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.8)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={20} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 6,
            }}
          >
            {allImages.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                }}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
