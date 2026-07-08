"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  eventId: string;
  ticketTypeId: string;
  ticketTypeName: string;
}

export default function ClaimFreeTicket({ eventId, ticketTypeId, ticketTypeName }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClaim() {
    setLoading(true);
    try {
      const res = await fetch("/api/tickets/claim-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, ticketTypeId }),
      });
      const json = await res.json();
      if (json.data?.orderId) {
        router.push(`/events/${eventId}?order_id=${json.data.orderId}`);
      }
    } catch {
      alert("Failed to claim ticket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClaim} disabled={loading} style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.85rem 2rem",
      backgroundColor: loading ? "var(--color-surface-container-high)" : "var(--color-primary)",
      color: "var(--color-on-primary)",
      borderRadius: 50,
      fontSize: "1rem",
      fontWeight: 600,
      cursor: loading ? "not-allowed" : "pointer",
      border: "none",
      fontFamily: "inherit",
      textDecoration: "none",
      opacity: loading ? 0.7 : 1,
    }}>
      {loading && <Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} />}
      {loading ? "Claiming..." : `Get Free ${ticketTypeName} Ticket`}
    </button>
  );
}
