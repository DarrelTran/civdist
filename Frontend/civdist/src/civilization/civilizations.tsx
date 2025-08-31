import { TileType, TileNone, TileFeatures, TileTerrain, TileDistricts, TileNaturalWonders, TileImprovements, TilePantheons, TileYields, TileWonders, PossibleErrors, TileArtifactResources } from "../types/civTypes";
import { hasSeaResource, hasNaturalWonder, hasCampus, getCityPantheon, isLand, hasLuxuryResource, hasStrategicResource, isCoast, hasTheater, hasHolySite, hasCommercial, hasHarbor, hasIndustrial, hasEntertainment, hasAqueduct, hasSpaceport, hasEncampment, isMountainWonder, hasAerodrome, isValidAqueductTile, distanceToTile, getCityTile, isAdjacentToCityCenter, isAdjacentToLand } from "../utils/civ/civFunctions";
import { getOffsets, isFacingTargetHex, getMapOddrString } from "../utils/hex/genericHex";
import { BAD_SCORE, distanceThreshold, facingCityAngleThreshold, getMinDistanceToTargetCity, getNeighborhoodScoreFromAppeal, getScoreFromAddAppeal, getScoreFromAdj, getScoreFromAppeal, getScoreFromChokepoint, getScoreFromImprovements, getScoreFromRemoveAppeal, getScoreFromWonderPlacement, getScoreIfNearTargetCity, getTileSimilarAppeal, getTileSimilarResources, getTileSimilarTerrain, getTileSimilarYield, LOW_SCORE, MEDIUM_SCORE } from "./scoring";

export abstract class Civilization
{
    /* Helper methods - In class because there might be civ specific stuff for them and if so, should be overwritten. */

    protected replacementTileExists(tile: TileType, ownedTiles: readonly TileType[], yieldPreferences: readonly TileYields[]): boolean
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
    
    protected getEncampmentScore(tile: TileType, yieldPreferences: readonly TileYields[], mapCache: Map<string, TileType>, ownedTiles: readonly TileType[], wondersIncluded: Set<TileWonders> | null, preferredVictory: string): number
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

        const campusExists = hasCampus(ownedTiles);
        const theaterExists = hasTheater(ownedTiles);
        const holyExists = hasHolySite(ownedTiles);
        const industrialExists = hasIndustrial(ownedTiles);
        const harborExists = hasHarbor(ownedTiles);
        const aqueductExists = hasAqueduct(ownedTiles);
        const aerodromeExists = hasAerodrome(ownedTiles);
        const entertainmentExists = hasEntertainment(ownedTiles);
        const spaceportExists = hasSpaceport(ownedTiles);
        const encampmentExists = hasEncampment(ownedTiles);
        const commercialExists = hasCommercial(ownedTiles);

