import os
import uuid
import shutil
from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sklearn.cluster import DBSCAN
import numpy as np

# --- Local Imports ---
# These files should be in the same directory as your app_mvp.py
import database as db
import model_inference
import risk_assessment

# --- Pydantic Models for Data Validation ---
# Using Pydantic models is a best practice for data validation and API documentation.
from pydantic import BaseModel
from typing import List, Optional

class ReportResponse(BaseModel):
    id: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    disease: str
    confidence: float
    risk_level: str
    image_url: str
    heatmap_url: str

class ClusterResponse(BaseModel):
    id: str
    lat: float
    lon: float
    cluster_id: int

# --- FastAPI App Initialization ---
app = FastAPI(title="AI Crop Disease Tracker Backend")

# --- CORS Middleware Configuration ---
# CORRECTED: Allow all origins for development. In production, you would restrict
# this to your frontend's actual domain (e.g., ["https://your-app.com"]).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Setup ---
@app.on_event("startup")
def on_startup():
    db.create_db_and_tables()

# Dependency to get the database session
def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

# --- Static File Serving ---
# Create directories if they don't exist
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/heatmaps", exist_ok=True)
# This line correctly serves files from the 'static' directory at the '/static' URL
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Crop Disease Tracker Backend"}

@app.post("/predict", response_model=ReportResponse)
async def predict_image(
    file: UploadFile = File(...), 
    lat: Optional[float] = Form(None), 
    lon: Optional[float] = Form(None), 
    db_session: Session = Depends(get_db)
):
    """
    Receives a crop leaf image, performs disease prediction, generates a heatmap,
    assesses risk, and stores the report in the database.
    """
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    
    # Paths for saving files on the server
    image_save_path = os.path.join("static", "uploads", f"{file_id}{file_extension}")
    heatmap_save_path = os.path.join("static", "heatmaps", f"{file_id}_heatmap.png")

    # CORRECTED: URL paths that the frontend will use to access the images
    image_url = f"/static/uploads/{file_id}{file_extension}"
    heatmap_url = f"/static/heatmaps/{file_id}_heatmap.png"

    # Save the uploaded file
    try:
        with open(image_save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except IOError:
        raise HTTPException(status_code=500, detail="Could not save the uploaded file.")

    try:
        # Perform inference and generate heatmap
        result = model_inference.predict_and_saliency(image_save_path, heatmap_save_path)
        
        # Get weather data and compute risk score
        weather_data = None
        if lat is not None and lon is not None:
            weather_data = risk_assessment.get_weather(lat, lon)
        
        risk_level = risk_assessment.compute_risk_score(result["confidence"], weather_data)

        # Create and save the new report to the database
        new_report = db.Report(
            id=file_id, 
            lat=lat, 
            lon=lon, 
            disease=result["disease"],
            confidence=result["confidence"], 
            risk_level=risk_level,
            image_path=image_url,      # Store the URL path
            heatmap_path=heatmap_url   # Store the URL path
        )
        db_session.add(new_report)
        db_session.commit()
        db_session.refresh(new_report)

        return {
            "id": new_report.id,
            "disease": new_report.disease,
            "confidence": new_report.confidence,
            "risk_level": new_report.risk_level,
            "image_url": new_report.image_path,
            "heatmap_url": new_report.heatmap_path,
            "lat": new_report.lat,
            "lon": new_report.lon
        }
    except Exception as e:
        # If anything goes wrong during processing, raise a server error
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {str(e)}")

@app.get("/reports", response_model=List[ReportResponse])
def get_all_reports(db_session: Session = Depends(get_db)):
    """
    Retrieves all reports from the database.
    """
    reports = db_session.query(db.Report).all()
    # Manually construct the response to match the Pydantic model
    return [
        {
            "id": r.id, "disease": r.disease, "confidence": r.confidence,
            "risk_level": r.risk_level, "image_url": r.image_path, "heatmap_url": r.heatmap_path,
            "lat": r.lat, "lon": r.lon
        } for r in reports
    ]


@app.get("/reports/clusters", response_model=List[ClusterResponse])
def get_report_clusters(db_session: Session = Depends(get_db)):
    """
    Performs clustering on reports with location data.
    """
    reports = db_session.query(db.Report).filter(db.Report.lat != None, db.Report.lon != None).all()
    if len(reports) < 3:
        return [] # Return an empty list if not enough data, frontend can handle this

    coords = np.array([[r.lat, r.lon] for r in reports])
    clustering = DBSCAN(eps=0.1, min_samples=2).fit(coords)

    return [
        {"id": r.id, "lat": r.lat, "lon": r.lon, "cluster_id": int(l)} 
        for r, l in zip(reports, clustering.labels_)
    ]

# To run this file, use the command: uvicorn app_mvp:app --reload