import { TileDistricts } from "./types";

export const baseTileSize : number = 10;
export const allPossibleDistricts = () =>
{
    const allDistricts: TileDistricts[] = [];

    for (const dist of Object.values(TileDistricts)) 
    {
        allDistricts.push(dist);
    }

    return allDistricts;
}