"use client";

import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelAction?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelAction, rightElement, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`${styles.wrapper} ${className ?? ""}`}>
        {label || labelAction ? (
          <div className={styles.labelRow}>
            {label ? (
              <label htmlFor={inputId} className={styles.label}>
                {label}
              </label>
            ) : null}
            {labelAction ? <div className={styles.labelAction}>{labelAction}</div> : null}
          </div>
        ) : null}
        <div className={styles.inputContainer}>
          <input
            ref={ref}
            id={inputId}
            className={`${styles.input} ${rightElement ? styles.inputWithRight : ""} ${error ? styles.inputError : ""}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightElement ? <div className={styles.rightElement}>{rightElement}</div> : null}
        </div>
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
