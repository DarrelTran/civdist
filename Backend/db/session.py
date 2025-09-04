from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os

DATABASE_NAME = f'postgresql+asyncpg://postgres.uojsgkzhqrankupfuore:[{os.environ.get('USER_DATABASE_PASSWORD')}]@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true'

engine = create_async_engine(DATABASE_NAME)
postgresqlSession = async_sessionmaker(autoflush=False, expire_on_commit=False, bind=engine)