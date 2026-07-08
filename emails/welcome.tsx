interface WelcomeEmailProps {
  name: string;
  appUrl?: string;
}

export function WelcomeEmail({ name, appUrl }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", maxWidth: 480, margin: "0 auto", padding: 0, backgroundColor: "#f4f4f6" }}>
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", padding: "32px 24px", textAlign: "center", borderRadius: "12px 12px 0 0" }}>
        <h1 style={{ color: "#fff", fontSize: 22, margin: 0, fontWeight: 700 }}>Welcome to PulsePass!</h1>
      </div>
      <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "0 0 12px 12px" }}>
        <p style={{ fontSize: 16, color: "#374151", margin: "0 0 16px", lineHeight: 1.6 }}>
          Hi {name}, welcome to PulsePass! We&apos;re excited to have you onboard.
        </p>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px", lineHeight: 1.6 }}>
          You can now browse events, purchase tickets, and manage your event experience all in one place.
        </p>
        <div style={{ textAlign: "center" }}>
          <a
            href={`${appUrl || "http://localhost:3000"}/events`}
            style={{
              display: "inline-block",
              padding: "14px 32px",
              backgroundColor: "#7c3aed",
              color: "#fff",
              borderRadius: 50,
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Browse Events
          </a>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "24px", fontSize: 12, color: "#9ca3af" }}>
        <p style={{ margin: 0 }}>PulsePass — Seamless event ticketing</p>
      </div>
    </div>
  );
}
