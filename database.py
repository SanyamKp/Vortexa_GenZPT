# database.py
from sqlalchemy import create_engine, Column, String, Float, DateTime
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import datetime

DATABASE_URL = "sqlite:///./reports_mvp.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Report(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, index=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    disease = Column(String, index=True)
    confidence = Column(Float)
    risk_level = Column(String, nullable=True)
    image_path = Column(String)
    heatmap_path = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

def create_db_and_tables():
    Base.metadata.create_all(bind=engine)