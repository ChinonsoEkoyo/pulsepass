"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import styles from "./page.module.css";

export default function ScannerPage() {
  const [qrUuid, setQrUuid] = useState("");
  const [result, setResult] = useState<{
    status: string;
    message: string;
    ticket?: { eventTitle: string; ticketName: string };
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleValidate() {
    if (!qrUuid.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tickets/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrUuid: qrUuid.trim() }),
      });

      const json = await res.json();
      setResult(json.data || { status: "ERROR", message: json.error || "Validation failed" });
    } catch {
      setResult({ status: "ERROR", message: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  const badgeVariant = result?.status === "VALID" ? "success"
    : result?.status === "USED" ? "warning"
    : result?.status === "INVALID" || result?.status === "ERROR" ? "error"
    : "default";

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Ticket Scanner</h1>

      <Card variant="outlined" padding="lg" className={styles.scanner}>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            placeholder="Enter or scan QR UUID"
            value={qrUuid}
            onChange={(e) => setQrUuid(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidate()}
          />
          <Button onClick={handleValidate} loading={loading}>
            Validate
          </Button>
        </div>

        {result ? (
          <div className={styles.result}>
            <Badge variant={badgeVariant}>{result.status}</Badge>
            <p className={styles.message}>{result.message}</p>
            {result.ticket ? (
              <div className={styles.ticketInfo}>
                <p><strong>{result.ticket.eventTitle}</strong></p>
                <p>{result.ticket.ticketName}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
