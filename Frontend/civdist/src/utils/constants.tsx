import { TileDistricts, TileYields, VictoryType } from "../types/types";

export const baseTileSize : number = 10;
export const CIV_NAME_DEFAULT = "Select a civilization";
export const CITY_NAME_DEFAULT = "Select a city";

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