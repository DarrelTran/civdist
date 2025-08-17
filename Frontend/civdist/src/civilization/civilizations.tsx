import { TileType, LeaderName, TileNone, TileFeatures, TileTerrain, TileDistricts, TileNaturalWonders, TileBonusResources, TileLuxuryResources, TileImprovements, TileStrategicResources, TilePantheons, TileYields, TileWonders, PossibleErrors, VictoryType, TileArtifactResources, TileUniqueDistricts } from "../types/types";
import { hasSeaResource, hasNaturalWonder, hasCampus, getCityPantheon, isLand, isWater, hasBonusResource, hasLuxuryResource, hasStrategicResource, isPlains, isGrassland, isDesert, isOcean, isCoast, isTundra, isSnow, hasTheater, hasHolySite, hasCommercial, hasHarbor, hasIndustrial, hasEntertainment, hasAqueduct, hasSpaceport, ruinsAdjacentTileAppeal, hasEncampment, isMountainWonder, hasAerodrome, isValidAqueductTile, distanceToTile, getCityTile, isAdjacentToCityCenter } from "../utils/functions/civ/civFunctions";
import { canPlaceAlhambra, canPlaceBigBen, canPlaceBolshoiTheatre, canPlaceBroadway, canPlaceChichenItza, canPlaceColosseum, canPlaceColossus, canPlaceCristoRedentor, canPlaceEiffelTower, canPlaceEstadioDoMaracana, canPlaceForbiddenCity, canPlaceGreatLibrary, canPlaceGreatLighthouse, canPlaceGreatZimbabwe, canPlaceHagiaSophia, canPlaceHangingGardens, canPlaceHermitage, canPlaceHueyTeocalli, canPlaceMahabodhiTemple, canPlaceMontStMichel, canPlaceOracle, canPlaceOxfordUniversity, canPlacePetra, canPlacePotalaPalace, canPlacePyramids, canPlaceRuhrValley, canPlaceStonehenge, canPlaceSydneyOperaHouse, canPlaceTerracottaArmy, canPlaceVenetianArsenal } from "./wonderPlacement"
import { getMapOddrString } from "../utils/functions/misc/misc";
import { getOffsets, isFacingTargetHex } from "../utils/functions/hex/genericHex";

/*
Rules:
2) Ignore some wonders based on typical civ victory type.
4) Account for civ specific stuff
5) Account for building bonuses to tiles or city (like factory or stave) or stuff that removes appeal when adding district
*/

const GOOD_SCORE = 5;
const MEDIUM_SCORE = 3;
const LOW_SCORE = 1;
const BAD_SCORE = -2;

function getScoreFromAdj(adj: number): number
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
function getScoreFromAppeal(appeal: number): number
{
    if (appeal >= 2) // breathtaking & charming
        return BAD_SCORE;
    else 
        return LOW_SCORE;
}

function getNeighborhoodScoreFromAppeal(appeal: number): number
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
function getScoreFromRemoveAppeal(tile: TileType, mapCache: Map<string, TileType>)
{
    if (ruinsAdjacentTileAppeal(tile, mapCache))
        return BAD_SCORE;
    else
        return LOW_SCORE;
}

function getScoreFromImprovements(tile: TileType, mapCache: Map<string, TileType>): number 
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

/** string is of format: TileWonder,VictoryType */
const WondersRegistry: Record<string, TileWonderFunction> = 
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

function callWonderFunction(fn: TileWonderFunction, tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[]): boolean 
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
function getScoreFromWonderPlacement(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<string> | null, preferredVictory: string): number
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

            if (!wondersIncluded.has(wonder) && !sameVictoryType)
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

function getTileSimilarYield(tile: TileType, otherTile: TileType, yieldPreferences: readonly TileYields[], yieldTolerance: number): boolean
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

function getTileSimilarTerrain(tile: TileType, otherTile: TileType): boolean
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

function getTileSimilarResources(tile: TileType, otherTile: TileType): boolean
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

