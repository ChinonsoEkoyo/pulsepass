import { NextRequest } from "next/server";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { success, error } from "@/lib/api-response";
import { z } from "zod";

const updateEventSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  venue: z.string().min(2).optional(),
  dateTime: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  recurrence: z.enum(["SINGLE", "MULTI_DAY", "WEEKLY"]).optional(),
  recurrenceDays: z.array(z.number().int().min(0).max(6)).optional(),
  isVirtual: z.boolean().optional(),
  category: z.string().min(2).optional(),
  bannerUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await db.event.findUnique({
      where: { id },
      include: { ticketTypes: true },
    });

    if (!event) return error("Event not found", 404);
    return success(event);
  } catch (e) {
    console.error("Get event error:", e);
    return error("Internal server error", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const { id } = await params;
    const event = await db.event.findUnique({ where: { id } });
    if (!event) return error("Event not found", 404);
    if (event.organizerId !== user.userId) return error("Forbidden", 403);

    const body = await request.json();
    const parsed = updateEventSchema.safeParse(body);
    if (!parsed.success) {
      return error(parsed.error.errors.map(e => e.message).join(", "));
    }

    const { dateTime, endDate, recurrenceDays, ...rest } = parsed.data;

    const updated = await db.event.update({
      where: { id },
      data: {
        ...(rest as Record<string, unknown>),
        ...(dateTime ? { dateTime: new Date(dateTime) } : {}),
        ...(endDate ? { endDate: new Date(endDate) } : {}),
        ...(recurrenceDays !== undefined ? { recurrenceDays } : {}),
      },
      include: { ticketTypes: true },
    });

    return success(updated);
  } catch (e) {
    console.error("Update event error:", e);
    const message = e instanceof Error ? e.message : "Internal server error";
    return error(message, 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const { id } = await params;
    const event = await db.event.findUnique({ where: { id } });
    if (!event) return error("Event not found", 404);
    if (event.organizerId !== user.userId) return error("Forbidden", 403);

    await db.event.delete({ where: { id } });
    return success({ message: "Event deleted" });
  } catch (e) {
    console.error("Delete event error:", e);
    return error("Internal server error", 500);
  }
}
