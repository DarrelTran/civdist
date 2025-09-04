from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import os
import re

engine = create_async_engine(re.sub(r'^postgresql:', 'postgresql+asyncpg:', os.getenv('USER_DATABASE_STR')), echo=True)
postgresqlSession = async_sessionmaker(autoflush=False, expire_on_commit=False, bind=engine)