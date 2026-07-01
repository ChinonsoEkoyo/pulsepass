import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Ticket, Landmark } from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";
import styles from "./page.module.css";
import dashboardStyles from "../page.module.css";

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  const sp = await searchParams;
  const activeTab = sp.tab || "tickets";

  const userId = user?.userId;
  const userName = user?.name || user?.email?.split("@")[0] || "Guest";
  const userEmail = user?.email || "";
  const firstLetter = userName.charAt(0).toUpperCase();
  const userRole = user?.role === "ORGANIZER" ? "Organizer" : user?.role === "ADMIN" ? "Admin" : "User";

  const tickets = !userId ? [] : await db.ticketInstance.findMany({
    where: { order: { userId } },
    include: {
      order: { include: { event: true } },
      ticketType: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { key: "tickets", label: "My Tickets" },
    { key: "payouts", label: "Payouts" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/dashboard/account${tab.key === "tickets" ? "" : `?tab=${tab.key}`}`}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {activeTab === "tickets" && (
        <div>
          {tickets.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Ticket size={48} />
              </div>
              <h2 className={styles.emptyTitle}>No tickets yet</h2>
              <p className={styles.emptyDesc}>Tickets you purchase will appear here.</p>
            </div>
          ) : (
            <div className={`${styles.card} ${styles.tableCard}`}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Event</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Purchased</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.id.slice(0, 8).toUpperCase()}</td>
                      <td>
                        {ticket.order.event?.title || "Event"}
                        <br />
                        <span>{ticket.order.event?.venue || ""}</span>
                      </td>
                      <td>{ticket.ticketType?.name || "Standard"}</td>
                      <td>
                        <span className={`${styles.statusPill} ${
                          ticket.validationStatus === "VALID" ? styles.statusConfirmed :
                          ticket.validationStatus === "USED" ? styles.statusPending :
                          styles.statusFailed
                        }`}>
                          {ticket.validationStatus}
                        </span>
                      </td>
                      <td>
                        {new Date(ticket.createdAt).toLocaleDateString("en-CA")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "payouts" && (
        <div className={styles.payoutsContainer}>
          <div className={styles.payoutsIcon}>
            <Landmark size={28} />
          </div>
          <h2 className={styles.payoutsTitle}>You&apos;ve not added any payout account</h2>
          <p className={styles.payoutsDesc}>
            Add your account details to receive funds from your PulsePass sales.
          </p>
          <button className={styles.payoutsBtn}>
            + Add payout account
          </button>
        </div>
      )}

      {activeTab === "settings" && (
        <div className={styles.settingsCard}>
          <div className={styles.settingsSection}>
            <div className={styles.avatarSection}>
              <div className={dashboardStyles.profileAvatar}>
                <div className={dashboardStyles.avatarPlaceholder}>{firstLetter}</div>
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)" }}>{userName}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-on-surface-variant)" }}>{userRole}</div>
              </div>
            </div>
            <div className={styles.settingsRow}>
              <div>
                <span className={styles.settingsLabel}>Username</span>
                <span className={styles.settingsValue}>{userName}</span>
              </div>
              <button className={styles.settingsAction}>Edit</button>
            </div>
            <div className={styles.settingsRow}>
              <div>
                <span className={styles.settingsLabel}>Email</span>
                <span className={styles.settingsValue}>{userEmail}</span>
              </div>
              <button className={styles.settingsAction}>Change</button>
            </div>
          </div>

          <div className={styles.settingsSection}>
            <h3 className={styles.settingsSectionTitle}>Order Notification Summary</h3>
            <div className={styles.notificationRow}>
              <div className={styles.notificationInfo}>
                <span className={styles.notificationLabel}>Order Notification Emails</span>
                <span className={styles.notificationDesc}>How frequently do you want to receive summary emails?</span>
              </div>
              <div className={styles.frequencyGroup}>
                <label className={styles.frequencyOption}>
                  <input type="radio" name="frequency" defaultChecked /> Weekly
                </label>
                <label className={styles.frequencyOption}>
                  <input type="radio" name="frequency" /> Monthly
                </label>
              </div>
            </div>
          </div>

          <div className={`${styles.signOutSection} ${styles.hideMobile}`}>
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
}
