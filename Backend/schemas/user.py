from pydantic import BaseModel, ConfigDict

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    username: str
    password: str

    model_config = ConfigDict(from_attributes=True)

class UserItemsCreate(BaseModel):
    id: int
    map: str
    username: str

class UserItemsRead(BaseModel):
    id: int
    map: str
    username: str

    model_config = ConfigDict(from_attributes=True)