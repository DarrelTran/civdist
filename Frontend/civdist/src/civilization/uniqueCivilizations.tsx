import { TileType, TileNone, TileFeatures, TileTerrain, TileDistricts, TileNaturalWonders, TileImprovements, TilePantheons, TileYields, TileWonders, PossibleErrors, TileArtifactResources, TileUniqueDistricts, LeaderName } from "../types/civTypes";
import { hasSeaResource, hasNaturalWonder, getCityPantheon, isLand, isWater, hasBonusResource, hasLuxuryResource, hasStrategicResource, hasTheater, hasHolySite, isMountainWonder, distanceToTile, getCityTile, isCommercialHub, isOnForeignContinent, isHolySite } from "../utils/civ/civFunctions";
import { getMapOddrString, getOffsets } from "../utils/hex/genericHex";
import { Civilization } from "./civilizations";
import { getMinDistanceToTargetCity, getNeighborhoodScoreFromAppeal, getScoreFromAddAppeal, getScoreFromAdj, getScoreFromAppeal, getScoreFromChokepoint, getScoreFromImprovements, getScoreFromRemoveAppeal, getScoreFromWonderPlacement, getScoreIfNearTargetCity, LOW_SCORE } from "./scoring";

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
    /**
     * A tile that has no district, wonder, is not mountainous, is not a natural wonder, is not a luxury or strategic resource, and is not an oasis. Can be overwritten.
     * @param tile 
     */
    override isFreeTile(tile: TileType, cityTile: TileType): boolean
    {
        if (
            (tile.IsMountain || isMountainWonder(tile)) || 
            tile.District !== TileNone.NONE || 
            tile.Wonder !== TileNone.NONE || 
            hasNaturalWonder(tile.FeatureType) || 
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

    protected getScoreFromRiverProductionBonus(tile: TileType)
    {
        if (tile.IsRiver)
            return LOW_SCORE; 

        return 0; // river production bonus is just a nice-to-have, not a mandatory bonus
    }

    override getCampusScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        // don't include getScoreFromPossibleAdjacentDistricts() because only care about current tile

        return  getScoreFromAdj(this.getCampusAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) + 
                this.getScoreFromRiverProductionBonus(tile);
    }
    
    override getTheaterScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        const appealTolerance = 6;

        return  getScoreFromAddAppeal(tile, mapCache, appealTolerance) +
                getScoreFromAdj(this.getTheaterAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) + 
                this.getScoreFromRiverProductionBonus(tile);
    }

    override getHolySiteScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        const appealTolerance = 6;

        return  getScoreFromAddAppeal(tile, mapCache, appealTolerance) +  
                getScoreFromAdj(this.getHolySiteAdj(tile, ownedTiles, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) + 
                this.getScoreFromRiverProductionBonus(tile);
    }

    override getCommercialHubScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  getScoreFromAdj(this.getCommercialHubAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) + 
                this.getScoreFromRiverProductionBonus(tile);
    }

    override getHarborScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  getScoreFromAdj(this.getHarborAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) + 
                this.getScoreFromRiverProductionBonus(tile);
    }

    override getIndustrialZoneScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  getScoreFromAdj(this.getIndustrialZoneAdj(tile, mapCache)) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) +
                getScoreFromRemoveAppeal(tile, mapCache) + 
                this.getScoreFromRiverProductionBonus(tile);
    }

    override getNeighborhoodScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  getNeighborhoodScoreFromAppeal(tile.Appeal) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
                this.getScoreFromRiverProductionBonus(tile);
    }

    override getAqueductScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) + 
                this.getScoreFromRiverProductionBonus(tile);
    }

    override getAerodromeScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): number
    {
        const minDist = getMinDistanceToTargetCity(targetCity, ownedTiles);

        return  this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) +
                getScoreIfNearTargetCity(tile, targetCity, minDist) +
                getScoreFromRemoveAppeal(tile, mapCache) + 
                this.getScoreFromRiverProductionBonus(tile);
    }

    override getEntertainmentZoneScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        const appealTolerance = 6;

        return  getScoreFromAddAppeal(tile, mapCache, appealTolerance) +
                this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal)+ 
                this.getScoreFromRiverProductionBonus(tile);
    }

    override getSpaceportScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        return  this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) +
                getScoreFromRemoveAppeal(tile, mapCache)+ 
                this.getScoreFromRiverProductionBonus(tile);
    }  
    
    override getEncampmentScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
    {
        const impassableThreshold = 1;
        const hindersThreshold = 1;

        return  this.getScoreFromReplacability(tile, yieldPreferences, ownedTiles) + 
                getScoreFromImprovements(tile, mapCache) + 
                getScoreFromWonderPlacement(tile, mapCache, ownedTiles, wondersIncluded, preferredVictory) +
                getScoreFromAppeal(tile.Appeal) + 
                getScoreFromChokepoint(tile, mapCache, impassableThreshold, hindersThreshold) +
                getScoreFromRemoveAppeal(tile, mapCache)+ 
                this.getScoreFromRiverProductionBonus(tile);
    }
}

