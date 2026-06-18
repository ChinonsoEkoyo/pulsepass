"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${className ?? ""}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <span className={styles.spinner} aria-hidden /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
