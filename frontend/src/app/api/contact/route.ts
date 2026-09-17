import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, category, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY || "";
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "accf40075@gmail.com";
    const emailUser = process.env.EMAIL_USER || "";
    const emailPass = process.env.EMAIL_PASS || "";

    const submittedAt = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    let adminNotificationSent = false;
    let visitorConfirmationSent = false;
    let adminErrorDetails: string | null = null;
    let visitorErrorDetails: string | null = null;

    // 1. Send detailed email to owner/admin using Resend
    try {
      const resend = new Resend(resendApiKey);

      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 24px; }
            .card { max-width: 600px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-sizing: border-box; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background-color: #0d9488; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
            h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; }
            .field-group { margin-bottom: 18px; border-bottom: 1px solid #27272a; padding-bottom: 12px; }
            .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #a1a1aa; letter-spacing: 0.05em; margin-bottom: 4px; }
            .value { font-size: 15px; color: #ffffff; font-weight: 500; }
            .message-box { background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; color: #e4e4e7; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
            .btn { display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 13px; margin-top: 24px; }
            .footer { margin-top: 32px; font-size: 12px; color: #71717a; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">New Direct Inquiry</span>
            <h1>New Message from ${escapeHtml(name)}</h1>
            
            <div class="field-group">
              <div class="label">Sender Name</div>
              <div class="value">${escapeHtml(name)}</div>
            </div>

            <div class="field-group">
              <div class="label">Sender Email</div>
              <div class="value"><a href="mailto:${escapeHtml(email)}" style="color: #2dd4bf; text-decoration: none;">${escapeHtml(email)}</a></div>
            </div>

            <div class="field-group">
              <div class="label">Category</div>
              <div class="value" style="display: inline-block; background: #27272a; padding: 4px 10px; border-radius: 6px; font-size: 13px;">${escapeHtml(category || "General Support")}</div>
            </div>

            <div class="field-group">
              <div class="label">Timestamp</div>
              <div class="value" style="font-size: 13px; color: #a1a1aa;">${submittedAt} IST</div>
            </div>

            <div style="margin-top: 20px;">
              <div class="label">Message Details</div>
              <div class="message-box">${escapeHtml(message)}</div>
            </div>

            <div style="text-align: center;">
              <a class="btn" href="mailto:${encodeURIComponent(email)}?subject=Re:%20${encodeURIComponent(category || "Inquiry")}%20-%20PustakEdits">
                Reply Directly to ${escapeHtml(name)}
              </a>
            </div>

            <div class="footer">
              This is an automated notification from the PustakEdits Direct Message contact form.
            </div>
          </div>
        </body>
        </html>
      `;

      const { error } = await resend.emails.send({
        from: "PustakEdits Notifications <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `📬 [${category || "Inquiry"}] New message from ${name}`,
        html: adminEmailHtml,
        replyTo: email,
      });

      if (error) {
        console.error("Resend API notification error:", error);
        adminErrorDetails = error.message;
      } else {
        adminNotificationSent = true;
      }
    } catch (err: unknown) {
      console.error("Resend execution error:", err);
      adminErrorDetails = err instanceof Error ? err.message : String(err);
    }

    // 2. Send "Thanks for reaching out" confirmation email to visitor
    try {
      const visitorHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 24px; }
            .card { max-width: 580px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-sizing: border-box; }
            .header-logo { font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 24px; }
            .header-logo span { color: #a1a1aa; font-weight: 400; }
            h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin: 0 0 14px 0; }
            p { font-size: 14px; color: #d4d4d8; line-height: 1.6; margin: 0 0 14px 0; }
            .summary-box { background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 18px; margin: 20px 0; font-size: 13px; }
            .summary-title { font-weight: 700; color: #ffffff; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            .summary-item { margin-bottom: 6px; color: #a1a1aa; }
            .summary-item strong { color: #e4e4e7; }
            .message-quote { background-color: #18181b; border-left: 3px solid #0d9488; padding: 10px 14px; border-radius: 0 8px 8px 0; color: #e4e4e7; font-style: italic; margin-top: 8px; font-size: 13px; }
            .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #27272a; font-size: 12px; color: #71717a; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header-logo">Pustak<span>Edits</span></div>
            <h1>Thanks for reaching out, ${escapeHtml(name)}!</h1>
            <p>
              We've received your message regarding <strong>${escapeHtml(category || "General Support")}</strong>.
            </p>
            <p>
              Our team usually reviews all inquiries within 24 hours. If your request concerns a specific document or technical issue, we are already looking into it and will get back to you shortly.
            </p>

            <div class="summary-box">
              <div class="summary-title">Summary of your message</div>
              <div class="summary-item"><strong>Category:</strong> ${escapeHtml(category || "General Support")}</div>
              <div class="summary-item"><strong>Date:</strong> ${submittedAt}</div>
              <div class="message-quote">&ldquo;${escapeHtml(message)}&rdquo;</div>
            </div>

            <p style="font-size: 13px; color: #a1a1aa;">
              If you have any further context or attachments to add, simply reply directly to this email.
            </p>

            <div class="footer">
              &copy; ${new Date().getFullYear()} PustakEdits. Browser-based direct PDF vector editor.
            </div>
          </div>
        </body>
        </html>
      `;

      // Attempt sending via Nodemailer / Gmail SMTP
      const cleanPass = emailPass.replace(/\s+/g, "");
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: emailUser,
          pass: cleanPass,
        },
      });

      await transporter.sendMail({
        from: `"PustakEdits Support" <${emailUser}>`,
        to: email,
        replyTo: adminEmail,
        subject: `Thank you for reaching out to PustakEdits`,
        html: visitorHtml,
        text: `Hi ${name},\n\nThank you for reaching out to PustakEdits regarding ${category}!\n\nWe have received your message:\n"${message}"\n\nOur team will review your inquiry and get back to you shortly (usually within 24 hours).\n\nBest regards,\nPustakEdits Team`,
      });

      visitorConfirmationSent = true;
    } catch (err: unknown) {
      console.warn("Gmail SMTP visitor auto-reply notice:", err);
      visitorErrorDetails = err instanceof Error ? err.message : String(err);

      // Fallback: If Gmail SMTP password needs user refresh in Google Account,
      // also attempt Resend if possible
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "PustakEdits Support <onboarding@resend.dev>",
          to: [email],
          subject: `Thank you for reaching out to PustakEdits`,
          text: `Hi ${name},\n\nThank you for reaching out to PustakEdits! We have received your message regarding ${category} and our team will get back to you shortly.\n\nBest regards,\nPustakEdits Team`,
        });
        visitorConfirmationSent = true;
      } catch {
        // If Resend in test mode restricts outside recipients, we safely record the state
      }
    }

    return NextResponse.json({
      success: true,
      message: "Message received! We will reply shortly via email.",
      adminNotified: adminNotificationSent,
      visitorNotified: visitorConfirmationSent,
      details: {
        adminError: adminErrorDetails,
        visitorError: visitorErrorDetails,
      },
    });
  } catch (error: unknown) {
    console.error("Direct Message handling error:", error);
    return NextResponse.json(
      { error: "Internal server error processing contact message." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
