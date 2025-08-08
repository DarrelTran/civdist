import { TileType, LeaderName, TileNone, TileFeatures, TileTerrain, TileWonders, TileDistricts, TileUniqueDistricts, TileNaturalWonders, TileBonusResources, TileLuxuryResources, TileImprovements, TileStrategicResources, TilePantheons, TileYields, TileBuildings } from "../utils/types";
import { getCityFoundedReligion, isCityCenter, isCommercialHub, isDesert, isTundra, isEncampment, isEntertainmentComplex, isHarbor, isHolySite, isLand, isTheaterSquare, isGrassland, isPlains, isCampus, isIndustrialZone, isMountainWonder } from "../utils/functions/civ/civFunctions";
import { getMapOddrString } from "../utils/functions/misc/misc";
import { getOffsets } from "../utils/functions/hex/genericHex";

export function canPlaceAlhambra(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.IsHills)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isEncampment(adjTile))
                return true;
        }
    }

    return false;
}

export function canPlaceBigBen(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    if (tile.IsRiver)
    {
        let hasCommercial = false;
        let hasBank = false;

        if (ownedTiles.length > 0)
        {
            const buildings = ownedTiles[ownedTiles.length - 1].Buildings;
            if (buildings.includes(TileBuildings.BANK)) // buildings only 'exist' within the city center, not at the districts themselves
                hasBank = true;
        }

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isCommercialHub(adjTile))
                hasCommercial = true;

            if (hasCommercial && hasBank)
                return true;
        }
    }

    return false;
}

export function canPlaceBolshoiTheatre(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.IsFlatlands)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isTheaterSquare(adjTile))
                return true;
        }
    }

    return false;
}

export function canPlaceBroadway(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.IsFlatlands)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isTheaterSquare(adjTile))
                return true;
        }
    }

    return false;
}

export function canPlaceChichenItza(tile: TileType): boolean
{
    if (tile.FeatureType === TileFeatures.RAINFOREST)
        return true;

    return false;
}

export function canPlaceColosseum(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.IsFlatlands)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isEntertainmentComplex(adjTile))
                return true;
        }
    }

    return false;
}

export function canPlaceColossus(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.TerrainType === TileTerrain.COAST)
    {
        let hasLand = false;
        let hasHarbor = false;

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isHarbor(adjTile))
                hasHarbor = true;
            else if (adjTile && isLand(adjTile))
                hasLand = true;

            if (hasLand && hasHarbor)
                return true;
        }
    }

    return false;
}

export function canPlaceCristoRedentor(tile: TileType): boolean
{
    if (tile.IsHills)
        return true;

    return false;
}

export function canPlaceEiffelTower(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.IsFlatlands)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isCityCenter(adjTile))
                return true;
        }
    }

    return false;
}

export function canPlaceEstadioDoMaracana(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    if (tile.IsFlatlands)
    {
        let hasEntertainment = false;
        let hasStadium = false;

        if (ownedTiles.length > 0)
        {
            const buildings = ownedTiles[ownedTiles.length - 1].Buildings;
            if (buildings.includes(TileBuildings.STADIUM)) // buildings only 'exist' within the city center, not at the districts themselves
                hasStadium = true;
        }

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isEntertainmentComplex(adjTile))
                hasEntertainment = true;

            if (hasEntertainment && hasStadium)
                return true;
        }
    }

    return false;
}

export function canPlaceForbiddenCity(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.IsFlatlands)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isCityCenter(adjTile))
                return true;
        }
    }

    return false;
}

export function canPlaceGreatLibrary(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    if (tile.IsFlatlands)
    {
        let hasCampus = false;
        let hasLibrary = false;

        if (ownedTiles.length > 0)
        {
            const buildings = ownedTiles[ownedTiles.length - 1].Buildings;
            if (buildings.includes(TileBuildings.LIBRARY)) // buildings only 'exist' within the city center, not at the districts themselves
                hasLibrary = true;
        }

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isEntertainmentComplex(adjTile))
                hasCampus = true;

            if (hasCampus && hasLibrary)
                return true;
        }
    }

    return false;
}

export function canPlaceGreatZimbabwe(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    let hasCommercial = false;
    let hasMarket = false;
    let hasCattle = false;

    if (ownedTiles.length > 0)
    {
        const buildings = ownedTiles[ownedTiles.length - 1].Buildings;
        if (buildings.includes(TileBuildings.MARKET)) // buildings only 'exist' within the city center, not at the districts themselves
            hasMarket = true;
    }

    const offsets = getOffsets(tile.Y);
    for (let i = 0; i < offsets.length; i++)
    {
        const dx = offsets[i][0];
        const dy = offsets[i][1];

        const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
        const adjTile = mapCache.get(oddrStr);

        if (adjTile && isCommercialHub(adjTile))
            hasCommercial = true;
        else if (adjTile && tile.ResourceType === TileBonusResources.CATTLE)
            hasCattle = true;

        if (hasCommercial && hasMarket && hasCattle)
            return true;
    }

    return false;
}

