import { isAerodrome, isAqueduct, isCampus, isCityCenter, isCommercialHub, isEncampment, isEntertainmentComplex, isHarbor, isHolySite, isIndustrialZone, isNeighborhood, isSpaceport, isTheaterSquare } from "../utils/civFunctions";
import { TileType, TileNone, TileFeatures, TileTerrain, TileWonders, TileDistricts, TileUniqueDistricts, TileNaturalWonders, TerrainFeatureKey, HexType } from "../utils/types";

export function getNaturalWonder(tile: TileType, natWonderMap: Map<TileNaturalWonders, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.FeatureType === TileNaturalWonders.CLIFFS_OF_DOVER)             return {imgElement: natWonderMap.get(TileNaturalWonders.CLIFFS_OF_DOVER), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.MOUNT_LILIMANJARO)      return {imgElement: natWonderMap.get(TileNaturalWonders.MOUNT_LILIMANJARO), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.CRATER_LAKE)            return {imgElement: natWonderMap.get(TileNaturalWonders.CRATER_LAKE), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.DEAD_SEA)               return {imgElement: natWonderMap.get(TileNaturalWonders.DEAD_SEA), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.GALAPAGOS_ISLANDS)      return {imgElement: natWonderMap.get(TileNaturalWonders.GALAPAGOS_ISLANDS), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.PANTANAL)               return {imgElement: natWonderMap.get(TileNaturalWonders.PANTANAL), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.PIOPIOTAHI)             return {imgElement: natWonderMap.get(TileNaturalWonders.MOUNT_LILIMANJARO), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.TORRES_DEL_PAINE)       return {imgElement: natWonderMap.get(TileNaturalWonders.TORRES_DEL_PAINE), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.TSINGY_DE_BEMARAHA)     return {imgElement: natWonderMap.get(TileNaturalWonders.TSINGY_DE_BEMARAHA), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.YOSEMITE)               return {imgElement: natWonderMap.get(TileNaturalWonders.YOSEMITE), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.MOUNT_EVEREST)          return {imgElement: natWonderMap.get(TileNaturalWonders.MOUNT_EVEREST), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNaturalWonders.GREAT_BARRIER_REEF)     return {imgElement: natWonderMap.get(TileNaturalWonders.GREAT_BARRIER_REEF), scaleType: HexType.TERRAIN};

    return {imgElement: undefined, scaleType: -1};
}

