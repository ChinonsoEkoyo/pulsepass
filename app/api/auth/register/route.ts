import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { registerSchema } from "@/lib/validations/auth";
import { signToken, setAuthCookie } from "@/lib/auth";
import { success, error } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";

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

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return success({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, 201);
  } catch (e) {
    console.error("Register error:", e);
    return error("Internal server error", 500);
  }
}
