"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";
import DashboardShell from "@/app/dashboard/DashboardShell";
import { Upload, X, Check, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import dashboardStyles from "@/app/dashboard/layout.module.css";
import styles from "./page.module.css";

const CATEGORIES = [
  "Music", "Tech", "Education", "Business", "Sports & Fitness",
  "Arts & Culture", "Food & Drink", "Health & Wellness",
  "Charity & Causes", "Entertainment", "Nightlife", "Fashion",
  "Comedy", "Film & Media", "Community", "Other",
];

const STEPS = [
  { num: 1, label: "Basic Info" },
  { num: 2, label: "Date & Media" },
  { num: 3, label: "Tickets & Publish" },
];

interface TicketType {
  name: string;
  price: number;
  quantity: number;
}

export default function CreateEventPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    date: "",
    time: "",
    endDate: "",
    recurrence: "SINGLE",
    recurrenceDays: [] as number[],
    isVirtual: false,
    instagram: "",
    facebook: "",
    twitter: "",
  });
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: "General Admission", price: 0, quantity: 100 },
  ]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const total = images.length + files.length;
    if (total > 4) {
      alert("Maximum 4 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === "string") {
          setImagePreviews((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function update(field: string, value: string | boolean | number[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addTicketType() {
    setTicketTypes((prev) => [...prev, { name: "", price: 0, quantity: 0 }]);
  }

  function removeTicketType(index: number) {
    setTicketTypes((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTicketType(index: number, field: keyof TicketType, value: string) {
    setTicketTypes((prev) =>
      prev.map((t, i) =>
        i === index
          ? { ...t, [field]: field === "name" ? value : Number(value) }
          : t
      )
    );
  }

  function validateStep(s: number): boolean {
    switch (s) {
      case 1:
        if (form.title.trim().length < 2) { alert("Title must be at least 2 characters"); return false; }
        if (form.description.trim().length < 10) { alert("Description must be at least 10 characters"); return false; }
        if (!form.category) { alert("Please select a category"); return false; }
        if (form.venue.trim().length < 2) { alert("Venue must be at least 2 characters"); return false; }
        return true;
      case 2:
        if (!form.date) { alert("Please select a date"); return false; }
        if (!form.time) { alert("Please select a time"); return false; }
        if (form.recurrence !== "SINGLE" && !form.endDate) { alert("Please select an end date"); return false; }
        if (form.recurrence === "WEEKLY" && form.recurrenceDays.length === 0) { alert("Please select at least one day of the week"); return false; }
        return true;
      case 3: {
        const valid = ticketTypes.filter((t) => t.name.trim() && t.quantity >= 1);
        if (valid.length === 0) { alert("Please add at least one valid ticket type"); return false; }
        return true;
      }
      default:
        return true;
    }
  }

  function nextStep() {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3));
    }
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (!validateStep(3)) return;
    setLoading(true);

    try {
      let imageUrls: string[] = [];

      if (images.length > 0) {
        setUploadingImages(true);
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          alert(uploadJson.error || "Image upload failed");
          setLoading(false);
          setUploadingImages(false);
          return;
        }
        imageUrls = uploadJson.data;
        setUploadingImages(false);
      }

      const dateTime = new Date(`${form.date}T${form.time}`).toISOString();
      const endDate = form.endDate ? new Date(`${form.endDate}T${form.time}`).toISOString() : undefined;
      const validTicketTypes = ticketTypes.filter((t) => t.name.trim() !== "" && t.quantity >= 1);

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          venue: form.venue,
          dateTime,
          endDate,
          recurrence: form.recurrence,
          recurrenceDays: form.recurrence === "WEEKLY" ? form.recurrenceDays : undefined,
          isVirtual: form.isVirtual,
          category: form.category,
          images: imageUrls,
          instagram: form.instagram || undefined,
          facebook: form.facebook || undefined,
          twitter: form.twitter || undefined,
          ticketTypes: validTicketTypes,
        }),
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

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Basic Information</h2>
            <div className={styles.fields}>
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
              <div className={styles.field}>
                <label className={styles.label} htmlFor="category">Category</label>
                <select
                  id="category"
                  className={styles.select}
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
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
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Date &amp; Media</h2>
            <div className={styles.fields}>
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
                ) : null}
              </div>

              {form.recurrence === "WEEKLY" ? (
                <div className={styles.field}>
                  <label className={styles.label}>Repeat on</label>
                  <div className={styles.dayGrid}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                      <label
                        key={day}
                        className={`${styles.dayChip} ${form.recurrenceDays.includes(i) ? styles.dayChipActive : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={form.recurrenceDays.includes(i)}
                          onChange={() => {
                            const days = form.recurrenceDays.includes(i)
                              ? form.recurrenceDays.filter((d) => d !== i)
                              : [...form.recurrenceDays, i];
                            update("recurrenceDays", days);
                          }}
                          style={{ display: "none" }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              <Input
                label="Time"
                type="time"
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                required
              />
              <div className={styles.field}>
                <label className={styles.label}>Event Images (up to 4)</label>
                <div className={styles.imageGrid}>
                  {imagePreviews.map((preview, i) => (
                    <div className={styles.imagePreview} key={i}>
                      <Image src={preview} alt={`Event image ${i + 1}`} width={140} height={100} style={{ objectFit: "cover", borderRadius: 8 }} />
                      <button type="button" className={styles.removeImage} onClick={() => removeImage(i)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 4 ? (
                    <button type="button" className={styles.imageUploadBox} onClick={() => fileInputRef.current?.click()}>
                      <Upload size={24} />
                      <span>{imagePreviews.length === 0 ? "Add images" : "Add more"}</span>
                    </button>
                  ) : null}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  style={{ display: "none" }}
                />
                <p className={styles.helperText}>{images.length}/4 images selected</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Tickets &amp; Review</h2>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Ticket Types</h3>
              {ticketTypes.map((ticket, i) => (
                <div className={styles.ticketCard} key={i}>
                  <div className={styles.ticketCardHeader}>
                    <span className={styles.ticketCardTitle}>Ticket {i + 1}</span>
                    {ticketTypes.length > 1 && (
                      <button type="button" className={styles.removeTicket} onClick={() => removeTicketType(i)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className={styles.ticketCardFields}>
                    <Input
                      label="Ticket Name"
                      value={ticket.name}
                      onChange={(e) => updateTicketType(i, "name", e.target.value)}
                      placeholder="e.g. General Admission"
                    />
                    <Input
                      label="Price (Naira)"
                      type="number"
                      min={0}
                      value={ticket.price}
                      onChange={(e) => updateTicketType(i, "price", e.target.value)}
                    />
                    <Input
                      label="Quantity"
                      type="number"
                      min={1}
                      value={ticket.quantity}
                      onChange={(e) => updateTicketType(i, "quantity", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addTicketBtn} onClick={addTicketType}>
                <Plus size={16} /> Add Ticket Type
              </button>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Review Event Details</h3>
              <Card variant="filled" padding="md">
                <div className={styles.reviewGrid}>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Title</span>
                    <span className={styles.reviewValue}>{form.title || "\u2014"}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Category</span>
                    <span className={styles.reviewValue}>{form.category || "\u2014"}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Venue</span>
                    <span className={styles.reviewValue}>{form.venue || "\u2014"}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Date</span>
                    <span className={styles.reviewValue}>{form.date || "\u2014"}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Time</span>
                    <span className={styles.reviewValue}>{form.time || "\u2014"}</span>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Tickets</span>
                    <span className={styles.reviewValue}>
                      {ticketTypes.filter((t) => t.name.trim()).map((t) => `${t.name} (Naira ${t.price} x ${t.quantity})`).join(", ") || "\u2014"}
                    </span>
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Images</span>
                      <span className={styles.reviewValue}>{images.length} image(s) selected</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        );
    }
  }

  return (
    <DashboardShell
      headerLeft={
        <Link href="/dashboard" className={dashboardStyles.logo}>
          <Image src="/images/PulsePass-purple.png" alt="PulsePass" width={140} height={35} />
        </Link>
      }
    >
      <div className={styles.wizard}>
        <div className={styles.stepIndicator}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={styles.stepItem}>
                <div className={`${styles.stepCircle} ${step >= s.num ? styles.stepCircleActive : ""}`}>
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className={`${styles.stepLabel} ${step >= s.num ? styles.stepLabelActive : ""}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.stepConnector} ${step > s.num ? styles.stepConnectorActive : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card variant="outlined" padding="lg">
          {renderStep()}
        </Card>

        <div className={styles.navButtons}>
          {step > 1 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft size={16} /> Back
            </Button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <Button onClick={nextStep}>
              Next <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading || uploadingImages} size="lg">
              {uploadingImages ? "Uploading images..." : "Publish Event"}
            </Button>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
