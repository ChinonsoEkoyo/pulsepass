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
  category: z.string().min(2).optional(),
  bannerUrl: z.string().optional(),
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
      return error(parsed.error.errors[0].message);
    }

    const updated = await db.event.update({
      where: { id },
      data: parsed.data.dateTime
        ? { ...parsed.data, dateTime: new Date(parsed.data.dateTime) }
        : parsed.data,
      include: { ticketTypes: true },
    });

    return success(updated);
  } catch (e) {
    console.error("Update event error:", e);
    return error("Internal server error", 500);
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
