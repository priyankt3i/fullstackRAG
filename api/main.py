from fastapi import FastAPI,Depends,status
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from routers import auth,document
import models
from database import engine
from routers.auth import get_current_user
app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(document.router)


# if __name__ == '__main__':
#     uvicorn.run(app, port=8000, host='127.0.0.1')
