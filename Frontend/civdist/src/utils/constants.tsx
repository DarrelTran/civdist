import { TileDistricts, TileYields, VictoryType } from "../types/types";

export const baseTileSize : number = 10;
export const minZoom = 50;
export const maxZoom = 300;

export const getAllPossibleDistricts = () =>
{
    const allDistricts: TileDistricts[] = [];

    for (const dist of Object.values(TileDistricts)) 
    {
        allDistricts.push(dist);
    }

    return allDistricts;
}
export const getAllPossibleYields = () =>
{
    const allYields: TileYields[] = [];

    for (const yields of Object.values(TileYields)) 
    {
        allYields.push(yields);
    }

    return allYields;
}
export const getAllPossibleVictoryTypes = () =>
{
    const allVict: VictoryType[] = [];

    for (const vicType of Object.values(VictoryType)) 
    {
        if (vicType !== VictoryType.NONE)
            allVict.push(vicType);
    }

    return allVict;
}