from pydantic import BaseModel
from typing import Optional

class ClinicalDataInput(BaseModel):
    patient_id: str
    axial_length: float
    refractive_error: float
    acd: Optional[float] = None
    lt: Optional[float] = None
    vcd: Optional[float] = None
    age: Optional[int] = None
    visit_year: Optional[int] = None
    reading_hours: Optional[float] = None
    screen_time: Optional[float] = None
    outdoor_activity: Optional[float] = None
    sleep_hours: Optional[float] = None
    parental_myopia: Optional[int] = None
    image_url: str
    doctor_verdict: Optional[str] = None

class PredictionResponse(BaseModel):
    prediction: str
    severity: str
    confidence: float
    predicted_next_spheq: float
    progression_rate: str

class ReportResponse(BaseModel):
    id: str
    patient_id: str
    image_url: Optional[str] = None
    prediction: str
    severity: str
    confidence: float
    predicted_next_spheq: Optional[float] = None
    progression_rate: Optional[str] = None
    pdf_url: Optional[str] = None
    created_at: str
