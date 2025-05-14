from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
app = FastAPI()

origins = [
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

DATABASE_URL = "mysql://root@localhost/todo"
engine = create_engine(DATABASE_URL)

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"
    Id = Column(Integer, primary_key=True, index=True)
    Title = Column(String, index=True)
    description = Column(String)
    status = Column(String)
    
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False,  autoflush=False,bind=engine)

class ModelInput(BaseModel):
    Id: int
    Title: str
    description: str
    status:str
    
@app.get('/')
def index():
    db = SessionLocal()
    tasks = db.query(Task).all()
    db.close()

    return tasks

@app.post('/add')
def add_task(task_input: ModelInput):
    try:
        db = SessionLocal()
        new_task = Task(Title=task_input.Title, description=task_input.description,)
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        db.close()
        return new_task
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding task: {str(e)}")