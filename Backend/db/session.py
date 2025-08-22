from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from Backend.config import userSettings
from asyncio import run

DATABASE_NAME = f'postgresql+asyncpg://{userSettings.databaseUsername}:{userSettings.databasePassword}@{userSettings.databaseHost}:{userSettings.databasePort}/{userSettings.databaseName}'

engine = create_async_engine(DATABASE_NAME)
postgresqlSession = async_sessionmaker(autoflush=False, expire_on_commit=False, bind=engine)

async def asyncTest():
    try:
        async with engine.begin() as connection:
            await connection.execute(text("SELECT 1"))
        print("Connection successful!")
    except Exception as e:
        print(f"Connection failed: {e}")

run(asyncTest())