import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendTicketEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("Email not sent: RESEND_API_KEY not configured");
      return;
    }

    await resend.emails.send({
      from: "PulsePass <noreply@pulsepass.app>",
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  } catch (e) {
    console.error("Email send error:", e);
  }
}
