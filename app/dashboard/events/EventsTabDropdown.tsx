"use client";

import { useRouter, usePathname } from "next/navigation";
import styles from "./page.module.css";

const tabOptions = [
  { key: "all", label: "All Events" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "ended", label: "Ended" },
];

export default function EventsTabDropdown({ activeTab }: { activeTab: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={styles.tabDropdownWrapper}>
      <select
        className={styles.tabDropdown}
        value={activeTab}
        onChange={(e) => {
          const val = e.target.value;
          router.push(val === "all" ? pathname : `${pathname}?tab=${val}`);
        }}
      >
        {tabOptions.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
