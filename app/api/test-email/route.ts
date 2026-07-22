import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.FROM_NAME || "PulsePass";

  if (!key) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set on Vercel" });
  }

  try {
    const resend = new Resend(key);
    const result = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: "delivered@resend.dev",
      subject: "PulsePass Email Test",
      text: "If you receive this, emails are working.",
    });

    if (result.error) {
      return NextResponse.json({ error: result.error });
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message });
  }
}
