import { TileType, LeaderName, TileNames } from "./types";

/*
Rules:
1) Account for civ specific stuff
2) Get max adjacency bonus
3) Avoid placing district on high tile yields or improved tiles, strategic, luxury, or bonus resources
4) Avoid tiles good for wonders
*/

/* SEPERATE ADJACENCY BONUSES FUNCTIONS INTO CLASS??? */

export abstract class Civilization
{
    protected leader: LeaderName; 
    constructor(theLeader: LeaderName) {this.leader = theLeader;};

    protected getOffsets(row: number): number[][]
    {
        const offsets = (row % 2 === 0) ? [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]] : [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]];

        return offsets;
    }

    /* ADJ BONUSES */

    protected getCampusBonuses(tile: TileType, ownedTiles: readonly TileType[]): number
    {
        let bonus = 0;

        const offset = this.getOffsets(tile.Y);
        offset.forEach(([dx, dy]) => 
        {
            const adjOddrX = tile.X + dx;
            const adjOddrY = tile.Y + dy;
            for (let i = 0; i < ownedTiles.length; i++)
            {
                const otherTile = ownedTiles[i];
                if (otherTile.X === adjOddrX && otherTile.Y === adjOddrY)
                {
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

    protected getTheaterBonuses(tile: TileType, ownedTiles: readonly TileType[]): number
    {

        
        return -1;
    }

    protected getIndustrialZoneBonuses(tile: TileType, ownedTiles: readonly TileType[]): number
    {

        
        return -1;
    }

    protected getHarborBonuses(tile: TileType, ownedTiles: readonly TileType[]): number
    {

        
        return -1;
    }

    protected getHolySiteBonuses(tile: TileType, ownedTiles: readonly TileType[]): number
    {

        
        return -1;
    }

    protected getCommercialHubBonuses(tile: TileType, ownedTiles: readonly TileType[]): number
    {

        
        return -1;
    }

    /* OPTIMAL TILE PLACEMENT */

    getCampusTile(ownedTiles: readonly TileType[]): number
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