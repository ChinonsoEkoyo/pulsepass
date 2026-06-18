import { NextRequest } from "next/server";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { success, error } from "@/lib/api-response";
import { z } from "zod";

const createEventSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  venue: z.string().min(2),
  dateTime: z.string().datetime(),
  category: z.string().min(2),
  bannerUrl: z.string().optional(),
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

    const { ticketTypes, ...eventData } = parsed.data;

    const event = await db.event.create({
      data: {
        ...eventData,
        dateTime: new Date(eventData.dateTime),
        organizerId: user.userId,
        ticketTypes: ticketTypes
          ? { create: ticketTypes }
          : undefined,
      },
      include: { ticketTypes: true },
    });

    return success(event, 201);
  } catch (e) {
    console.error("Create event error:", e);
    return error("Internal server error", 500);
  }
}
