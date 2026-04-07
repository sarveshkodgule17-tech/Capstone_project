import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

def generate_pdf(patient_id: str, report_data: dict) -> str:
    pdf_filename = f"report_{patient_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)
    
    c = canvas.Canvas(pdf_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, 750, "Myopia Screening Report")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, 700, f"Patient ID: {patient_id}")
    c.drawString(50, 680, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    c.drawString(50, 640, "Clinical Prediction:")
    c.drawString(70, 620, f"- Prediction: {report_data.get('prediction', 'N/A')}")
    c.drawString(70, 600, f"- Severity: {report_data.get('severity', 'N/A')}")
    c.drawString(70, 580, f"- Confidence: {report_data.get('confidence', 0.0)}")
    
    c.drawString(50, 540, "Notes:")
    c.drawString(70, 520, "This is an AI-assisted decision support report.")
    c.drawString(70, 500, "Please verify clinical findings manually.")
    
    c.save()
    
    return pdf_filename
