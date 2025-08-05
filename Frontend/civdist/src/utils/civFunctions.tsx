import { TileType, TileTerrain, TileNaturalWonders, TileBonusResources, TileLuxuryResources, TileDistricts, TileUniqueDistricts, TileNone, TileBuildings, TileStrategicResources } from "./types";

export function isBonusResource(tile: TileType): boolean
{
    for (const bonus of Object.values(TileBonusResources)) 
    {
        if (tile.ResourceType === bonus)
            return true;
    }

    return false;
}

export function isLuxuryResource(tile: TileType): boolean
{
    for (const luxury of Object.values(TileLuxuryResources)) 
    {
        if (tile.ResourceType === luxury)
            return true;
    }

    return false;
}

export function isStrategicResource(tile: TileType): boolean
{
    for (const strategic of Object.values(TileStrategicResources)) 
    {
        if (tile.ResourceType === strategic)
            return true;
    }

    return false;
}

export function isLand(tile: TileType)
{
    if (tile.TerrainType !== TileNone.NONE && tile.TerrainType !== TileTerrain.OCEAN && tile.TerrainType !== TileTerrain.COAST)
        return true;

    return false;
}

export function isWater(tile: TileType)
{
    if (tile.TerrainType !== TileNone.NONE && (tile.TerrainType === TileTerrain.OCEAN || tile.TerrainType === TileTerrain.COAST))
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

export function isOcean(tile: TileType)
{
    if (tile.TerrainType === TileTerrain.OCEAN)
        return true;

    return false;
}

export function isCoast(tile: TileType)
{
    if (tile.TerrainType === TileTerrain.COAST && !tile.IsLake)
        return true;

    return false;
}

export function hasCampus(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isCampus(tile));
}

export function hasHolySite(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isHolySite(tile));
}

export function hasTheater(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isTheaterSquare(tile));
}

export function hasEntertainment(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isEntertainmentComplex(tile));
}

export function hasHarbor(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isHarbor(tile));
}

export function hasIndustrial(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isIndustrialZone(tile));
}

export function hasCommercial(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isCommercialHub(tile));
}

export function hasAqueduct(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isAqueduct(tile));
}

export function hasEncampment(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isEncampment(tile));
}

export function hasAerodrome(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isAerodrome(tile));
}

export function hasSpaceport(ownedTiles: readonly TileType[]): boolean
{
    return ownedTiles.some(tile => isSpaceport(tile));
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

export function isChokepoint()
{

}

// https://ondras.github.io/rot.js/manual/#hex/indexing
export function distanceToTile(currTile: TileType, otherTile: TileType)
{
    const x1 = currTile.X;
    const y1 = currTile.Y;
    const x2 = otherTile.X;
    const y2 = otherTile.Y;

    const even = (num: number) => {return (num % 2 == 0)};
    const odd = (num: number) => {return (num % 2 == 1)};

    const dx = x2 - x1;
    const dy = y2 - y1;
    const penalty = ( (even(y1) && odd(y2) && (x1 < x2)) || (even(y2) && odd(y1) && (x2 < x1)) ) ? 1 : 0;
    const distance = Math.max(Math.abs(dy), Math.abs(dx) + Math.floor(Math.abs(dy)/2) + penalty); 

    return distance;
}