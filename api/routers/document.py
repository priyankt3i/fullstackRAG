from fastapi import Depends,HTTPException,APIRouter,status,File, UploadFile
from database import engine,SessionLocal
import models
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional,Annotated
from models import Document
from azure_utils import does_blob_exists,upload_to_azure_storage
from datetime import datetime, timedelta
models.Base.metadata.create_all(bind=engine)
from rag import embed_blob,answer_query

router = APIRouter(
    prefix="/document",
    tags=["Document"],
    responses={401: {"user": "Not authorized"}}
)

class create_document_type(BaseModel):
    document_name: str

class query_type(BaseModel):
    document_name : str
    query : str
    retriever_type : str

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session,Depends(get_db)]

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_new_document(db:db_dependency,file: UploadFile = File(...)):
    if(does_blob_exists(file.filename)):
        return {"filename": file.filename}
    
    await upload_to_azure_storage(file)
    embed_blob(file.filename)
    new_document = Document (
        document_name = file.filename,
        uploaded_at = datetime.now()
    )
    db.add(new_document)
    db.commit()
   
    return {"filename": file.filename}

@router.post("/query", status_code=status.HTTP_200_OK)
async def query(query_request: query_type):
   answer = answer_query(query_request.document_name, query_request.query,query_request.retriever_type)
   return {"answer": answer}