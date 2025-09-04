from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from Backend.config import userSettings 

DATABASE_NAME = f'postgresql+asyncpg://postgres.uojsgkzhqrankupfuore:[{userSettings.databasePassword}]@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true'

engine = create_async_engine(DATABASE_NAME)
postgresqlSession = async_sessionmaker(autoflush=False, expire_on_commit=False, bind=engine)