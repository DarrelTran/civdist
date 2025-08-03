import { TileType, LeaderName, TileNone, TileFeatures, TileTerrain, TileDistricts, TileNaturalWonders, TileBonusResources, TileLuxuryResources, TileImprovements, TileStrategicResources, TilePantheons, TileYields, TileWonders } from "../utils/types";
import { getMapOddrString, getOffsets } from "../utils/miscFunctions";
import { isSeaResource, hasNaturalWonder, hasCampus, getCityPantheon, isLand, isWater } from "../utils/civFunctions";
import { canPlaceAlhambra, canPlaceBigBen, canPlaceBolshoiTheatre, canPlaceBroadway, canPlaceChichenItza, canPlaceColosseum, canPlaceColossus, canPlaceCristoRedentor, canPlaceEiffelTower, canPlaceEstadioDoMaracana, canPlaceForbiddenCity, canPlaceGreatLibrary, canPlaceGreatLighthouse, canPlaceGreatZimbabwe, canPlaceHagiaSophia, canPlaceHangingGardens, canPlaceHermitage, canPlaceHueyTeocalli, canPlaceMahabodhiTemple, canPlaceMontStMichel, canPlaceOracle, canPlaceOxfordUniversity, canPlacePetra, canPlacePotalaPalace, canPlacePyramids, canPlaceRuhrValley, canPlaceStonehenge, canPlaceSydneyOperaHouse, canPlaceTerracottaArmy, canPlaceVenetianArsenal } from "./wonderPlacement"

/*
Rules:
1) Account for civ specific stuff
3) Account for building bonuses to tiles or city (like factory) or stuff that removes appeal when adding district
5) Avoid tiles good for wonders
6) Check if future districts can be placed nearby
7) update getScoreFromPossibleAdjacentDistricts() with other districts
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

function getScoreFromResource(tile: TileType): number
{
    for (const bonus of Object.values(TileBonusResources)) 
    {
        if (tile.ResourceType === bonus)
            return BAD_SCORE;
    }
    for (const luxury of Object.values(TileLuxuryResources)) 
    {
        if (tile.ResourceType === luxury)
            return BAD_SCORE;
    }
    for (const strategic of Object.values(TileStrategicResources)) 
    {
        if (tile.ResourceType === strategic)
            return BAD_SCORE;
    }

    return LOW_SCORE;
}

function getScoreFromImprovements(tile: TileType, mapCache: Map<string, TileType>): number // maybe a class method??
{
    const goodForFarm = (tile: TileType): boolean => 
    {
        if (tile.TerrainType === TileTerrain.GRASSLAND || 
            tile.TerrainType === TileTerrain.GRASSLAND_HILLS || 
            tile.TerrainType === TileTerrain.PLAINS || 
            tile.TerrainType === TileTerrain.PLAINS_HILLS || 
            (tile.TerrainType === TileTerrain.DESERT && tile.FeatureType === TileFeatures.FLOODPLAINS)
           )
            return true;

        return false;
    }

    if (tile.ImprovementType !== TileNone.NONE || tile.FeatureType !== TileNone.NONE)
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

const WondersRegistry: Record<TileWonders, TileWonderFunction> = 
{
    [TileWonders.ALHAMBRA]: canPlaceAlhambra,
    [TileWonders.BIG_BEN]: canPlaceBigBen,
    [TileWonders.BOLSHOI_THEATRE]: canPlaceBolshoiTheatre,
    [TileWonders.BROADWAY]: canPlaceBroadway,
    [TileWonders.CHICHEN_ITZA]: canPlaceChichenItza,
    [TileWonders.COLOSSEUM]: canPlaceColosseum,
    [TileWonders.COLOSSUS]: canPlaceColossus,
    [TileWonders.CRISTO_REDENTOR]: canPlaceCristoRedentor,
    [TileWonders.EIFFEL_TOWER]: canPlaceEiffelTower,
    [TileWonders.ESTADIO_DO_MARACANA]: canPlaceEstadioDoMaracana,
    [TileWonders.FORBIDDEN_CITY]: canPlaceForbiddenCity,
    [TileWonders.GREAT_LIBRARY]: canPlaceGreatLibrary,
    [TileWonders.GREAT_ZIMBABWE]: canPlaceGreatZimbabwe,
    [TileWonders.GREAT_LIGHTHOUSE]: canPlaceGreatLighthouse,
    [TileWonders.HAGIA_SOPHIA]: canPlaceHagiaSophia,
    [TileWonders.HANGING_GARDENS]: canPlaceHangingGardens,
    [TileWonders.HERMITAGE]: canPlaceHermitage,
    [TileWonders.HUEY_TEOCALLI]: canPlaceHueyTeocalli,
    [TileWonders.MAHABODHI_TEMPLE]: canPlaceMahabodhiTemple,
    [TileWonders.MONT_ST_MICHEL]: canPlaceMontStMichel,
    [TileWonders.ORACLE]: canPlaceOracle,
    [TileWonders.OXFORD_UNIVERSITY]: canPlaceOxfordUniversity,
    [TileWonders.PETRA]: canPlacePetra,
    [TileWonders.POTALA_PALACE]: canPlacePotalaPalace,
    [TileWonders.PYRAMIDS]: canPlacePyramids,
    [TileWonders.RUHR_VALLEY]: canPlaceRuhrValley,
    [TileWonders.STONEHENGE]: canPlaceStonehenge,
    [TileWonders.SYDNEY_OPERA_HOUSE]: canPlaceSydneyOperaHouse,
    [TileWonders.TERRACOTTA_ARMY]: canPlaceTerracottaArmy,
    [TileWonders.VENETIAN_ARSENAL]: canPlaceVenetianArsenal
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
function getScoreFromWonderPlacement(tile: TileType, mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null): number
{
    if (wondersIncluded)
    {
        for (const [wonder, fn] of Object.entries(WondersRegistry) as [TileWonders, TileWonderFunction][]) 
        {
            if (!wondersIncluded.has(wonder)) 
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

/** TODO: Add PREFERENCE SCORE TO  getTileSimilarYieldScore FOR EACH YIELD*/

