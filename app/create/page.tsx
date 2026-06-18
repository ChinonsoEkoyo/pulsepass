"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import styles from "./page.module.css";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    category: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const dateTime = new Date(`${form.date}T${form.time}`).toISOString();

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dateTime }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Failed to create event");
        return;
      }

      router.push("/dashboard");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create Event</h1>
      <Card variant="outlined" padding="lg">
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Event Title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
            placeholder="Give your event a name"
          />
          <div className={styles.field}>
            <label className={styles.label} htmlFor="desc">Description</label>
            <textarea
              id="desc"
              className={styles.textarea}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              required
              placeholder="Describe your event"
              rows={4}
            />
          </div>
          <Input
            label="Venue"
            value={form.venue}
            onChange={(e) => update("venue", e.target.value)}
            required
            placeholder="Event location"
          />
          <div className={styles.row}>
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              required
            />
            <Input
              label="Time"
              type="time"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              required
            />
          </div>
          <Input
            label="Category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            required
            placeholder="e.g. Music, Tech, Education"
          />

          <Button type="submit" loading={loading} size="lg">
            Create Event
          </Button>
        </form>
      </Card>
    </div>
  );
}
