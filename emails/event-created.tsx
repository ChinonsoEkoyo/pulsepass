interface EventCreatedEmailProps {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventUrl: string;
}

export function EventCreatedEmail({ name, eventTitle, eventDate, eventUrl }: EventCreatedEmailProps) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Event Created Successfully</h1>
      <p style={{ fontSize: 16, color: "#444", marginBottom: 16 }}>
        Hi {name}, your event <strong>{eventTitle}</strong> has been created and published!
      </p>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
        Event date: {eventDate}
      </p>
      <a
        href={eventUrl}
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
        View Event
      </a>
    </div>
  );
}
