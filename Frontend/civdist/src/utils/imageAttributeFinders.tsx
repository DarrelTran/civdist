import { TileType, ImageNaturalWondersType, ImageTerrainType, ImageWondersType, ImageDistrictType, Civ6Names, HexType } from "./types";

export function getNaturalWonder(tile: TileType, natWonderMap: Map<ImageNaturalWondersType, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.FeatureType === Civ6Names.CLIFFS_OF_DOVER)             return {imgElement: natWonderMap.get(ImageNaturalWondersType.CLIFFS_OF_DOVER), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.MOUNT_LILIMANJARO)      return {imgElement: natWonderMap.get(ImageNaturalWondersType.MOUNT_LILIMANJARO), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.CRATER_LAKE)            return {imgElement: natWonderMap.get(ImageNaturalWondersType.CRATER_LAKE), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.DEAD_SEA)               return {imgElement: natWonderMap.get(ImageNaturalWondersType.DEAD_SEA), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.GALAPAGOS_ISLANDS)      return {imgElement: natWonderMap.get(ImageNaturalWondersType.GALAPAGOS_ISLANDS), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.PANTANAL)               return {imgElement: natWonderMap.get(ImageNaturalWondersType.PANTANAL), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.PIOPIOTAHI)             return {imgElement: natWonderMap.get(ImageNaturalWondersType.MOUNT_LILIMANJARO), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.TORRES_DEL_PAINE)       return {imgElement: natWonderMap.get(ImageNaturalWondersType.TORRES_DEL_PAINE), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.TSINGY_DE_BEMARAHA)     return {imgElement: natWonderMap.get(ImageNaturalWondersType.TSINGY_DE_BEMARAHA), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.YOSEMITE)               return {imgElement: natWonderMap.get(ImageNaturalWondersType.YOSEMITE), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.MOUNT_EVEREST)          return {imgElement: natWonderMap.get(ImageNaturalWondersType.MOUNT_EVEREST), scaleType: HexType.TERRAIN};
    else if (tile.FeatureType === Civ6Names.GREAT_BARRIER_REEF)     return {imgElement: natWonderMap.get(ImageNaturalWondersType.GREAT_BARRIER_REEF), scaleType: HexType.TERRAIN};

    return {imgElement: undefined, scaleType: -1};
}

