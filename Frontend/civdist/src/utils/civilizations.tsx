import { TileType, LeaderName, TileNone, TileFeatures, TileTerrain, TileWonders, TileDistricts, TileUniqueDistricts, TileNaturalWonders, TileBonusResources, TileLuxuryResources, TileImprovements, TileStrategicResources, TilePantheons } from "./types";

/*
Rules:
1) Account for civ specific stuff
2) Get max adjacency bonus
3) Account for building bonuses to tiles or city (like factory) or stuff that removes appeal
3) Avoid placing district on high tile yields or improved tiles, strategic, luxury, or bonus resources
4) Avoid tiles good for wonders
*/

/* SEPERATE ADJACENCY BONUSES FUNCTIONS INTO CLASS??? */

// change?????????????????
const goodScore = 5;
const mediumScore = 3;
const lowScore = 1;
const badScore = -2;

function getOffsets(row: number): number[][]
{
    const offsets = (row % 2 === 0) ? [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]] : [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]];

    return offsets;
}

function isSeaResource(tile: TileType): boolean
{
    if (tile.ResourceType === TileBonusResources.CRABS || 
        tile.ResourceType === TileBonusResources.FISH ||
        tile.ResourceType === TileLuxuryResources.PEARLS ||
        tile.ResourceType === TileLuxuryResources.WHALES
    )
        return true;
    
    return false;
}

/**
 * A tile that has no district, wonder, and is not mountainous.
 * @param tile 
 */
function isFreeTile(tile: TileType): boolean
{
    if (tile.IsMountain || tile.District !== TileNone.NONE || tile.Wonder !== TileNone.NONE )
        return false;

    return true;
}

function getScoreFromAdj(adj: number): number
{
    if (adj >= 5) // 5 or more
        return goodScore;
    else if (adj > 1 && adj < 5) // 1.5 - 4.5
        return mediumScore;
    else if (adj > 0 && adj <= 1) // 0.5 - 1
        return lowScore;
    else
        return badScore;
}

export abstract class Civilization
{
    protected leader: LeaderName; 
    constructor(theLeader: LeaderName) {this.leader = theLeader;};

    /* ADJ BONUSES */