        offsets.forEach(([dx, dy]) => 
        {
            const oddrStr = getMapOddrString(tile.X + dx, tile.Y + dy);
            const adjTile = mapCache.get(oddrStr);
            if (!adjTile || (adjTile && !this.isFreeTile(adjTile, getCityTile(ownedTiles)))) return;

            const campusScore =             campusExists || !this.canPlaceCampus(tile, ownedTiles) ? 
                                            0 : this.getCampusScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const theaterScore =            theaterExists || !this.canPlaceTheater(tile, ownedTiles)? 
                                            0 : this.getTheaterScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const holySiteScore =           holyExists || !this.canPlaceHolySite(tile, ownedTiles) ? 
                                            0 : this.getHolySiteScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const industrialZoneScore =     industrialExists || !this.canPlaceIndustrialZone(tile, ownedTiles) ? 
                                            0 : this.getIndustrialZoneScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const commercialHubScore =      commercialExists || !this.canPlaceCommercialHub(tile, ownedTiles) ? 
                                            0 : this.getCommercialHubScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const harborScore =             harborExists || !this.canPlaceHarbor(tile, ownedTiles, mapCache) ? 
                                            0 : this.getHarborScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const neighborhoodScore =       this.getNeighborhoodScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const aqueductScore =           aqueductExists || !this.canPlaceAqueduct(tile, ownedTiles, mapCache) ? 
                                            0 : this.getAqueductScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const aerodromeScore =          aerodromeExists || !this.canPlaceAerodrome(tile, ownedTiles) ? 
                                            0 : this.getAerodromeScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, targetCity, preferredVictory);

            const entertainmentZoneScore =  entertainmentExists || !this.canPlaceEntertainmentZone(tile, ownedTiles) ? 
                                            0 : this.getEntertainmentZoneScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const spaceportScore =          spaceportExists || !this.canPlaceSpaceport(tile, ownedTiles) ? 
                                            0 : this.getSpaceportScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

            const encampmentScore =         encampmentExists || !this.canPlaceEncampment(tile, ownedTiles, mapCache, targetCity) ? 
                                            0 : this.getEncampmentScore(adjTile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory);

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
                encampmentScore >= LOW_SCORE ||
                adjTile.District !== TileNone.NONE
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
                if (adjCacheTile.IsCity)
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

    /* TILE PLACEMENT RESTRICTIONS */

    protected canPlaceCampus(tile: TileType, ownedTiles: readonly TileType[])
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile);
    }

    protected canPlaceTheater(tile: TileType, ownedTiles: readonly TileType[])
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile);
    }

    protected canPlaceCommercialHub(tile: TileType, ownedTiles: readonly TileType[])
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile);
    }

    protected canPlaceHarbor(tile: TileType, ownedTiles: readonly TileType[], mapCache: Map<string, TileType>)
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && (isCoast(tile) || tile.IsLake) && isAdjacentToLand(tile, mapCache);
    }

    protected canPlaceIndustrialZone(tile: TileType, ownedTiles: readonly TileType[])
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile);
    }

    protected canPlaceNeighborhood(tile: TileType, ownedTiles: readonly TileType[])
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile);
    }

    protected canPlaceAqueduct(tile: TileType, ownedTiles: readonly TileType[], mapCache: Map<string, TileType>)
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile) && isValidAqueductTile(tile, mapCache);
    }

    protected canPlaceHolySite(tile: TileType, ownedTiles: readonly TileType[])
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile);
    }

    protected canPlaceAerodrome(tile: TileType, ownedTiles: readonly TileType[])
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile);
    }

    protected canPlaceEntertainmentZone(tile: TileType, ownedTiles: readonly TileType[])
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile);
    }

    protected canPlaceSpaceport(tile: TileType, ownedTiles: readonly TileType[])
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile);
    }

    protected canPlaceEncampment(tile: TileType, ownedTiles: readonly TileType[], mapCache: Map<string, TileType>, targetCity: TileType)
    {
        return this.isFreeTile(tile, getCityTile(ownedTiles)) && isLand(tile) && !isAdjacentToCityCenter(tile, mapCache) && isFacingTargetHex(getCityTile(ownedTiles), targetCity, tile, facingCityAngleThreshold, distanceThreshold);
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
                if (this.canPlaceCampus(tile, ownedTiles))
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
                if (this.canPlaceHolySite(tile, ownedTiles))
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
                if (this.canPlaceCommercialHub(tile, ownedTiles))
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
                if (this.canPlaceHarbor(tile, ownedTiles, mapCache))
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
                if (this.canPlaceIndustrialZone(tile, ownedTiles))
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
                if (this.canPlaceAqueduct(tile, ownedTiles, mapCache))
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
                if (this.canPlaceAerodrome(tile, ownedTiles))
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
                if (this.canPlaceEntertainmentZone(tile, ownedTiles))
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
                if (this.canPlaceSpaceport(tile, ownedTiles))
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

        if (!hasEncampment(ownedTiles))
        {
            ownedTiles.forEach((tile) => 
            {
                if (this.canPlaceEncampment(tile, ownedTiles, mapCache, targetCity))
                {
                    let score = maxScore + this.getEncampmentScore(tile, yieldPreferences, mapCache, ownedTiles, wondersIncluded, preferredVictory) + 
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