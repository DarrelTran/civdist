import { Civ6Names } from "./types";
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
        if (district === "Campus")                                                                      return Civ6Names.SCIENCE_DISTRICT;
        else if (district === "Theater" && empireName === "Greek Empire")                               return Civ6Names.ACROPOLIS_DISTRICT;
        else if (district === "Theater")                                                                return Civ6Names.THEATER_DISTRICT;
        else if (district === "Holy Site" && empireName === "Russian Empire")                           return Civ6Names.LAVRA_DISTRICT;
        else if (district === "Holy Site")                                                              return Civ6Names.FAITH_DISTRICT;
        else if (district === "Encampment")                                                             return Civ6Names.ENCAMPMENT_DISTRICT;
        else if (district === "Commercial Hub")                                                         return Civ6Names.COMMERCIAL_DISTRICT;
        else if (district === "Harbor" && empireName === "English Empire")                              return Civ6Names.ROYAL_NAVY_DOCKYARD_DISTRICT;
        else if (district === "Harbor")                                                                 return Civ6Names.HARBOR_DISTRICT;
        else if (district === "Industrial Zone" && empireName === "German Empire")                      return Civ6Names.HANSA_DISTRICT;
        else if (district === "Industrial Zone")                                                        return Civ6Names.INDUSTRIAL_DISTRICT;
        else if (district === "Entertainment Complex" && empireName === "Brazilian Empire")             return Civ6Names.STREET_CARNIVAL_DISTRICT;
        else if (district === "Entertainment Complex")                                                  return Civ6Names.ENTERTAINMENT_DISTRICT;
        else if (district === "Aqueduct" && empireName === "Roman Empire")                              return Civ6Names.BATH_DISTRICT;
        else if (district === "Aqueduct")                                                               return Civ6Names.AQUEDUCT_DISTRICT;
        else if (district === "Neighborhood" && empireName === "Empire of Kongo")                       return Civ6Names.MBANZA_DISTRICT;
        else if (district === "Neighborhood")                                                           return Civ6Names.NEIGHBORHOOD_DISTRICT;
        else if (district === "Aerodome")                                                               return Civ6Names.AERODOME_DISTRICT;
        else if (district === "Spaceport")                                                              return Civ6Names.ROCKET_DISTRICT;
    }

    return "NONE";
}