'''
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class UserSettings(BaseSettings):
    databaseUsername: str = Field(env="USER_DATABASE_USERNAME")
    databasePassword: str = Field(env="USER_DATABASE_PASSWORD")
    databaseHost: str = Field(env="USER_DATABASE_HOST")
    databasePort: int = Field(env="USER_DATABASE_PORT")
    databaseName: str = Field(env="USER_DATABASE_NAME")

    model_config = SettingsConfigDict(env_file='.env')

userSettings = UserSettings()

print(userSettings.databaseHost)
'''

import os
print(os.getcwd())  # where Python thinks your working directory is
print(open(".env").read())  # confirm Python can read it