import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#5B5FFF", textDecoration: "none", marginBottom: "2rem" }}>
        ← Back to Home
      </Link>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#242565", marginBottom: "1rem" }}>Privacy Policy</h1>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "2rem" }}>Last updated: June 2026</p>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>1. Introduction</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>PulsePass (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data when you use our platform, in compliance with the Nigeria Data Protection Act (NDPA) 2023.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>2. Information We Collect</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>We collect personal data you provide directly, including your name, email address, phone number, and payment information. We also collect event-related data such as event details, attendee lists, and ticket purchase history.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>3. How We Use Your Data</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>We use your data to provide and improve our ticketing services, process transactions, send event updates, communicate with you about your account, and comply with legal obligations under Nigerian law.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>4. Legal Basis for Processing</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>We process your personal data based on your consent, the performance of a contract (ticket purchase), legal obligations under the NDPA 2023, and our legitimate interests in operating the platform.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>5. Data Subject Rights</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>Under the NDPA 2023, you have the right to access, correct, delete, and port your personal data. You may also object to or restrict processing. To exercise these rights, contact us at support@pulsepass.com.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>6. Data Security</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>We implement appropriate technical and organisational measures to protect your personal data, including encryption, access controls, and regular security assessments, as required by the NDPA 2023.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>7. Data Breach Notification</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>In the event of a data breach likely to affect your rights and freedoms, we will notify the Nigeria Data Protection Commission (NDPC) within 72 hours and inform affected users as required by law.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>8. Contact</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>For privacy-related inquiries, contact our Data Protection Officer at dpo@pulsepass.com or write to us at Lagos, Nigeria.</p>
      </section>
    </div>
  );
}
