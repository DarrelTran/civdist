from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import userSettings



DATABASE_NAME = f'postgresql://{}'