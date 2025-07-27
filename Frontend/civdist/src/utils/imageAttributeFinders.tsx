import { TileType, ImageNaturalWondersType, ImageTerrainType, ImageWondersType, ImageDistrictType, TileNames, HexType } from "./types";

export function getNaturalWonder(tile: TileType, natWonderMap: Map<ImageNaturalWondersType, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.FeatureType === TileNames.CLIFFS_OF_DOVER)             return {imgElement: natWonderMap.get(ImageNaturalWondersType.CLIFFS_OF_DOVER), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.MOUNT_LILIMANJARO)      return {imgElement: natWonderMap.get(ImageNaturalWondersType.MOUNT_LILIMANJARO), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.CRATER_LAKE)            return {imgElement: natWonderMap.get(ImageNaturalWondersType.CRATER_LAKE), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.DEAD_SEA)               return {imgElement: natWonderMap.get(ImageNaturalWondersType.DEAD_SEA), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.GALAPAGOS_ISLANDS)      return {imgElement: natWonderMap.get(ImageNaturalWondersType.GALAPAGOS_ISLANDS), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.PANTANAL)               return {imgElement: natWonderMap.get(ImageNaturalWondersType.PANTANAL), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.PIOPIOTAHI)             return {imgElement: natWonderMap.get(ImageNaturalWondersType.MOUNT_LILIMANJARO), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.TORRES_DEL_PAINE)       return {imgElement: natWonderMap.get(ImageNaturalWondersType.TORRES_DEL_PAINE), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.TSINGY_DE_BEMARAHA)     return {imgElement: natWonderMap.get(ImageNaturalWondersType.TSINGY_DE_BEMARAHA), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.YOSEMITE)               return {imgElement: natWonderMap.get(ImageNaturalWondersType.YOSEMITE), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.MOUNT_EVEREST)          return {imgElement: natWonderMap.get(ImageNaturalWondersType.MOUNT_EVEREST), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === TileNames.GREAT_BARRIER_REEF)     return {imgElement: natWonderMap.get(ImageNaturalWondersType.GREAT_BARRIER_REEF), scaleType: HexType.TERRAIN};

    return {imgElement: undefined, scaleType: -1};
}

