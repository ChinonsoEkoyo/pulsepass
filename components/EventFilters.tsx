"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const types = ["All", "Physical", "Virtual"];
const allCategories = ["All", "Tech", "Music", "Travel", "Comedy", "Gaming"];

interface DropdownProps {
  label: string;
  options: { label: string; value: string }[];
  active: string;
  onSelect: (value: string) => void;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

function Dropdown({ label, options, active, onSelect, showLoadMore, onLoadMore }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.5rem 1rem",
          border: "1px solid var(--color-outline-variant)",
          borderRadius: 50,
          background: "var(--color-surface)",
          fontSize: "0.85rem",
          color: "var(--color-on-surface)",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {active === "All" ? label : active}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 4,
            background: "var(--color-surface)",
            border: "1px solid var(--color-outline-variant)",
            borderRadius: 12,
            padding: "0.25rem",
            minWidth: 160,
            zIndex: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "none",
                borderRadius: 8,
                background: active === opt.value ? "var(--color-primary-container)" : "transparent",
                color: active === opt.value ? "var(--color-primary)" : "var(--color-on-surface)",
                fontSize: "0.85rem",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              {opt.label}
            </button>
          ))}
          {showLoadMore && onLoadMore ? (
            <button
              onClick={() => { onLoadMore(); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "none",
                borderRadius: 8,
                background: "transparent",
                color: "var(--color-primary)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "center",
                fontFamily: "inherit",
                borderTop: "1px solid var(--color-outline-variant)",
                marginTop: "0.25rem",
              }}
            >
              Load more categories
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function EventFilters() {
  const router = useRouter();
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [showMore, setShowMore] = useState(false);

  const visibleCategories = showMore
    ? allCategories
    : allCategories.slice(0, 5);

  function applyFilters(t: string, c: string) {
    const params = new URLSearchParams();
    if (t !== "All") params.set("type", t);
    if (c !== "All") params.set("category", c);
    const qs = params.toString();
    router.push(`/events${qs ? `?${qs}` : ""}`);
  }

  function handleType(v: string) {
    setType(v);
    applyFilters(v, category);
  }

  function handleCategory(v: string) {
    setCategory(v);
    applyFilters(type, v);
  }

  return (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Dropdown
        label="Event type"
        options={types.map((t) => ({ label: t, value: t }))}
        active={type}
        onSelect={handleType}
      />
      <Dropdown
        label="Category"
        options={visibleCategories.map((c) => ({ label: c, value: c }))}
        active={category}
        onSelect={handleCategory}
        showLoadMore={!showMore}
        onLoadMore={() => setShowMore(true)}
      />
    </div>
  );
}
