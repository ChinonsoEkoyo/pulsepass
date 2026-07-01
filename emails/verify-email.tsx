interface VerifyEmailProps {
  name: string;
  verificationUrl: string;
}

export function VerifyEmail({ name, verificationUrl }: VerifyEmailProps) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Verify your email</h1>
      <p style={{ fontSize: 16, color: "#444", marginBottom: 24 }}>
        Hi {name}, thanks for creating a PulsePass account. Click the button below to verify your email address.
      </p>
      <a
        href={verificationUrl}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#7c3aed",
          color: "#fff",
          borderRadius: 8,
          textDecoration: "none",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        Verify Email
      </a>
      <p style={{ fontSize: 14, color: "#888", marginTop: 24 }}>
        If you didn&apos;t create this account, you can safely ignore this email.
      </p>
    </div>
  );
}