export function getWonder(tile: TileType, wonderMap: Map<TileWonders, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.Wonder === TileWonders.ALHAMBRA)                     return {imgElement: wonderMap.get(TileWonders.ALHAMBRA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.BIG_BEN)                 return {imgElement: wonderMap.get(TileWonders.BIG_BEN), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.BOLSHOI_THEATRE)         return {imgElement: wonderMap.get(TileWonders.BOLSHOI_THEATRE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.BROADWAY)                return {imgElement: wonderMap.get(TileWonders.BROADWAY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.CHICHEN_ITZA)            return {imgElement: wonderMap.get(TileWonders.CHICHEN_ITZA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.COLOSSEUM)               return {imgElement: wonderMap.get(TileWonders.COLOSSEUM), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.COLOSSUS)                return {imgElement: wonderMap.get(TileWonders.COLOSSUS), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.CRISTO_REDENTOR)         return {imgElement: wonderMap.get(TileWonders.CRISTO_REDENTOR), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.EIFFEL_TOWER)            return {imgElement: wonderMap.get(TileWonders.EIFFEL_TOWER), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.ESTADIO_DO_MARACANA)     return {imgElement: wonderMap.get(TileWonders.ESTADIO_DO_MARACANA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.FORBIDDEN_CITY)          return {imgElement: wonderMap.get(TileWonders.FORBIDDEN_CITY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.GREAT_LIBRARY)           return {imgElement: wonderMap.get(TileWonders.GREAT_LIBRARY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.GREAT_LIGHTHOUSE)        return {imgElement: wonderMap.get(TileWonders.GREAT_LIGHTHOUSE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.GREAT_ZIMBABWE)          return {imgElement: wonderMap.get(TileWonders.GREAT_ZIMBABWE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.HAGIA_SOPHIA)            return {imgElement: wonderMap.get(TileWonders.HAGIA_SOPHIA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.HANGING_GARDENS)         return {imgElement: wonderMap.get(TileWonders.HANGING_GARDENS), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.HERMITAGE)               return {imgElement: wonderMap.get(TileWonders.HERMITAGE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.HUEY_TEOCALLI)           return {imgElement: wonderMap.get(TileWonders.HUEY_TEOCALLI), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.MAHABODHI_TEMPLE)        return {imgElement: wonderMap.get(TileWonders.MAHABODHI_TEMPLE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.MONT_ST_MICHEL)          return {imgElement: wonderMap.get(TileWonders.MONT_ST_MICHEL), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.ORACLE)                  return {imgElement: wonderMap.get(TileWonders.ORACLE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.OXFORD_UNIVERSITY)       return {imgElement: wonderMap.get(TileWonders.OXFORD_UNIVERSITY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.PETRA)                   return {imgElement: wonderMap.get(TileWonders.PETRA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.POTALA_PALACE)           return {imgElement: wonderMap.get(TileWonders.POTALA_PALACE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.PYRAMIDS)                return {imgElement: wonderMap.get(TileWonders.PYRAMIDS), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.RUHR_VALLEY)             return {imgElement: wonderMap.get(TileWonders.RUHR_VALLEY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.STONEHENGE)              return {imgElement: wonderMap.get(TileWonders.STONEHENGE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.SYDNEY_OPERA_HOUSE)      return {imgElement: wonderMap.get(TileWonders.SYDNEY_OPERA_HOUSE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.TERRACOTTA_ARMY)         return {imgElement: wonderMap.get(TileWonders.TERRACOTTA_ARMY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileWonders.VENETIAN_ARSENAL)        return {imgElement: wonderMap.get(TileWonders.VENETIAN_ARSENAL), scaleType: HexType.DISTRICT};

    return {imgElement: undefined, scaleType: -1};
}

export function getDistrict(tile: TileType, districtMap: Map<TileDistricts, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (isCityCenter(tile))                     return {imgElement: districtMap.get(TileDistricts.CENTER_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isCommercialHub(tile))             return {imgElement: districtMap.get(TileDistricts.COMMERCIAL_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isEncampment(tile))                return {imgElement: districtMap.get(TileDistricts.ENCAMPMENT_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isEntertainmentComplex(tile))      return {imgElement: districtMap.get(TileDistricts.ENTERTAINMENT_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isHarbor(tile))                    return {imgElement: districtMap.get(TileDistricts.HARBOR_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isHolySite(tile))                  return {imgElement: districtMap.get(TileDistricts.FAITH_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isTheaterSquare(tile))             return {imgElement: districtMap.get(TileDistricts.THEATER_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isIndustrialZone(tile))            return {imgElement: districtMap.get(TileDistricts.INDUSTRIAL_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isNeighborhood(tile))              return {imgElement: districtMap.get(TileDistricts.NEIGHBORHOOD_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isAqueduct(tile))                  return {imgElement: districtMap.get(TileDistricts.AQUEDUCT_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isSpaceport(tile))                 return {imgElement: districtMap.get(TileDistricts.ROCKET_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isAerodrome(tile))                 return {imgElement: districtMap.get(TileDistricts.AERODROME_DISTRICT), scaleType: HexType.DISTRICT};
    else if (isCampus(tile))                    return {imgElement: districtMap.get(TileDistricts.SCIENCE_DISTRICT), scaleType: HexType.DISTRICT};

    return {imgElement: undefined, scaleType: -1};
}

export function getTerrain(tile: TileType, terrainMap: Map<TerrainFeatureKey, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.TerrainType === TileTerrain.OCEAN && tile.FeatureType === TileFeatures.ICE)                        return {imgElement: terrainMap.get(`${TileTerrain.OCEAN}_${TileFeatures.ICE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.COAST && tile.FeatureType === TileFeatures.ICE)                   return {imgElement: terrainMap.get(`${TileTerrain.COAST}_${TileFeatures.ICE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.OCEAN)                                                            return {imgElement: terrainMap.get(`${TileTerrain.OCEAN}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.COAST)                                                            return {imgElement: terrainMap.get(`${TileTerrain.COAST}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.PLAINS && tile.FeatureType === TileFeatures.RAINFOREST)           return {imgElement: terrainMap.get(`${TileTerrain.PLAINS}_${TileFeatures.RAINFOREST}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.PLAINS && tile.FeatureType === TileFeatures.WOODS)                return {imgElement: terrainMap.get(`${TileTerrain.PLAINS}_${TileFeatures.WOODS}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.PLAINS)                                                           return {imgElement: terrainMap.get(`${TileTerrain.PLAINS}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.PLAINS_HILLS && tile.FeatureType === TileFeatures.RAINFOREST)     return {imgElement: terrainMap.get(`${TileTerrain.PLAINS_HILLS}_${TileFeatures.RAINFOREST}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.PLAINS_HILLS && tile.FeatureType === TileFeatures.WOODS)          return {imgElement: terrainMap.get(`${TileTerrain.PLAINS_HILLS}_${TileFeatures.WOODS}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.PLAINS_HILLS)                                                     return {imgElement: terrainMap.get(`${TileTerrain.PLAINS_HILLS}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.PLAINS_MOUNTAIN)                                                  return {imgElement: terrainMap.get(`${TileTerrain.PLAINS_MOUNTAIN}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.GRASSLAND && tile.FeatureType === TileFeatures.WOODS)             return {imgElement: terrainMap.get(`${TileTerrain.GRASSLAND}_${TileFeatures.WOODS}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.GRASSLAND && tile.FeatureType === TileFeatures.MARSH)             return {imgElement: terrainMap.get(`${TileTerrain.GRASSLAND}_${TileFeatures.MARSH}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.GRASSLAND)                                                        return {imgElement: terrainMap.get(`${TileTerrain.GRASSLAND}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.GRASSLAND_HILLS && tile.FeatureType === TileFeatures.WOODS)       return {imgElement: terrainMap.get(`${TileTerrain.GRASSLAND_HILLS}_${TileFeatures.WOODS}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.GRASSLAND_HILLS)                                                  return {imgElement: terrainMap.get(`${TileTerrain.GRASSLAND_HILLS}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.GRASSLAND_MOUNTAIN)                                               return {imgElement: terrainMap.get(`${TileTerrain.GRASSLAND_MOUNTAIN}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.DESERT && tile.FeatureType === TileFeatures.OASIS)                return {imgElement: terrainMap.get(`${TileTerrain.DESERT}_${TileFeatures.OASIS}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.DESERT && tile.FeatureType === TileFeatures.FLOODPLAINS)          return {imgElement: terrainMap.get(`${TileTerrain.DESERT}_${TileFeatures.FLOODPLAINS}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.DESERT)                                                           return {imgElement: terrainMap.get(`${TileTerrain.DESERT}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.DESERT_HILLS)                                                     return {imgElement: terrainMap.get(`${TileTerrain.DESERT_HILLS}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.DESERT_MOUNTAIN)                                                  return {imgElement: terrainMap.get(`${TileTerrain.DESERT_MOUNTAIN}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.TUNDRA && tile.FeatureType === TileFeatures.WOODS)                return {imgElement: terrainMap.get(`${TileTerrain.TUNDRA}_${TileFeatures.WOODS}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.TUNDRA)                                                           return {imgElement: terrainMap.get(`${TileTerrain.TUNDRA}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.TUNDRA_HILLS && tile.FeatureType === TileFeatures.WOODS)          return {imgElement: terrainMap.get(`${TileTerrain.TUNDRA_HILLS}_${TileFeatures.WOODS}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.TUNDRA_HILLS)                                                     return {imgElement: terrainMap.get(`${TileTerrain.TUNDRA_HILLS}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.TUNDRA_MOUNTAIN)                                                  return {imgElement: terrainMap.get(`${TileTerrain.TUNDRA_MOUNTAIN}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.SNOW)                                                             return {imgElement: terrainMap.get(`${TileTerrain.SNOW}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.SNOW_HILLS)                                                       return {imgElement: terrainMap.get(`${TileTerrain.SNOW_HILLS}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileTerrain.SNOW_MOUNTAIN)                                                    return {imgElement: terrainMap.get(`${TileTerrain.SNOW_MOUNTAIN}_${TileNone.NONE}`), scaleType: HexType.TERRAIN};

    return {imgElement: undefined, scaleType: -1};
}

/*
*/