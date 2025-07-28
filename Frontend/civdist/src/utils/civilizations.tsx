import { TileType, LeaderName, TileNames } from "./types";

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
    if (tile.ResourceType === TileNames.CRABS || 
        tile.ResourceType === TileNames.FISH ||
        tile.ResourceType === TileNames.PEARLS ||
        tile.ResourceType === TileNames.WHALES
    )
        return true;
    
    return false;
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
                    if (otherTile.Wonder === TileNames.GREAT_BARRIER_REEF)
                        bonus = bonus + 2;
                    if (otherTile.IsMountain)
                        bonus = bonus + 1;
                    if (otherTile.FeatureType === TileNames.RAINFOREST || (otherTile.District !== "NONE" && otherTile.Wonder === "NONE")) // wonders are districts
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
                    if (otherTile.Wonder !== "NONE")
                        bonus = bonus + 1;
                    if (otherTile.District !== "NONE" && otherTile.Wonder === "NONE")
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
                    if (tile.ImprovementType === TileNames.MINE || tile.ImprovementType === TileNames.QUARRY)
                        bonus = bonus + 1;
                    if (otherTile.District !== "NONE" && otherTile.Wonder === "NONE")
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
                    if (otherTile.District === TileNames.CENTER_DISTRICT)
                        bonus = bonus + 2;
                    if (isSeaResource(otherTile))
                        bonus = bonus + 1;
                    if (otherTile.District !== "NONE" && otherTile.Wonder === "NONE")
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
                    if (otherTile.IsRiver || otherTile.District === TileNames.HARBOR_DISTRICT)
                        bonus = bonus + 2;
                    if (otherTile.District !== "NONE" && otherTile.Wonder === "NONE")
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
                    if (otherTile.Wonder !== "NONE")
                        bonus = bonus + 2;
                    if (
                        otherTile.IsMountain || 
                        (cityPanth === TileNames.DANCE_OF_THE_AURORA && (otherTile.TerrainType === TileNames.TUNDRA || otherTile.TerrainType === TileNames.TUNDRA_HILLS || otherTile.TerrainType === TileNames.TUNDRA_MOUNTAIN)) ||
                        (cityPanth === TileNames.DESERT_FOLKLORE && (otherTile.TerrainType === TileNames.DESERT || otherTile.TerrainType === TileNames.DESERT_HILLS || otherTile.TerrainType === TileNames.DESERT_MOUNTAIN)) ||
                        (cityPanth === TileNames.SACRED_PATH && otherTile.FeatureType === TileNames.RAINFOREST)
                       )
                        bonus = bonus + 1;
                    if ((otherTile.District !== "NONE" && otherTile.Wonder === "NONE") || otherTile.FeatureType === TileNames.WOODS)
                        bonus = bonus + 0.5;
                    break;
                }
            }
        })

        return bonus;
    }

    /* OPTIMAL TILE PLACEMENT */

    getCampusTile(ownedTiles: readonly TileType[]): number // TileType
    {


        return -1;
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