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

      await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: "COMPLETED" },
      });

      const order = await tx.order.findUnique({
        where: { id: payment.orderId },
        include: { event: { include: { ticketTypes: true } } },
      });

      if (order) {
        const ticketTypes = order.event.ticketTypes;
        const ticketInstances = [];

        for (const tt of ticketTypes) {
          const existingTickets = await tx.ticketInstance.findMany({
            where: { orderId: order.id, ticketTypeId: tt.id },
          });

          for (let i = existingTickets.length; i < 1; i++) {
            ticketInstances.push({
              orderId: order.id,
              ticketTypeId: tt.id,
              qrUuid: `${order.id}-${tt.id}-${i}`,
              qrCode: `PP-${order.id}-${tt.id}-${i}`,
            });
          }
        }

        if (ticketInstances.length > 0) {
          await tx.ticketInstance.createMany({ data: ticketInstances });
        }
      }
    });

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("Webhook error:", e);
    return error("Internal server error", 500);
  }
}
