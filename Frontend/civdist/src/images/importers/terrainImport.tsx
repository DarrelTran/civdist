import coast from '../terrain/coast.png';
import desert_hills from '../terrain/desert_hills.png';
import desert_mountain from '../terrain/desert_mountain.png';
import desert from '../terrain/desert.png';
import desert_floodplains from '../terrain/desert_floodplains2.png';
import grass_hills from '../terrain/grass_hills.png';
import grass_mountain from '../terrain/grass_mountain.png';
import grass_forest from '../terrain/grass_forest.png'
import grass_hills_forest from '../terrain/grass_hills_forest.png'
import grass from '../terrain/grass.png';
import ocean from '../terrain/ocean.png';
import plains_hills from '../terrain/plains_hills.png';
import plains_mountain from '../terrain/plains_mountain.png';
import plains_forest from '../terrain/plains_forest.png'
import plains_hills_forest from '../terrain/plains_hills_forest.png'
import plains_jungle from '../terrain/plains_jungle.png'
import plains_hills_jungle from '../terrain/plains_hills_jungle.png'
import plains from '../terrain/plains.png';
import river from '../terrain/river.png';
import snow_hills from '../terrain/snow_hills.png';
import snow_mountain from '../terrain/snow_mountain.png';
import snow from '../terrain/snow.png';
import tundra_hills from '../terrain/tundra_hills.png';
import tundra_mountain from '../terrain/tundra_mountain.png';
import tundra_forest from '../terrain/tundra_forest.png'
import tundra_hills_forest from '../terrain/tundra_hills_forest.png'
import tundra from '../terrain/tundra.png';
import oasis from '../terrain/oasis2.png';
import marsh from '../terrain/marsh.png';
import ice from '../terrain/ice.png';
import { TileTerrain, TileFeatures, TileNone, TerrainFeatureKey } from '../../types/types';

export const allTerrainImages: Partial<Record<TerrainFeatureKey, string>> = 
{
  [`${TileTerrain.COAST}_${TileFeatures.ICE}`]: ice,
  [`${TileTerrain.OCEAN}_${TileFeatures.ICE}`]: ice,
  [`${TileTerrain.COAST}_${TileNone.NONE}`]: coast,
  [`${TileTerrain.DESERT_HILLS}_${TileNone.NONE}`]: desert_hills,
  [`${TileTerrain.DESERT_MOUNTAIN}_${TileNone.NONE}`]: desert_mountain,
  [`${TileTerrain.DESERT}_${TileNone.NONE}`]: desert,
  [`${TileTerrain.DESERT}_${TileFeatures.OASIS}`]: oasis,
  [`${TileTerrain.DESERT}_${TileFeatures.FLOODPLAINS}`]: desert_floodplains,
  [`${TileTerrain.GRASSLAND_HILLS}_${TileNone.NONE}`]: grass_hills,
  [`${TileTerrain.GRASSLAND_MOUNTAIN}_${TileNone.NONE}`]: grass_mountain,
  [`${TileTerrain.GRASSLAND}_${TileFeatures.WOODS}`]: grass_forest,
  [`${TileTerrain.GRASSLAND_HILLS}_${TileFeatures.WOODS}`]: grass_hills_forest,
  [`${TileTerrain.GRASSLAND}_${TileNone.NONE}`]: grass,
  [`${TileTerrain.GRASSLAND}_${TileFeatures.MARSH}`]: marsh,
  [`${TileTerrain.OCEAN}_${TileNone.NONE}`]: ocean,
  [`${TileTerrain.PLAINS_HILLS}_${TileNone.NONE}`]: plains_hills,
  [`${TileTerrain.PLAINS_MOUNTAIN}_${TileNone.NONE}`]: plains_mountain,
  [`${TileTerrain.PLAINS}_${TileFeatures.WOODS}`]: plains_forest,
  [`${TileTerrain.PLAINS_HILLS}_${TileFeatures.WOODS}`]: plains_hills_forest,
  [`${TileTerrain.PLAINS}_${TileFeatures.RAINFOREST}`]: plains_jungle,
  [`${TileTerrain.PLAINS_HILLS}_${TileFeatures.RAINFOREST}`]: plains_hills_jungle,
  [`${TileTerrain.PLAINS}_${TileNone.NONE}`]: plains,
  [`${TileTerrain.RIVER}_${TileNone.NONE}`]: river,
  [`${TileTerrain.SNOW_HILLS}_${TileNone.NONE}`]: snow_hills,
  [`${TileTerrain.SNOW_MOUNTAIN}_${TileNone.NONE}`]: snow_mountain,
  [`${TileTerrain.SNOW}_${TileNone.NONE}`]: snow,
  [`${TileTerrain.TUNDRA_HILLS}_${TileNone.NONE}`]: tundra_hills,
  [`${TileTerrain.TUNDRA_MOUNTAIN}_${TileNone.NONE}`]: tundra_mountain,
  [`${TileTerrain.TUNDRA}_${TileFeatures.WOODS}`]: tundra_forest,
  [`${TileTerrain.TUNDRA_HILLS}_${TileFeatures.WOODS}`]: tundra_hills_forest,
  [`${TileTerrain.TUNDRA}_${TileNone.NONE}`]: tundra
};