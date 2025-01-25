from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel

Base = declarative_base()

class History(Base):
    __tablename__ = 'history'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False)

    def __repr__(self):
        return f"<History(id={self.id}, message='{self.message}', type='{self.type}')>"

class HistorySchema(BaseModel):
    id: int
    message: str
    type: str

    class Config:
        orm_mode = True

class CreateHistorySchema(BaseModel):
    message: str
    type: str

    class Config:
        orm_mode = True