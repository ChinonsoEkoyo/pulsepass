import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { CalendarDays, MapPin, Search } from "lucide-react";
import Link from "next/link";
import styles from "../page.module.css";

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export default async function BookingsPage() {
  const user = await getCurrentUser();
  const userId = user?.userId;

  const orders = !userId ? [] : await db.order.findMany({
    where: { event: { organizerId: userId } },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className={styles.headerRow} style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>Bookings</h2>
        <div className={styles.tableActions}>
          <div className={styles.tableSearch}>
            <Search size={14} />
            <input type="text" placeholder="Search bookings..." />
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <CalendarDays size={48} />
          </div>
          <h2 className={styles.emptyTitle}>No bookings yet</h2>
          <p className={styles.emptyDesc}>When users book your events, they will appear here.</p>
        </div>
      ) : (
        <div className={`${styles.card} ${styles.tableCard}`}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id.slice(0, 8).toUpperCase()}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("en-CA")}
                    <br />
                    <span>{new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
                  </td>
                  <td>
                    {order.event?.title || "Event"}
                    <br />
                    <span>{order.event?.venue || ""}</span>
                  </td>
                  <td>{formatCurrency(Number(order.amount))}</td>
                  <td>
                    <span className={`${styles.statusPill} ${
                      order.paymentStatus === "COMPLETED" ? styles.statusConfirmed :
                      order.paymentStatus === "PENDING" ? styles.statusPending :
                      styles.statusFailed
                    }`}>
                      {order.paymentStatus === "COMPLETED" ? "Confirmed" :
                       order.paymentStatus === "PENDING" ? "Pending" : "Failed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
