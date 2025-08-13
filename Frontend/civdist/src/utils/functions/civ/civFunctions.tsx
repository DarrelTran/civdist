import { TileType, TileTerrain, TileNaturalWonders, TileBonusResources, TileLuxuryResources, TileDistricts, TileUniqueDistricts, TileNone, TileBuildings, TileStrategicResources, TileFeatures, TileWonders, TileYields, TileBuildingsCitizenSlots } from "../../../types/types";
import { getOffsets } from "../hex/genericHex";
import { getMapOddrString } from "../misc/misc";

export function hasBonusResource(tile: TileType): boolean
{
    for (const bonus of Object.values(TileBonusResources)) 
    {
        if (tile.ResourceType === bonus)
            return true;
    }

    return false;
}

export function hasLuxuryResource(tile: TileType): boolean
{
    for (const luxury of Object.values(TileLuxuryResources)) 
    {
        if (tile.ResourceType === luxury)
            return true;
    }

    return false;
}

export function hasStrategicResource(tile: TileType): boolean
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

export function hasSeaResource(tile: TileType): boolean
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

// https://ondras.github.io/rot.js/manual/#hex/indexing
export function distanceToTile(currTile: TileType, otherTile: TileType)
{
    const x1 = currTile.X;
    const y1 = currTile.Y;
    const x2 = otherTile.X;
    const y2 = otherTile.Y;

    const even = (num: number) => {return (num % 2 === 0)};
    const odd = (num: number) => {return (num % 2 === 1)};

    const dx = x2 - x1;
    const dy = y2 - y1;
    const penalty = ( (even(y1) && odd(y2) && (x1 < x2)) || (even(y2) && odd(y1) && (x2 < x1)) ) ? 1 : 0;
    const distance = Math.max(Math.abs(dy), Math.abs(dx) + Math.floor(Math.abs(dy) / 2) + penalty); 

    return distance;
}

/**
 * Checks if the district place on the tile will ruin breathtaking or charming appeal tiles.
 * @param tile 
 * @param mapCache 
 * @returns 
 */
export function ruinsAdjacentTileAppeal(tile: TileType, mapCache: Map<string, TileType>)
{
    const offsets = getOffsets(tile.Y); 
    for (let i = 0; i < offsets.length; i++)
    {
        const dx = offsets[i][0];
        const dy = offsets[i][1];

        const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
        const adjTile = mapCache.get(oddrStr);

        if (adjTile)
        {
            if (adjTile.Appeal - 1 < 2) // worse than breathtaking/charming
                return true;
        }
    }

    return false;
}

/**
 * Mount Kilimanjaro & Mount Everest count for adjacency bonuses but are not listed as mountains??? why???
 * @param tile 
 */
export function isMountainWonder(tile: TileType)
{
    if (tile.FeatureType === TileNaturalWonders.MOUNT_EVEREST || tile.FeatureType === TileNaturalWonders.MOUNT_LILIMANJARO)
        return true;

    return false;
}

