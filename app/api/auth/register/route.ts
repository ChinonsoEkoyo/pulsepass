import { NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { db } from "@/db";
import { registerSchema } from "@/lib/validations/auth";
import { success, error } from "@/lib/api-response";
import { getAppUrl } from "@/lib/app-url";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/lib/email";
import { VerifyEmail } from "@/emails/verify-email";

const FROM_VERIFY = `${process.env.FROM_NAME || "PulsePass"} <${process.env.FROM_EMAIL || "onboarding@resend.dev"}>`;

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const limit = checkRateLimit(`register:${ip}`);
    if (!limit.allowed) {
      return error("Too many requests. Try again later.", 429);
    }
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return error(parsed.error.errors[0].message);
    }

    const { name, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return error("Email already in use", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: { name, email, passwordHash },
    });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(rawToken, 10);

    await db.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const appUrl = getAppUrl(request);
    const verificationUrl = `${appUrl}/api/auth/verify-email?token=${rawToken}`;

    try {
      await getResend().emails.send({
        from: FROM_VERIFY,
        to: email,
        subject: "Verify your PulsePass email",
        react: VerifyEmail({ name, verificationUrl }),
      });
    } catch (e) {
      console.error("Verification email error:", e);
    }

    try {
      await sendWelcomeEmail(email, name, appUrl);
    } catch (e) {
      console.error("Welcome email error:", e);
    }

    return success({
      message: "Account created. Check your email to verify your account.",
    }, 201);
  } catch (e) {
    console.error("Register error:", e);
    return error("Internal server error", 500);
  }
}
