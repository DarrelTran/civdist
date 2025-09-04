from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import pathlib

BASE_DIR = pathlib.Path(__file__).resolve().parent

class UserSettings(BaseSettings):
    databasePassword: str = Field(alias="USER_DATABASE_PASSWORD")

    model_config = SettingsConfigDict(env_file=str(BASE_DIR / ".env"), extra='ignore')

userSettings = UserSettings()

class Auth(BaseSettings):
    tokenSecret: str = Field(alias="TOKEN_SECRET_KEY")

    model_config = SettingsConfigDict(env_file=str(BASE_DIR / ".env"), extra='ignore')

authSettings = Auth()