export function getWonder(tile: TileType, wonderMap: Map<ImageWondersType, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.Wonder === TileNames.ALHAMBRA)                     return {imgElement: wonderMap.get(ImageWondersType.ALHAMBRA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.BIG_BEN)                 return {imgElement: wonderMap.get(ImageWondersType.BIG_BEN), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.BOLSHOI_THEATRE)         return {imgElement: wonderMap.get(ImageWondersType.BOLSHOI_THEATRE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.BROADWAY)                return {imgElement: wonderMap.get(ImageWondersType.BROADWAY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.CHICHEN_ITZA)            return {imgElement: wonderMap.get(ImageWondersType.CHICHEN_ITZA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.COLOSSEUM)               return {imgElement: wonderMap.get(ImageWondersType.COLOSSEUM), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.COLOSSUS)                return {imgElement: wonderMap.get(ImageWondersType.COLOSSUS), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.CRISTO_REDENTOR)         return {imgElement: wonderMap.get(ImageWondersType.CRISTO_REDENTOR), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.EIFFEL_TOWER)            return {imgElement: wonderMap.get(ImageWondersType.EIFFEL_TOWER), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.ESTADIO_DO_MARACANA)     return {imgElement: wonderMap.get(ImageWondersType.ESTADIO_DO_MARACANA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.FORBIDDEN_CITY)          return {imgElement: wonderMap.get(ImageWondersType.FORBIDDEN_CITY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.GREAT_LIBRARY)           return {imgElement: wonderMap.get(ImageWondersType.GREAT_LIBRARY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.GREAT_LIGHTHOUSE)        return {imgElement: wonderMap.get(ImageWondersType.GREAT_LIGHTHOUSE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.GREAT_ZIMBABWE)          return {imgElement: wonderMap.get(ImageWondersType.GREAT_ZIMBABWE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.HAGIA_SOPHIA)            return {imgElement: wonderMap.get(ImageWondersType.HAGIA_SOPHIA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.HANGING_GARDENS)         return {imgElement: wonderMap.get(ImageWondersType.HANGING_GARDENS), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.HERMITAGE)               return {imgElement: wonderMap.get(ImageWondersType.HERMITAGE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.HUEY_TEOCALLI)           return {imgElement: wonderMap.get(ImageWondersType.HUEY_TEOCALLI), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.MAHABODHI_TEMPLE)        return {imgElement: wonderMap.get(ImageWondersType.MAHABODHI_TEMPLE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.MONT_ST_MICHEL)          return {imgElement: wonderMap.get(ImageWondersType.MONT_ST_MICHEL), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.ORACLE)                  return {imgElement: wonderMap.get(ImageWondersType.ORACLE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.OXFORD_UNIVERSITY)       return {imgElement: wonderMap.get(ImageWondersType.OXFORD_UNIVERSITY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.PETRA)                   return {imgElement: wonderMap.get(ImageWondersType.PETRA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.POTALA_PALACE)           return {imgElement: wonderMap.get(ImageWondersType.POTALA_PALACE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.PYRAMIDS)                return {imgElement: wonderMap.get(ImageWondersType.PYRAMIDS), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.RUHR_VALLEY)             return {imgElement: wonderMap.get(ImageWondersType.RUHR_VALLEY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.STONEHENGE)              return {imgElement: wonderMap.get(ImageWondersType.STONEHENGE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.SYDNEY_OPERA_HOUSE)      return {imgElement: wonderMap.get(ImageWondersType.SYDNEY_OPERA_HOUSE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.TERRACOTTA_ARMY)         return {imgElement: wonderMap.get(ImageWondersType.TERRACOTTA_ARMY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === TileNames.VENETIAN_ARSENAL)        return {imgElement: wonderMap.get(ImageWondersType.VENETIAN_ARSENAL), scaleType: HexType.DISTRICT};

    return {imgElement: undefined, scaleType: -1};
}

export function getDistrict(tile: TileType, districtMap: Map<ImageDistrictType, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.District === TileNames.CENTER_DISTRICT)                            return {imgElement: districtMap.get(ImageDistrictType.CENTER_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.COMMERCIAL_DISTRICT)                   return {imgElement: districtMap.get(ImageDistrictType.COMMERCIAL_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.ENCAMPMENT_DISTRICT)                   return {imgElement: districtMap.get(ImageDistrictType.ENCAMPMENT_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.ENTERTAINMENT_DISTRICT || 
                tile.District === TileNames.STREET_CARNIVAL_DISTRICT)           return {imgElement: districtMap.get(ImageDistrictType.ENTERTAINMENT_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.HARBOR_DISTRICT || 
                tile.District === TileNames.ROYAL_NAVY_DOCKYARD_DISTRICT)       return {imgElement: districtMap.get(ImageDistrictType.HARBOR_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.FAITH_DISTRICT || 
                tile.District === TileNames.LAVRA_DISTRICT)                     return {imgElement: districtMap.get(ImageDistrictType.FAITH_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.THEATER_DISTRICT || 
                tile.District === TileNames.ACROPOLIS_DISTRICT)                 return {imgElement: districtMap.get(ImageDistrictType.THEATER_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.INDUSTRIAL_DISTRICT || 
                tile.District === TileNames.HANSA_DISTRICT)                     return {imgElement: districtMap.get(ImageDistrictType.INDUSTRIAL_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.NEIGHBORHOOD_DISTRICT || 
                tile.District === TileNames.MBANZA_DISTRICT)                    return {imgElement: districtMap.get(ImageDistrictType.NEIGHBORHOOD_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.AQUEDUCT_DISTRICT || 
                tile.District === TileNames.BATH_DISTRICT)                      return {imgElement: districtMap.get(ImageDistrictType.AQUEDUCT_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.ROCKET_DISTRICT)                       return {imgElement: districtMap.get(ImageDistrictType.ROCKET_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.AERODROME_DISTRICT)                    return {imgElement: districtMap.get(ImageDistrictType.AERODROME_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === TileNames.SCIENCE_DISTRICT)                      return {imgElement: districtMap.get(ImageDistrictType.SCIENCE_DISTRICT), scaleType: HexType.DISTRICT};

    return {imgElement: undefined, scaleType: -1};
}

export function getTerrain(tile: TileType, terrainMap: Map<ImageTerrainType, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.TerrainType === TileNames.OCEAN)                                                               return {imgElement: terrainMap.get(ImageTerrainType.OCEAN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.COAST)                                                          return {imgElement: terrainMap.get(ImageTerrainType.COAST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.PLAINS && tile.FeatureType === TileNames.RAINFOREST)            return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_JUNGLE), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.PLAINS && tile.FeatureType === TileNames.WOODS)                 return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.PLAINS)                                                         return {imgElement: terrainMap.get(ImageTerrainType.PLAINS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.PLAINS_HILLS && tile.FeatureType === TileNames.RAINFOREST)      return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_HILLS_JUNGLE), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.PLAINS_HILLS && tile.FeatureType === TileNames.WOODS)           return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_HILLS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.PLAINS_HILLS)                                                   return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.PLAINS_MOUNTAIN)                                                return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_MOUNTAIN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.GRASSLAND && tile.FeatureType === TileNames.WOODS)              return {imgElement: terrainMap.get(ImageTerrainType.GRASS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.GRASSLAND)                                                      return {imgElement: terrainMap.get(ImageTerrainType.GRASS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.GRASSLAND_HILLS && tile.FeatureType === TileNames.WOODS)        return {imgElement: terrainMap.get(ImageTerrainType.GRASS_HILLS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.GRASSLAND_HILLS)                                                return {imgElement: terrainMap.get(ImageTerrainType.GRASS_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.GRASSLAND_MOUNTAIN)                                             return {imgElement: terrainMap.get(ImageTerrainType.GRASS_MOUNTAIN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.DESERT)                                                         return {imgElement: terrainMap.get(ImageTerrainType.DESERT), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.DESERT_HILLS)                                                   return {imgElement: terrainMap.get(ImageTerrainType.DESERT_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.DESERT_MOUNTAIN)                                                return {imgElement: terrainMap.get(ImageTerrainType.DESERT_MOUNTAIN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.TUNDRA && tile.FeatureType === TileNames.WOODS)                 return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.TUNDRA)                                                         return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.TUNDRA_HILLS && tile.FeatureType === TileNames.WOODS)           return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA_HILLS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.TUNDRA_HILLS)                                                   return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.TUNDRA_MOUNTAIN)                                                return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA_MOUNTAIN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.SNOW)                                                           return {imgElement: terrainMap.get(ImageTerrainType.SNOW), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.SNOW_HILLS)                                                     return {imgElement: terrainMap.get(ImageTerrainType.SNOW_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === TileNames.SNOW_MOUNTAIN)                                                  return {imgElement: terrainMap.get(ImageTerrainType.SNOW_MOUNTAIN), scaleType: HexType.TERRAIN};

    return {imgElement: undefined, scaleType: -1};
}
