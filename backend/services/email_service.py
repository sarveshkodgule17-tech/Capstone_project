"""
Email Notification Service
Sends email alerts to doctors when a High-risk patient is submitted.
Uses Python's built-in smtplib — works with Gmail SMTP.
Configure SMTP_EMAIL and SMTP_PASSWORD in your .env file.
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST     = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", 587))
SMTP_EMAIL    = os.getenv("SMTP_EMAIL", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def send_high_risk_alert(doctor_email: str, doctor_name: str, patient_name: str,
                         patient_age: int, risk_probability: float) -> bool:
    """
    Sends an email alert to a doctor when a patient with High myopia risk submits.
    Returns True on success, False if email is not configured or fails.
    """
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("[Email] SMTP not configured. Skipping alert.")
        return False

    try:
        pct = round(risk_probability * 100, 1)
        subject = f"🔴 High Risk Alert: Patient {patient_name} — {pct}% Myopia Probability"
        html_body = f"""
        <html><body style="font-family: Arial, sans-serif; color: #334155; max-width: 600px; margin: auto;">
          <div style="background: linear-gradient(135deg,#1E3A8A,#3B82F6); padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color:white; margin:0;">🔴 High Risk Patient Alert</h2>
            <p style="color:#BFDBFE; margin:4px 0 0;">VisionAssist AI Screening System</p>
          </div>
          <div style="background:#F8FAFC; padding:24px; border-radius: 0 0 12px 12px; border:1px solid #E2E8F0;">
            <p>Dear <strong>Dr. {doctor_name}</strong>,</p>
            <p>A patient assigned to you has been flagged as <strong style="color:#DC2626;">HIGH RISK</strong> by the AI screening model.</p>
            <table style="width:100%; border-collapse:collapse; margin:16px 0;">
              <tr style="background:#EFF6FF;">
                <td style="padding:10px; font-weight:bold; border:1px solid #BFDBFE;">Patient Name</td>
                <td style="padding:10px; border:1px solid #BFDBFE;">{patient_name}</td>
              </tr>
              <tr>
                <td style="padding:10px; font-weight:bold; border:1px solid #BFDBFE;">Age</td>
                <td style="padding:10px; border:1px solid #BFDBFE;">{patient_age} years</td>
              </tr>
              <tr style="background:#FEF2F2;">
                <td style="padding:10px; font-weight:bold; border:1px solid #FECACA;">AI Risk Probability</td>
                <td style="padding:10px; border:1px solid #FECACA; color:#DC2626; font-weight:bold;">{pct}%</td>
              </tr>
            </table>
            <p>Please log into the <strong>Doctor Portal</strong> to review this patient's full lifestyle profile and conduct a clinical evaluation.</p>
            <a href="http://localhost:5173/doctor-dashboard" 
               style="display:inline-block; background:#1E3A8A; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold; margin-top:8px;">
              Open Doctor Dashboard →
            </a>
            <p style="margin-top:24px; font-size:12px; color:#94A3B8;">
              This is an automated alert from VisionAssist AI. Please do not reply to this email.
            </p>
          </div>
        </body></html>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"VisionAssist AI <{SMTP_EMAIL}>"
        msg["To"]      = doctor_email
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, doctor_email, msg.as_string())

        print(f"[Email] ✅ High-risk alert sent to {doctor_email}")
        return True

    except Exception as e:
        print(f"[Email] ❌ Failed to send alert: {e}")
        return False
