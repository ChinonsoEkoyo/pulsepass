"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, Card } from "@/components/ui";
import styles from "./page.module.css";

interface TicketType {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface EventData {
  id: string;
  title: string;
  venue: string;
  dateTime: string;
  ticketTypes: TicketType[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${params.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setEvent(json.data);
          const initial: Record<string, number> = {};
          json.data.ticketTypes.forEach((t: TicketType) => {
            initial[t.id] = 0;
          });
          setQuantities(initial);
        }
      });
  }, [params.id]);

  const total = event
    ? event.ticketTypes.reduce(
        (sum, t) => sum + Number(t.price) * (quantities[t.id] || 0),
        0
      )
    : 0;

  const hasSelection = Object.values(quantities).some((q) => q > 0);

  async function handlePayment() {
    if (!event || !hasSelection) return;
    setLoading(true);

    const selectedIds = event.ticketTypes
      .filter((t) => (quantities[t.id] || 0) > 0)
      .map((t) => t.id);

    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ticketTypeIds: selectedIds,
          quantities,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Payment initialization failed");
        return;
      }

      if (json.data?.paymentLink) {
        window.location.href = json.data.paymentLink;
      } else {
        router.push(`/events/${event.id}?order_id=${json.data.orderId}`);
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!event) {
    return <div className={styles.page}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/images/PulsePass-purple.png" alt="PulsePass" width={140} height={35} className={styles.logo} />
        </Link>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Checkout</h1>

        <Card variant="outlined" padding="md" className={styles.eventInfo}>
          <h2>{event.title}</h2>
          <p>{event.venue}</p>
          <p>{new Date(event.dateTime).toLocaleDateString()}</p>
        </Card>

        <div className={styles.tickets}>
          {event.ticketTypes.map((ticket) => (
            <div key={ticket.id} className={styles.ticketRow}>
              <div>
                <p className={styles.ticketName}>{ticket.name}</p>
                <p className={styles.ticketPrice}>
                  ₦{Number(ticket.price).toLocaleString()}
                </p>
              </div>
              <div className={styles.qtyControl}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() =>
                    setQuantities((p) => ({
                      ...p,
                      [ticket.id]: Math.max(0, (p[ticket.id] || 0) - 1),
                    }))
                  }
                >
                  -
                </button>
                <span className={styles.qty}>{quantities[ticket.id] || 0}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() =>
                    setQuantities((p) => ({
                      ...p,
                      [ticket.id]: Math.min(ticket.quantity, (p[ticket.id] || 0) + 1),
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.total}>
          <span>Total</span>
          <span className={styles.totalAmount}>₦{total.toLocaleString()}</span>
        </div>

        <Button
          size="lg"
          onClick={handlePayment}
          disabled={!hasSelection}
          loading={loading}
          className={styles.payBtn}
        >
          {total === 0 ? "Get Free Ticket" : "Proceed to Payment"}
        </Button>
      </main>
    </div>
  );
}