function getTileSimilarYieldScore(tile: TileType, otherTile: TileType): boolean
{
    const otherYieldSum = otherTile.Food + otherTile.Production + otherTile.Gold + otherTile.Science + otherTile.Faith + otherTile.Culture;
    const currentTileYieldSum = otherTile.Food + otherTile.Production + otherTile.Gold + otherTile.Science + otherTile.Faith + otherTile.Culture;

    const yieldDifference = otherYieldSum - currentTileYieldSum;

    if (yieldDifference >= 0)
        return true;

    return false;
}

function getTileSimilarTerrainScore(tile: TileType, otherTile: TileType): boolean
{


    return false;
}

function getTileSimilarDistanceScore(tile: TileType, otherTile: TileType): boolean
{

    return false;
}

function getTileSimilarResourcesScore(tile: TileType, otherTile: TileType): boolean
{
    if (tile.ResourceType === TileNone.NONE)
        return true;

    return false;
}

function getTileSimilarAppealScore(tile: TileType, otherTile: TileType): boolean
{

    return false;
}

export abstract class Civilization
{
    /* Helper methods - In class because there might be civ specific stuff for them and if so, should be overwritten. */

    tileWithReplacementYieldsExists(tile: TileType, ownedTiles: readonly TileType[]): boolean
    {
        for (let i = 0; i < ownedTiles.length; i++)
        {
            const otherTile = ownedTiles[i];

            if (otherTile.X === tile.X && otherTile.Y === tile.Y)
                continue;

            if (!otherTile.IsWorked && this.isFreeTile(otherTile))
            {
                if (getTileSimilarYieldScore(tile, otherTile) && 
                    getTileSimilarTerrainScore(tile, otherTile) && 
                    getTileSimilarDistanceScore(tile, otherTile) && 
                    getTileSimilarResourcesScore(tile, otherTile) && 
                    getTileSimilarAppealScore(tile, otherTile)
                   )
                   return true;
            }
        }

        return false;
    }

