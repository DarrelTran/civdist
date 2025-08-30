import { TileDistricts, TileYields, VictoryType } from "../types/types";

export const BASE_TILE_SIZE : number = 10;
export const MIN_ZOOM = 50;
export const MAX_ZOOM = 1000;
export const BACKEND_URL = 'https://localhost:8000';

export const TITLE_TEXT = "Civdist";
export const TITLE_CHAR_ANIM_TIME_MS = 500;
export const TITLE_CHAR_ANIM_DELAY_MS = 100;

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