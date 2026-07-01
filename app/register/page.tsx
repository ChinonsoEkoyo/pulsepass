"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CircleUser, BriefcaseBusiness, ArrowRight, ArrowLeft, Check, Mail } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import styles from "./page.module.css";

type AccountType = "personal" | "organization" | null;
type Step = 1 | 2 | 3;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const nameLabel = accountType === "organization" ? "Organization name" : "Full name";

  function handleSelect(type: AccountType) {
    setAccountType(type);
  }

  function nextStep() {
    if (step === 1 && !accountType) return;
    setStep((s) => (s + 1) as Step);
  }

  function prevStep() {
    setStep((s) => (s - 1) as Step);
  }

  function validateField(name: string, value: string): string {
    if (!value.trim()) {
      if (name === "name") return `${nameLabel} cannot be empty`;
      if (name === "email") return "Email cannot be empty";
      return "Password cannot be empty";
    }
    if (name === "name" && value.trim().length < 2) {
      return `${nameLabel} must be at least 2 characters`;
    }
    if (name === "email" && !isValidEmail(value)) {
      return "Enter a valid Email Address";
    }
    if (name === "password" && value.length < 8) {
      return "Password must be at least 8 characters";
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
      setFieldErrors((p) => ({ ...p, [name]: err }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const allTouched = { name: true, email: true, password: true };
    setTouched(allTouched);

    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = `${nameLabel} cannot be empty`;
    } else if (form.name.trim().length < 2) {
      errors.name = `${nameLabel} must be at least 2 characters`;
    }
    if (!form.email.trim()) {
      errors.email = "Email cannot be empty";
    } else if (!isValidEmail(form.email)) {
      errors.email = "Enter a valid Email Address";
    }
    if (!form.password.trim()) {
      errors.password = "Password cannot be empty";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, accountType }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Registration failed");
        setStep(2);
        return;
      }

      setStep(3);
    } catch {
      setError("Something went wrong");
      setStep(2);
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
      <div className={styles.steps}>
        <div className={`${styles.stepDot} ${step >= 1 ? styles.stepActive : ""}`}>
          <span>1</span>
        </div>
        <div className={`${styles.stepLine} ${step >= 2 ? styles.stepActive : ""}`} />
        <div className={`${styles.stepDot} ${step >= 2 ? styles.stepActive : ""}`}>
          <span>{step > 2 ? <Check size={14} /> : "2"}</span>
        </div>
        <div className={`${styles.stepLine} ${step >= 3 ? styles.stepActive : ""}`} />
        <div className={`${styles.stepDot} ${step >= 3 ? styles.stepActive : ""}`}>
          <span>{step > 3 ? <Check size={14} /> : "3"}</span>
        </div>
      </div>

      <p className={styles.stepLabel}>
        Step {step} of 3 —{" "}
        {step === 1 ? "Choose account type" : step === 2 ? "Your details" : "Almost done"}
      </p>

      <Card variant="elevated" padding="lg" className={styles.card}>
        {step === 1 && (
          <>
            <h1 className={styles.title}>Create your PulsePass account</h1>
            <p className={styles.subtitle}>Select the account type that best fits you</p>

            <div className={styles.cardGrid}>
              <button
                type="button"
                className={`${styles.typeCard} ${accountType === "personal" ? styles.typeCardSelected : ""}`}
                onClick={() => handleSelect("personal")}
              >
                <div className={styles.typeIcon}>
                  <CircleUser size={28} />
                </div>
                <h3 className={styles.typeTitle}>Personal Account</h3>
                <p className={styles.typeDesc}>
                  For individuals. Get paid to your personal bank account.
                </p>
              </button>

              <button
                type="button"
                className={`${styles.typeCard} ${accountType === "organization" ? styles.typeCardSelected : ""}`}
                onClick={() => handleSelect("organization")}
              >
                <div className={styles.typeIcon}>
                  <BriefcaseBusiness size={28} />
                </div>
                <h3 className={styles.typeTitle}>Organization Account</h3>
                <p className={styles.typeDesc}>
                  For registered businesses. Get paid to your business account.
                </p>
              </button>
            </div>

            <Button
              size="lg"
              onClick={nextStep}
              disabled={!accountType}
              className={styles.nextButton}
            >
              Continue
              <ArrowRight size={18} />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.backRow}>
              <button type="button" className={styles.backButton} onClick={prevStep}>
                <ArrowLeft size={18} />
                Back
              </button>
              <span className={styles.accountBadge}>
                {accountType === "personal" ? "Personal" : "Organization"}
              </span>
            </div>
            <h1 className={styles.title}>Your details</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label={nameLabel}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={(e) => handleBlur("name", e.target.value)}
                error={fieldErrors.name}
                required
                placeholder={accountType === "organization" ? "Your organization name" : "Your full name"}
              />
              <Input
                label="Email address"
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
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                error={fieldErrors.password}
                required
                placeholder="At least 8 characters"
              />
              {error ? <p className={styles.error}>{error}</p> : null}
              <Button type="submit" loading={loading} size="lg">
                Create Account
              </Button>
            </form>

            <p className={styles.footer}>
              Already have an account? <Link href="/login">Sign In</Link>
            </p>
          </>
        )}

        {step === 3 && (
          <div className={styles.done}>
            <div className={styles.doneIcon}>
              <Mail size={32} />
            </div>
            <h1 className={styles.title}>Check your email</h1>
            <p className={styles.subtitle}>
              A verification has been sent to <strong>{form.email}</strong>
            </p>
            <Button
              size="lg"
              onClick={() => window.location.href = "/login"}
              className={styles.nextButton}
            >
              Go to Sign In
              <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
