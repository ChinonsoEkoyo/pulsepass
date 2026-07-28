import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { EditEventForm } from "./form";
import styles from "./page.module.css";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    include: { ticketTypes: true },
  });

  if (!event || event.organizerId !== user.userId) notFound();

  const rawRecurrenceDays = (event.recurrenceDays as unknown) || [];
  const recurrenceDays = Array.isArray(rawRecurrenceDays)
    ? rawRecurrenceDays.map((d: unknown) => {
        if (typeof d === "number") {
          return { day: d, time: new Date(event.dateTime).toTimeString().slice(0, 5) };
        }
        if (typeof d === "object" && d !== null && "day" in d) {
          return d as { day: number; time: string };
        }
        return { day: 0, time: "09:00" };
      })
    : [];

  const eventData = {
    id: event.id,
    title: event.title,
    description: event.description,
    venue: event.venue,
    date: new Date(event.dateTime).toISOString().split("T")[0],
    time: new Date(event.dateTime).toTimeString().slice(0, 5),
    endDate: event.endDate ? new Date(event.endDate).toISOString().split("T")[0] : "",
    recurrence: event.recurrence || "SINGLE",
    recurrenceDays,
    isVirtual: event.isVirtual ?? false,
    category: event.category,
    images: (event.images as string[]) || [],
    instagram: event.instagram || "",
    facebook: event.facebook || "",
    twitter: event.twitter || "",
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit Event</h1>
      <div className={styles.layout}>
        <EditEventForm event={eventData} />
      </div>
    </div>
  );
}
