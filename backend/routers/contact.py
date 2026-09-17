import os
import smtplib
import urllib.request
import json
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import re

router = APIRouter()

class ContactRequest(BaseModel):
    name: str
    email: str
    category: str = "General Support"
    message: str

def escape_html(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#039;")
    )

@router.post("")
@router.post("/")
async def submit_direct_message(payload: ContactRequest):
    if not payload.name.strip() or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name and message cannot be blank."
        )

    resend_api_key = os.getenv("RESEND_API_KEY", "")
    admin_email = os.getenv("ADMIN_NOTIFICATION_EMAIL", "accf40075@gmail.com")
    email_user = os.getenv("EMAIL_USER", "")
    email_pass = os.getenv("EMAIL_PASS", "").replace(" ", "")

    now_str = datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")

    admin_sent = False
    visitor_sent = False
    admin_err = None
    visitor_err = None

    # 1. Send detailed email to owner/admin via Resend
    try:
        admin_html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 28px;">
            <div style="color: #0d9488; font-weight: bold; text-transform: uppercase; font-size: 11px; margin-bottom: 8px;">New Direct Inquiry</div>
            <h2 style="color: #ffffff; margin-top: 0;">Message from {escape_html(payload.name)}</h2>
            <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:{escape_html(payload.email)}" style="color: #2dd4bf;">{escape_html(payload.email)}</a></p>
            <p style="margin: 6px 0;"><strong>Category:</strong> {escape_html(payload.category)}</p>
            <p style="margin: 6px 0;"><strong>Time:</strong> {now_str}</p>
            <div style="margin-top: 16px; background: #09090b; border: 1px solid #27272a; padding: 16px; border-radius: 10px; white-space: pre-wrap; color: #e4e4e7;">
              {escape_html(payload.message)}
            </div>
            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:{urllib.parse.quote(payload.email)}?subject=Re:%20{urllib.parse.quote(payload.category)}%20-%20PustakEdits" 
                 style="background: #ffffff; color: #000000; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
                Reply Directly to {escape_html(payload.name)}
              </a>
            </div>
          </div>
        </body>
        </html>
        """

        headers = {
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json",
            "User-Agent": "resend-python/2.0.0"
        }
        req_data = json.dumps({
            "from": "PustakEdits Notifications <onboarding@resend.dev>",
            "to": [admin_email],
            "subject": f"📬 [{payload.category}] New message from {payload.name}",
            "html": admin_html,
            "reply_to": payload.email
        }).encode("utf-8")

        req = urllib.request.Request("https://api.resend.com/emails", data=req_data, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in (200, 201):
                admin_sent = True
    except Exception as e:
        admin_err = str(e)

    # 2. Send "thanks for reaching out" to visitor via Gmail SMTP
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Thank you for reaching out to PustakEdits"
        msg["From"] = f"PustakEdits Support <{email_user}>"
        msg["To"] = payload.email
        msg["Reply-To"] = admin_email

        visitor_text = f"""Hi {payload.name},\n\nThank you for reaching out to PustakEdits regarding {payload.category}!\n\nWe have received your message:\n"{payload.message}"\n\nOur team will review your inquiry and get back to you shortly (usually within 24 hours).\n\nBest regards,\nThe PustakEdits Team"""

        visitor_html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #09090b; color: #f4f4f5; padding: 24px;">
          <div style="max-width: 580px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 28px;">
            <h2 style="color: #ffffff; margin-top: 0;">Thanks for reaching out, {escape_html(payload.name)}!</h2>
            <p style="color: #d4d4d8; line-height: 1.6;">
              We have received your message regarding <strong>{escape_html(payload.category)}</strong> and our team will get back to you shortly.
            </p>
            <div style="background: #09090b; border: 1px solid #27272a; border-radius: 10px; padding: 16px; margin: 16px 0;">
              <div style="font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-weight: bold; margin-bottom: 6px;">Your Message</div>
              <div style="color: #e4e4e7; font-style: italic;">&ldquo;{escape_html(payload.message)}&rdquo;</div>
            </div>
            <p style="font-size: 12px; color: #71717a;">
              &copy; {datetime.now().year} PustakEdits. All rights reserved.
            </p>
          </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(visitor_text, "plain"))
        msg.attach(MIMEText(visitor_html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
            server.login(email_user, email_pass)
            server.send_message(msg)
        visitor_sent = True
    except Exception as e:
        visitor_err = str(e)
        # Fallback: attempt via Resend if domain allows
        try:
            headers = {
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json",
                "User-Agent": "resend-python/2.0.0"
            }
            req_data = json.dumps({
                "from": "PustakEdits Support <onboarding@resend.dev>",
                "to": [payload.email],
                "subject": "Thank you for reaching out to PustakEdits",
                "text": f"Hi {payload.name},\n\nThank you for reaching out to PustakEdits! We have received your message regarding {payload.category} and will get back to you shortly.\n\nBest regards,\nPustakEdits Team"
            }).encode("utf-8")
            req = urllib.request.Request("https://api.resend.com/emails", data=req_data, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status in (200, 201):
                    visitor_sent = True
        except Exception:
            pass

    return {
        "success": True,
        "message": "Message received! We will reply shortly via email.",
        "adminNotified": admin_sent,
        "visitorNotified": visitor_sent,
        "details": {
            "adminError": admin_err,
            "visitorError": visitor_err
        }
    }