    protected getCampusAdj(tile: TileType, ownedTiles: readonly TileType[]): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;
            for (let i = 0; i < ownedTiles.length; i++)
            {
                const otherTile = ownedTiles[i];
                if (otherTile.X === adjOddrX && otherTile.Y === adjOddrY)
                {
                    if (otherTile.Wonder === TileNaturalWonders.GREAT_BARRIER_REEF)
                        bonus = bonus + 2;
                    if (otherTile.IsMountain)
                        bonus = bonus + 1;
                    if (otherTile.FeatureType === TileFeatures.RAINFOREST || (otherTile.District !== TileNone.NONE && otherTile.Wonder === TileNone.NONE)) // wonders are districts
                        bonus = bonus + 0.5;

                    break;
                }
            }
        })

        return bonus;
    }

    protected getTheaterAdj(tile: TileType, ownedTiles: readonly TileType[]): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;
            for (let i = 0; i < ownedTiles.length; i++)
            {
                const otherTile = ownedTiles[i];
                if (otherTile.X === adjOddrX && otherTile.Y === adjOddrY)
                {
                    if (otherTile.Wonder !== TileNone.NONE)
                        bonus = bonus + 1;
                    if (otherTile.District !== TileNone.NONE && otherTile.Wonder === TileNone.NONE)
                        bonus = bonus + 0.5;

                    break;
                }
            }
        })

        return bonus;
    }

    protected getIndustrialZoneAdj(tile: TileType, ownedTiles: readonly TileType[]): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;
            for (let i = 0; i < ownedTiles.length; i++)
            {
                const otherTile = ownedTiles[i];
                if (otherTile.X === adjOddrX && otherTile.Y === adjOddrY)
                {
                    if (tile.ImprovementType === TileImprovements.MINE || tile.ImprovementType === TileImprovements.QUARRY)
                        bonus = bonus + 1;
                    if (otherTile.District !== TileNone.NONE && otherTile.Wonder === TileNone.NONE)
                        bonus = bonus + 0.5;

                    break;
                }
            }
        })

        return bonus;
    }

    protected getHarborAdj(tile: TileType, ownedTiles: readonly TileType[]): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;
            for (let i = 0; i < ownedTiles.length; i++)
            {
                const otherTile = ownedTiles[i];
                if (otherTile.X === adjOddrX && otherTile.Y === adjOddrY)
                {
                    if (otherTile.District === TileDistricts.CENTER_DISTRICT)
                        bonus = bonus + 2;
                    if (isSeaResource(otherTile))
                        bonus = bonus + 1;
                    if (otherTile.District !== TileNone.NONE && otherTile.Wonder === TileNone.NONE)
                        bonus = bonus + 0.5;
                    
                    break;
                }
            }
        })

        return bonus;
    }

    protected getCommercialHubAdj(tile: TileType, ownedTiles: readonly TileType[]): number
    {
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;
            for (let i = 0; i < ownedTiles.length; i++)
            {
                const otherTile = ownedTiles[i];
                if (otherTile.X === adjOddrX && otherTile.Y === adjOddrY)
                {
                    if (otherTile.IsRiver || otherTile.District === TileDistricts.HARBOR_DISTRICT)
                        bonus = bonus + 2;
                    if (otherTile.District !== TileNone.NONE && otherTile.Wonder === TileNone.NONE)
                        bonus = bonus + 0.5;
                    
                    break;
                }
            }
        })

        return bonus;
    }

    protected getHolySiteAdj(tile: TileType, ownedTiles: readonly TileType[]): number
    {
        let cityPanth = "NONE";
        for (let i = 0; i < ownedTiles.length; i++)
        {
            const theTile = ownedTiles[i];
            if (theTile.IsCity)
            {
                cityPanth = theTile.CityPantheon;
                break;
            }
        }
        
        let bonus = 0;

        const offset = getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;
            for (let i = 0; i < ownedTiles.length; i++)
            {
                const otherTile = ownedTiles[i];
                if (otherTile.X === adjOddrX && otherTile.Y === adjOddrY)
                {
                    if (otherTile.Wonder !== TileNone.NONE)
                        bonus = bonus + 2;
                    if (
                        otherTile.IsMountain || 
                        (cityPanth === TilePantheons.DANCE_OF_THE_AURORA && (otherTile.TerrainType === TileTerrain.TUNDRA || otherTile.TerrainType === TileTerrain.TUNDRA_HILLS || otherTile.TerrainType === TileTerrain.TUNDRA_MOUNTAIN)) ||
                        (cityPanth === TilePantheons.DESERT_FOLKLORE && (otherTile.TerrainType === TileTerrain.DESERT || otherTile.TerrainType === TileTerrain.DESERT_HILLS || otherTile.TerrainType === TileTerrain.DESERT_MOUNTAIN)) ||
                        (cityPanth === TilePantheons.SACRED_PATH && otherTile.FeatureType === TileFeatures.RAINFOREST)
                       )
                        bonus = bonus + 1;
                    if ((otherTile.District !== "NONE" && otherTile.Wonder === "NONE") || otherTile.FeatureType === TileFeatures.WOODS)
                        bonus = bonus + 0.5;
                    break;
                }
            }
        })

        return bonus;
    }

    /* OPTIMAL TILE PLACEMENT */

    getCampusTile(ownedTiles: readonly TileType[]): TileType | undefined
    {
        let maxScore = 0;
        let returnedTile = undefined as TileType | undefined; // wtf???

        ownedTiles.forEach((tile) => 
        {
            if (isFreeTile(tile))
            {
                let score = getScoreFromAdj(this.getCampusAdj(tile, ownedTiles));
                if (score > maxScore)
                {
                    maxScore = score;
                    returnedTile = tile;
                }
            }
        })

        if (returnedTile)
            returnedTile.District = TileDistricts.SCIENCE_DISTRICT;

        return returnedTile;
    }

    getTheaterTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }

    getHolySiteTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }   

    getCommercialHubTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }

    getHarborTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }

    getIndustrialZoneTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }   

    getNeighborhoodTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }
    
    getAqueductTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }

    getAerodromeTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }

    getEntertainmentZoneTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }

    getSpaceportTile(ownedTiles: readonly TileType[]): number
    {


        return -1;
    }
}

/* America, Arabia, Brazil, China, Egypt, England, France, Germany, Greece, India, Japan, Kongo, Russia, Scythia, Sumeria, Spain, Norway, Rome, Aztec */

export class America extends Civilization
{
    constructor(theLeader: LeaderName.TEDDY_ROOSEVELT)
    {
        super(theLeader);
    }
}