export function isValidAqueductTile(tile: TileType, mapCache: Map<string, TileType>)
{
    const initBasicRiverDirections = (tile: TileType) => 
    {
        let tileRiverDirections = {E: false, NE: false, NW: false, W: false, SW: false, SE: false};

        if (tile.IsNEOfRiver)
            tileRiverDirections.SW = true;
        if (tile.IsNWOfRiver)
            tileRiverDirections.SE = true;
        if (tile.IsWOfRiver)
            tileRiverDirections.E = true;

        return tileRiverDirections;
    }

    const isNWNeighbor = (tile: TileType, adj: TileType): boolean => 
    {
        const parity = tile.Y % 2;
        return  (parity === 0 && adj.X === tile.X - 1 && adj.Y === tile.Y + 1) || // even row
                (parity === 1 && adj.X === tile.X     && adj.Y === tile.Y + 1);   // odd row
    }

    const isNENeighbor = (tile: TileType, adj: TileType): boolean => 
    {
        const parity = tile.Y % 2;
        return  (parity === 0 && adj.X === tile.X     && adj.Y === tile.Y + 1) || // even row
                (parity === 1 && adj.X === tile.X + 1 && adj.Y === tile.Y + 1);   // odd row
    }

    const getRestOfRiverDirections = (tile: TileType, riverDirections: {E: boolean, NE: boolean, NW: boolean, W: boolean, SW: boolean, SE: boolean}) => 
    {
        const tempDirections = riverDirections;

        const offsets = getOffsets(tile.Y); 
        for (let i = 0; i < offsets.length; i++)
        {
            const dx = offsets[i][0];
            const dy = offsets[i][1];

            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);

            if (adjTile)
            {
                const adjTileRiverDirections = initBasicRiverDirections(adjTile);
                if (adjTileRiverDirections.E && adjTile.Y === tile.Y)
                    tempDirections.W = true;
                if (adjTileRiverDirections.SE && isNWNeighbor(tile, adjTile)) // because hexmap y coords are flipped, to match with visual change
                    tempDirections.NW = true;
                if (adjTileRiverDirections.SW && isNENeighbor(tile, adjTile)) // because hexmap y coords are flipped, to match with visual change
                    tempDirections.NE = true;
            }
        }

        return tempDirections;
    }

    /**
     * 
     * @param tile 
     * @param otherRiverDirections 
     * @returns Which river edge relative to the otherTile (otherRiverDirections) borders the same river edge as the given tile.
     */
    const getSharedRiverEdgeWithCity = (tile: TileType, otherRiverDirections: {E: boolean, NE: boolean, NW: boolean, W: boolean, SW: boolean, SE: boolean}): {E: boolean, NE: boolean, NW: boolean, W: boolean, SW: boolean, SE: boolean} => 
    {
        let tileRiverDirections = initBasicRiverDirections(tile);
        tileRiverDirections = getRestOfRiverDirections(tile, tileRiverDirections);

        if (otherRiverDirections.E && tileRiverDirections.W)
            return {E: true, NE: false, NW: false, W: false, SW: false, SE: false};
        else if (otherRiverDirections.W && tileRiverDirections.E)
            return {E: false, NE: false, NW: false, W: true, SW: false, SE: false};
        else if (otherRiverDirections.NE && tileRiverDirections.SW)
            return {E: false, NE: true, NW: false, W: false, SW: false, SE: false};
        else if (otherRiverDirections.SW && tileRiverDirections.NE)
            return {E: false, NE: false, NW: false, W: false, SW: true, SE: false};
        else if (otherRiverDirections.NW && tileRiverDirections.SE)
            return {E: false, NE: false, NW: true, W: false, SW: false, SE: false};
        else if (otherRiverDirections.SE && tileRiverDirections.NW)
            return {E: false, NE: false, NW: false, W: false, SW: false, SE: true};

        return {E: false, NE: false, NW: false, W: false, SW: false, SE: false};
    }

    const offsets = getOffsets(tile.Y); 
    let theCity = undefined as TileType | undefined;
    let hasNonRiverWaterSource = false;
    let hasRiverWaterSource = false;

    // check tile water sources - non river
    for (let i = 0; i < offsets.length; i++)
    {
        const dx = offsets[i][0];
        const dy = offsets[i][1];

        const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
        const adjTile = mapCache.get(oddrStr);

        if (adjTile)
        {
            if (!theCity && adjTile.IsCity)
                theCity = adjTile;

            if (adjTile.IsMountain || isMountainWonder(adjTile) || adjTile.FeatureType === TileFeatures.OASIS || adjTile.IsLake)
                hasNonRiverWaterSource = true;
        }
    }

    let currRiverDirections = initBasicRiverDirections(tile);
    currRiverDirections = getRestOfRiverDirections(tile, currRiverDirections);

    // check river edges
    // has to be a 'river' tile as civ6 represents rivers as tiles but visually as edges
    if (theCity && tile.IsRiver)
    {
        const sameRiverEdge = getSharedRiverEdgeWithCity(theCity, currRiverDirections);
        let waterSourceCount = 0;

        if (sameRiverEdge.E)
            --waterSourceCount;
        else if (currRiverDirections.E) // means no shared edge
            ++waterSourceCount;

        if (sameRiverEdge.W)
            --waterSourceCount;
        else if (currRiverDirections.W) 
            ++waterSourceCount;

        if (sameRiverEdge.NE)
            --waterSourceCount;
        else if (currRiverDirections.NE) 
            ++waterSourceCount;

        if (sameRiverEdge.SE)
            --waterSourceCount;
        else if (currRiverDirections.SE)
            ++waterSourceCount;

        if (sameRiverEdge.SW)
            --waterSourceCount;
        else if (currRiverDirections.SW)
            ++waterSourceCount;

        if (sameRiverEdge.NW)
            --waterSourceCount;
        else if (currRiverDirections.NW)
            ++waterSourceCount;
        
        // if there is a shared edge and no other sources this would be negative
        if (waterSourceCount >= 0)
            hasRiverWaterSource = true;
    }

    // has water and adjacent city
    if ((hasRiverWaterSource || hasNonRiverWaterSource) && theCity)
        return true;
    else
        return false;
}

