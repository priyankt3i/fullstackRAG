from database import engine,SessionLocal
import models
from models import User
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional,Annotated
from fastapi import Depends,HTTPException,APIRouter,status
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer, HTTPBearer
from datetime import datetime, timedelta
from jose import jwt, JWTError

SECRET_KEY = "KlgH6AzYDeZeGwD288to79I3vTHT8wp7"
ALGORITHM = "HS256"

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
models.Base.metadata.create_all(bind=engine)
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
    responses={401: {"user": "Not authorized"}}
)


class create_user_type(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type : str

    
class UserCreated(BaseModel):
    message : str


def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

def get_password_hash(password):
    return bcrypt_context.hash(password)

def verify_password(plain_password, hashed_password):
    return bcrypt_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str, db):
    user = db.query(models.User) \
        .filter(models.User.username == username) \
        .first()

    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(username: str, user_id: int, expires_delta: Optional[timedelta] = None):
    encode = {"sub": username, "id": user_id}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    encode.update({"exp": expire})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("id")
        if username is None or username is None:
            raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
       )
        return {"username": username, "id": user_id}
    except JWTError:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
       )
    
@router.post("/create/user", status_code=status.HTTP_201_CREATED)
async def create_new_user(create_user: create_user_type, db: db_dependency):
    new_user = User(
        username = create_user.username,
        password = get_password_hash(create_user.password)
    )
    db.add(new_user)
    db.commit()
    return {"message":"User created"}


@router.post("/token",response_model=Token)
async def login_for_access_token(user_login:create_user_type,db: Session = Depends(get_db)):
    user = authenticate_user(user_login.username,user_login.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not verify user")

    token_expires = timedelta(minutes=360)
    token = create_access_token(user.username,user.id, expires_delta=token_expires)
    return {"access_token": token, "token_type": "bearer"}

user_dependency = Annotated[dict,Depends(get_current_user)]

@router.get('/user',status_code=status.HTTP_200_OK)
async def user(user:user_dependency, db:db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='authentication failed')
    return {"User" : user}

