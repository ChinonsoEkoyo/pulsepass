"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Input, Card } from "@/components/ui";
import { Upload, X } from "lucide-react";
import styles from "./page.module.css";

interface EditEventFormProps {
  event: {
    id: string;
    title: string;
    description: string;
    venue: string;
    date: string;
    time: string;
    endDate: string;
    recurrence: string;
    recurrenceDays: Array<{ day: number; time: string }>;
    isVirtual: boolean;
    category: string;
    images: string[];
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

export function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingImages] = useState<string[]>(event.images);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: event.title,
    description: event.description,
    venue: event.venue,
    date: event.date,
    time: event.time,
    endDate: event.endDate,
    recurrence: event.recurrence,
    recurrenceDays: event.recurrenceDays,
    isVirtual: event.isVirtual,
    category: event.category,
    instagram: event.instagram,
    facebook: event.facebook,
    twitter: event.twitter,
  });
  const [formError, setFormError] = useState("");

  const totalImages = existingImages.filter((u) => !removedImages.includes(u)).length + newImages.length;
  const canAddMore = totalImages < 4;

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (totalImages + files.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === "string") {
          setNewPreviews((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeExisting(index: number) {
    const url = existingImages.filter((u) => !removedImages.includes(u))[index];
    if (url) setRemovedImages((prev) => [...prev, url]);
  }

  function removeNew(index: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (form.title.trim().length < 2) { setFormError("Title must be at least 2 characters"); return; }
    if (form.description.trim().length < 10) { setFormError("Description must be at least 10 characters"); return; }
    if (form.venue.trim().length < 2) { setFormError("Venue must be at least 2 characters"); return; }
    if (!form.date) { setFormError("Please select a date"); return; }
    if (!form.time) { setFormError("Please select a time"); return; }
    if (form.recurrence !== "SINGLE" && !form.endDate) { setFormError("Please select an end date"); return; }
    if (form.recurrence === "WEEKLY" && form.recurrenceDays.length === 0) { setFormError("Please select at least one day of the week"); return; }
    if (form.recurrence === "WEEKLY" && form.recurrenceDays.some((d) => !d.time)) { setFormError("Please set a time for each selected day"); return; }
    if (!form.category) { setFormError("Please select a category"); return; }

    setLoading(true);

    try {
      let uploadedUrls: string[] = [];

      if (newImages.length > 0) {
        setUploading(true);
        const formData = new FormData();
        newImages.forEach((img) => formData.append("images", img));
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          setFormError(uploadJson.error || "Image upload failed");
          setLoading(false);
          setUploading(false);
          return;
        }
        uploadedUrls = uploadJson.data;
        setUploading(false);
      }

      const keptImages = existingImages.filter((u) => !removedImages.includes(u));
      const allImages = [...keptImages, ...uploadedUrls];

      const dateTime = new Date(`${form.date}T${form.time}`).toISOString();
      const endDate = form.endDate ? new Date(`${form.endDate}T${form.time}`).toISOString() : undefined;

      const body = {
        title: form.title,
        description: form.description,
        venue: form.venue,
        dateTime,
        endDate,
        recurrence: form.recurrence,
        recurrenceDays: form.recurrence === "WEEKLY" ? form.recurrenceDays : undefined,
        isVirtual: form.isVirtual,
        category: form.category,
        images: allImages,
        instagram: form.instagram || undefined,
        facebook: form.facebook || undefined,
        twitter: form.twitter || undefined,
        status: "PUBLISHED",
      };
      console.log("Edit event submit body:", body);

      const res = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      console.log("Edit event response:", res.status, json);

      if (!res.ok) {
        setFormError(json.error || "Failed to update event");
        return;
      }

      router.push("/dashboard/events");
      router.refresh();
    } catch (err) {
      console.error("Edit event submit error:", err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function update(field: string, value: string | boolean | number[] | Array<{ day: number; time: string }>) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const visibleExisting = existingImages.filter((u) => !removedImages.includes(u));

  return (
    <form onSubmit={handleSubmit} className={styles.formLayout}>
      <div className={styles.imageColumn}>
        <div className={styles.imageSection}>
          <label className={styles.sectionLabel}>Event Images (up to 4)</label>
          <div className={styles.imageGrid}>
            {visibleExisting.map((url, i) => (
              <div className={styles.imagePreview} key={`ex-${i}`}>
                <Image src={url} alt="" fill style={{ objectFit: "cover" }} sizes="150px" />
                <button type="button" className={styles.removeImage} onClick={() => removeExisting(i)}>
                  <X size={14} />
                </button>
              </div>
            ))}
            {newPreviews.map((preview, i) => (
              <div className={styles.imagePreview} key={`new-${i}`}>
                <Image src={preview} alt="" fill style={{ objectFit: "cover" }} sizes="150px" />
                <button type="button" className={styles.removeImage} onClick={() => removeNew(i)}>
                  <X size={14} />
                </button>
              </div>
            ))}
            {canAddMore ? (
              <button type="button" className={styles.imageUploadBox} onClick={() => fileInputRef.current?.click()}>
                <Upload size={24} />
                <span>Add Image</span>
              </button>
            ) : null}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: "none" }} />
          <p className={styles.helperText}>{totalImages}/4 images</p>
        </div>
      </div>

      <div className={styles.formColumn}>
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

        <div className={styles.field}>
          <label className={styles.label}>Event Format</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="isVirtual"
                checked={!form.isVirtual}
                onChange={() => update("isVirtual", false)}
              />
              In-Person
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="isVirtual"
                checked={form.isVirtual}
                onChange={() => update("isVirtual", true)}
              />
              Virtual
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Recurrence</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="recurrence"
                checked={form.recurrence === "SINGLE"}
                onChange={() => update("recurrence", "SINGLE")}
              />
              Single Event
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="recurrence"
                checked={form.recurrence === "MULTI_DAY"}
                onChange={() => update("recurrence", "MULTI_DAY")}
              />
              Multiple Days
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="recurrence"
                checked={form.recurrence === "WEEKLY"}
                onChange={() => update("recurrence", "WEEKLY")}
              />
              Weekly
            </label>
          </div>
        </div>

        <div className={styles.row}>
          <Input
            label={form.recurrence === "SINGLE" ? "Date" : "Start Date"}
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            required
          />
          {form.recurrence !== "SINGLE" ? (
            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => update("endDate", e.target.value)}
              required
            />
          ) : (
            <Input
              label="Time"
              type="time"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              required
            />
          )}
        </div>

        {form.recurrence === "WEEKLY" ? (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Repeat on</label>
              <div className={styles.dayGrid}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                  <label
                    key={day}
                    className={`${styles.dayChip} ${form.recurrenceDays.some((d) => d.day === i) ? styles.dayChipActive : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.recurrenceDays.some((d) => d.day === i)}
                      onChange={() => {
                        const exists = form.recurrenceDays.find((d) => d.day === i);
                        if (exists) {
                          update("recurrenceDays", form.recurrenceDays.filter((d) => d.day !== i));
                        } else {
                          update("recurrenceDays", [...form.recurrenceDays, { day: i, time: form.time || "09:00" }]);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                    {day}
                  </label>
                ))}
              </div>
              {form.recurrenceDays.length > 0 && (
                <div className={styles.daySchedules}>
                  {form.recurrenceDays.map((entry) => (
                    <div key={entry.day} className={styles.daySchedule}>
                      <span className={styles.dayScheduleLabel}>{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][entry.day]}</span>
                      <Input
                        type="time"
                        value={entry.time}
                        onChange={(e) => {
                          update("recurrenceDays", form.recurrenceDays.map((d) =>
                            d.day === entry.day ? { ...d, time: e.target.value } : d
                          ));
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : form.recurrence !== "SINGLE" ? (
          <Input
            label="Time"
            type="time"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
            required
          />
        ) : null}

        <Input
          label="Category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          required
          placeholder="e.g. Music, Tech, Education"
        />

        <div className={styles.field}>
          <label className={styles.label}>Social Links</label>
          <Input
            label="Instagram"
            value={form.instagram}
            onChange={(e) => update("instagram", e.target.value)}
            placeholder="https://instagram.com/your-page"
          />
          <Input
            label="Facebook"
            value={form.facebook}
            onChange={(e) => update("facebook", e.target.value)}
            placeholder="https://facebook.com/your-page"
          />
          <Input
            label="X (Twitter)"
            value={form.twitter}
            onChange={(e) => update("twitter", e.target.value)}
            placeholder="https://x.com/your-handle"
          />
        </div>

        {formError && (
          <div style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            color: "#b91c1c",
            fontSize: "0.875rem",
          }}>
            {formError}
          </div>
        )}

        <div className={styles.actions}>
          <Button type="submit" loading={loading || uploading} size="lg">
            {uploading ? "Uploading..." : "Save Changes"}
          </Button>
          <a href="/dashboard/events" className={styles.cancelBtn}>Cancel</a>
        </div>
      </div>
    </form>
  );
}
