import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#5B5FFF", textDecoration: "none", marginBottom: "2rem" }}>
        ← Back to Home
      </Link>
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#242565", marginBottom: "1rem" }}>How It Works</h1>
      <ol style={{ fontSize: "16px", lineHeight: "1.8", color: "#333", paddingLeft: "1.5rem" }}>
        <li><strong>Create an Event</strong> — Set up your event page with title, description, date, venue, and ticket types in minutes.</li>
        <li><strong>Sell Tickets</strong> — Accept payments securely via Flutterwave. Set pricing, discounts, and ticket limits.</li>
        <li><strong>Manage Attendees</strong> — Track sales, view attendee lists, and send updates from your dashboard.</li>
        <li><strong>QR Check-In</strong> — Validate tickets at the door using our scanner. Real-time verification prevents fraud.</li>
        <li><strong>Analyze & Grow</strong> — Access real-time analytics on sales, attendance, and revenue to improve future events.</li>
      </ol>
    </div>
  );
}
