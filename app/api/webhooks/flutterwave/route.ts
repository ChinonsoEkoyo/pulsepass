import { NextRequest } from "next/server";
import { db } from "@/db";
import { verifyWebhookHash, verifyTransaction } from "@/lib/flutterwave";
import { error } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("verif-hash");
    if (!verifyWebhookHash(signature)) {
      return error("Invalid signature", 401);
    }

    const payload = await request.json();

    if (payload.event !== "charge.completed" || payload.data?.status !== "successful") {
      return new Response("OK", { status: 200 });
    }

    const { id: transactionId, tx_ref } = payload.data;

    const payment = await db.payment.findUnique({
      where: { flutterwaveTxnRef: tx_ref },
      include: { order: true },
    });

    if (!payment) {
      console.error(`Payment not found for tx_ref: ${tx_ref}`);
      return new Response("OK", { status: 200 });
    }

    if (payment.order.paymentStatus === "COMPLETED") {
      return new Response("OK", { status: 200 });
    }

    const verification = await verifyTransaction(transactionId);
    if (verification.status !== "success" || verification.data?.status !== "successful") {
      console.error(`Transaction verification failed for ${transactionId}`);
      return error("Verification failed", 400);
    }

    await db.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "COMPLETED" },
      });

      const order = await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: "COMPLETED" },
      });

      const quantities = order.ticketQuantities as Record<string, number>;
      const ticketInstances: {
        orderId: string;
        ticketTypeId: string;
        qrUuid: string;
        qrCode: string;
      }[] = [];

      for (const [ttId, qty] of Object.entries(quantities)) {
        if (qty < 1) continue;
        const existingTickets = await tx.ticketInstance.findMany({
          where: { orderId: order.id, ticketTypeId: ttId },
        });

        for (let i = existingTickets.length; i < qty; i++) {
          ticketInstances.push({
            orderId: order.id,
            ticketTypeId: ttId,
            qrUuid: `${order.id}-${ttId}-${i}`,
            qrCode: `PP-${order.id}-${ttId}-${i}`,
          });
        }
      }

      if (ticketInstances.length > 0) {
        await tx.ticketInstance.createMany({ data: ticketInstances });
      }
    });

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("Webhook error:", e);
    return error("Internal server error", 500);
  }
}
