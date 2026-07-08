import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome";
import { EventCreatedEmail } from "@/emails/event-created";
import { TicketPurchaseEmail } from "@/emails/ticket-purchase";
import { PasswordChangedEmail } from "@/emails/password-changed";

const resend = new Resend(process.env.RESEND_API_KEY || "");

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@resend.dev";
const FROM_NAME = process.env.FROM_NAME || "PulsePass";
const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;

async function send(params: { to: string; subject: string; react: React.ReactElement }) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Email not sent: RESEND_API_KEY not configured");
    return;
  }
  try {
    const result = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      react: params.react,
    });
    if (result.error) {
      console.error("Email send error:", JSON.stringify(result.error));
    } else {
      console.log(`Email sent to ${params.to}: ${params.subject}`);
    }
  } catch (e) {
    console.error("Email send exception:", e);
  }
}

export async function sendWelcomeEmail(to: string, name: string, appUrl?: string) {
  await send({ to, subject: "Welcome to PulsePass!", react: <WelcomeEmail name={name} appUrl={appUrl} /> });
}

export async function sendEventCreatedEmail(to: string, name: string, eventTitle: string, eventDate: string, eventUrl: string) {
  await send({ to, subject: `Event Created: ${eventTitle}`, react: <EventCreatedEmail name={name} eventTitle={eventTitle} eventDate={eventDate} eventUrl={eventUrl} /> });
}

interface TicketInfo {
  qrCodeUrl: string;
  ticketTypeName: string;
}

export async function sendTicketPurchaseEmail(to: string, name: string, eventTitle: string, eventDate: string, eventTime: string, eventVenue: string, orderId: string, ticketCount: number, totalAmount: string, tickets: TicketInfo[] = [], appUrl?: string) {
  await send({ to, subject: `Tickets Confirmed for ${eventTitle}`, react: <TicketPurchaseEmail name={name} eventTitle={eventTitle} eventDate={eventDate} eventTime={eventTime} eventVenue={eventVenue} orderId={orderId} ticketCount={ticketCount} totalAmount={totalAmount} tickets={tickets} appUrl={appUrl} /> });
}

export async function sendPasswordChangedEmail(to: string, name: string) {
  await send({ to, subject: "Your Password Has Been Changed", react: <PasswordChangedEmail name={name} /> });
}
