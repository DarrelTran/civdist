import { TileDistricts, TileUniqueDistricts, TileBuildings } from "./types"

/** Maps districts to their buildings. */
export const TileBuildingsList: Record<TileDistricts | TileUniqueDistricts, TileBuildings[]> = 
{
    [TileDistricts.AERODROME_DISTRICT]:                   [TileBuildings.HANGAR, TileBuildings.AIRPORT],
    [TileDistricts.AQUEDUCT_DISTRICT]:                    [],
    [TileUniqueDistricts.BATH_DISTRICT]:                  [],
    [TileDistricts.SCIENCE_DISTRICT]:                     [TileBuildings.LIBRARY, TileBuildings.UNIVERSITY, TileBuildings.RESEARCH_LAB],
    [TileDistricts.CENTER_DISTRICT]:                      [TileBuildings.PALACE, TileBuildings.MONUMENT, TileBuildings.GRANARY, TileBuildings.WATER_MILL, TileBuildings.ANCIENT_WALLS, TileBuildings.MEDIEVAL_WALLS, TileBuildings.RENAISSANCE_WALLS, TileBuildings.SEWER],
    [TileDistricts.COMMERCIAL_DISTRICT]:                  [TileBuildings.MARKET, TileBuildings.BANK, TileBuildings.STOCK_EXCHANGE],
    [TileDistricts.ENCAMPMENT_DISTRICT]:                  [TileBuildings.BARRACKS, TileBuildings.STABLE, TileBuildings.ARMORY, TileBuildings.MILITARY_ACADEMY],
    [TileDistricts.ENTERTAINMENT_DISTRICT]:               [TileBuildings.ARENA, TileBuildings.ZOO, TileBuildings.STADIUM],
    [TileUniqueDistricts.STREET_CARNIVAL_DISTRICT]:       [TileBuildings.ARENA, TileBuildings.ZOO, TileBuildings.STADIUM],
    [TileDistricts.HARBOR_DISTRICT]:                      [TileBuildings.LIGHTHOUSE, TileBuildings.SHIPYARD, TileBuildings.SEAPORT],
    [TileUniqueDistricts.ROYAL_NAVY_DOCKYARD_DISTRICT]:   [TileBuildings.LIGHTHOUSE, TileBuildings.SHIPYARD, TileBuildings.SEAPORT],
    [TileDistricts.FAITH_DISTRICT]:                       [TileBuildings.SHRINE, TileBuildings.TEMPLE],
    [TileUniqueDistricts.LAVRA_DISTRICT]:                 [TileBuildings.SHRINE, TileBuildings.TEMPLE],
    [TileDistricts.INDUSTRIAL_DISTRICT]:                  [TileBuildings.WORKSHOP, TileBuildings.FACTORY, TileBuildings.POWER_PLANT],
    [TileUniqueDistricts.HANSA_DISTRICT]:                 [TileBuildings.WORKSHOP, TileBuildings.FACTORY, TileBuildings.POWER_PLANT],
    [TileDistricts.NEIGHBORHOOD_DISTRICT]:                [],
    [TileUniqueDistricts.MBANZA_DISTRICT]:                [],
    [TileDistricts.ROCKET_DISTRICT]:                      [],
    [TileDistricts.THEATER_DISTRICT]:                     [TileBuildings.AMPHITHEATER, TileBuildings.ARCHAEOLOGICAL_MUSEUM, TileBuildings.MUSEUM_ART, TileBuildings.BROADCAST_CENTER],
    [TileUniqueDistricts.ACROPOLIS_DISTRICT]:             [TileBuildings.AMPHITHEATER, TileBuildings.ARCHAEOLOGICAL_MUSEUM, TileBuildings.MUSEUM_ART, TileBuildings.BROADCAST_CENTER],
}

