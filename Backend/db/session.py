from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from Backend.config import userSettings

DATABASE_NAME = f'postgresql+asyncpg://{userSettings.databaseUsername}:{userSettings.databasePassword}@{userSettings.databaseHost}:{userSettings.databasePort}/{userSettings.databaseName}'

engine = create_async_engine(DATABASE_NAME)
postgresqlSession = async_sessionmaker(autoflush=False, expire_on_commit=False, bind=engine)