export function getWonder(tile: TileType, wonderMap: Map<ImageWondersType, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.Wonder === Civ6Names.ALHAMBRA)                     return {imgElement: wonderMap.get(ImageWondersType.ALHAMBRA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.BIG_BEN)                 return {imgElement: wonderMap.get(ImageWondersType.BIG_BEN), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.BOLSHOI_THEATRE)         return {imgElement: wonderMap.get(ImageWondersType.BOLSHOI_THEATRE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.BROADWAY)                return {imgElement: wonderMap.get(ImageWondersType.BROADWAY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.CHICHEN_ITZA)            return {imgElement: wonderMap.get(ImageWondersType.CHICHEN_ITZA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.COLOSSEUM)               return {imgElement: wonderMap.get(ImageWondersType.COLOSSEUM), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.COLOSSUS)                return {imgElement: wonderMap.get(ImageWondersType.COLOSSUS), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.CRISTO_REDENTOR)         return {imgElement: wonderMap.get(ImageWondersType.CRISTO_REDENTOR), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.EIFFEL_TOWER)            return {imgElement: wonderMap.get(ImageWondersType.EIFFEL_TOWER), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.ESTADIO_DO_MARACANA)     return {imgElement: wonderMap.get(ImageWondersType.ESTADIO_DO_MARACANA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.FORBIDDEN_CITY)          return {imgElement: wonderMap.get(ImageWondersType.FORBIDDEN_CITY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.GREAT_LIBRARY)           return {imgElement: wonderMap.get(ImageWondersType.GREAT_LIBRARY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.GREAT_LIGHTHOUSE)        return {imgElement: wonderMap.get(ImageWondersType.GREAT_LIGHTHOUSE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.GREAT_ZIMBABWE)          return {imgElement: wonderMap.get(ImageWondersType.GREAT_ZIMBABWE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.HAGIA_SOPHIA)            return {imgElement: wonderMap.get(ImageWondersType.HAGIA_SOPHIA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.HANGING_GARDENS)         return {imgElement: wonderMap.get(ImageWondersType.HANGING_GARDENS), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.HERMITAGE)               return {imgElement: wonderMap.get(ImageWondersType.HERMITAGE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.HUEY_TEOCALLI)           return {imgElement: wonderMap.get(ImageWondersType.HUEY_TEOCALLI), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.MAHABODHI_TEMPLE)        return {imgElement: wonderMap.get(ImageWondersType.MAHABODHI_TEMPLE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.MONT_ST_MICHEL)          return {imgElement: wonderMap.get(ImageWondersType.MONT_ST_MICHEL), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.ORACLE)                  return {imgElement: wonderMap.get(ImageWondersType.ORACLE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.OXFORD_UNIVERSITY)       return {imgElement: wonderMap.get(ImageWondersType.OXFORD_UNIVERSITY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.PETRA)                   return {imgElement: wonderMap.get(ImageWondersType.PETRA), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.POTALA_PALACE)           return {imgElement: wonderMap.get(ImageWondersType.POTALA_PALACE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.PYRAMIDS)                return {imgElement: wonderMap.get(ImageWondersType.PYRAMIDS), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.RUHR_VALLEY)             return {imgElement: wonderMap.get(ImageWondersType.RUHR_VALLEY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.STONEHENGE)              return {imgElement: wonderMap.get(ImageWondersType.STONEHENGE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.SYDNEY_OPERA_HOUSE)      return {imgElement: wonderMap.get(ImageWondersType.SYDNEY_OPERA_HOUSE), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.TERRACOTTA_ARMY)         return {imgElement: wonderMap.get(ImageWondersType.TERRACOTTA_ARMY), scaleType: HexType.DISTRICT};
    else if (tile.Wonder === Civ6Names.VENETIAN_ARSENAL)        return {imgElement: wonderMap.get(ImageWondersType.VENETIAN_ARSENAL), scaleType: HexType.DISTRICT};

    return {imgElement: undefined, scaleType: -1};
}

export function getDistrict(tile: TileType, districtMap: Map<ImageDistrictType, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.District === Civ6Names.CENTER_DISTRICT)                        return {imgElement: districtMap.get(ImageDistrictType.CENTER_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.COMMERCIAL_DISTRICT)               return {imgElement: districtMap.get(ImageDistrictType.COMMERCIAL_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.ENCAMPMENT_DISTRICT)               return {imgElement: districtMap.get(ImageDistrictType.ENCAMPMENT_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.ENTERTAINMENT_DISTRICT || 
                tile.District === Civ6Names.STREET_CARNIVAL_DISTRICT)          return {imgElement: districtMap.get(ImageDistrictType.ENTERTAINMENT_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.HARBOR_DISTRICT || 
                tile.District === Civ6Names.ROYAL_NAVY_DOCKYARD_DISTRICT)      return {imgElement: districtMap.get(ImageDistrictType.HARBOR_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.FAITH_DISTRICT || 
                tile.District === Civ6Names.LAVRA_DISTRICT)                    return {imgElement: districtMap.get(ImageDistrictType.FAITH_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.THEATER_DISTRICT || 
                tile.District === Civ6Names.ACROPOLIS_DISTRICT)                return {imgElement: districtMap.get(ImageDistrictType.THEATER_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.INDUSTRIAL_DISTRICT || 
                tile.District === Civ6Names.HANSA_DISTRICT)                    return {imgElement: districtMap.get(ImageDistrictType.INDUSTRIAL_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.NEIGHBORHOOD_DISTRICT || 
                tile.District === Civ6Names.MBANZA_DISTRICT)                   return {imgElement: districtMap.get(ImageDistrictType.NEIGHBORHOOD_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.AQUEDUCT_DISTRICT || 
                tile.District === Civ6Names.BATH_DISTRICT)                     return {imgElement: districtMap.get(ImageDistrictType.AQUEDUCT_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.ROCKET_DISTRICT)                   return {imgElement: districtMap.get(ImageDistrictType.ROCKET_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.AERODOME_DISTRICT)                 return {imgElement: districtMap.get(ImageDistrictType.AERODOME_DISTRICT), scaleType: HexType.DISTRICT};
    else if (tile.District === Civ6Names.SCIENCE_DISTRICT)                  return {imgElement: districtMap.get(ImageDistrictType.SCIENCE_DISTRICT), scaleType: HexType.DISTRICT};

    return {imgElement: undefined, scaleType: -1};
}

export function getTerrain(tile: TileType, terrainMap: Map<ImageTerrainType, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.TerrainType === Civ6Names.OCEAN)                                                               return {imgElement: terrainMap.get(ImageTerrainType.OCEAN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.COAST)                                                          return {imgElement: terrainMap.get(ImageTerrainType.COAST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.PLAINS && tile.FeatureType === Civ6Names.RAINFOREST)            return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_JUNGLE), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.PLAINS && tile.FeatureType === Civ6Names.WOODS)                 return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.PLAINS)                                                         return {imgElement: terrainMap.get(ImageTerrainType.PLAINS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.PLAINS_HILLS && tile.FeatureType === Civ6Names.RAINFOREST)      return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_HILLS_JUNGLE), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.PLAINS_HILLS && tile.FeatureType === Civ6Names.WOODS)           return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_HILLS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.PLAINS_HILLS)                                                   return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.PLAINS_MOUNTAIN)                                                return {imgElement: terrainMap.get(ImageTerrainType.PLAINS_MOUNTAIN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.GRASSLAND && tile.FeatureType === Civ6Names.WOODS)              return {imgElement: terrainMap.get(ImageTerrainType.GRASS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.GRASSLAND)                                                      return {imgElement: terrainMap.get(ImageTerrainType.GRASS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.GRASSLAND_HILLS && tile.FeatureType === Civ6Names.WOODS)        return {imgElement: terrainMap.get(ImageTerrainType.GRASS_HILLS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.GRASSLAND_HILLS)                                                return {imgElement: terrainMap.get(ImageTerrainType.GRASS_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.GRASSLAND_MOUNTAIN)                                             return {imgElement: terrainMap.get(ImageTerrainType.GRASS_MOUNTAIN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.DESERT)                                                         return {imgElement: terrainMap.get(ImageTerrainType.DESERT), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.DESERT_HILLS)                                                   return {imgElement: terrainMap.get(ImageTerrainType.DESERT_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.DESERT_MOUNTAIN)                                                return {imgElement: terrainMap.get(ImageTerrainType.DESERT_MOUNTAIN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.TUNDRA && tile.FeatureType === Civ6Names.WOODS)                 return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.TUNDRA)                                                         return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.TUNDRA_HILLS && tile.FeatureType === Civ6Names.WOODS)           return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA_HILLS_FOREST), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.TUNDRA_HILLS)                                                   return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.TUNDRA_MOUNTAIN)                                                return {imgElement: terrainMap.get(ImageTerrainType.TUNDRA_MOUNTAIN), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.SNOW)                                                           return {imgElement: terrainMap.get(ImageTerrainType.SNOW), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.SNOW_HILLS)                                                     return {imgElement: terrainMap.get(ImageTerrainType.SNOW_HILLS), scaleType: HexType.TERRAIN};
    else if (tile.TerrainType === Civ6Names.SNOW_MOUNTAIN)                                                  return {imgElement: terrainMap.get(ImageTerrainType.SNOW_MOUNTAIN), scaleType: HexType.TERRAIN};

    return {imgElement: undefined, scaleType: -1};
}