function getTileSimilarAppeal(tile: TileType, otherTile: TileType, appealTolerance: number): boolean
{
    return (Math.abs(tile.Appeal - otherTile.Appeal) <= appealTolerance);
}

/**
 * Checks if the district will add extra appeal to surrounding tiles such that they are charming or above.
 * @param ownedTiles 
 * @param appealTolerance How many tiles must be charming or above in order for the district placement to be 'good.' Maximum value is 6. MEDIUM_SCORE for >= appealTolerance. LOW_SCORE for >= (appealTolerance / 2).
 */
function getScoreFromAddAppeal(tile: TileType, mapCache: Map<string, TileType>, appealTolerance: number): number
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

function getMinDistanceToTargetCity(targetTile: TileType, ownedTiles: readonly TileType[])
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
function getScoreIfNearTargetCity(checkTile: TileType, targetTile: TileType, minDistance: number)
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
function getScoreFromChokepoint(tile: TileType, mapCache: Map<string, TileType>, impassableTolerance: number, strongTerrainTolerance: number)
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

export abstract class Civilization
{
    /* Helper methods - In class because there might be civ specific stuff for them and if so, should be overwritten. */

    replacementTileExists(tile: TileType, ownedTiles: readonly TileType[], yieldPreferences: readonly TileYields[]): boolean
    {
        for (let i = 0; i < ownedTiles.length; i++)
        {
            const otherTile = ownedTiles[i];

            if (otherTile.X === tile.X && otherTile.Y === tile.Y)
                continue;

            if (!otherTile.IsWorked && this.isFreeTile(otherTile, getCityTile(ownedTiles)))
            {
                const yieldTolerance = 1;
                const appealTolerance = 1;

                if (getTileSimilarYield(tile, otherTile, yieldPreferences, yieldTolerance) && 
                    getTileSimilarTerrain(tile, otherTile) && 
                    getTileSimilarResources(tile, otherTile) && 
                    getTileSimilarAppeal(tile, otherTile, appealTolerance)
                   )
                   return true;
            }
        }

        return false;
    }

    protected getCampusScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        // don't include getScoreFromPossibleAdjacentDistricts() because only care about current tile

