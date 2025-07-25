import coast from './terrain/coast.png';
import desert_hills from './terrain/desert_hills.png';
import desert_mountain from './terrain/desert_mountain.png';
import desert from './terrain/desert.png';
import grass_hills from './terrain/grass_hills.png';
import grass_mountain from './terrain/grass_mountain.png';
import grass_forest from './terrain/grass_forest.png'
import grass_hills_forest from './terrain/grass_hills_forest.png'
import grass from './terrain/grass.png';
import ocean from './terrain/ocean.png';
import plains_hills from './terrain/plains_hills.png';
import plains_mountain from './terrain/plains_mountain.png';
import plains_forest from './terrain/plains_forest.png'
import plains_hills_forest from './terrain/plains_hills_forest.png'
import plains_jungle from './terrain/plains_jungle.png'
import plains_hills_jungle from './terrain/plains_hills_jungle.png'
import plains from './terrain/plains.png';
import river from './terrain/river.png';
import snow_hills from './terrain/snow_hills.png';
import snow_mountain from './terrain/snow_mountain.png';
import snow from './terrain/snow.png';
import tundra_hills from './terrain/tundra_hills.png';
import tundra_mountain from './terrain/tundra_mountain.png';
import tundra_forest from './terrain/tundra_forest.png'
import tundra_hills_forest from './terrain/tundra_hills_forest.png'
import tundra from './terrain/tundra.png';
import { ImageTerrainType } from '../utils/types';

export const allTerrainImages: Record<ImageTerrainType, string> = 
{
  [ImageTerrainType.COAST]: coast,
  [ImageTerrainType.DESERT_HILLS]: desert_hills,
  [ImageTerrainType.DESERT_MOUNTAIN]: desert_mountain,
  [ImageTerrainType.DESERT]: desert,
  [ImageTerrainType.GRASS_HILLS]: grass_hills,
  [ImageTerrainType.GRASS_MOUNTAIN]: grass_mountain,
  [ImageTerrainType.GRASS_FOREST]: grass_forest,
  [ImageTerrainType.GRASS_HILLS_FOREST]: grass_hills_forest,
  [ImageTerrainType.GRASS]: grass,
  [ImageTerrainType.OCEAN]: ocean,
  [ImageTerrainType.PLAINS_HILLS]: plains_hills,
  [ImageTerrainType.PLAINS_MOUNTAIN]: plains_mountain,
  [ImageTerrainType.PLAINS_FOREST]: plains_forest,
  [ImageTerrainType.PLAINS_HILLS_FOREST]: plains_hills_forest,
  [ImageTerrainType.PLAINS_JUNGLE]: plains_jungle,
  [ImageTerrainType.PLAINS_HILLS_JUNGLE]: plains_hills_jungle,
  [ImageTerrainType.PLAINS]: plains,
  [ImageTerrainType.RIVER]: river,
  [ImageTerrainType.SNOW_HILLS]: snow_hills,
  [ImageTerrainType.SNOW_MOUNTAIN]: snow_mountain,
  [ImageTerrainType.SNOW]: snow,
  [ImageTerrainType.TUNDRA_HILLS]: tundra_hills,
  [ImageTerrainType.TUNDRA_MOUNTAIN]: tundra_mountain,
  [ImageTerrainType.TUNDRA_FOREST]: tundra_forest,
  [ImageTerrainType.TUNDRA_HILLS_FOREST]: tundra_hills_forest,
  [ImageTerrainType.TUNDRA]: tundra
};