/** Maps districts to buildings with citizen slots. */
export const TileBuildingsCitizenSlots: Record<TileDistricts | TileUniqueDistricts, TileBuildings[]> = 
{
    [TileDistricts.AERODROME_DISTRICT]:                   [],
    [TileDistricts.AQUEDUCT_DISTRICT]:                    [],
    [TileUniqueDistricts.BATH_DISTRICT]:                  [],
    [TileDistricts.SCIENCE_DISTRICT]:                     [TileBuildings.LIBRARY, TileBuildings.UNIVERSITY, TileBuildings.RESEARCH_LAB],
    [TileDistricts.CENTER_DISTRICT]:                      [TileBuildings.PALACE], // doesn't give citizen slot, but city center has worked citizen at all times
    [TileDistricts.COMMERCIAL_DISTRICT]:                  [TileBuildings.MARKET, TileBuildings.BANK, TileBuildings.STOCK_EXCHANGE],
    [TileDistricts.ENCAMPMENT_DISTRICT]:                  [TileBuildings.BARRACKS, TileBuildings.STABLE, TileBuildings.ARMORY, TileBuildings.MILITARY_ACADEMY],
    [TileDistricts.ENTERTAINMENT_DISTRICT]:               [],
    [TileUniqueDistricts.STREET_CARNIVAL_DISTRICT]:       [],
    [TileDistricts.HARBOR_DISTRICT]:                      [TileBuildings.LIGHTHOUSE, TileBuildings.SHIPYARD, TileBuildings.SEAPORT],
    [TileUniqueDistricts.ROYAL_NAVY_DOCKYARD_DISTRICT]:   [TileBuildings.LIGHTHOUSE, TileBuildings.SHIPYARD, TileBuildings.SEAPORT],
    [TileDistricts.FAITH_DISTRICT]:                       [TileBuildings.SHRINE, TileBuildings.TEMPLE],
    [TileUniqueDistricts.LAVRA_DISTRICT]:                 [TileBuildings.SHRINE, TileBuildings.TEMPLE],
    [TileDistricts.INDUSTRIAL_DISTRICT]:                  [TileBuildings.WORKSHOP, TileBuildings.FACTORY, TileBuildings.POWER_PLANT],
    [TileUniqueDistricts.HANSA_DISTRICT]:                 [TileBuildings.WORKSHOP, TileBuildings.FACTORY, TileBuildings.POWER_PLANT],
    [TileDistricts.NEIGHBORHOOD_DISTRICT]:                [],
    [TileUniqueDistricts.MBANZA_DISTRICT]:                [],
    [TileDistricts.ROCKET_DISTRICT]:                      [],
    [TileDistricts.THEATER_DISTRICT]:                     [TileBuildings.AMPHITHEATER, TileBuildings.ARCHAEOLOGICAL_MUSEUM, TileBuildings.MUSEUM_ART, TileBuildings.BROADCAST_CENTER],
    [TileUniqueDistricts.ACROPOLIS_DISTRICT]:             [TileBuildings.AMPHITHEATER, TileBuildings.ARCHAEOLOGICAL_MUSEUM, TileBuildings.MUSEUM_ART, TileBuildings.BROADCAST_CENTER],
}

/** Maps districts using TileDistricts as the key to the TileDistrict and any TileUniqueDistricts */
export const DistrictIdentifierRecord: Record<TileDistricts, (TileDistricts | TileUniqueDistricts)[]> = 
{
    [TileDistricts.AERODROME_DISTRICT]:                   [TileDistricts.AERODROME_DISTRICT],
    [TileDistricts.AQUEDUCT_DISTRICT]:                    [TileDistricts.AQUEDUCT_DISTRICT],
    [TileDistricts.SCIENCE_DISTRICT]:                     [TileDistricts.SCIENCE_DISTRICT],
    [TileDistricts.CENTER_DISTRICT]:                      [TileDistricts.CENTER_DISTRICT],
    [TileDistricts.COMMERCIAL_DISTRICT]:                  [TileDistricts.COMMERCIAL_DISTRICT],
    [TileDistricts.ENCAMPMENT_DISTRICT]:                  [TileDistricts.ENCAMPMENT_DISTRICT],
    [TileDistricts.ENTERTAINMENT_DISTRICT]:               [TileDistricts.ENTERTAINMENT_DISTRICT, TileUniqueDistricts.STREET_CARNIVAL_DISTRICT],
    [TileDistricts.HARBOR_DISTRICT]:                      [TileDistricts.HARBOR_DISTRICT, TileUniqueDistricts.ROYAL_NAVY_DOCKYARD_DISTRICT],
    [TileDistricts.FAITH_DISTRICT]:                       [TileDistricts.FAITH_DISTRICT, TileUniqueDistricts.LAVRA_DISTRICT],
    [TileDistricts.INDUSTRIAL_DISTRICT]:                  [TileDistricts.INDUSTRIAL_DISTRICT, TileUniqueDistricts.HANSA_DISTRICT],
    [TileDistricts.NEIGHBORHOOD_DISTRICT]:                [TileDistricts.NEIGHBORHOOD_DISTRICT, TileUniqueDistricts.MBANZA_DISTRICT],
    [TileDistricts.ROCKET_DISTRICT]:                      [TileDistricts.ROCKET_DISTRICT],
    [TileDistricts.THEATER_DISTRICT]:                     [TileDistricts.THEATER_DISTRICT, TileUniqueDistricts.ACROPOLIS_DISTRICT],
}