import { notFound } from "next/navigation";
import { db } from "@/db";
import QRCode from "qrcode";
import styles from "./page.module.css";

async function getTicket(id: string) {
  return db.ticketInstance.findUnique({
    where: { id },
    include: {
      ticketType: true,
      order: {
        include: { event: true },
      },
    },
  });
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getTicket(id);

  if (!ticket) notFound();

  const qrDataUrl = await QRCode.toDataURL(ticket.qrUuid, {
    width: 300,
    margin: 2,
  });

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{ticket.order.event.title}</h1>
        <p className={styles.subtitle}>{ticket.ticketType.name}</p>

        <div className={styles.qrWrapper}>
          <img src={qrDataUrl} alt="QR Code" className={styles.qr} />
        </div>

        <div className={styles.info}>
          <p>Venue: {ticket.order.event.venue}</p>
          <p>
            Date:{" "}
            {new Date(ticket.order.event.dateTime).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p>
            Status: <span className={styles.status}>{ticket.validationStatus}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
