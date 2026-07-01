import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import DashboardShell from "./DashboardShell";
import styles from "./layout.module.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      headerLeft={
        <Link href="/" className={styles.logo}>
          <Image src="/images/PulsePass-purple.png" alt="PulsePass" width={140} height={35} />
        </Link>
      }
    >
      {children}
    </DashboardShell>
  );
}
