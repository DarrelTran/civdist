from typing import List
from pydantic import BaseModel, ConfigDict

class UserCreateSchema(BaseModel):
    username: str
    password: str

class UserReadSchema(BaseModel):
    username: str
    password: str

    model_config = ConfigDict(from_attributes=True)

class UserItemsCreateSchema(BaseModel):
    # id is autoincrement
    map: dict | List[dict]
    username: str

class UserItemsReadSchema(BaseModel):
    id: int
    map: dict | List[dict]
    username: str

    model_config = ConfigDict(from_attributes=True)

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