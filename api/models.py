from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime, func
from database import Base
from datetime import datetime, timedelta


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    username = Column(String(length=100), unique=True, index=True)
    password = Column(String(length=100))
  


class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    document_name = Column(String(length=250) , unique=True,index=True)
    uploaded_at = Column(DateTime, default=datetime.now)
