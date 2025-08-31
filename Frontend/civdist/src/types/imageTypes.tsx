import { TileFeatures, TileNone, TileTerrain, TileYields } from "./civTypes";

/** Format is: "TileTerrain_[TileFeatures | TileNone]" EXCLUDING the brackets */
export type TerrainFeatureKey = `${TileTerrain}_${TileFeatures | TileNone}`;

/** Format is: "TileYields_theYieldValue" */
export type YieldImagesKey = `${TileYields}_${number}`;

export enum MiscImages 
{
    CURRENT_CITY = 'Current City',
    ENEMY_CITY = 'Enemy City'
}