interface TicketInfo {
  qrCodeUrl: string;
  ticketTypeName: string;
}

interface TicketPurchaseEmailProps {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  orderId: string;
  ticketCount: number;
  totalAmount: string;
  tickets: TicketInfo[];
  appUrl?: string;
}

export function TicketPurchaseEmail({ name, eventTitle, eventDate, eventTime, eventVenue, orderId, ticketCount, totalAmount, tickets, appUrl }: TicketPurchaseEmailProps) {
  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", maxWidth: 520, margin: "0 auto", padding: 0, backgroundColor: "#f4f4f6" }}>
      {/* Banner */}
      <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", padding: "32px 24px", textAlign: "center", borderRadius: "12px 12px 0 0" }}>
        <h1 style={{ color: "#fff", fontSize: 22, margin: 0, fontWeight: 700, letterSpacing: "-0.3px" }}>Tickets Confirmed!</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "8px 0 0", lineHeight: 1.5 }}>
          Hi {name}, your tickets are ready.
        </p>
      </div>

      <div style={{ backgroundColor: "#fff", padding: "0 24px", borderRadius: "0 0 12px 12px" }}>
        {/* Event Card */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, marginTop: 24, overflow: "hidden" }}>
          <div style={{ padding: 20 }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Event</p>
            <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 700, color: "#111" }}>{eventTitle}</h2>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 16, lineHeight: "20px" }}>📅</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, color: "#374151", fontWeight: 500 }}>{eventDate}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>{eventTime}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 16, lineHeight: "20px" }}>📍</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, color: "#374151", fontWeight: 500 }}>{eventVenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, marginTop: 16, padding: 20 }}>
          <p style={{ margin: "0 0 12px", fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Order Summary</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>Order ID</span>
            <span style={{ fontSize: 14, color: "#111", fontWeight: 600, fontFamily: "monospace" }}>{orderId.slice(0, 6).toUpperCase()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>Tickets</span>
            <span style={{ fontSize: 14, color: "#111", fontWeight: 600 }}>{ticketCount}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: 14, color: "#6b7280" }}>Total</span>
            <span style={{ fontSize: 16, color: "#111", fontWeight: 700 }}>{totalAmount}</span>
          </div>
        </div>

        {/* QR Codes */}
        {tickets.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Your Tickets</p>
            {tickets.map((t, i) => (
              <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 12, textAlign: "center" }}>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6b7280" }}>{t.ticketTypeName}</p>
                <img
                  src={t.qrCodeUrl}
                  alt={`Ticket ${i + 1} QR code`}
                  width={140}
                  height={140}
                  style={{ borderRadius: 8, display: "block", margin: "0 auto" }}
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <a
            href={`${appUrl || "http://localhost:3000"}/dashboard/tickets`}
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
            View My Tickets
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px", fontSize: 12, color: "#9ca3af" }}>
        <p style={{ margin: 0 }}>PulsePass — Seamless event ticketing</p>
      </div>
    </div>
  );
}
