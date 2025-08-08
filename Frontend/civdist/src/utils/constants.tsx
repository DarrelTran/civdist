import { TileDistricts, TileYields, VictoryType } from "./types";

export const baseTileSize : number = 10;
export const CIV_NAME_DEFAULT = "Unknown Civilization";
export const CITY_NAME_DEFAULT = "Unknown City";

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
export const allPossibleVictoryTypes = () =>
{
    const allVict: VictoryType[] = [];

    for (const vicType of Object.values(VictoryType)) 
    {
        if (vicType !== VictoryType.NONE)
            allVict.push(vicType);
    }

    return allVict;
}