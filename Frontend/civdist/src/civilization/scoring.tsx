import { TileType, TileNone, TileFeatures, TileTerrain, TileYields, TileWonders, VictoryType } from "../types/civTypes";
import { isLand, isWater, hasBonusResource, hasLuxuryResource, hasStrategicResource, isPlains, isGrassland, isDesert, isOcean, isCoast, isTundra, isSnow, ruinsAdjacentTileAppeal, isMountainWonder, distanceToTile } from "../utils/civ/civFunctions";
import { canPlaceAlhambra, canPlaceBigBen, canPlaceBolshoiTheatre, canPlaceBroadway, canPlaceChichenItza, canPlaceColosseum, canPlaceColossus, canPlaceCristoRedentor, canPlaceEiffelTower, canPlaceEstadioDoMaracana, canPlaceForbiddenCity, canPlaceGreatLibrary, canPlaceGreatLighthouse, canPlaceGreatZimbabwe, canPlaceHagiaSophia, canPlaceHangingGardens, canPlaceHermitage, canPlaceHueyTeocalli, canPlaceMahabodhiTemple, canPlaceMontStMichel, canPlaceOracle, canPlaceOxfordUniversity, canPlacePetra, canPlacePotalaPalace, canPlacePyramids, canPlaceRuhrValley, canPlaceStonehenge, canPlaceSydneyOperaHouse, canPlaceTerracottaArmy, canPlaceVenetianArsenal } from "./wonderPlacement"
import { getMapOddrString, getOffsets } from "../utils/hex/genericHex";

/* Basically contains functions that dont need to be overwritten in the classes. */

export const GOOD_SCORE = 5;
export const MEDIUM_SCORE = 3;
export const LOW_SCORE = 1;
export const BAD_SCORE = -2;

// for encampment
export const facingCityAngleThreshold = 75;
export const distanceThreshold = 2;

export function getScoreFromAdj(adj: number): number
{
    if (adj >= 5) // 5 or more
        return GOOD_SCORE;
    else if (adj > 1 && adj < 5) // 1.5 - 4.5
        return MEDIUM_SCORE;
    else if (adj > 0 && adj <= 1) // 0.5 - 1
        return LOW_SCORE;
    else
        return BAD_SCORE;
}

/**
 * Avoid high appeal tiles. Already accounts for good seaside resort placement.
 * @param appeal 
 * @returns 
 */
export function getScoreFromAppeal(appeal: number): number
{
    if (appeal >= 2) // breathtaking & charming
        return BAD_SCORE;
    else 
        return LOW_SCORE;
}

export function getNeighborhoodScoreFromAppeal(appeal: number): number
{
    if (appeal >= 4) // breathtaking
        return GOOD_SCORE;
    else if (appeal >= 2 && appeal <= 3) // charming
        return MEDIUM_SCORE;
    else if (appeal >= -3 && appeal <= 1) // average, uninviting
        return LOW_SCORE;
    else
        return BAD_SCORE;
}

/**
 * Gets the score for if the district will ruin the appeal of the surrounding tiles.
 * @param tile 
 * @param mapCache 
 */
export function getScoreFromRemoveAppeal(tile: TileType, mapCache: Map<string, TileType>)
{
    if (ruinsAdjacentTileAppeal(tile, mapCache))
        return BAD_SCORE;
    else
        return LOW_SCORE;
}

