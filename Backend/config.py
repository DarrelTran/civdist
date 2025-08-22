from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import pathlib

BASE_DIR = pathlib.Path(__file__).resolve().parent

class UserSettings(BaseSettings):
    databaseUsername: str = Field(alias="USER_DATABASE_USERNAME")
    databasePassword: str = Field(alias="USER_DATABASE_PASSWORD")
    databaseHost: str = Field(alias="USER_DATABASE_HOST")
    databasePort: int = Field(alias="USER_DATABASE_PORT")
    databaseName: str = Field(alias="USER_DATABASE_NAME")

    model_config = SettingsConfigDict(env_file=str(BASE_DIR / ".env"))

userSettings = UserSettings()