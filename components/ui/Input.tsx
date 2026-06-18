"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`${styles.wrapper} ${className ?? ""}`}>
        {label ? (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p className={styles.helper}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
