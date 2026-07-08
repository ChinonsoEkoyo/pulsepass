import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";
import PayoutSection from "./PayoutSection";
import styles from "./page.module.css";
import dashboardStyles from "../page.module.css";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  const sp = await searchParams;
  const activeTab = sp.tab || "payouts";

  const userName = user?.name || user?.email?.split("@")[0] || "Guest";
  const userEmail = user?.email || "";
  const firstLetter = userName.charAt(0).toUpperCase();
  const userRole = user?.role === "ORGANIZER" ? "Organizer" : user?.role === "ADMIN" ? "Admin" : "User";

  const tabs = [
    { key: "payouts", label: "Payouts" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/dashboard/account?tab=${tab.key}`}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {activeTab === "payouts" && <PayoutSection />}

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
