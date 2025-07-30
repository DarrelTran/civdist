import { TileDistricts, TileYields } from "./types";

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
export const allPossibleYields = () =>
{
    const allYields: TileYields[] = [];

    for (const yields of Object.values(TileYields)) 
    {
        allYields.push(yields);
    }

    return allYields;
}