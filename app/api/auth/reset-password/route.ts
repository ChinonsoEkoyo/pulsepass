import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { error, success } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const limit = checkRateLimit(`reset-password:${ip}`);
    if (!limit.allowed) {
      return error("Too many requests. Try again later.", 429);
    }

    const { token, password } = await request.json();

    if (!token || typeof token !== "string") {
      return error("Reset token is required");
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return error("Password must be at least 8 characters");
    }

    const tokens = await db.passwordResetToken.findMany({
      where: {
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    let matchedToken = null;
    for (const t of tokens) {
      const match = await bcrypt.compare(token, t.tokenHash);
      if (match) {
        matchedToken = t;
        break;
      }
    }

    if (!matchedToken) {
      return error("Invalid or expired reset token", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.$transaction([
      db.user.update({
        where: { id: matchedToken.userId },
        data: { passwordHash },
      }),
      db.passwordResetToken.update({
        where: { id: matchedToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return success({ message: "Password reset successfully" });
  } catch (e) {
    console.error("Reset password error:", e);
    return error("Internal server error", 500);
  }
}
