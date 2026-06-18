import { HTMLAttributes, forwardRef } from "react";
import styles from "./Card.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "outlined" | "filled";
  padding?: "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "elevated", padding = "md", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${styles[variant]} ${styles[`pad-${padding}`]} ${className ?? ""}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
