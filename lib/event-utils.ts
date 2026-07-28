type RecurrenceDayEntry = { day: number; time: string };

export function normalizeRecurrenceDays(data: unknown, fallbackTime: string = "09:00"): RecurrenceDayEntry[] {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (typeof data[0] === "number") {
    return (data as number[]).map((d) => ({ day: d, time: fallbackTime }));
  }
  return data as RecurrenceDayEntry[];
}

export function getNextOccurrence(
  startDate: Date,
  endDate: Date | null,
  recurrence: string,
  recurrenceDaysInput: number[] | RecurrenceDayEntry[],
): { date: Date; label: string } | null {
  const now = new Date();
  const recurrenceDays = normalizeRecurrenceDays(recurrenceDaysInput, startDate.toTimeString().slice(0, 5));

  if (recurrence === "SINGLE") {
    if (startDate <= now) return null;
    return { date: startDate, label: "" };
  }

  if (recurrence === "MULTI_DAY") {
    if (endDate && endDate < now) return null;
    if (startDate > now) return { date: startDate, label: "" };
    if (endDate && endDate >= now) {
      return { date: now > startDate ? now : startDate, label: "Ongoing" };
    }
    return null;
  }

  if (recurrence === "WEEKLY") {
    if (!recurrenceDays || recurrenceDays.length === 0) {
      return startDate >= now ? { date: startDate, label: "" } : null;
    }

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const nextDates: { date: Date; time: string }[] = [];
    for (let i = 0; i < 14; i++) {
      const check = new Date(today);
      check.setDate(check.getDate() + i);
      const dayOfWeek = (check.getDay() + 6) % 7;
      const entry = recurrenceDays.find((d) => d.day === dayOfWeek);
      if (entry) {
        const [h, m] = entry.time.split(":").map(Number);
        check.setHours(h || 0, m || 0, 0, 0);
        if (check >= now) {
          nextDates.push({ date: check, time: entry.time });
        }
      }
    }

    if (nextDates.length === 0) return null;
    return { date: nextDates[0].date, label: "" };
  }

  return null;
}

export function isEventUpcoming(
  startDate: Date,
  endDate: Date | null,
  recurrence: string,
  recurrenceDaysInput: number[] | RecurrenceDayEntry[],
): boolean {
  return getNextOccurrence(startDate, endDate, recurrence, recurrenceDaysInput) !== null;
}

export function formatEventDate(
  startDate: Date,
  endDate: Date | null,
  recurrence: string,
  recurrenceDaysInput: number[] | RecurrenceDayEntry[],
): { dateText: string; timeText: string } {
  const recurrenceDays = normalizeRecurrenceDays(recurrenceDaysInput, startDate.toTimeString().slice(0, 5));
  const next = getNextOccurrence(startDate, endDate, recurrence, recurrenceDaysInput);

  if (!next) {
    return {
      dateText: new Date(startDate).toLocaleDateString("en-US", {
        weekday: "short", month: "long", day: "numeric", year: "numeric",
      }),
      timeText: new Date(startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
  }

  const dateText = next.label
    ? `${next.label} — ${next.date.toLocaleDateString("en-US", {
        weekday: "short", month: "long", day: "numeric", year: "numeric",
      })}`
    : next.date.toLocaleDateString("en-US", {
        weekday: "short", month: "long", day: "numeric", year: "numeric",
      });

  const timeText = next.date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (recurrence === "WEEKLY") {
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    if (recurrenceDays.length > 0 && recurrenceDays[0].time !== recurrenceDays[recurrenceDays.length - 1]?.time) {
      const parts = recurrenceDays.map((d) => `${dayNames[d.day] || ""} ${formatTime(d.time)}`);
      return { dateText: `Every ${parts.join(", ")}`, timeText: "" };
    }
    const days = recurrenceDays.map((d) => dayNames[d.day] || "").join(", ");
    return { dateText: `Every ${days}`, timeText };
  }

  if (recurrence === "MULTI_DAY" && startDate < next.date) {
    const endLabel = endDate ? endDate.toLocaleDateString("en-US", {
      weekday: "short", month: "long", day: "numeric", year: "numeric",
    }) : "";
    return { dateText, timeText };
  }

  return { dateText, timeText };
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")}${ampm}`;
}
