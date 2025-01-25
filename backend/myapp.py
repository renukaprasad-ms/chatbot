from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
from langchain_community.utilities import SQLDatabase
from langchain.chains import create_sql_query_chain
from langchain_google_genai import GoogleGenerativeAI
from sqlalchemy import create_engine
from sqlalchemy.exc import ProgrammingError
from fastapi.middleware.cors import CORSMiddleware
import models

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

db_user = "root"
db_password = "123"
db_host = "localhost"
db_port = "3306"
db_name = "chatbot"

engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}")

db = SQLDatabase(engine, sample_rows_in_table_info=3)

llm = GoogleGenerativeAI(model="gemini-pro", google_api_key=os.environ["GOOGLE_API_KEY"])

chain = create_sql_query_chain(llm, db)

class QueryRequest(BaseModel):
    question: str

def execute_query(question: str):
    try:
        response = chain.invoke({"question": question})
        cleaned_query = response.strip('```sql\n').strip('\n```')
        print(cleaned_query)
        result = db.run(cleaned_query)
        print(result)
        return response, result
    except ProgrammingError as e:
        return f"An error occurred: {e}", None
    
def get_db():
    db = Session(bind=engine)
    try:
        yield db
    finally:
        db.close()

@app.post("/execute_query/")
async def execute_query_endpoint(request: QueryRequest):
    question = request.question
    cleaned_query, query_result = execute_query(question)
    
    if cleaned_query and query_result is not None:
        return {
            "generated_sql": cleaned_query,
            "query_result": query_result
        }
    else:
        return {
            "error": "No result returned due to an error."
        }

@app.post("/history", response_model=models.HistorySchema)
def create_history(history: models.CreateHistorySchema, db: Session = Depends(get_db)):
    new_history = models.History(message=history.message, type=history.type)
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history

@app.get("/history", response_model=list[models.HistorySchema])
def get_all_history(db: Session = Depends(get_db)):
    history_items = db.query(models.History).all()
    
    if not history_items:
        raise HTTPException(status_code=404, detail="No history found")
    
    return history_items
