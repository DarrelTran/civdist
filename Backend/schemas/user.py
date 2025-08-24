from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class TileType(BaseModel):
    X: int
    Y: int
    TerrainType: str
    FeatureType: str
    ResourceType: str
    ImprovementType: str
    IsHills: bool
    IsMountain: bool
    IsWater: bool
    IsLake: bool
    IsFlatlands: bool
    IsCity: bool
    IsCapital: bool
    OriginalOwner: str
    Population: int
    IsWorked: bool
    TileCity: str
    CityPantheon: str
    FoundedReligion: str
    IsRiver: bool
    IsNEOfRiver: bool
    IsWOfRiver: bool
    IsNWOfRiver: bool
    RiverSWFlow: str
    RiverEFlow: str
    RiverSEFlow: str
    Appeal: int
    Continent: str
    Civilization: str
    Leader: str 
    CityName: str
    District: str
    Buildings: List[str]
    Wonder: str
    Food: int
    Production: int
    Gold: int
    Science: int
    Culture: int
    Faith: int
    FavoredYields: List[str]
    DisfavoredYields: List[str]

class UserCreateSchema(BaseModel):
    username: str
    password: str

class UserReadSchema(BaseModel):
    username: str

class UserItemsCreateSchema(BaseModel):
    # id is autoincrement
    map: TileType | List[TileType]
    username: str

class UserItemUpdateSchemaID(BaseModel):
    id: int
    map: TileType | List[TileType]

class UserItemsReadSchemaID(BaseModel):
    id: int

class UserItemsReadSchemaUsername(BaseModel):
    username: str