import { TileNames } from "./types";
import { allPossibleDistricts } from "./constants";

/**
 * Couldn't figure out a way to get the pretty text from the game into the map json
 * @param district The district name found through the dropdown.
 * @param EmpireName The civ empire name from the JSON. I.e - "German Empire"
 * @returns 
 */
export function uglifyDistrictNames(district: string, empireName: string)
{
    if (allPossibleDistricts.includes(district))
    {
        if (district === "Campus")                                                                      return TileNames.SCIENCE_DISTRICT;
        else if (district === "Theater" && empireName === "Greek Empire")                               return TileNames.ACROPOLIS_DISTRICT;
        else if (district === "Theater")                                                                return TileNames.THEATER_DISTRICT;
        else if (district === "Holy Site" && empireName === "Russian Empire")                           return TileNames.LAVRA_DISTRICT;
        else if (district === "Holy Site")                                                              return TileNames.FAITH_DISTRICT;
        else if (district === "Encampment")                                                             return TileNames.ENCAMPMENT_DISTRICT;
        else if (district === "Commercial Hub")                                                         return TileNames.COMMERCIAL_DISTRICT;
        else if (district === "Harbor" && empireName === "English Empire")                              return TileNames.ROYAL_NAVY_DOCKYARD_DISTRICT;
        else if (district === "Harbor")                                                                 return TileNames.HARBOR_DISTRICT;
        else if (district === "Industrial Zone" && empireName === "German Empire")                      return TileNames.HANSA_DISTRICT;
        else if (district === "Industrial Zone")                                                        return TileNames.INDUSTRIAL_DISTRICT;
        else if (district === "Entertainment Complex" && empireName === "Brazilian Empire")             return TileNames.STREET_CARNIVAL_DISTRICT;
        else if (district === "Entertainment Complex")                                                  return TileNames.ENTERTAINMENT_DISTRICT;
        else if (district === "Aqueduct" && empireName === "Roman Empire")                              return TileNames.BATH_DISTRICT;
        else if (district === "Aqueduct")                                                               return TileNames.AQUEDUCT_DISTRICT;
        else if (district === "Neighborhood" && empireName === "Empire of Kongo")                       return TileNames.MBANZA_DISTRICT;
        else if (district === "Neighborhood")                                                           return TileNames.NEIGHBORHOOD_DISTRICT;
        else if (district === "Aerodrome")                                                              return TileNames.AERODROME_DISTRICT;
        else if (district === "Spaceport")                                                              return TileNames.ROCKET_DISTRICT;
    }

    return "NONE";
}