export function getNextOccurrence(
  startDate: Date,
  endDate: Date | null,
  recurrence: string,
  recurrenceDays: number[],
): { date: Date; label: string } | null {
  const now = new Date();

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

    const nextDates: Date[] = [];
    for (let i = 0; i < 14; i++) {
      const check = new Date(today);
      check.setDate(check.getDate() + i);
      const dayOfWeek = (check.getDay() + 6) % 7;
      if (recurrenceDays.includes(dayOfWeek)) {
        check.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
        if (check >= now) {
          nextDates.push(check);
        }
      }
    }

    if (nextDates.length === 0) return null;
    return { date: nextDates[0], label: "" };
  }

  return null;
}

export function isEventUpcoming(
  startDate: Date,
  endDate: Date | null,
  recurrence: string,
  recurrenceDays: number[],
): boolean {
  return getNextOccurrence(startDate, endDate, recurrence, recurrenceDays) !== null;
}

export function formatEventDate(
  startDate: Date,
  endDate: Date | null,
  recurrence: string,
  recurrenceDays: number[],
): { dateText: string; timeText: string } {
  const next = getNextOccurrence(startDate, endDate, recurrence, recurrenceDays);

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
    const days = recurrenceDays.map((d) => dayNames[d] || "").join(", ");
    return {
      dateText: `Every ${days}`,
      timeText,
    };
  }

  if (recurrence === "MULTI_DAY" && startDate < next.date) {
    const endLabel = endDate ? endDate.toLocaleDateString("en-US", {
      weekday: "short", month: "long", day: "numeric", year: "numeric",
    }) : "";
    return { dateText, timeText };
  }

  return { dateText, timeText };
}
