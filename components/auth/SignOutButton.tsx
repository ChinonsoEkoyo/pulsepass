"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface Props {
  style?: React.CSSProperties;
}

export default function SignOutButton({ style }: Props) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1rem",
    borderRadius: "50px",
    border: "none",
    background: "transparent",
    color: "var(--color-on-surface)",
    fontSize: "var(--font-body-medium-font-size)",
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "auto",
    width: "100%",
    textAlign: "left",
  };

  return (
    <button
      onClick={handleSignOut}
      style={{ ...baseStyle, ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-container-high)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <LogOut size={18} />
      Sign Out
    </button>
  );
}
