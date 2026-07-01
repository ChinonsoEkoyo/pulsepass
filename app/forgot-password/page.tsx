"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import styles from "./page.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [devUrl, setDevUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong");
        return;
      }

      setSent(true);
      if (json.data?.devResetUrl) {
        setDevUrl(json.data.devResetUrl);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/images/PulsePass-purple.png"
          alt="PulsePass"
          width={140}
          height={35}
          priority
        />
      </Link>
      <Card variant="elevated" padding="lg" className={styles.card}>
        {sent ? (
          <>
            <div className={styles.sentIcon}>
              <Check size={32} />
            </div>
            <h1 className={styles.title}>Check your email</h1>
            <p className={styles.subtitle}>
              If an account with that email exists, we&apos;ve sent a password reset link.
            </p>
            {devUrl ? (
              <a href={devUrl} className={styles.devLink}>
                Open reset link (dev mode)
              </a>
            ) : null}
            <Link href="/login" className={styles.backToLogin}>
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.backButton}>
              <ArrowLeft size={18} />
              Back
            </Link>
            <h1 className={styles.title}>Forgot Password</h1>
            <p className={styles.subtitle}>
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
              {error ? <p className={styles.error}>{error}</p> : null}
              <Button type="submit" loading={loading} size="lg">
                Send Reset Link
              </Button>
            </form>
            <p className={styles.footer}>
              Remember your password? <Link href="/login">Sign In</Link>
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
