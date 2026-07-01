import { NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { error } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const limit = checkRateLimit(`forgot-password:${ip}`);
    if (!limit.allowed) {
      return error("Too many requests. Try again later.", 429);
    }

    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return error("Email is required");
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      return new Response(JSON.stringify({ data: { message: "If an account with that email exists, a reset link has been sent." } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(rawToken, 10);

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const resetUrl = `${request.nextUrl.origin}/reset-password/${rawToken}`;

    console.log(`\n[DEV] Password reset link for ${email}:`);
    console.log(`[DEV] ${resetUrl}\n`);

    return new Response(JSON.stringify({
      data: {
        message: "If an account with that email exists, a reset link has been sent.",
        ...(process.env.NODE_ENV === "development" ? { devResetUrl: resetUrl } : {}),
      },
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Forgot password error:", e);
    return error("Internal server error", 500);
  }
}