/**
 * Removes bonuses resources, features, yields, improvements, and if a tile is worked, reassigns another tile to be worked. ASSUMES that the isFreeTile function was called beforehand from civilizations.tsx.
 * @param districtTile 
 * @param cityTile 
 * @returns 
 */
export function purgeTileForDistrict(districtTile: TileType, cityTile: TileType): TileType
{
    const dist = districtTile;

    dist.ResourceType = TileNone.NONE;

    dist.Food = 0;
    dist.Science = 0;
    dist.Culture = 0;
    dist.Faith = 0;
    dist.Gold = 0;
    dist.Production = 0;

    dist.IsWorked = false;

    dist.FeatureType = TileNone.NONE;

    dist.ImprovementType = TileNone.NONE;

    return dist;
}

type YieldKey = 'Food' | 'Production' | 'Gold' | 'Science' | 'Culture' | 'Faith';

interface AllocOptions 
{
    maxDistance?: number;                       
    population: number;                        
    baseWeights?: Record<YieldKey, number>;
    favoredMultiplier?: number;                 
    disfavoredMultiplier?: number;              
}

function calculateDistrictYieldsFromCitizens(districtTile: TileType, cityTile: TileType): TileType[]
{
    const newTiles: TileType[] = [];

    if (districtTile.District !== TileNone.NONE && districtTile.Wonder === TileNone.NONE)
    {
        const correctDistrictBuildings = TileBuildingsCitizenSlots[districtTile.District]; // buildings for district the tile contains
        const cityBuildings = cityTile.Buildings; // all buildings from all districts in the city
        
        if (correctDistrictBuildings.length > 0)
        {
            cityBuildings.forEach((theBuilding) => 
            {
                const newDistrictTile: TileType = Object.assign({}, districtTile);

                if (correctDistrictBuildings.includes(theBuilding))
                {
                    if (isCampus(districtTile))
                    {
                        newDistrictTile.Science = newDistrictTile.Science + 2;
                    }
                    else if (isHolySite(districtTile))
                    {
                        newDistrictTile.Faith = newDistrictTile.Faith + 2;
                    }
                    else if (isEncampment(districtTile))
                    {
                        newDistrictTile.Production = newDistrictTile.Production + 1;
                        newDistrictTile.Gold = newDistrictTile.Gold + 2;
                    }
                    else if (isHarbor(districtTile))
                    {
                        newDistrictTile.Food = newDistrictTile.Food + 1;
                        newDistrictTile.Gold = newDistrictTile.Gold + 2;
                    }
                    else if (isCommercialHub(districtTile))
                    {
                        newDistrictTile.Gold = newDistrictTile.Gold + 4;
                    }
                    else if (isIndustrialZone(districtTile))
                    {
                        newDistrictTile.Production = newDistrictTile.Production + 2;
                    }
                    else if (isTheaterSquare(districtTile))
                    {
                        newDistrictTile.Culture = newDistrictTile.Culture + 2;
                    }

                    newTiles.push(newDistrictTile);
                }
            })
        }
    }

    return newTiles;
}