export class England extends Civilization
{
    override getHarborAdj(tile: TileType, mapCache: Map<string, TileType>): number
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
                if (adjCacheTile.IsCity)
                    bonus = bonus + 2;
                if (hasSeaResource(adjCacheTile))
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 1;
            }
        })

        if (isOnForeignContinent(tile, mapCache))
            bonus = bonus + 2;

        return bonus;
    }

    override getHarborTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        try
        {
            const theTile = super.getHarborTile(ownedTiles, yieldPreferences, mapCache, wondersIncluded, targetCity, preferredVictory);
            
            if (theTile)
            {
                theTile.District = TileUniqueDistricts.ROYAL_NAVY_DOCKYARD_DISTRICT;
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

export class France extends Civilization
{
    
}

export class Germany extends Civilization
{
    override getIndustrialZoneAdj(tile: TileType, mapCache: Map<string, TileType>): number
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
                if (isCommercialHub(adjCacheTile.District))
                    bonus = bonus + 2;
                if (adjCacheTile.ResourceType !== TileNone.NONE)
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }

    override getIndustrialZoneTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        try
        {
            const theTile = super.getIndustrialZoneTile(ownedTiles, yieldPreferences, mapCache, wondersIncluded, targetCity, preferredVictory);
            
            if (theTile)
            {
                theTile.District = TileUniqueDistricts.HANSA_DISTRICT;
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

export class Greece extends Civilization
{
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
                if (adjCacheTile.Wonder !== TileNone.NONE || (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE) || tile.IsCity)
                    bonus = bonus + 1;
            }
        })

        return bonus;
    }

    protected override canPlaceTheater(tile: TileType, ownedTiles: readonly TileType[]): boolean 
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile) && tile.IsHills;
    }

    override getTheaterTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        if (!hasTheater(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.canPlaceTheater(tile, ownedTiles))
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
            returnedTile.District = TileUniqueDistricts.ACROPOLIS_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }
}

export class India extends Civilization
{
    
}

export class Japan extends Civilization
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
                if ((adjCacheTile.IsMountain || isMountainWonder(adjCacheTile)))
                    bonus = bonus + 1;
                if (adjCacheTile.FeatureType === TileFeatures.RAINFOREST || (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)) // wonders are districts
                    bonus = bonus + 1;
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
                if (adjCacheTile.Wonder !== TileNone.NONE)
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 1;
            }
        })

        return bonus;
    }

    override getIndustrialZoneAdj(tile: TileType, mapCache: Map<string, TileType>): number
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
                    bonus = bonus + 1;
            }
        })

        return bonus;
    }

    override getHarborAdj(tile: TileType, mapCache: Map<string, TileType>): number
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
                if (adjCacheTile.IsCity)
                    bonus = bonus + 2;
                if (hasSeaResource(adjCacheTile))
                    bonus = bonus + 1;
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 1;
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
                if (adjCacheTile.District !== TileNone.NONE && adjCacheTile.Wonder === TileNone.NONE)
                    bonus = bonus + 1;
            }
        })

        // bonus only counts once
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
                    (cityPanth === TilePantheons.DANCE_OF_THE_AURORA && (adjCacheTile.TerrainType === TileTerrain.TUNDRA || adjCacheTile.TerrainType === TileTerrain.TUNDRA_HILLS || adjCacheTile.TerrainType === TileTerrain.TUNDRA_MOUNTAIN)) ||
                    (cityPanth === TilePantheons.DESERT_FOLKLORE && (adjCacheTile.TerrainType === TileTerrain.DESERT || adjCacheTile.TerrainType === TileTerrain.DESERT_HILLS || adjCacheTile.TerrainType === TileTerrain.DESERT_MOUNTAIN)) ||
                    (cityPanth === TilePantheons.SACRED_PATH && adjCacheTile.FeatureType === TileFeatures.RAINFOREST)
                    )
                    bonus = bonus + 1;
                if ((adjCacheTile.District !== "NONE" && adjCacheTile.Wonder === "NONE") || adjCacheTile.FeatureType === TileFeatures.WOODS)
                    bonus = bonus + 1;
            }
        })

        return bonus;
    }
}

