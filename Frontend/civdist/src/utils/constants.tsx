import { Civilization } from "../civilization/civilizations";
import { TileDistricts, TileUniqueDistricts, TileYields, VictoryType } from "../types/civTypes";
import { CivilizationToUniqueDistrict } from "../types/typeMaps";

export const BASE_TILE_SIZE : number = 10;
export const MIN_ZOOM = 50;
export const MAX_ZOOM = 1000;
export const BACKEND_URL = 'https://localhost:8000';

export const TITLE_TEXT = "Civdist";
export const TITLE_CHAR_ANIM_TIME_MS = 500;
export const TITLE_CHAR_ANIM_DELAY_MS = 100;

export const getAllPossibleDistricts = (civObj: Civilization | null) =>
{
    const allDistricts: (TileDistricts | TileUniqueDistricts)[] = [];

    for (const dist of Object.values(TileDistricts)) 
    {
        if (dist !== TileDistricts.CENTER_DISTRICT)
        {
            if (civObj)
            {
                const uniqueDistrTuple = CivilizationToUniqueDistrict[civObj.constructor.name];
                
                if (uniqueDistrTuple)
                {
                    const districtIdentifier = uniqueDistrTuple[0];
                    const uniqueDistrict = uniqueDistrTuple[1];

                    if (dist === districtIdentifier) // this failing means just need to find district at appropriate spot - a unique one does exist
                        allDistricts.push(uniqueDistrict);
                    else
                        allDistricts.push(dist);
                }
                else // civ exists, but no unique = fallback
                {
                    allDistricts.push(dist);
                }
            }
            else // no civ = fallback to defaults
            {
                allDistricts.push(dist);
            }
        }
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