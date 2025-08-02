import { TileType, TileTerrain, TileNaturalWonders, TileBonusResources, TileLuxuryResources, TileDistricts, TileUniqueDistricts, TileNone, TileBuildings } from "./types";

export function isLand(tile: TileType)
{
    if (tile.TerrainType !== TileNone.NONE && tile.TerrainType !== TileTerrain.OCEAN && tile.TerrainType !== TileTerrain.COAST)
        return true;

    return false;
}

export function isSeaResource(tile: TileType): boolean
{
    if (tile.ResourceType === TileBonusResources.CRABS || 
        tile.ResourceType === TileBonusResources.FISH ||
        tile.ResourceType === TileLuxuryResources.PEARLS ||
        tile.ResourceType === TileLuxuryResources.WHALES
    )
        return true;
    
    return false;
}

export function hasNaturalWonder(wonder: string): boolean
{
    for (const natWonder of Object.values(TileNaturalWonders)) 
    {
        if (wonder === natWonder)
            return true;
    }

    return false;
}

export function getCityBuildings(ownedTiles: readonly TileType[]): TileBuildings[]
{
    let tiles: TileBuildings[] = [];

    for (let i = 0; i < ownedTiles.length; i++)
    {
        const theTile = ownedTiles[i];

        if (theTile.Buildings.length > 0)
            tiles = structuredClone(theTile.Buildings);
    }

    return tiles;
}

export function getCityPantheon(ownedTiles: readonly TileType[])
{
    for (let i = 0; i < ownedTiles.length; i++)
    {
        const theTile = ownedTiles[i];
        if (theTile.IsCity)
        {
            return theTile.CityPantheon;
        }
    }

    return TileNone.NONE;
}

export function getCityFoundedReligion(ownedTiles: readonly TileType[])
{
    for (let i = 0; i < ownedTiles.length; i++)
    {
        const theTile = ownedTiles[i];
        if (theTile.IsCity)
        {
            return theTile.FoundedReligion;
        }
    }

    return TileNone.NONE;
}

export function isDesert(tile: TileType)
{
    if (tile.TerrainType === TileTerrain.DESERT || tile.TerrainType === TileTerrain.DESERT_HILLS || tile.TerrainType === TileTerrain.DESERT_MOUNTAIN)
        return true;

    return false;
}

export function isTundra(tile: TileType)
{
    if (tile.TerrainType === TileTerrain.TUNDRA || tile.TerrainType === TileTerrain.TUNDRA_HILLS || tile.TerrainType === TileTerrain.TUNDRA_MOUNTAIN)
        return true;

    return false;
}

export function isSnow(tile: TileType)
{
    if (tile.TerrainType === TileTerrain.SNOW || tile.TerrainType === TileTerrain.SNOW_HILLS || tile.TerrainType === TileTerrain.SNOW_MOUNTAIN)
        return true;

    return false;
}

export function isPlains(tile: TileType)
{
    if (tile.TerrainType === TileTerrain.PLAINS || tile.TerrainType === TileTerrain.PLAINS_HILLS || tile.TerrainType === TileTerrain.PLAINS_MOUNTAIN)
        return true;

    return false;
}

export function isGrassland(tile: TileType)
{
    if (tile.TerrainType === TileTerrain.GRASSLAND || tile.TerrainType === TileTerrain.GRASSLAND_HILLS || tile.TerrainType === TileTerrain.GRASSLAND_MOUNTAIN)
        return true;

    return false;
}

export function hasCampus(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isCampus(tile));
}

export function isAerodrome(tile: TileType)
{
    return (tile.District === TileDistricts.AERODROME_DISTRICT);
}

export function isAqueduct(tile: TileType)
{
    return (tile.District === TileDistricts.AQUEDUCT_DISTRICT || tile.District === TileUniqueDistricts.BATH_DISTRICT);
}

export function isCampus(tile: TileType)
{
    return (tile.District === TileDistricts.SCIENCE_DISTRICT);
}

export function isCityCenter(tile: TileType)
{
    return (tile.District === TileDistricts.CENTER_DISTRICT);
}

export function isCommercialHub(tile: TileType)
{
    return (tile.District === TileDistricts.COMMERCIAL_DISTRICT);
}

export function isEncampment(tile: TileType)
{
    return (tile.District === TileDistricts.ENCAMPMENT_DISTRICT);
}

export function isEntertainmentComplex(tile: TileType)
{
    return (tile.District === TileDistricts.ENTERTAINMENT_DISTRICT || tile.District === TileUniqueDistricts.STREET_CARNIVAL_DISTRICT);
}

export function isHolySite(tile: TileType)
{
    return (tile.District === TileDistricts.FAITH_DISTRICT || tile.District === TileUniqueDistricts.LAVRA_DISTRICT);
}

export function isIndustrialZone(tile: TileType)
{
    return (tile.District === TileDistricts.INDUSTRIAL_DISTRICT || tile.District === TileUniqueDistricts.HANSA_DISTRICT);
}

export function isNeighborhood(tile: TileType)
{
    return (tile.District === TileDistricts.NEIGHBORHOOD_DISTRICT || tile.District === TileUniqueDistricts.MBANZA_DISTRICT);
}

export function isSpaceport(tile: TileType)
{
    return (tile.District === TileDistricts.ROCKET_DISTRICT);
}

export function isTheaterSquare(tile: TileType)
{
    return (tile.District === TileDistricts.THEATER_DISTRICT || tile.District === TileUniqueDistricts.ACROPOLIS_DISTRICT);
}

export function isHarbor(tile: TileType)
{
    return (tile.District === TileDistricts.HARBOR_DISTRICT || tile.District === TileUniqueDistricts.ROYAL_NAVY_DOCKYARD_DISTRICT);
}