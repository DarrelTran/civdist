from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os

DATABASE_NAME = f'postgresql+asyncpg://postgres:{os.environ.get('USER_DATABASE_PASSWORD')}@db.uojsgkzhqrankupfuore.supabase.co:5432/postgres'

engine = create_async_engine(DATABASE_NAME)
postgresqlSession = async_sessionmaker(autoflush=False, expire_on_commit=False, bind=engine)