export function getScoreFromImprovements(tile: TileType, mapCache: Map<string, TileType>): number 
{
    const goodForFarm = (tile: TileType): boolean => 
    {
        if ((tile.TerrainType === TileTerrain.GRASSLAND || 
            tile.TerrainType === TileTerrain.GRASSLAND_HILLS || 
            tile.TerrainType === TileTerrain.PLAINS || 
            tile.TerrainType === TileTerrain.PLAINS_HILLS || 
            (tile.TerrainType === TileTerrain.DESERT && tile.FeatureType === TileFeatures.FLOODPLAINS) &&
            tile.District === TileNone.NONE)
           )
            return true;

        return false;
    }

    // accounts for woods/rainforest (lumber mills) & mines
    if (tile.ImprovementType !== TileNone.NONE || tile.FeatureType !== TileNone.NONE || tile.IsHills)
        return BAD_SCORE;
    // check if tile has good adjacencies for farm's feudalism civic
    else if (goodForFarm(tile))
    {
        const offset = getOffsets(tile.Y);

        const rightOddr =       getMapOddrString(tile.X + offset[0][0], 
                                                 tile.Y + offset[0][1]);
        const topRightOddr =    getMapOddrString(tile.X + offset[1][0], 
                                                 tile.Y + offset[1][1]);
        const topLeftOddr =     getMapOddrString(tile.X + offset[2][0], 
                                                 tile.Y + offset[2][1]);
        const leftOddr =        getMapOddrString(tile.X + offset[3][0], 
                                                 tile.Y + offset[3][1]);
        const bottomLeftOddr =  getMapOddrString(tile.X + offset[4][0], 
                                                 tile.Y + offset[4][1]);
        const bottomRightOddr = getMapOddrString(tile.X + offset[5][0], 
                                                 tile.Y + offset[5][1]);

        const rightTile = mapCache.get(rightOddr);
        const topRightTile = mapCache.get(topRightOddr);
        const topLeftTile = mapCache.get(topLeftOddr);
        const leftTile = mapCache.get(leftOddr);
        const bottomLeftTile = mapCache.get(bottomLeftOddr);
        const bottomRightTile = mapCache.get(bottomRightOddr);

        // northeast double
        if (rightTile && topRightTile && goodForFarm(rightTile) && goodForFarm(topRightTile))
            return BAD_SCORE;

        // north double
        if (topRightTile && topLeftTile && goodForFarm(topRightTile) && goodForFarm(topLeftTile))
            return BAD_SCORE;

        // north west double
        if (topLeftTile && leftTile && goodForFarm(topLeftTile) && goodForFarm(leftTile))
            return BAD_SCORE;

        // south west double
        if (leftTile && bottomLeftTile && goodForFarm(leftTile) && goodForFarm(bottomLeftTile))
            return BAD_SCORE;

        // south double
        if (bottomLeftTile && bottomRightTile && goodForFarm(bottomLeftTile) && goodForFarm(bottomRightTile))
            return BAD_SCORE;

        // south east double
        if (bottomRightTile && rightTile && goodForFarm(bottomRightTile) && goodForFarm(rightTile))
            return BAD_SCORE;

        // back slash diagonal
        if (topLeftTile && bottomRightTile && goodForFarm(topLeftTile) && goodForFarm(bottomRightTile))
            return BAD_SCORE;

        // forward slash diagonal
        if (topRightTile && bottomLeftTile && goodForFarm(topRightTile) && goodForFarm(bottomLeftTile))
            return BAD_SCORE;

        // horizontal 
        if (leftTile && rightTile && goodForFarm(leftTile) && goodForFarm(rightTile))
            return BAD_SCORE;

        // backwards l-shape
        if (topRightTile && leftTile && goodForFarm(topRightTile) && goodForFarm(leftTile))
            return BAD_SCORE;

        // l-shape
        if (topLeftTile && rightTile && goodForFarm(topLeftTile) && goodForFarm(rightTile))
            return BAD_SCORE;

        // upside down l-shape
        if (bottomLeftTile && rightTile && goodForFarm(bottomLeftTile) && goodForFarm(rightTile))
            return BAD_SCORE;

        // upside down backwards l-shape
        if (bottomRightTile && leftTile && goodForFarm(bottomRightTile) && goodForFarm(leftTile))
            return BAD_SCORE;
    }

    return LOW_SCORE;
}

type TileWonderFunction = 
  | ((tile: TileType) => boolean)
  | ((tile: TileType, mapCache: Map<string, TileType>) => boolean)
  | ((tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]) => boolean);

const key = (wonder: TileWonders, victory: VictoryType[]) => {return `${wonder};${victory}`}

