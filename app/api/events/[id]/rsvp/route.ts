import { NextRequest } from "next/server";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { success, error } from "@/lib/api-response";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const { id } = await params;

    const event = await db.event.findUnique({ where: { id } });
    if (!event) return error("Event not found", 404);

    const existing = await db.rSVP.findUnique({
      where: { eventId_userId: { eventId: id, userId: user.userId } },
    });

    if (existing) return error("Already RSVPed", 409);

    const rsvp = await db.rSVP.create({
      data: { eventId: id, userId: user.userId },
    });

    return success(rsvp, 201);
  } catch (e) {
    console.error("RSVP error:", e);
    return error("Internal server error", 500);
  }
}
