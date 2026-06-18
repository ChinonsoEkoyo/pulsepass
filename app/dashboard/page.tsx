import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui";
import styles from "./page.module.css";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const events = user
    ? await db.event.findMany({
        where: { organizerId: user.userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    : [];

  const totalRevenue = events.reduce((sum, e) => sum, 0);

  return (
    <div>
      <h1 className={styles.title}>Overview</h1>
      <div className={styles.grid}>
        <Card variant="outlined" padding="md">
          <p className={styles.label}>Total Events</p>
          <p className={styles.value}>{events.length}</p>
        </Card>
        <Card variant="outlined" padding="md">
          <p className={styles.label}>Revenue</p>
          <p className={styles.value}>₦{totalRevenue.toLocaleString()}</p>
        </Card>
      </div>
    </div>
  );
}
