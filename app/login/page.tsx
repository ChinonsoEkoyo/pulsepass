"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Login failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <Card variant="elevated" padding="lg" className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
            placeholder="Enter your password"
          />
          {error ? <p className={styles.error}>{error}</p> : null}
          <Button type="submit" loading={loading} size="lg">
            Sign In
          </Button>
        </form>
        <p className={styles.footer}>
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
      </Card>
    </div>
  );
}
