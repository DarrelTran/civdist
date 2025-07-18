export enum HexType
{
    TERRAIN,
    DISTRICT
}

export type TileType =
{
  X: number,
  Y: number,
  TerrainType: string,
  FeatureType: string,
  ResourceType: string,
  ImprovementType: string,
  IsHills: boolean,
  IsMountain: boolean,
  IsWater: boolean,
  IsCity: boolean,
  IsRiver: boolean,
  IsNEOfRiver: boolean,
  IsWOfRiver: boolean,
  IsNWOfRiver: boolean,
  RiverSWFlow: string,
  RiverEFlow: string,
  RiverSEFlow: string,
  Appeal: number,
  Continent: string,
  Civilization: string,
  Leader: string,
  CityName: string,
  District: string,
  Buildings: never[] | [string],
  Food: number, 
  Production: number, 
  Gold: number, 
  Science: number, 
  Culture: number, 
  Faith: number
}