import Link from "next/link";

export default function ContactPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#5B5FFF", textDecoration: "none", marginBottom: "2rem" }}>
        ← Back to Home
      </Link>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#242565", marginBottom: "1rem" }}>Contact Us</h1>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333", marginBottom: "1rem" }}>
        Have a question or need help? We&apos;d love to hear from you.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333", marginBottom: "0.5rem" }}><strong>Email:</strong> support@pulsepass.com</p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333", marginBottom: "0.5rem" }}><strong>Phone:</strong> +234 800 PULSEPASS</p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}><strong>Address:</strong> Lagos, Nigeria</p>
    </div>
  );
}
