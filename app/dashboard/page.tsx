import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { 
  CalendarDays, 
  CheckSquare, 
  Ticket, 
  ChevronDown, 
  AlertCircle,
  Plus,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user?.userId;

  const [events, orders] = !userId ? [[], []] : await Promise.all([
    db.event.findMany({
      where: { organizerId: userId },
      include: { ticketTypes: true },
      orderBy: { dateTime: "asc" },
    }),
    db.order.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const upcomingEvents = events.filter((e) => new Date(e.dateTime) > new Date());
  const totalBookings = orders.length;
  const ticketsSold = orders.reduce((sum, o) => sum + Number(o.amount), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.amount), 0);
  const hasEvents = events.length > 0;

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
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Ticket Sales</h3>
            <button className={styles.pillButton}>
              This Week <ChevronDown size={14} />
            </button>
          </div>
          {ticketsSold === 0 ? (
            <div className={styles.cardEmptyState}>
              <Ticket size={32} opacity={0.3} />
              <p>No ticket sales yet</p>
            </div>
          ) : (
            <>
              <div className={styles.donutChartContainer}>
                <svg viewBox="0 0 36 36" className={styles.donutSvg}>
                  <path
                    className={styles.donutHole}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={styles.donutSegmentGrey}
                    strokeDasharray="45, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={styles.donutSegmentPink}
                    strokeDasharray="40, 100"
                    strokeDashoffset="-45"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className={styles.donutCenter}>
                  <span className={styles.donutLabel}>Total Ticket</span>
                  <span className={styles.donutTotal}>{ticketsSold}</span>
                </div>
              </div>
              <div className={styles.ticketStatsList}>
                <div className={styles.ticketStatItem}>
                  <div className={styles.statLine}>
                    <div className={styles.statIndicatorRow}>
                      <span className={`${styles.indicator} ${styles.bgPink}`}></span>
                      <span className={styles.statLabel}>Sold Out</span>
                    </div>
                    <span className={styles.statPercentBadge}>45%</span>
                  </div>
                  <div className={styles.statValue}>{Math.round(ticketsSold * 0.45)}</div>
                </div>
                <div className={styles.ticketStatItem}>
                   <div className={styles.statLine}>
                    <div className={styles.statIndicatorRow}>
                      <span className={`${styles.indicator} ${styles.bgGrey}`}></span>
                      <span className={styles.statLabel}>Fully Booked</span>
                    </div>
                    <span className={styles.statPercentBadge}>30%</span>
                  </div>
                  <div className={styles.statValue}>{Math.round(ticketsSold * 0.3)}</div>
                </div>
                <div className={styles.ticketStatItem}>
                   <div className={styles.statLine}>
                    <div className={styles.statIndicatorRow}>
                      <span className={`${styles.indicator} ${styles.bgLightGrey}`}></span>
                      <span className={styles.statLabel}>Available</span>
                    </div>
                    <span className={styles.statPercentBadge}>25%</span>
                  </div>
                  <div className={styles.statValue}>{Math.round(ticketsSold * 0.25)}</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.card}>
           <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Sales Revenue</h3>
            <button className={styles.pillButton}>
              Last 8 Months <ChevronDown size={14} />
            </button>
          </div>
          {ticketsSold === 0 ? (
            <div className={styles.cardEmptyState}>
              <DollarSign size={32} opacity={0.3} />
              <p>No revenue data yet</p>
            </div>
          ) : (
            <>
              <div className={styles.revenueSummary}>
                <div className={styles.revenueTotalWrapper}>
                  <span className={styles.revenueTotalLabel}>Total Revenue</span>
                  <span className={styles.revenueTotalValue}>{formatCurrency(totalRevenue)}</span>
                </div>
                <div className={styles.revenueLegend}>
                  <span className={styles.legendItem}><span className={`${styles.indicator} ${styles.bgLightPurple}`}></span>Revenue</span>
                  <span className={styles.legendItem}><span className={`${styles.indicator} ${styles.bgHotPink}`}></span>Profit</span>
                </div>
              </div>
              <div className={styles.barChartMock}>
                <div className={styles.yAxis}>
                  <span>60K</span><span>45K</span><span>30K</span><span>15K</span><span>0</span>
                </div>
                <div className={styles.barsContainer}>
                  {[{h1: "30%", h2:"40%"}, {h1:"20%", h2:"25%"}, {h1:"50%", h2:"40%"}, {h1:"80%", h2:"60%"}, {h1:"30%", h2:"20%"}, {h1:"40%", h2:"30%"}, {h1:"15%", h2:"10%"}, {h1:"45%", h2:"35%"}].map((data, i) => (
                    <div className={styles.barGroup} key={i}>
                       <div className={styles.barTracks}>
                          <div className={`${styles.bar} ${styles.bgLightPurple}`} style={{height: data.h1}}></div>
                          <div className={`${styles.bar} ${styles.bgHotPink}`} style={{height: data.h2}}></div>
                       </div>
                       <span className={styles.xAxisLabel}>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'][i]}</span>
                    </div>
                  ))}
                  <div className={styles.chartTooltip} style={{left: "40%", top: "20%"}}>
                    <span className={styles.tooltipLabel}>Revenue</span>
                    <span className={styles.tooltipValue}>{formatCurrency(totalRevenue)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className={styles.recentBookingsSection}>
        <div className={`${styles.card} ${styles.tableCard}`}>
           <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recent Bookings</h3>
              <div className={styles.tableActions}>
                <button className={styles.pillButton}>This Week <ChevronDown size={14}/></button>
              </div>
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
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id.slice(0, 8).toUpperCase()}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString("en-CA")}<br/><span>{new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span></td>
                    <td>{order.event?.title || "Event"}<br/><span>{order.event?.category || ""}</span></td>
                    <td>{formatCurrency(Number(order.amount))}</td>
                    <td><span className={`${styles.statusPill} ${order.paymentStatus === "COMPLETED" ? styles.statusConfirmed : order.paymentStatus === "PENDING" ? styles.statusPending : order.paymentStatus === "FAILED" ? styles.statusFailed : order.paymentStatus === "REFUNDED" ? styles.statusRefunded : ""}`}>{order.paymentStatus === "COMPLETED" ? "Confirmed" : order.paymentStatus === "PENDING" ? "Pending" : order.paymentStatus === "FAILED" ? "Failed" : order.paymentStatus === "REFUNDED" ? "Refunded" : order.paymentStatus}</span></td>
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