    protected getCampusScore(tile: TileType, yieldPreferences: TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null): number
    {
        // don't include getScoreFromPossibleAdjacentDistricts() because only care about current tile

        return  getScoreFromAdj(this.getCampusAdj(tile, mapCache)) +
                this.getScoreFromYields(tile, yieldPreferences, ownedTiles) + 
                getScoreFromResource(tile) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded);
    }

    /**
     * Checks if the tile can accomodate a district and other adjacent districts (will be "good" district placements).
     * @param tile 
     * @param mapCache 
     */
    protected getScoreFromPossibleAdjacentDistricts(tile: TileType, yieldPreferences: TileYields[], mapCache: Map<string, TileType>, ownedTiles: TileType[], wondersIncluded: Set<TileWonders> | null)
    {
        let totalDistricts = 0;
        const offsets = getOffsets(tile.Y);

        offsets.forEach(([dx, dy]) => 
        {
            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);
            if (!adjTile || (adjTile && this.isFreeTile(adjTile))) return;

            const campusScore = this.getCampusScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded);

            // ADD OTHER DISTRICTS IN A DUPLICATE OR STATEMENT
            if (campusScore >= LOW_SCORE)
                ++totalDistricts;
        })

        if (totalDistricts >= 2) // adj bonus = 0.5 for adj districts
            return MEDIUM_SCORE;
        else
            return BAD_SCORE; // maybe will find a better tile with better adjacent districts
    }

    /**
     * A tile that has no district, wonder, is not mountainous, and isn't on a desert floodplains. Can be overwritten.
     * @param tile 
     */
    protected isFreeTile(tile: TileType): boolean
    {
        if (tile.IsMountain || tile.District !== TileNone.NONE || tile.Wonder !== TileNone.NONE || hasNaturalWonder(tile.FeatureType) || (tile.FeatureType === TileFeatures.FLOODPLAINS && tile.TerrainType === TileTerrain.DESERT))
            return false;

        return true;
    }

    /**
     * Want to avoid tiles with high yields or ones with yields preferred by the user.
     * @param tile 
     * @param yieldPreferences 
     * @returns 
     */
    protected getScoreFromYields(tile: TileType, yieldPreferences: TileYields[], ownedTiles: readonly TileType[]): number
    {
        if ((yieldPreferences.includes(TileYields.FOOD) && tile.Food > 0) || 
            (yieldPreferences.includes(TileYields.SCIENCE) && tile.Science > 0) ||
            (yieldPreferences.includes(TileYields.PRODUCTION) && tile.Production > 0) ||
            (yieldPreferences.includes(TileYields.CULTURE) && tile.Culture > 0) ||
            (yieldPreferences.includes(TileYields.FAITH) && tile.Faith > 0) ||
            (yieldPreferences.includes(TileYields.GOLD) && tile.Gold > 0)
           )
            return BAD_SCORE;
        else if (tile.IsWorked)
        {
            const hasReplacement = this.tileWithReplacementYieldsExists(tile, ownedTiles);

            if (hasReplacement)
                return MEDIUM_SCORE;
            else
                return BAD_SCORE;
        }
        else if (tile.Food >= 4 || 
                 tile.Science >= 4 ||
                 tile.Production >= 4 ||
                 tile.Culture >= 4 ||
                 tile.Faith >= 4 ||
                 tile.Gold >= 4
                )
            return BAD_SCORE;
        else
            return LOW_SCORE; 
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
                if (adjCacheTile.IsMountain)
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
                if (isSeaResource(adjCacheTile))
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
                    adjCacheTile.IsMountain || 
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

    getCampusTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null): TileType | undefined
    {
        let maxScore = -Number.MAX_SAFE_INTEGER;
        let returnedTile = undefined as TileType | undefined; // wtf???

        if (!hasCampus(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.isFreeTile(tile) && isLand(tile))
                {
                    let score = maxScore + this.getCampusScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded);
                    if (score > maxScore)
                    {
                        maxScore = score;
                        returnedTile = tile;
                    }
                }
            })
        }

        if (returnedTile)
            returnedTile.District = TileDistricts.SCIENCE_DISTRICT;

        return returnedTile;
    }

    getTheaterTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }

    getHolySiteTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }   

    getCommercialHubTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }

    getHarborTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }

    getIndustrialZoneTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }   

    getNeighborhoodTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }
    
    getAqueductTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }

    getAerodromeTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }

    getEntertainmentZoneTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }

    getSpaceportTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: boolean): number
    {


        return -1;
    }
}

export class America extends Civilization
{
    
}

export class Arabia extends Civilization
{
    
}

export class Brazil extends Civilization
{
    
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