        return  getScoreFromAdj(this.getCampusAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal);
    }
    
    protected getTheaterScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        const appealTolerance = 6;

        return  getScoreFromAddAppeal(tile, mapCache, appealTolerance) +
                getScoreFromAdj(this.getTheaterAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal);
    }

    protected getHolySiteScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        const appealTolerance = 6;

        return  getScoreFromAddAppeal(tile, mapCache, appealTolerance) +  
                getScoreFromAdj(this.getHolySiteAdj(tile, ownedTiles, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal);
    }

    protected getCommercialHubScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  getScoreFromAdj(this.getCommercialHubAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal);
    }

    protected getHarborScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  getScoreFromAdj(this.getHarborAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal);
    }

    protected getIndustrialZoneScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  getScoreFromAdj(this.getIndustrialZoneAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) +
                getScoreFromRemoveAppeal(tile, mapCache);
    }

    protected getNeighborhoodScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  getNeighborhoodScoreFromAppeal(tile.Appeal) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory);
    }

    protected getAqueductScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal);
    }

    protected getAerodromeScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): number
    {
        const minDist = getMinDistanceToTargetCity(targetCity, ownedTiles);

        return  this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) +
                getScoreIfNearTargetCity(tile, targetCity, minDist) +
                getScoreFromRemoveAppeal(tile, mapCache);
    }

    protected getEntertainmentZoneScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        const appealTolerance = 6;

        return  getScoreFromAddAppeal(tile, mapCache, appealTolerance) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal);
    }

    protected getSpaceportScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) +
                getScoreFromRemoveAppeal(tile, mapCache);
    }  
    
    protected getEncampmentScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): number
    {
        const impassableThreshold = 1;
        const hindersThreshold = 1;

        return  this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) + 
                getScoreFromChokepoint(tile, mapCache, impassableThreshold, hindersThreshold) +
                getScoreFromRemoveAppeal(tile, mapCache);
    }  

    /**
     * Checks if the tile can accomodate a district and other adjacent districts (will be "good" district placements). Should not be used inside getCampusScore or else it'll be an infinite loop.
     * @param tile 
     * @param mapCache 
     */
    protected getScoreFromPossibleAdjacentDistricts(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string)
    {
        let totalDistricts = 0;
        const offsets = getOffsets(tile.Y);

        offsets.forEach(([dx, dy]) => 
        {
            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);
            if (!adjTile || (adjTile && this.isFreeTile(adjTile, getCityTile(ownedTiles)))) return;

            const campusScore = this.getCampusScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const theaterScore = this.getTheaterScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const holySiteScore = this.getHolySiteScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const industrialZoneScore = this.getIndustrialZoneScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const commercialHubScore = this.getCommercialHubScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const harborScore = this.getHarborScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const neighborhoodScore = this.getNeighborhoodScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const aqueductScore = this.getAqueductScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const aerodromeScore = this.getAerodromeScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
            const entertainmentZoneScore = this.getEntertainmentZoneScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const spaceportScore = this.getSpaceportScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);
            const encampmentScore = this.getEncampmentScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);

            if (campusScore >= LOW_SCORE || 
                theaterScore >= LOW_SCORE || 
                holySiteScore >= LOW_SCORE ||
                industrialZoneScore >= LOW_SCORE || 
                commercialHubScore >= LOW_SCORE || 
                commercialHubScore >= LOW_SCORE ||
                harborScore >= LOW_SCORE || 
                neighborhoodScore >= LOW_SCORE || 
                aqueductScore >= LOW_SCORE ||
                aerodromeScore >= LOW_SCORE || 
                entertainmentZoneScore >= LOW_SCORE || 
                spaceportScore >= LOW_SCORE ||
                encampmentScore >= LOW_SCORE
               )
                ++totalDistricts;
        })

        if (totalDistricts >= 2) // adj bonus = 0.5 for adj districts
            return MEDIUM_SCORE;
        else
            return BAD_SCORE; // maybe will find a better tile with better adjacent districts
    }

    /**
     * A tile that has no district, wonder, is not mountainous, isn't on a desert floodplains, is not a natural wonder, is not a luxury or strategic resource, and is not an oasis. Can be overwritten.
     * @param tile 
     */
    protected isFreeTile(tile: TileType, cityTile: TileType): boolean
    {
        if (
            (tile.IsMountain || isMountainWonder(tile)) || 
            tile.District !== TileNone.NONE || 
            tile.Wonder !== TileNone.NONE || 
            hasNaturalWonder(tile.FeatureType) || 
            (tile.FeatureType === TileFeatures.FLOODPLAINS && tile.TerrainType === TileTerrain.DESERT) ||
            hasLuxuryResource(tile) ||
            hasStrategicResource(tile) ||
            tile.FeatureType === TileFeatures.OASIS ||
            distanceToTile(tile, cityTile) > 3 ||
            tile.ResourceType === TileArtifactResources.ANTIQUITY_SITE ||
            tile.ResourceType === TileArtifactResources.SHIPWRECK
           )
            return false;

        return true;
    }

    /**
     * Checks if a tile can be replaced by another owned tile.
     * @param tile 
     * @param yieldPreferences 
     * @param ownedTiles 
     * @returns 
     */
    protected getScoreFromReplacability(tile: TileType, yieldPreferences: readonly TileYields[], ownedTiles: readonly TileType[]): number
    {
        if (this.replacementTileExists(tile, ownedTiles, yieldPreferences) && tile.IsWorked) // worked tiles are important
            return MEDIUM_SCORE;
        else if (this.replacementTileExists(tile, ownedTiles, yieldPreferences))
            return LOW_SCORE;
        else
            return BAD_SCORE;
    }

    protected getCampusAdj(tile: TileType, mapCache: Map<string, TileType>): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {
                if (adjCacheTile.FeatureType === TileNaturalWonders.GREAT_BARRIER_REEF)
                    bonus = bonus + 2;
                if ((adjCacheTile.IsMountain || isMountainWonder(adjCacheTile)))
                    bonus = bonus + 1;
                if (adjCacheTile.FeatureType === TileFeatures.RAINFOREST || (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)) // wonders are districts
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }

    protected getTheaterAdj(tile: TileType, mapCache: Map<string, TileType>): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {   
                if (adjCacheTile.Wonder !== TileNone.NONE)
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }

    protected getIndustrialZoneAdj(tile: TileType, mapCache: Map<string, TileType>): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {
                if (adjCacheTile.ImprovementType === TileImprovements.MINE || adjCacheTile.ImprovementType === TileImprovements.QUARRY)
                    bonus = bonus + 1;
                else if (adjCacheTile.IsHills) // if no mine/quarry exists, it can be placed later on the hill
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }

    protected getHarborAdj(tile: TileType, mapCache: Map<string, TileType>): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {
                if (adjCacheTile.District === TileDistricts.CENTER_DISTRICT)
                    bonus = bonus + 2;
                if (hasSeaResource(adjCacheTile))
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }

    protected getCommercialHubAdj(tile: TileType, mapCache: Map<string, TileType>): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {
                if (adjCacheTile.District === TileDistricts.HARBOR_DISTRICT)
                    bonus = bonus + 2;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 0.5;
            }
        })

        if (tile.IsRiver) // rivers are visually between tiles but represented as tiles between the visual river
            bonus = bonus + 2;

        return bonus;
    }

    protected getHolySiteAdj(tile: TileType, ownedTiles: readonly TileType[], mapCache: Map<string, TileType>): number
    {
        let cityPanth = getCityPantheon(ownedTiles);
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {
                if (hasNaturalWonder(adjCacheTile.FeatureType))
                    bonus = bonus + 2;
                if (
                    (adjCacheTile.IsMountain || isMountainWonder(adjCacheTile)) || 
                    (cityPanth === TilePantheons.DANCE_OF_THE_AURORA && (adjCacheTile.TerrainType === TileTerrain.TUNDRA || adjCacheTile.TerrainType === TileTerrain.TUNDRA_HILLS || adjCacheTile.TerrainType === TileTerrain.TUNDRA_MOUNTAIN)) ||
                    (cityPanth === TilePantheons.DESERT_FOLKLORE && (adjCacheTile.TerrainType === TileTerrain.DESERT || adjCacheTile.TerrainType === TileTerrain.DESERT_HILLS || adjCacheTile.TerrainType === TileTerrain.DESERT_MOUNTAIN)) ||
                    (cityPanth === TilePantheons.SACRED_PATH && adjCacheTile.FeatureType === TileFeatures.RAINFOREST)
                    )
                    bonus = bonus + 1;
                if ((adjCacheTile.District !== "NONE" && adjCacheTile.Wonder === "NONE") || adjCacheTile.FeatureType === TileFeatures.WOODS)
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }

    /* OPTIMAL TILE PLACEMENT */

    getCampusTile(ownedTiles: readonly TileType[], yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined; // wtf???

        if (!hasCampus(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile))
                {
                    let score = maxScore + this.getCampusScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.SCIENCE_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }

    getTheaterTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        if (!hasTheater(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile))
                {
                    let score = maxScore + this.getTheaterScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.THEATER_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }

    getHolySiteTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        if (!hasHolySite(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile))
                {
                    let score = maxScore + this.getHolySiteScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.FAITH_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }   

    getCommercialHubTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        if (!hasCommercial(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile))
                {
                    let score = maxScore + this.getCommercialHubScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.COMMERCIAL_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }

    getHarborTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        if (!hasHarbor(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isWater(tile))
                {
                    let score = maxScore + this.getHarborScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.HARBOR_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }

    getIndustrialZoneTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        if (!hasIndustrial(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile))
                {
                    let score = maxScore + this.getIndustrialZoneScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.INDUSTRIAL_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }   

    getNeighborhoodTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        ownedTiles.forEach((tile) => 
        {
            if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile))
            {
                let score = maxScore + this.getNeighborhoodScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                if (score > maxScore)
                {
                    maxScore = score;
                    returnedTile = tile;
                }
            }
        })

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.NEIGHBORHOOD_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }
    
    getAqueductTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        // placed adjacent to the City Center and either a Mountain, Oasis, Lake, or River 

        if (!hasAqueduct(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile) && isValidAqueductTile(tile, mapCache))
                {
                    let score = maxScore + this.getAqueductScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.AQUEDUCT_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }

    getAerodromeTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        if (!hasAerodrome(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile))
                {
                    let score = maxScore + this.getAerodromeScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.AERODROME_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }

    getEntertainmentZoneTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        if (!hasEntertainment(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile))
                {
                    let score = maxScore + this.getEntertainmentZoneScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.ENTERTAINMENT_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }

    getSpaceportTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        if (!hasSpaceport(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile))
                {
                    let score = maxScore + this.getSpaceportScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.ROCKET_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }

    getEncampmentTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        const facingCityAngleThreshold = 75;
        const distanceThreshold = 2;

        if (!hasEncampment(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile) && !isAdjacentToCityCenter(tile, mapCache) && isFacingTargetHex(getCityTile(ownedTiles), targetCity, tile, facingCityAngleThreshold, distanceThreshold))
                {
                    let score = maxScore + this.getEncampmentScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory) + 
                                this.getScoreFromPossibleAdjacentDistricts(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }
        else
        {
            throw new Error(PossibleErrors.DISTRICT_ALREADY_EXISTS);
        }

        if (returnedTile)
        {
            returnedTile.District = TileDistricts.ENCAMPMENT_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }
}

