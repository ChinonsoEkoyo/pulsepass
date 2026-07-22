import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#5B5FFF", textDecoration: "none", marginBottom: "2rem" }}>
        ← Back to Home
      </Link>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#242565", marginBottom: "1rem" }}>About PulsePass</h1>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333", marginBottom: "1rem" }}>
        PulsePass is a self-service ticketing platform for live experiences across Africa. We empower event creators to build, manage, and monetize events with seamless ticketing, secure payments via Flutterwave, and QR-based check-in.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333", marginBottom: "1rem" }}>
        Our mission is to make event infrastructure accessible to everyone — from small community gatherings to large-scale concerts and conferences.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
        PulsePass is built for the African market, with local payment integrations, real-time analytics, and tools designed for the unique needs of event organizers across the continent.
      </p>
      <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#242565", marginBottom: "1rem" }}>Contact Us</h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333", marginBottom: "1rem" }}>
        Have a question or need help? We&apos;d love to hear from you.
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333", marginBottom: "0.5rem" }}><strong>Email:</strong> support@pulsepass.com</p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333", marginBottom: "0.5rem" }}><strong>Phone:</strong> +234 800 PULSEPASS</p>
      <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}><strong>Address:</strong> Lagos, Nigeria</p>
    </div>
  );
}
