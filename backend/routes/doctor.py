from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from utils.dependencies import get_current_doctor
from schemas.doctor import ClinicalDataInput, PredictionResponse, ReportResponse
from services.doctor_service import (
    handle_image_upload, 
    process_prediction, 
    fetch_doctor_patients,
    fetch_report,
    create_pdf_report,
    fetch_screening_stats
)

router = APIRouter(prefix="/doctor", tags=["Doctor Dashboard"])

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_doctor)):
    file_path = await handle_image_upload(file)
    return {
        "status": "success",
        "data": {"image_url": file_path},
        "message": "Image uploaded successfully"
    }

@router.post("/predict")
async def predict(data: ClinicalDataInput, current_user: dict = Depends(get_current_doctor)):
    report = await process_prediction(
        data.patient_id,
        data.image_url,
        data.model_dump(),
        doctor_verdict=data.doctor_verdict
    )
    return {
        "status": "success",
        "data": report,
        "message": "Prediction generated successfully"
    }

@router.get("/patients")
async def get_patients(current_user: dict = Depends(get_current_doctor)):
    doctor_id = str(current_user.get("_id", current_user.get("id", "")))
    patients = await fetch_doctor_patients(doctor_id=doctor_id)
    return {
        "status": "success",
        "data": patients,
        "message": "Patients fetched successfully"
    }

@router.get("/report/{id}")
async def get_report(id: str, current_user: dict = Depends(get_current_doctor)):
    report = await fetch_report(id)
    return {
        "status": "success",
        "data": report,
        "message": "Report fetched successfully"
    }

@router.post("/generate-report/{patient_id}")
async def generate_report(patient_id: str, current_user: dict = Depends(get_current_doctor)):
    """Generate a real PDF report and stream it as a download."""
    import os
    pdf_path = await create_pdf_report(patient_id)
    filename  = os.path.basename(pdf_path)
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

@router.get("/screening-stats")
async def get_screening_stats(current_user: dict = Depends(get_current_doctor)):
    stats = await fetch_screening_stats()
    return {
        "status": "success",
        "data": stats,
        "message": "Screening stats fetched successfully"
    }
