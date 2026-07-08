"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  function validateField(name: string, value: string): string {
    if (!value.trim()) {
      return name === "email" ? "Email cannot be empty" : "Password cannot be empty";
    }
    return "";
  }

  function handleBlur(name: string, value: string) {
    setTouched((p) => ({ ...p, [name]: true }));
    const err = validateField(name, value);
    setFieldErrors((p) => ({ ...p, [name]: err }));
  }

  function handleChange(name: string, value: string) {
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      if (!err && name === "email" && value.includes("@")) {
        setFieldErrors((p) => ({ ...p, [name]: "" }));
      } else {
        setFieldErrors((p) => ({ ...p, [name]: err }));
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const allTouched = { email: true, password: true };
    setTouched(allTouched);

    const errors: Record<string, string> = {};
    if (!form.email.trim()) errors.email = "Email cannot be empty";
    if (!form.password.trim()) errors.password = "Password cannot be empty";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

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

      router.push(searchParams.get("redirect") || "/dashboard");
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
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>Continue with the email address used to create your account</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            ref={emailRef}
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={(e) => handleBlur("email", e.target.value)}
            error={fieldErrors.email}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={(e) => handleBlur("password", e.target.value)}
            error={fieldErrors.password}
            required
            placeholder="Enter your password"
            labelAction={
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot Password?
              </Link>
            }
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
