import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { fullName, email, message } = body;

  if (!fullName || !email || !message) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.CONTACT_RECEIVER!,
      subject: `New message from ${fullName}`,
      replyTo: email, // ✅ camelCase property name
      html: `
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Resend error:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
  }
}
