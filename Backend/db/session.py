from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os

DATABASE_NAME = os.environ.get('USER_DATABASE_STR')

engine = create_async_engine(DATABASE_NAME)
postgresqlSession = async_sessionmaker(autoflush=False, expire_on_commit=False, bind=engine)