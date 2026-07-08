import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { CalendarDays, CheckSquare, Ticket, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import DashboardAnalytics from "./DashboardAnalytics";
import styles from "./page.module.css";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user?.userId;

  const [events, orders, allOrders, ticketTypesWithCount] = !userId
    ? [[], [], [], []]
    : await Promise.all([
        db.event.findMany({
          where: { organizerId: userId },
          include: { ticketTypes: true },
          orderBy: { dateTime: "asc" },
        }),
        db.order.findMany({
          where: { event: { organizerId: userId } },
          include: { event: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        db.order.findMany({
          where: { event: { organizerId: userId }, paymentStatus: "COMPLETED" },
          include: { event: true },
          orderBy: { createdAt: "asc" },
        }),
        db.ticketType.findMany({
          where: { event: { organizerId: userId } },
          include: { _count: { select: { ticketInstances: true } } },
        }),
      ]);

  const upcomingEvents = events.filter((e) => new Date(e.dateTime) > new Date());
  const totalBookings = orders.length;
  const ticketsSold = totalBookings;
  const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.amount), 0);
  const hasEvents = events.length > 0;

  // ── Ticket type analytics ──
  const ticketTypeAnalytics = ticketTypesWithCount.map((tt) => {
    const event = events.find((e) => e.id === tt.eventId);
    return {
      id: tt.id,
      eventTitle: event?.title || "Unknown",
      name: tt.name,
      quantity: tt.quantity,
      ticketCount: tt._count.ticketInstances,
    };
  });

  // ── Monthly revenue ──
  const monthlyMap: Record<string, { revenue: number; profit: number }> = {};
  for (const order of allOrders) {
    if (order.paymentStatus !== "COMPLETED") continue;
    const d = new Date(order.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short" });
    if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, profit: 0 };
    monthlyMap[key].revenue += Number(order.amount);
    monthlyMap[key].profit += Number(order.amount) * 0.3; // assume 30% profit margin
  }
  const monthlyRevenue = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => {
      const parts = key.split("-");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return { month: key, label: monthNames[parseInt(parts[1])], revenue: val.revenue, profit: val.profit };
    });

  // ── Orders formatted ──
  const orderData = orders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    eventTitle: o.event?.title || "Event",
    category: o.event?.category || "",
    amount: Number(o.amount),
    status: o.paymentStatus,
  }));

  if (!hasEvents) {
    return (
      <div className={styles.dashboard}>
        <section className={styles.topCardsRow}>
          <div className={styles.metricCard}>
            <CalendarDays size={24} className={styles.metricIcon} />
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Upcoming Events</p>
              <p className={styles.metricValue}>0</p>
            </div>
          </div>
          <div className={styles.metricCard}>
            <CheckSquare size={24} className={styles.metricIcon} />
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Total Bookings</p>
              <p className={styles.metricValue}>0</p>
            </div>
          </div>
          <div className={styles.metricCard}>
            <Ticket size={24} className={styles.metricIcon} />
            <div className={styles.metricInfo}>
              <p className={styles.metricLabel}>Tickets Sold</p>
              <p className={styles.metricValue}>0</p>
            </div>
          </div>
        </section>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <AlertCircle size={48} />
          </div>
          <h2 className={styles.emptyTitle}>No events yet</h2>
          <p className={styles.emptyDesc}>Create your first event to get started with PulsePass.</p>
          <Link href="/create" className={styles.emptyCta}>
            <Plus size={18} />
            Create Event
          </Link>
        </div>

        <footer className={styles.dashboardFooter}>
          <div className={styles.footerLeft}>Copyright &copy; 2026 PulsePass</div>
          <div className={styles.footerCenter}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms and conditions</a>
            <a href="#">Contact</a>
          </div>
          <div className={styles.footerRight}>
            <a href="#">X</a>
            <a href="#">In</a>
            <a href="#">Yt</a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <section className={styles.topCardsRow}>
        <div className={styles.metricCard}>
          <CalendarDays size={24} className={styles.metricIcon} />
          <div className={styles.metricInfo}>
            <p className={styles.metricLabel}>Upcoming Events</p>
            <p className={styles.metricValue}>{upcomingEvents.length}</p>
          </div>
        </div>
        <div className={styles.metricCard}>
          <CheckSquare size={24} className={styles.metricIcon} />
          <div className={styles.metricInfo}>
            <p className={styles.metricLabel}>Total Bookings</p>
            <p className={styles.metricValue}>{totalBookings}</p>
          </div>
        </div>
        <div className={styles.metricCard}>
          <Ticket size={24} className={styles.metricIcon} />
          <div className={styles.metricInfo}>
            <p className={styles.metricLabel}>Tickets Sold</p>
            <p className={styles.metricValue}>{ticketsSold}</p>
          </div>
        </div>
      </section>

      <section className={styles.analyticsRow}>
        <DashboardAnalytics
          ticketTypes={ticketTypeAnalytics}
          monthlyRevenue={monthlyRevenue}
          totalRevenue={totalRevenue}
        />
        <section className={styles.recentBookingsSection}>
          <div className={`${styles.card} ${styles.tableCard}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recent Bookings</h3>
            </div>
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
                {orderData.length > 0 ? orderData.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{order.id.slice(0, 6).toUpperCase()}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString("en-CA")}<br/><span>{new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span></td>
                    <td>{order.eventTitle}<br/><span>{order.category}</span></td>
                    <td>{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(order.amount)}</td>
                    <td><span className={`${styles.statusPill} ${order.status === "COMPLETED" ? styles.statusConfirmed : order.status === "PENDING" ? styles.statusPending : order.status === "FAILED" ? styles.statusFailed : order.status === "REFUNDED" ? styles.statusRefunded : ""}`}>{order.status === "COMPLETED" ? "Confirmed" : order.status === "PENDING" ? "Pending" : order.status === "FAILED" ? "Failed" : order.status === "REFUNDED" ? "Refunded" : order.status}</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--color-on-surface-variant)" }}>No bookings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <footer className={styles.dashboardFooter}>
        <div className={styles.footerLeft}>Copyright &copy; 2026 PulsePass</div>
        <div className={styles.footerCenter}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms and conditions</a>
          <a href="#">Contact</a>
        </div>
        <div className={styles.footerRight}>
          <a href="#">X</a>
          <a href="#">In</a>
          <a href="#">Yt</a>
        </div>
      </footer>

    </div>
  );
}
