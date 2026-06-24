from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv(".env.local")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    date = Column(String, nullable=True)  # YYYY-MM-DD


class TodoCreate(BaseModel):
    text: str
    date: Optional[str] = None


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None


class TodoResponse(BaseModel):
    id: int
    text: str
    completed: bool
    date: Optional[str] = None

    model_config = {"from_attributes": True}


Base.metadata.create_all(bind=engine)

# Migration: add date column to existing DBs without it
with engine.connect() as conn:
    inspector = inspect(engine)
    columns = [c["name"] for c in inspector.get_columns("todos")]
    if "date" not in columns:
        conn.execute(text("ALTER TABLE todos ADD COLUMN date TEXT"))
        conn.commit()

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo


@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    filter: Optional[str] = None,
    search: Optional[str] = None,
    date: Optional[str] = None,
    start: Optional[str] = None,
    end: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Todo)
    if filter == "active":
        query = query.filter(Todo.completed == False)
    elif filter == "completed":
        query = query.filter(Todo.completed == True)
    if search:
        query = query.filter(Todo.text.contains(search))
    if date:
        query = query.filter(Todo.date == date)
    elif start and end:
        query = query.filter(Todo.date >= start, Todo.date <= end)
    return query.all()


@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(text=todo.text, date=todo.date)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.text is not None:
        db_todo.text = todo.text
    if todo.completed is not None:
        db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return {"message": "Todo deleted"}
