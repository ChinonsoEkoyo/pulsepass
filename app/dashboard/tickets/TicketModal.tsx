"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import styles from "./page.module.css";

interface TicketInfo {
  id: string;
  qrCode: string;
  validationStatus: string;
  ticketTypeName: string;
  ticketTypePrice: number;
  createdAt: string;
}

interface TicketModalProps {
  tickets: TicketInfo[];
  eventTitle: string;
  onClose: () => void;
}

export default function TicketModal({ tickets, eventTitle, onClose }: TicketModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const firstTicket = tickets[0];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <h2 className={styles.modalTitle}>{eventTitle}</h2>
        <p className={styles.modalSubtitle}>{tickets.length} ticket{tickets.length > 1 ? "s" : ""}</p>

        {tickets.map((ticket, idx) => (
          <div key={ticket.id} className={styles.ticketCard}>
            {tickets.length > 1 && (
              <div className={styles.ticketIndex}>Ticket {idx + 1}</div>
            )}
            <div className={styles.barcodeSection}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticket.qrCode)}`}
                alt="QR Code"
                width={160}
                height={160}
                className={styles.qrCode}
              />
              <p className={styles.barcodeLabel}>{ticket.qrCode}</p>
            </div>
            <div className={styles.ticketDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Type</span>
                <span className={styles.detailValue}>{ticket.ticketTypeName}</span>
              </div>
              {ticket.ticketTypePrice > 0 && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Price</span>
                  <span className={styles.detailValue}>₦{ticket.ticketTypePrice.toLocaleString()}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={`${styles.statusPill} ${
                  ticket.validationStatus === "VALID" ? styles.statusValid :
                  ticket.validationStatus === "USED" ? styles.statusUsed :
                  styles.statusInvalid
                }`}>
                  {ticket.validationStatus}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Purchased</span>
                <span className={styles.detailValue}>
                  {new Date(ticket.createdAt).toLocaleDateString("en-CA")}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Ticket ID</span>
                <span className={styles.detailValue}>{ticket.id.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
