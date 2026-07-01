import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawToken = searchParams.get("token");

    if (!rawToken) {
      return NextResponse.redirect(new URL("/login?error=invalid-token", request.url));
    }

    const tokens = await db.emailVerificationToken.findMany({
      where: {
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    let matchedToken = null;
    for (const t of tokens) {
      const match = await bcrypt.compare(rawToken, t.tokenHash);
      if (match) {
        matchedToken = t;
        break;
      }
    }

    if (!matchedToken) {
      return NextResponse.redirect(new URL("/login?error=invalid-token", request.url));
    }

    await db.$transaction([
      db.user.update({
        where: { id: matchedToken.userId },
        data: { emailVerified: true },
      }),
      db.emailVerificationToken.update({
        where: { id: matchedToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=verification-failed", request.url));
  }
}