/**
 * 
 * @param allTiles 
 * @param cityTile 
 * @param opts 
 * @returns Returns an array of worked tiles for the city named cityName.
 */
export function allocateCitizensAuto(
    allTiles: TileType[],
    cityTile: TileType,
    opts: AllocOptions
): TileType[] 
{
    opts.maxDistance = opts.maxDistance ? opts.maxDistance : 3;
    // these random numbers seem to work
    opts.baseWeights = opts.baseWeights ? opts.baseWeights : { Food: 1.6, Production: 2, Gold: 0.75, Science: 0.75, Culture: 0.75, Faith: 0.75}; 
    opts.favoredMultiplier = opts.favoredMultiplier ? opts.favoredMultiplier : 25;
    opts.disfavoredMultiplier = opts.disfavoredMultiplier ? opts.disfavoredMultiplier : 0.5;

    type TileTypeWithSpecialist = TileType & {IsSpecialist: boolean};

    if (!cityTile) return [];

    const allTilesModified: TileTypeWithSpecialist[] = allTiles.map(tile => ({...tile, IsSpecialist: false}))

    const slots = Math.max(0, opts.population);
    if (slots === 0) return [];

    // Setup yield weights
    const favoredSet = new Set(cityTile.FavoredYields || []);
    const disfavoredSet = new Set(cityTile.DisfavoredYields || []);
    const yieldKeys: YieldKey[] = ['Food', 'Production', 'Gold', 'Science', 'Culture', 'Faith'];

    // remove typescript errors
    const weights = opts.baseWeights;
    const maxDistance = opts.maxDistance;
    const favoredMultiplier = opts.favoredMultiplier;
    const disfavoredMultiplier = opts.disfavoredMultiplier;
    const population = opts.population;

    for (const y of yieldKeys) 
    {
        if (favoredSet.has(y as TileYields)) 
            weights[y] = weights[y] * favoredMultiplier;

        if (disfavoredSet.has(y as TileYields)) 
            weights[y] = weights[y] * disfavoredMultiplier;
    }

    // === Gather normal workable tiles ===
    const normalTiles = allTilesModified.filter
    (t =>
        !t.IsCity &&
        t.District === TileNone.NONE &&
        (t.Food > 0 || t.Production > 0 || t.Gold > 0 || t.Science > 0 || t.Culture > 0 || t.Faith > 0) &&
        distanceToTile(cityTile, t) <= maxDistance &&
        !hasNaturalWonder(t.FeatureType)
    );

    // === Gather specialist "virtual tiles" ===
    function getSpecialistVirtualTiles(): TileTypeWithSpecialist[] 
    {
        const virtualTiles: TileTypeWithSpecialist[] = [];
        
        for (const districtTile of allTilesModified.filter
        (t =>
            !t.IsCity &&
            t.District !== TileNone.NONE &&
            distanceToTile(cityTile, t) <= maxDistance &&
            t.Wonder === TileNone.NONE
        )) 
        {
            const specialistTiles = calculateDistrictYieldsFromCitizens(districtTile, cityTile);
            for (let i = 0; i < specialistTiles.length; i++) 
            {
                const specialistTile = specialistTiles[i];

                virtualTiles.push
                ({
                    ...specialistTile,
                    IsSpecialist: true
                });
            }
        }

        return virtualTiles;
    }

    const specialistTiles = getSpecialistVirtualTiles();

    // merge all candidate tiles
    const candidates = [...normalTiles, ...specialistTiles];

    if (candidates.length === 0) return [];

    function tileScore(t: TileType) 
    {
        const rawScore =
            (t.Food || 0) * weights.Food +
            (t.Production || 0) * weights.Production +
            (t.Gold || 0) * weights.Gold +
            (t.Science || 0) * weights.Science +
            (t.Culture || 0) * weights.Culture +
            (t.Faith || 0) * weights.Faith;

        // ignore zero yields
        const diversityCount = 
        [
            t.Food, t.Production, t.Gold, t.Science, t.Culture, t.Faith
        ].filter(v => (v || 0) > 0).length;

        // slight bonus for diverse yields
        const diversityBonus = 1 + (diversityCount - 1) * 0.05; // 5% per extra type beyond the first

        const diversityScore = rawScore * diversityBonus;

        // prioritize non-district tiles
        let totalScore = diversityScore;
        if (t.District === TileNone.NONE)
            totalScore = totalScore * 2;

        return totalScore;
    }

    /* Sorted in descending order */

    // food-first to avoid starvation
    const cityBaseFood = cityTile.Food || 0;
    // how much food we still need as city is always worked
    const requiredFood = Math.max(0, population - cityBaseFood);

    const sortedByFood = [...candidates].sort((a, b) => 
    {
        if (b.Food !== a.Food) 
            return b.Food - a.Food;

        if (b.Production !== a.Production) 
            return b.Production - a.Production;

        if (b.Gold !== a.Gold) 
            return b.Gold - a.Gold;

        // fallback to closer tiles
        return distanceToTile(cityTile, a) - distanceToTile(cityTile, b);
    });

    const chosen: TileTypeWithSpecialist[] = [];
    let foodSum = cityBaseFood;

    // add food-heavy tiles until no longer need a lot of food
    for (const t of sortedByFood) 
    {
        if (chosen.length >= slots) 
            break;

        if (foodSum >= requiredFood) 
            break;

        chosen.push(t);
        foodSum = foodSum + t.Food || 0;
    }

    // fill remaining slots by score
    const remainingSlots = slots - chosen.length;
    if (remainingSlots > 0) 
    {
        const chosenSet = new Set(chosen.map(t => `${t.X},${t.Y},${t.IsSpecialist}`));

        const pool = candidates
            .filter(t => !chosenSet.has(`${t.X},${t.Y},${t.IsSpecialist}`))
            .map(t => ({ tile: t, score: tileScore(t), dist: distanceToTile(cityTile, t) }));

        pool.sort((a, b) => 
        {
            if (b.score !== a.score) 
                return b.score - a.score;

            if (b.tile.Food !== a.tile.Food) 
                return b.tile.Food - a.tile.Food;

            if (b.tile.Production !== a.tile.Production) 
                return b.tile.Production - a.tile.Production;

            if (b.tile.Gold !== a.tile.Gold) 
                return b.tile.Gold - a.tile.Gold;

            return a.dist - b.dist;
        });

        for (let i = 0; i < Math.min(remainingSlots, pool.length); i++) 
        {
            chosen.push(pool[i].tile);
        }
    }

    // consistent sort for stability
    chosen.sort((a, b) => 
    {
        if ((b.Food || 0) !== (a.Food || 0)) 
            return (b.Food || 0) - (a.Food || 0);

        if ((b.Production || 0) !== (a.Production || 0)) 
            return (b.Production || 0) - (a.Production || 0);

        if ((b.Gold || 0) !== (a.Gold || 0)) 
            return (b.Gold || 0) - (a.Gold || 0);

        if (a.X !== b.X) 
            return a.X - b.X;

        return a.Y - b.Y;
    });

    return chosen.slice(0, slots);
}