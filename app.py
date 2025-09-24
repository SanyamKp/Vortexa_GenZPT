# app.py
import os
import uuid
import shutil
from fastapi import FastAPI, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import database as db
import model_inference

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    db.create_db_and_tables()

def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/predict")
async def predict_image(file: UploadFile = File(...), db_session: Session = Depends(get_db)):
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    image_path = os.path.join("static", "uploads", f"{file_id}{file_extension}")

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = model_inference.predict(image_path)
        new_report = db.Report(
            id=file_id,
            disease=result["disease"],
            confidence=result["confidence"],
            image_path=image_path,
        )
        db_session.add(new_report)
        db_session.commit()
        db_session.refresh(new_report)

        return JSONResponse(content={
            "id": new_report.id,
            "disease": new_report.disease,
            "confidence": new_report.confidence,
            "image_url": image_path,
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"An error occurred: {str(e)}"})

@app.get("/reports")
def get_all_reports(db_session: Session = Depends(get_db)):
    return db_session.query(db.Report).all()