/** string is of format: TileWonder;[VictoryType] (brackets not included in string)*/
export const WondersRegistry: Record<string, TileWonderFunction> = 
{
    [key(TileWonders.ALHAMBRA, [VictoryType.DOMINATION])]:                              canPlaceAlhambra,
    [key(TileWonders.BIG_BEN, [VictoryType.NONE])]:                                     canPlaceBigBen,
    [key(TileWonders.BOLSHOI_THEATRE, [VictoryType.CULTURE])]:                          canPlaceBolshoiTheatre,
    [key(TileWonders.BROADWAY, [VictoryType.CULTURE])]:                                 canPlaceBroadway,
    [key(TileWonders.CHICHEN_ITZA, [VictoryType.CULTURE])]:                             canPlaceChichenItza,
    [key(TileWonders.COLOSSEUM, [VictoryType.NONE])]:                                   canPlaceColosseum,
    [key(TileWonders.COLOSSUS, [VictoryType.NONE])]:                                    canPlaceColossus,
    [key(TileWonders.CRISTO_REDENTOR, [VictoryType.CULTURE])]:                          canPlaceCristoRedentor,
    [key(TileWonders.EIFFEL_TOWER, [VictoryType.CULTURE])]:                             canPlaceEiffelTower,
    [key(TileWonders.ESTADIO_DO_MARACANA, [VictoryType.NONE])]:                         canPlaceEstadioDoMaracana,
    [key(TileWonders.FORBIDDEN_CITY, [VictoryType.NONE])]:                              canPlaceForbiddenCity,
    [key(TileWonders.GREAT_LIBRARY, [VictoryType.SCIENCE, VictoryType.CULTURE])]:       canPlaceGreatLibrary,
    [key(TileWonders.GREAT_ZIMBABWE, [VictoryType.NONE])]:                              canPlaceGreatZimbabwe,
    [key(TileWonders.GREAT_LIGHTHOUSE, [VictoryType.DOMINATION])]:                      canPlaceGreatLighthouse,
    [key(TileWonders.HAGIA_SOPHIA, [VictoryType.RELIGIOUS])]:                           canPlaceHagiaSophia,
    [key(TileWonders.HANGING_GARDENS, [VictoryType.NONE])]:                             canPlaceHangingGardens,
    [key(TileWonders.HERMITAGE, [VictoryType.CULTURE])]:                                canPlaceHermitage,
    [key(TileWonders.HUEY_TEOCALLI, [VictoryType.NONE])]:                               canPlaceHueyTeocalli,
    [key(TileWonders.MAHABODHI_TEMPLE, [VictoryType.RELIGIOUS])]:                       canPlaceMahabodhiTemple,
    [key(TileWonders.MONT_ST_MICHEL, [VictoryType.RELIGIOUS, VictoryType.CULTURE])]:    canPlaceMontStMichel,
    [key(TileWonders.ORACLE, [VictoryType.NONE])]:                                      canPlaceOracle,
    [key(TileWonders.OXFORD_UNIVERSITY, [VictoryType.SCIENCE, VictoryType.CULTURE])]:   canPlaceOxfordUniversity,
    [key(TileWonders.PETRA, [VictoryType.NONE])]:                                       canPlacePetra,
    [key(TileWonders.POTALA_PALACE, [VictoryType.NONE])]:                               canPlacePotalaPalace,
    [key(TileWonders.PYRAMIDS, [VictoryType.NONE])]:                                    canPlacePyramids,
    [key(TileWonders.RUHR_VALLEY, [VictoryType.NONE])]:                                 canPlaceRuhrValley,
    [key(TileWonders.STONEHENGE, [VictoryType.RELIGIOUS])]:                             canPlaceStonehenge,
    [key(TileWonders.SYDNEY_OPERA_HOUSE, [VictoryType.CULTURE])]:                       canPlaceSydneyOperaHouse,
    [key(TileWonders.TERRACOTTA_ARMY, [VictoryType.DOMINATION])]:                       canPlaceTerracottaArmy,
    [key(TileWonders.VENETIAN_ARSENAL, [VictoryType.DOMINATION])]:                      canPlaceVenetianArsenal
};

export function callWonderFunction(fn: TileWonderFunction, tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean 
{
    if (fn.length === 1) 
        return (fn as (tile: TileType) => boolean)(tile);
    else if (fn.length === 2) 
        return (fn as (tile: TileType, mapCache: Map<string, TileType>) => boolean)(tile, mapCache);
    else 
        return (fn as (tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]) => boolean)(tile, mapCache, ownedTiles);
}

/**
 * Finds if the tile is potentially good for a wonder by checking if it's possible to put one here. A good wonder is already covered by other functions like yield placement (want low yields for good wonder).
 * @param tile 
 * @param mapCache 
 */
