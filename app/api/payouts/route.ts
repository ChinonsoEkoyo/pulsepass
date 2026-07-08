import { NextRequest } from "next/server";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { success, error } from "@/lib/api-response";
import { z } from "zod";

const payoutSchema = z.object({
  bankName: z.string().min(1),
  accountNumber: z.string().length(10),
  accountName: z.string().min(1),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const account = await db.payoutAccount.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    return success(account);
  } catch (e) {
    console.error("Get payout error:", e);
    return error("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("Unauthorized", 401);

    const body = await request.json();
    const parsed = payoutSchema.safeParse(body);
    if (!parsed.success) return error(parsed.error.errors[0].message);

    const { bankName, accountNumber, accountName } = parsed.data;

    const existing = await db.payoutAccount.findFirst({
      where: { userId: user.userId },
    });

    const account = existing
      ? await db.payoutAccount.update({
          where: { id: existing.id },
          data: { bankName, accountNumber, accountName },
        })
      : await db.payoutAccount.create({
          data: { userId: user.userId, bankName, accountNumber, accountName },
        });

    return success(account, 201);
  } catch (e) {
    console.error("Save payout error:", e);
    return error("Internal server error", 500);
  }
}
