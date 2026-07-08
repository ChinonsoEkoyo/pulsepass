"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import TicketModal from "./TicketModal";
import styles from "./page.module.css";

interface TicketInfo {
  id: string;
  qrCode: string;
  validationStatus: string;
  ticketTypeName: string;
  ticketTypePrice: number;
  createdAt: string;
}

interface TicketGroup {
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventBanner: string | null;
  orderId: string;
  isUpcoming: boolean;
  tickets: TicketInfo[];
}

export default function TicketsClient({ groups }: { groups: TicketGroup[] }) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedTickets, setSelectedTickets] = useState<TicketInfo[] | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const upcoming = groups.filter((g) => g.isUpcoming);
  const past = groups.filter((g) => !g.isUpcoming);
  const displayed = activeTab === "upcoming" ? upcoming : past;

  function openModal(tickets: TicketInfo[], eventTitle: string) {
    setSelectedTickets(tickets);
    setSelectedEvent(eventTitle);
  }

  return (
    <>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "upcoming" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`${styles.tab} ${activeTab === "past" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>

      {displayed.length === 0 ? (
        <div className={styles.emptyState}>
          <Ticket size={48} />
          <h2 className={styles.emptyTitle}>
            {activeTab === "upcoming" ? "No upcoming tickets" : "No past tickets"}
          </h2>
          <p className={styles.emptyDesc}>
            {activeTab === "upcoming"
              ? "Tickets you purchase for upcoming events will appear here."
              : "Past event tickets will appear here."}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {displayed.map((group) => (
            <button
              key={group.orderId}
              className={styles.card}
              onClick={() => openModal(group.tickets, group.eventTitle)}
            >
              <div className={styles.cardImage}>
                {group.eventBanner ? (
                  <img src={group.eventBanner} alt={group.eventTitle} className={styles.cardImg} />
                ) : (
                  <div className={styles.cardImagePlaceholder} />
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{group.eventTitle}</h3>
                <p className={styles.cardMeta}>
                  <CalendarDays size={14} />
                  {new Date(group.eventDate).toLocaleDateString("en-US", {
                    weekday: "short", month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
                <p className={styles.cardMeta}>
                  <MapPin size={14} />
                  {group.eventVenue}
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.ticketCount}>
                    {group.tickets.length} ticket{group.tickets.length > 1 ? "s" : ""}
                  </span>
                  <span className={`${styles.statusBadge} ${
                    group.tickets.some((t) => t.validationStatus === "USED")
                      ? styles.usedBadge
                      : styles.validBadge
                  }`}>
                    {group.tickets.every((t) => t.validationStatus === "USED")
                      ? "Used"
                      : group.tickets.some((t) => t.validationStatus === "USED")
                      ? "Partially Used"
                      : "Valid"}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedTickets && (
        <TicketModal
          tickets={selectedTickets}
          eventTitle={selectedEvent}
          onClose={() => setSelectedTickets(null)}
        />
      )}
    </>
  );
}
