interface PasswordChangedEmailProps {
  name: string;
}

export function PasswordChangedEmail({ name }: PasswordChangedEmailProps) {
  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", maxWidth: 480, margin: "0 auto", padding: 0, backgroundColor: "#f4f4f6" }}>
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", padding: "32px 24px", textAlign: "center", borderRadius: "12px 12px 0 0" }}>
        <h1 style={{ color: "#fff", fontSize: 22, margin: 0, fontWeight: 700 }}>Password Changed</h1>
      </div>
      <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "0 0 12px 12px" }}>
        <p style={{ fontSize: 16, color: "#374151", margin: "0 0 16px", lineHeight: 1.6 }}>
          Hi {name}, your PulsePass password has been changed successfully.
        </p>
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: "#b91c1c", margin: 0, lineHeight: 1.5 }}>
            If you did not make this change, please contact support immediately.
          </p>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "24px", fontSize: 12, color: "#9ca3af" }}>
        <p style={{ margin: 0 }}>PulsePass — Seamless event ticketing</p>
      </div>
    </div>
  );
}
