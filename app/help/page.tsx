import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#5B5FFF", textDecoration: "none", marginBottom: "2rem" }}>
        ← Back to Home
      </Link>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#242565", marginBottom: "1rem" }}>Help Center</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>Creating an Event</h2>
          <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>To create an event, sign up for a PulsePass account, click &quot;Create Event&quot;, fill in your event details (title, date, venue, description), set up ticket types and pricing, then publish. Your event page will be live immediately.</p>
        </div>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>Ticket Purchases</h2>
          <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>Attendees can browse events, select ticket types, and pay securely via Flutterwave. Tickets are delivered instantly via email and are available in their PulsePass account.</p>
        </div>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>QR Check-In</h2>
          <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>Use the PulsePass scanner app to validate tickets at your event. Simply scan the QR code from the attendee&apos;s ticket and get instant confirmation.</p>
        </div>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#242565", marginBottom: "0.5rem" }}>Payments & Payouts</h2>
          <p style={{ fontSize: "14px", color: "#333", lineHeight: "1.6" }}>Payments are processed through Flutterwave. Payouts are sent to your registered bank account within 3-5 business days after the event. Track your earnings in real-time from the dashboard.</p>
        </div>
      </div>
    </div>
  );
}
