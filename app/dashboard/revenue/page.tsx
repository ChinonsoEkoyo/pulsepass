import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import styles from "../page.module.css";

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export default async function RevenuePage() {
  const user = await getCurrentUser();
  const userId = user?.userId;

  const orders = !userId ? [] : await db.order.findMany({
    where: { userId, paymentStatus: "COMPLETED" },
    include: { event: true },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.amount), 0);
  const totalOrders = orders.length;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>Financials</h2>
      </div>

      <section className={styles.topCardsRow}>
        <div className={styles.metricCard}>
          <DollarSign size={24} className={styles.metricIcon} />
          <div className={styles.metricInfo}>
            <p className={styles.metricLabel}>Total Revenue</p>
            <p className={styles.metricValue}>{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        <div className={styles.metricCard}>
          <TrendingUp size={24} className={styles.metricIcon} />
          <div className={styles.metricInfo}>
            <p className={styles.metricLabel}>Completed Orders</p>
            <p className={styles.metricValue}>{totalOrders}</p>
          </div>
        </div>
        <div className={styles.metricCard}>
          <TrendingDown size={24} className={styles.metricIcon} />
          <div className={styles.metricInfo}>
            <p className={styles.metricLabel}>Average Order Value</p>
            <p className={styles.metricValue}>{totalOrders > 0 ? formatCurrency(totalRevenue / totalOrders) : "₦0"}</p>
          </div>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className={styles.emptyState} style={{ marginTop: "1.5rem" }}>
          <div className={styles.emptyIcon}>
            <DollarSign size={48} />
          </div>
          <h2 className={styles.emptyTitle}>No revenue data yet</h2>
          <p className={styles.emptyDesc}>Revenue from completed orders will appear here.</p>
        </div>
      ) : (
        <div className={`${styles.card} ${styles.tableCard}`} style={{ marginTop: "1.5rem" }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Event</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id.slice(0, 8).toUpperCase()}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("en-CA")}
                  </td>
                  <td>{order.event?.title || "Event"}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(Number(order.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
