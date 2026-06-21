import Link from "next/link";

export default function TermsPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#5B5FFF", textDecoration: "none", marginBottom: "2rem" }}>
        ← Back to Home
      </Link>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#242565", marginBottom: "1rem" }}>Terms & Conditions</h1>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "2rem" }}>Last updated: June 2026</p>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>1. Acceptance of Terms</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>By accessing or using PulsePass, you agree to be bound by these Terms & Conditions. If you do not agree, do not use the platform. These terms are governed by the laws of the Federal Republic of Nigeria.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>2. User Accounts</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>You must register for an account to create events or purchase tickets. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>3. Event Creation & Ticketing</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>Event creators are responsible for the accuracy of event information and compliance with applicable laws. PulsePass acts as an intermediary platform and is not liable for the quality or delivery of events listed on the platform.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>4. Payments & Refunds</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>Payments are processed securely through Flutterwave. Refund policies are set by event creators. PulsePass will facilitate refunds in accordance with the event creator&apos;s policy and applicable Nigerian consumer protection laws under the Federal Competition and Consumer Protection Act (FCCPA).</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>5. Consumer Rights</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>Your use of PulsePass is subject to the Federal Competition and Consumer Protection Act (FCCPA). We are committed to fair treatment of consumers and will address complaints through our redress mechanism.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>6. Prohibited Conduct</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>Users must not use the platform for illegal activities, fraud, or to post prohibited content as defined by the Cybercrimes (Prohibition, Prevention) Act 2015 and NITDA Code of Practice for Interactive Computer Service Platforms.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>7. Limitation of Liability</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>PulsePass shall not be liable for indirect, incidental, or consequential damages arising from your use of the platform. Our total liability is limited to the amount paid by you for ticket purchases through the platform.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>8. Dispute Resolution</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>Any disputes arising from these terms shall be resolved through amicable negotiation. If unresolved, disputes shall be submitted to the courts of Nigeria. This clause is governed by Nigerian law.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>9. Contact</h2>
        <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>For questions about these terms, contact us at support@pulsepass.com.</p>
      </section>
    </div>
  );
}