export function getScoreFromWonderPlacement(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<string> | null, preferredVictory: string): number
{
    if (wondersIncluded)
    {
        for (const [wonderKey, fn] of Object.entries(WondersRegistry) as [string, TileWonderFunction][]) 
        {
            const splitString = wonderKey.split(';');
            const wonder = splitString[0];
            const victories = splitString[1].split(',');

            let sameVictoryType = false;
            // skip wonder if doesn't match preferred victory type
            // as player is unlikely to place it anyways, so don't need to add a score for it
            for (let i = 0; i < victories.length; i++)
            {
                if (victories[i] === preferredVictory)
                {
                    sameVictoryType = true;
                    break;
                }
            }

            if (!wondersIncluded.has(wonder) && (sameVictoryType || preferredVictory === VictoryType.NONE))
            {
                const canPlace = callWonderFunction(fn, tile, mapCache, ownedTiles);
                if (canPlace) 
                    return BAD_SCORE;
            }
        }

        return LOW_SCORE;
    }

    return 0;
}

export function getTileSimilarYield(tile: TileType, otherTile: TileType, yieldPreferences: readonly TileYields[], yieldTolerance: number): boolean
{
    // for preferred yields, want exact or larger amount of yields
    if (yieldPreferences.length > 0)
    {
        let preferredScore = 0;

        yieldPreferences.forEach((prefYield) => 
        {
            if (prefYield === TileYields.FOOD && otherTile.Food >= tile.Food)
                ++preferredScore;
            else if (prefYield === TileYields.CULTURE && otherTile.Food >= tile.Culture)
                ++preferredScore;
            else if (prefYield === TileYields.GOLD && otherTile.Food >= tile.Gold)
                ++preferredScore;
            else if (prefYield === TileYields.SCIENCE && otherTile.Food >= tile.Science)
                ++preferredScore;
            else if (prefYield === TileYields.FAITH && otherTile.Food >= tile.Faith)
                ++preferredScore;
            else if (prefYield === TileYields.PRODUCTION && otherTile.Food >= tile.Production)
                ++preferredScore;
        })

        if (preferredScore >= yieldPreferences.length)
            return true;
    }
    else
    {
        let otherTileSum = 0;
        let tileSum = 0;
        for (const theYield of Object.values(TileYields))
        {
            if (otherTile[theYield] > 0 && tile[theYield] > 0) // avoid terrible zero yield tiles
            {
                otherTileSum = otherTileSum + otherTile[theYield];
                tileSum = tileSum + otherTile[theYield];
            }
        }

        if (Math.abs(otherTileSum - tileSum) <= yieldTolerance)
            return true;
    }

    return false;
}

export function getTileSimilarTerrain(tile: TileType, otherTile: TileType): boolean
{
    if (isLand(tile) && isLand(otherTile))
    {
        if ((isPlains(tile) && isPlains(otherTile)) || 
            (isGrassland(tile) && isGrassland(otherTile)) || 
            (isDesert(tile) && isDesert(otherTile)) || 
            (isTundra(tile) && isTundra(otherTile)) || 
            (isSnow(tile) && isSnow(otherTile))
           )
           return true;
    }
    else if (isWater(tile) && isWater(otherTile))
    {
        if ((tile.IsLake && otherTile.IsLake) || 
            (isOcean(tile) && isOcean(otherTile)) || 
            (isCoast(tile) && isCoast(otherTile))
           )
            return true;
    }

    return false;
}

export function getTileSimilarResources(tile: TileType, otherTile: TileType): boolean
{
    if (tile.ResourceType === TileNone.NONE)
        return true;

    if (((isLand(tile) && isLand(otherTile)) || (isWater(tile) && isWater(otherTile))) && // even for resources unique to land/water, if both are land/water, dont need to check that
        (hasBonusResource(tile) && hasBonusResource(otherTile)) ||
        (hasLuxuryResource(tile) && hasLuxuryResource(otherTile)) ||
        (hasStrategicResource(tile) && hasStrategicResource(otherTile))
       )
        return true;

    return false;
}

export function getTileSimilarAppeal(tile: TileType, otherTile: TileType, appealTolerance: number): boolean
{
    return (Math.abs(tile.Appeal - otherTile.Appeal) <= appealTolerance);
}