/* right now, these specific civs are pretty empty, but kept for easy modification later on if needed */

export class CityState extends Civilization
{
    // for consistency and easy identification
}

export class America extends Civilization
{
    
}

export class Arabia extends Civilization
{
    
}   

export class Brazil extends Civilization
{
    override getCampusAdj(tile: TileType, mapCache: Map<string, TileType>): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {
                if (adjCacheTile.FeatureType === TileNaturalWonders.GREAT_BARRIER_REEF)
                    bonus = bonus + 2;
                if ((adjCacheTile.IsMountain || isMountainWonder(adjCacheTile)) || adjCacheTile.FeatureType === TileFeatures.RAINFOREST)
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }

    override getTheaterAdj(tile: TileType, mapCache: Map<string, TileType>): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {   
                if (adjCacheTile.Wonder !== TileNone.NONE || adjCacheTile.FeatureType === TileFeatures.RAINFOREST)
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }

    override getCommercialHubAdj(tile: TileType, mapCache: Map<string, TileType>): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {
                if (adjCacheTile.District === TileDistricts.HARBOR_DISTRICT)
                    bonus = bonus + 2;
                if (adjCacheTile.FeatureType === TileFeatures.RAINFOREST)
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 0.5;
            }
        })

        if (tile.IsRiver) // rivers are visually between tiles but represented as tiles between the visual river
            bonus = bonus + 2;

        return bonus;
    }

    override getHolySiteAdj(tile: TileType, ownedTiles: readonly TileType[], mapCache: Map<string, TileType>): number
    {
        let cityPanth = getCityPantheon(ownedTiles);
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;

            const adjOddr = getMapOddrString(adjOddrX, adjOddrY);
            const adjCacheTile = mapCache.get(adjOddr);

            if (adjCacheTile)
            {
                if (hasNaturalWonder(adjCacheTile.FeatureType))
                    bonus = bonus + 2;
                if (
                    (adjCacheTile.IsMountain || isMountainWonder(adjCacheTile)) || 
                    adjCacheTile.FeatureType === TileFeatures.RAINFOREST ||
                    (cityPanth === TilePantheons.DANCE_OF_THE_AURORA && (adjCacheTile.TerrainType === TileTerrain.TUNDRA || adjCacheTile.TerrainType === TileTerrain.TUNDRA_HILLS || adjCacheTile.TerrainType === TileTerrain.TUNDRA_MOUNTAIN)) ||
                    (cityPanth === TilePantheons.DESERT_FOLKLORE && (adjCacheTile.TerrainType === TileTerrain.DESERT || adjCacheTile.TerrainType === TileTerrain.DESERT_HILLS || adjCacheTile.TerrainType === TileTerrain.DESERT_MOUNTAIN))
                    )
                    bonus = bonus + 1;
                if ((adjCacheTile.District !== "NONE" && adjCacheTile.Wonder === "NONE") || adjCacheTile.FeatureType === TileFeatures.WOODS)
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }

    override getEntertainmentZoneTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        try
        {
            const theTile = super.getEntertainmentZoneTile(ownedTiles, yieldPreferences, mapCache, wondersIncluded, targetCity, preferredVictory);
            
            if (theTile)
            {
                theTile.District = TileUniqueDistricts.STREET_CARNIVAL_DISTRICT;
                return theTile;
            }
        }
        catch (err)
        {
            if (err instanceof Error)
                throw err;
        }
    }
}