export function canPlaceGreatLighthouse(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    if (tile.TerrainType === TileTerrain.COAST)
    {
        let hasLand = false;
        let hasHarbor = false;
        let hasLighthouse = false;

        if (ownedTiles.length > 0)
        {
            const buildings = ownedTiles[ownedTiles.length - 1].Buildings;
            if (buildings.includes(TileBuildings.LIGHTHOUSE)) // buildings only 'exist' within the city center, not at the districts themselves
                hasLighthouse = true;
        }

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isHarbor(adjTile))
                hasHarbor = true;
            else if (adjTile && isLand(adjTile))
                hasLand = true;

            if (hasLand && hasHarbor && hasLighthouse)
                return true;
        }
    }

    return false;
}

export function canPlaceHagiaSophia(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    if (getCityFoundedReligion(ownedTiles) !== TileNone.NONE && tile.IsFlatlands)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isHolySite(adjTile))
                return true;
        }
    }

    return false;
}

export function canPlaceHangingGardens(tile: TileType): boolean
{
    if (tile.IsRiver)
        return true;

    return false;
}

export function canPlaceHermitage(tile: TileType): boolean
{
    if (tile.IsRiver && !(isDesert(tile) || isTundra(tile)))
        return true;

    return false;
}

export function canPlaceHueyTeocalli(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.IsLake)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isLand(adjTile))
                return true;
        }
    }

    return false;
}

export function canPlaceMahabodhiTemple(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    if (getCityFoundedReligion(ownedTiles) !== TileNone.NONE && tile.FeatureType === TileFeatures.WOODS)
    {
        let hasHoly = false;
        let hasTemple = false;

        if (ownedTiles.length > 0)
        {
            const buildings = ownedTiles[ownedTiles.length - 1].Buildings;
            if (buildings.includes(TileBuildings.TEMPLE)) // buildings only 'exist' within the city center, not at the districts themselves
                hasTemple = true;
        }

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isHolySite(adjTile))
                hasHoly = true;

            if (hasHoly && hasTemple)
                return true;
        }
    }

    return false;
}

export function canPlaceMontStMichel(tile: TileType): boolean
{
    if (tile.FeatureType === TileFeatures.FLOODPLAINS || tile.FeatureType === TileFeatures.MARSH)
        return true;

    return false;
}

export function canPlaceOracle(tile: TileType): boolean
{
    if (tile.IsHills)
        return true;

    return false;
}

export function canPlaceOxfordUniversity(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    if (isGrassland(tile) || isPlains(tile))
    {
        let hasCampus = false;
        let hasUniversity = false;

        if (ownedTiles.length > 0)
        {
            const buildings = ownedTiles[ownedTiles.length - 1].Buildings;
            if (buildings.includes(TileBuildings.UNIVERSITY)) // buildings only 'exist' within the city center, not at the districts themselves
                hasUniversity = true;
        }

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isCampus(adjTile))
                hasCampus = true;

            if (hasCampus && hasUniversity)
                return true;
        }
    }

    return false;
}

export function canPlacePetra(tile: TileType): boolean
{
    if (isDesert(tile))
        return true;

    return false;
}

export function canPlacePotalaPalace(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.IsHills)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && (adjTile.IsMountain || isMountainWonder(adjTile)))
                return true;;
        }
    }

    return false;
}

export function canPlacePyramids(tile: TileType): boolean
{
    if (isDesert(tile))
        return true;

    return false;
}

export function canPlaceRuhrValley(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    if (tile.IsRiver)
    {
        let hasIndustrial = false;
        let hasFactory = false;

        if (ownedTiles.length > 0)
        {
            const buildings = ownedTiles[ownedTiles.length - 1].Buildings;
            if (buildings.includes(TileBuildings.FACTORY)) // buildings only 'exist' within the city center, not at the districts themselves
                hasFactory = true;
        }

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isIndustrialZone(adjTile))
                hasIndustrial = true;

            if (hasIndustrial && hasFactory)
                return true;
        }
    }

    return false;
}

export function canPlaceStonehenge(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.IsFlatlands)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && adjTile.ResourceType === TileBonusResources.STONE)
                return true;
        }
    }

    return false;
}

export function canPlaceSydneyOperaHouse(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.TerrainType === TileTerrain.COAST && !tile.IsLake)
    {
        let hasLand = false;
        let hasHarbor = false;

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isHarbor(adjTile))
                hasHarbor = true;
            else if (adjTile && isLand(adjTile))
                hasLand = true;

            if (hasLand && hasHarbor)
                return true;
        }
    }

    return false;
}

export function canPlaceTerracottaArmy(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean
{
    if (tile.IsRiver)
    {
        let hasEncampment = false;
        let hasBarracksOrStable = false;

        if (ownedTiles.length > 0)
        {
            const buildings = ownedTiles[ownedTiles.length - 1].Buildings;
            if (buildings.includes(TileBuildings.BARRACKS) || buildings.includes(TileBuildings.STABLE)) // buildings only 'exist' within the city center, not at the districts themselves
                hasBarracksOrStable = true;
        }

        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isEncampment(adjTile))
                hasEncampment = true;

            if (hasEncampment && hasBarracksOrStable)
                return true;
        }
    }

    return false;
}

export function canPlaceVenetianArsenal(tile: TileType, mapCache: Map<string, TileType>): boolean
{
    if (tile.TerrainType === TileTerrain.COAST && !tile.IsLake)
    {
        const offsets = getOffsets(tile.Y);
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile && isIndustrialZone(adjTile))
                return true;
        }
    }

    return false;
}