/**
 * Checks if the district will add extra appeal to surrounding tiles such that they are charming or above.
 * @param ownedTiles 
 * @param appealTolerance How many tiles must be charming or above in order for the district placement to be 'good.' Maximum value is 6. MEDIUM_SCORE for >= appealTolerance. LOW_SCORE for >= (appealTolerance / 2).
 */
export function getScoreFromAddAppeal(tile: TileType, mapCache: Map<string, TileType>, appealTolerance: number): number
{
    if (appealTolerance > 6)
        appealTolerance = 6;

    let totalTiles = 0;
    const offsets = getOffsets(tile.Y);

    for (let i = 0; i < offsets.length; i++)
    {
        const dx = offsets[i][0];
        const dy = offsets[i][1];

        const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
        const adjTile = mapCache.get(oddrStr);

        if (adjTile)
        {
            if (adjTile.Appeal + 1 >= 2) // better than breathtaking/charming
                ++totalTiles;
        }
    }

    if (totalTiles >= appealTolerance)
        return MEDIUM_SCORE;
    else if (totalTiles >= (appealTolerance / 2))
        return LOW_SCORE;
    else
        return BAD_SCORE;
}

export function getMinDistanceToTargetCity(targetTile: TileType, ownedTiles: readonly TileType[])
{
    let minDist = 99999; // all cities, even when founded have at least 7 tiles, so this will always be changed

    ownedTiles.forEach((tile) => 
    {
        minDist = Math.min(minDist, distanceToTile(tile, targetTile));
    })

    return minDist;
}

/**
 * +0 dist from min = GOOD_SCORE ; +1 dist from min = MEDIUM_SCORE ; +2 dist from min = LOW_SCORE
 * @param checkTile 
 * @param targetTile 
 * @param minDistance MUST call getMinDistanceToTargetCity to get the minDistance value BEFORE calling this function!!
 */
export function getScoreIfNearTargetCity(checkTile: TileType, targetTile: TileType, minDistance: number)
{
    const dist = distanceToTile(checkTile, targetTile);//getDistanceBetweenTwoOddrHex({x: checkTile.X, y: checkTile.Y}, {x: targetTile.X, y: targetTile.Y});

    if (dist === minDistance)
        return GOOD_SCORE;
    else if (dist === minDistance + 1)
        return MEDIUM_SCORE;
    else if (dist === minDistance + 2)
        return LOW_SCORE;
    else
        return BAD_SCORE;
}

/**
 * 
 * @param tile 
 * @param mapCache 
 * @param impassableTolerance How many surrounding impassable tiles must exist for the tile to be good.
 * @param strongTerrainTolerance How many surrounding 'strong' terrain (hills, forest, etc) tiles must exist for the tile to be good.
 * @returns Score based on impassable tiles, terrain that hinders ranged sight, and sea tiles. Returns a score based on number of mountains or strong terrain where mountains get a higher score.
 */
export function getScoreFromChokepoint(tile: TileType, mapCache: Map<string, TileType>, impassableTolerance: number, strongTerrainTolerance: number)
{
    let impassableTiles = 0;
    let hindersMovementOrAttack = 0;

    if (tile.IsRiver)
        ++hindersMovementOrAttack

    const offsets = getOffsets(tile.Y);
    offsets.forEach(([dx, dy]) => 
    {
        const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
        const adjTile = mapCache.get(oddrStr);

        if (adjTile)
        {
            if (adjTile.IsMountain || isMountainWonder(adjTile))
                ++impassableTiles;
            else if (adjTile.FeatureType === TileFeatures.WOODS || adjTile.FeatureType === TileFeatures.RAINFOREST || adjTile.IsHills || isWater(adjTile))
                ++hindersMovementOrAttack;
        }
    })

    const mountainScore = impassableTiles * 2;
    const otherScore = hindersMovementOrAttack;
    const maxMountains = 4; // encampment wont be able to shoot much if too many mountains blocking it

    if (impassableTiles >= impassableTolerance && hindersMovementOrAttack >= strongTerrainTolerance && impassableTiles <= maxMountains)
        return mountainScore + otherScore;
    else if (impassableTiles >= impassableTolerance && impassableTiles <= maxMountains)
        return mountainScore;
    else if (hindersMovementOrAttack >= strongTerrainTolerance)
        return otherScore;
    else
        return BAD_SCORE;
}