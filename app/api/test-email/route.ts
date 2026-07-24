import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: Request) {
  const key = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.FROM_NAME || "PulsePass";
  const url = new URL(request.url);
  const toEmail = url.searchParams.get("to") || "delivered@resend.dev";

  if (!key) {
    return NextResponse.json({
      error: "RESEND_API_KEY is not set",
      hint: "Add RESEND_API_KEY to Vercel dashboard → Settings → Environment Variables → Production",
    });
  }

  try {
    const resend = new Resend(key);
    const result = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject: "PulsePass Email Test",
      text: `Test email sent at ${new Date().toISOString()}. If you receive this, emails are working.`,
    });

    if (result.error) {
      return NextResponse.json({
        error: result.error,
        hint: toEmail !== "delivered@resend.dev"
          ? "With Resend free tier + onboarding@resend.dev, you can only send to verified emails. Verify the recipient at resend.com/audiences or use delivered@resend.dev for testing."
          : undefined,
      });
    }

    return NextResponse.json({ success: true, id: result.data?.id, to: toEmail });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message });
  }
}
