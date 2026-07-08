"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Ticket, DollarSign } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./page.module.css";

ChartJS.register(ArcElement, Tooltip);

interface TicketTypeData {
  id: string;
  eventTitle: string;
  name: string;
  quantity: number;
  ticketCount: number;
}

interface MonthlyData {
  month: string;
  label: string;
  revenue: number;
  profit: number;
}

interface Props {
  ticketTypes: TicketTypeData[];
  monthlyRevenue: MonthlyData[];
  totalRevenue: number;
}

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

function getCSSVar(name: string): string {
  if (typeof window === "undefined") return "#000";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#000";
}

type SalesPeriod = "week" | "month" | "all";
type RevenuePeriod = "6months" | "8months" | "12months";

export default function DashboardAnalytics({ ticketTypes, monthlyRevenue, totalRevenue }: Props) {
  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>("week");
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("8months");
  const [salesOpen, setSalesOpen] = useState(false);
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [colors, setColors] = useState({ primary: "#e91e63", secondary: "#3f51b5", tertiary: "#009688", surfaceHigh: "#e0e0e0" });

  useEffect(() => {
    setColors({
      primary: getCSSVar("--color-primary"),
      secondary: getCSSVar("--color-secondary"),
      tertiary: getCSSVar("--color-tertiary"),
      surfaceHigh: getCSSVar("--color-surface-container-high"),
    });
  }, []);

  const filteredTicketTypes = ticketTypes.filter(() => true);

  const totalSold = filteredTicketTypes.reduce((s, t) => s + t.ticketCount, 0);

  const soldOutTotal = filteredTicketTypes.filter((t) => t.ticketCount >= t.quantity).reduce((s, t) => s + t.ticketCount, 0);
  const fullyBookedTotal = filteredTicketTypes.filter((t) => t.ticketCount > 0 && t.ticketCount < t.quantity && (t.ticketCount / t.quantity) >= 0.5).reduce((s, t) => s + t.ticketCount, 0);
  const availableTotal = filteredTicketTypes.filter((t) => t.ticketCount === 0 || (t.ticketCount / t.quantity) < 0.5).reduce((s, t) => s + t.ticketCount, 0);

  const totalForPercent = soldOutTotal + fullyBookedTotal + availableTotal || 1;
  const soldOutPct = Math.round((soldOutTotal / totalForPercent) * 100);
  const fullyBookedPct = Math.round((fullyBookedTotal / totalForPercent) * 100);
  const availablePct = 100 - soldOutPct - fullyBookedPct;

  const donutData = {
    labels: ["Sold Out", "Fully Booked", "Available"],
    datasets: [{
      data: [
        Math.max(soldOutTotal, 0.1),
        Math.max(fullyBookedTotal, 0.1),
        Math.max(availableTotal, 0.1),
      ],
      backgroundColor: [colors.primary, colors.secondary, colors.tertiary],
      borderWidth: 0,
      spacing: 6,
    }],
  };

  const donutOptions = {
    cutout: "75%",
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  const monthsToShow = revenuePeriod === "6months" ? 6 : revenuePeriod === "8months" ? 8 : 12;
  const displayRevenue = monthlyRevenue.slice(-monthsToShow);
  const maxRevenue = Math.max(...displayRevenue.map((m) => m.revenue), 1);

  return (
    <>
      {/* ── Ticket Sales ── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Ticket Sales</h3>
          <div style={{ position: "relative" }}>
            <button className={styles.pillButton} onClick={() => setSalesOpen(!salesOpen)}>
              {salesPeriod === "week" ? "This Week" : salesPeriod === "month" ? "This Month" : "All Time"} <ChevronDown size={14} />
            </button>
            {salesOpen && (
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 4,
                backgroundColor: "var(--color-surface)", borderRadius: 8,
                border: "1px solid var(--color-outline-variant)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 10, minWidth: 140, overflow: "hidden",
              }}>
                {(["week", "month", "all"] as SalesPeriod[]).map((p) => (
                  <button key={p} onClick={() => { setSalesPeriod(p); setSalesOpen(false); }} style={{
                    display: "block", width: "100%", padding: "0.5rem 1rem", textAlign: "left", border: "none",
                    background: salesPeriod === p ? "var(--color-primary-container)" : "transparent",
                    color: "var(--color-on-surface)", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {p === "week" ? "This Week" : p === "month" ? "This Month" : "All Time"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {totalSold === 0 ? (
          <div className={styles.cardEmptyState}>
            <Ticket size={32} opacity={0.3} />
            <p>No ticket sales yet</p>
          </div>
        ) : (
          <>
            <div className={styles.donutChartContainer}>
              <Doughnut data={donutData} options={donutOptions} />
              <div className={styles.donutCenter}>
                <span className={styles.donutLabel}>Total Sold</span>
                <span className={styles.donutTotal}>{totalSold}</span>
              </div>
            </div>
            <div className={styles.ticketStatsList}>
                {[
                  { label: "Sold Out", value: soldOutTotal, pct: soldOutPct, color: styles.bgPink },
                  { label: "Fully Booked", value: fullyBookedTotal, pct: fullyBookedPct, color: styles.bgDarkBlue },
                  { label: "Available", value: availableTotal, pct: availablePct, color: styles.bgLightBlue },
                ].map((stat) => (
                <div key={stat.label} className={styles.ticketStatItem}>
                  <div className={styles.statLine}>
                    <div className={styles.statIndicatorRow}>
                      <span className={`${styles.indicator} ${stat.color}`}></span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                    <span className={styles.statPercentBadge}>{stat.pct}%</span>
                  </div>
                  <div className={styles.statValue}>{stat.value}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Sales Revenue ── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Sales Revenue</h3>
          <div style={{ position: "relative" }}>
            <button className={styles.pillButton} onClick={() => setRevenueOpen(!revenueOpen)}>
              Last {monthsToShow} Months <ChevronDown size={14} />
            </button>
            {revenueOpen && (
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 4,
                backgroundColor: "var(--color-surface)", borderRadius: 8,
                border: "1px solid var(--color-outline-variant)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 10, minWidth: 160, overflow: "hidden",
              }}>
                {(["6months", "8months", "12months"] as RevenuePeriod[]).map((p) => (
                  <button key={p} onClick={() => { setRevenuePeriod(p); setRevenueOpen(false); }} style={{
                    display: "block", width: "100%", padding: "0.5rem 1rem", textAlign: "left", border: "none",
                    background: revenuePeriod === p ? "var(--color-primary-container)" : "transparent",
                    color: "var(--color-on-surface)", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    Last {p === "6months" ? "6" : p === "8months" ? "8" : "12"} Months
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {totalRevenue === 0 ? (
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
                <span>{formatCurrency(maxRevenue)}</span>
                <span>{formatCurrency(Math.round(maxRevenue * 0.75))}</span>
                <span>{formatCurrency(Math.round(maxRevenue * 0.5))}</span>
                <span>{formatCurrency(Math.round(maxRevenue * 0.25))}</span>
                <span>0</span>
              </div>
              <div className={styles.barsContainer}>
                {displayRevenue.map((m, i) => {
                  const revPct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                  const profPct = maxRevenue > 0 ? (m.profit / maxRevenue) * 100 : 0;
                  return (
                    <div className={styles.barGroup} key={i}>
                      <div className={styles.barTracks}>
                        <div className={`${styles.bar} ${styles.bgLightPurple}`} style={{ height: `${Math.max(revPct, 2)}%` }}></div>
                        <div className={`${styles.bar} ${styles.bgHotPink}`} style={{ height: `${Math.max(profPct, 2)}%` }}></div>
                      </div>
                      <span className={styles.xAxisLabel}>{m.label}</span>
                    </div>
                  );
                })}
                <div className={styles.chartTooltip} style={{ left: "40%", top: "10%" }}>
                  <span className={styles.tooltipLabel}>Revenue</span>
                  <span className={styles.tooltipValue}>{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>


    </>
  );
}
