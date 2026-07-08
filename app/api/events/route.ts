import { NextRequest } from "next/server";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { success, error } from "@/lib/api-response";
import { sendEventCreatedEmail } from "@/lib/email";
import { z } from "zod";

const createEventSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  venue: z.string().min(2),
  dateTime: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  recurrence: z.enum(["SINGLE", "MULTI_DAY", "WEEKLY"]).default("SINGLE"),
  recurrenceDays: z.array(z.number().int().min(0).max(6)).optional(),
  isVirtual: z.boolean().default(false),
  category: z.string().min(2),
  bannerUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  ticketTypes: z.array(z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    quantity: z.number().int().min(1),
  })).optional(),
});

export async function GET() {
  try {
    const events = await db.event.findMany({
      where: { status: "PUBLISHED" },
      include: { ticketTypes: true },
      orderBy: { dateTime: "asc" },
    });
    return success(events);
  } catch (e) {
    console.error("Get events error:", e);
    return error("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const body = await request.json();
    const parsed = createEventSchema.safeParse(body);
    if (!parsed.success) {
      return error(parsed.error.errors[0].message);
    }

    const { ticketTypes, images: imagesData, endDate, recurrenceDays, ...eventData } = parsed.data;

    const event = await db.event.create({
      data: {
        ...eventData,
        images: imagesData ?? [],
        status: "PUBLISHED",
        dateTime: new Date(eventData.dateTime),
        endDate: endDate ? new Date(endDate) : null,
        recurrenceDays: recurrenceDays ?? [],
        organizerId: user.userId,
        ticketTypes: ticketTypes
          ? { create: ticketTypes }
          : undefined,
      },
      include: { ticketTypes: true },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await sendEventCreatedEmail(
      user.email,
      user.name || user.email,
      event.title,
      new Date(event.dateTime).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      }),
      `${appUrl}/events/${event.id}`,
    );

    return success(event, 201);
  } catch (e) {
    console.error("Create event error:", e);
    return error("Internal server error", 500);
  }
}
