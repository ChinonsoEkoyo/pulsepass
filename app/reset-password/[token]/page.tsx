"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import styles from "./page.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong");
        return;
      }

      setDone(true);
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
        {done ? (
          <>
            <div className={styles.doneIcon}>
              <Check size={32} />
            </div>
            <h1 className={styles.title}>Password reset</h1>
            <p className={styles.subtitle}>
              Your password has been reset successfully.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className={styles.button}
            >
              Sign In
            </Button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Reset password</h1>
            <p className={styles.subtitle}>
              Enter your new password below.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="New password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                required
                placeholder="At least 8 characters"
                rightElement={
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <Button type="submit" loading={loading} size="lg">
                Reset Password
              </Button>
            </form>
            <p className={styles.footer}>
              <Link href="/login">
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