export class China extends Civilization
{
    
}

export class Egypt extends Civilization
{
    
}

export class England extends Civilization
{
    
}

export class France extends Civilization
{
    
}

export class Germany extends Civilization
{
    
}

export class Greece extends Civilization
{
    
}

export class India extends Civilization
{
    
}

export class Japan extends Civilization
{
    
}

export class Kongo extends Civilization
{
    
}

export class Russia extends Civilization
{
    
}

export class Scythia extends Civilization
{
    
}

export class Sumeria extends Civilization
{
    
}

export class Spain extends Civilization
{
    
}

export class Norway extends Civilization
{
    
}

export class Rome extends Civilization
{
    
}

export class Aztec extends Civilization
{
    
}

const CivRegistry: Record<LeaderName, new () => Civilization> = 
{
    [LeaderName.CITY_STATE]: CityState,
    [LeaderName.TEDDY_ROOSEVELT]: America,
    [LeaderName.SALADIN]: Arabia,
    [LeaderName.PEDRO_II]: Brazil,
    [LeaderName.QIN_SHI_HUANG]: China,
    [LeaderName.CLEOPATRA]: Egypt,
    [LeaderName.VICTORIA]: England,
    [LeaderName.CATHERINE_DE_MEDICI]: France,
    [LeaderName.FREDERICK_BARBAROSSA]: Germany,
    [LeaderName.PERICLES]: Greece,
    [LeaderName.GORGO]: Greece,
    [LeaderName.GANDHI]: India,
    [LeaderName.HOJO_TOKIMUNE]: Japan,
    [LeaderName.MVEMBA_A_NZINGA]: Kongo,
    [LeaderName.PETER_THE_GREAT]: Russia,
    [LeaderName.TOMYRIS]: Scythia,
    [LeaderName.GILGAMESH]: Sumeria,
    [LeaderName.PHILIP_II]: Spain,
    [LeaderName.HARALD_HARDRADA]: Norway,
    [LeaderName.TRAJAN]: Rome,
    [LeaderName.MONTEZUMA_I]: Aztec
};

export function getCivilizationObject(leaderName: LeaderName | TileNone): Civilization | TileNone
{
    let theCiv: Civilization | TileNone = TileNone.NONE;

    if (leaderName !== TileNone.NONE)
    {
        const FoundCiv = CivRegistry[leaderName];
        if (FoundCiv)
            return new FoundCiv();
    }

    return theCiv;
}   