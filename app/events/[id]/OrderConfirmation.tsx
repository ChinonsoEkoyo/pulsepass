"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const transactionId = searchParams.get("transaction_id");
  const flwStatus = searchParams.get("status");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [ticketCount, setTicketCount] = useState(0);
  const [isFree, setIsFree] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    if (flwStatus && flwStatus !== "successful" && flwStatus !== "completed") {
      setStatus("error");
      return;
    }

    fetch("/api/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        transactionId: transactionId ? Number(transactionId) : undefined,
        status: flwStatus || undefined,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.status === "COMPLETED") {
          setStatus("success");
          setTicketCount(json.data.ticketCount || 0);
          setIsFree(json.data.isFree || false);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [orderId, transactionId, flwStatus]);

  if (!orderId) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      padding: "1rem 2rem",
      backgroundColor: status === "success"
        ? "var(--color-primary-container)"
        : status === "error"
        ? "var(--color-error-container)"
        : "var(--color-surface-container)",
      color: status === "success"
        ? "var(--color-primary)"
        : status === "error"
        ? "#b91c1c"
        : "var(--color-on-surface-variant)",
      fontWeight: 600,
      fontSize: "0.9rem",
      flexWrap: "wrap",
    }}>
      {status === "verifying" && (
        <>
          <Loader2 size={20} style={{ animation: "spin 0.8s linear infinite" }} />
          <span>Confirming your payment...</span>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle size={20} />
          <span>{isFree ? "Ticket claimed!" : ticketCount > 0 ? `${ticketCount} ticket(s) confirmed.` : "Payment successful!"}</span>
          <Link href="/dashboard/tickets" style={{
            marginLeft: "auto",
            padding: "0.4rem 1rem",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-on-primary)",
            borderRadius: 50,
            textDecoration: "none",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
          }}>
            View tickets
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle size={20} />
          <span>Payment could not be verified. Please contact support.</span>
          <Link href={`/dashboard/account?order_id=${orderId}`} style={{
            marginLeft: "auto",
            padding: "0.4rem 1rem",
            backgroundColor: "#b91c1c",
            color: "#fff",
            borderRadius: 50,
            textDecoration: "none",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
          }}>
            Check order status
          </Link>
        </>
      )}
    </div>
  );
}