export class Kongo extends Civilization
{
    protected override canPlaceNeighborhood(tile: TileType, ownedTiles: readonly TileType[]): boolean 
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile) && (tile.FeatureType === TileFeatures.WOODS || tile.FeatureType === TileFeatures.RAINFOREST);
    }

    override getNeighborhoodTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined;

        ownedTiles.forEach((tile) => 
        {
            if (this.canPlaceNeighborhood(tile, ownedTiles))
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
            returnedTile.District = TileUniqueDistricts.MBANZA_DISTRICT;
            return returnedTile;
        }
        else
        {
            throw new Error(PossibleErrors.FAILED_TO_FIND_TILE);
        }
    }
}

export class Russia extends Civilization
{
    override getHolySiteTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        try
        {
            const theTile = super.getHolySiteTile(ownedTiles, yieldPreferences, mapCache, wondersIncluded, targetCity, preferredVictory);
            
            if (theTile)
            {
                theTile.District = TileUniqueDistricts.LAVRA_DISTRICT;
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
    /**
     * Removes production from worked tiles such that updateCityTilesWithProduction can be easily used after. Should be called before allocateCitizensAuto (if also called). Will check if a holy site exists.
     * @param ownedTiles 
     */
    removeProductionFromWorkedTiles(ownedTiles: TileType[])
    {
        if (!hasHolySite(ownedTiles))
            return;

        ownedTiles.forEach((tile) =>
        {
            if (tile.IsWorked)
                tile.Production = tile.Production - 1;
        })
    }

    /**
     * Assumes that all Holy Site buildings are or will be built. Should be called after allocateCitizensAuto (if also called).
     * @param addedDistrictTile 
     * @param ownedTiles 
     * @param mapCache 
     */
    updateCityTilesWithProduction(addedDistrictTile: TileType, ownedTiles: TileType[], mapCache: Map<string, TileType>)
    {
        if (!isHolySite(addedDistrictTile.District))
            return;

        ownedTiles.forEach((tile) => 
        {
            const validForStaveProduction = isWater(tile) && (hasBonusResource(tile) || hasLuxuryResource(tile) || tile.ResourceType === TileArtifactResources.SHIPWRECK);

            if (validForStaveProduction)
                tile.Production = tile.Production + 1;

            const oddr = getMapOddrString(tile.X, tile.Y);
            const mapTile = mapCache.get(oddr);
            if (mapTile)
            {
                mapTile.Production = mapTile.Production + 1;
                mapCache.set(oddr, mapTile);
            }
        })
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
                    (cityPanth === TilePantheons.DANCE_OF_THE_AURORA && (adjCacheTile.TerrainType === TileTerrain.TUNDRA || adjCacheTile.TerrainType === TileTerrain.TUNDRA_HILLS || adjCacheTile.TerrainType === TileTerrain.TUNDRA_MOUNTAIN)) ||
                    (cityPanth === TilePantheons.DESERT_FOLKLORE && (adjCacheTile.TerrainType === TileTerrain.DESERT || adjCacheTile.TerrainType === TileTerrain.DESERT_HILLS || adjCacheTile.TerrainType === TileTerrain.DESERT_MOUNTAIN)) ||
                    (cityPanth === TilePantheons.SACRED_PATH && adjCacheTile.FeatureType === TileFeatures.RAINFOREST) ||
                    adjCacheTile.FeatureType === TileFeatures.WOODS // assume the stave church will be built
                    )
                    bonus = bonus + 1;
                if ((adjCacheTile.District !== "NONE" && adjCacheTile.Wonder === "NONE") || adjCacheTile.FeatureType === TileFeatures.WOODS)
                    bonus = bonus + 0.5;
            }
        })

        return bonus;
    }
}

export class Rome extends Civilization
{
    override getAqueductTile(ownedTiles: readonly TileType[], yieldPreferences: TileYields[], mapCache: Map<string, TileType>, wondersIncluded: Set<TileWonders> | null, targetCity: TileType, preferredVictory: string): TileType | undefined
    {
        try
        {
            const theTile = super.getAqueductTile(ownedTiles, yieldPreferences, mapCache, wondersIncluded, targetCity, preferredVictory);
            
            if (theTile)
            {
                theTile.District = TileUniqueDistricts.BATH_DISTRICT;
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

export function getCivilizationObject(leaderName: LeaderName | null): Civilization | null
{
    let theCiv: Civilization | null = null;

    if (leaderName)
    {
        const FoundCiv = CivRegistry[leaderName];
        if (FoundCiv)
            return new FoundCiv();
    }

    return theCiv;
}   