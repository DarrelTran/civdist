import aqueduct_district from '../districts/aqueduct_district2.png';
import aerodome_district from '../districts/aerodome_district2.png';
import center_district from '../districts/center_district2.png';
import commercial_district from '../districts/commercial_district2.png';
import encampment_district from '../districts/encampment_district2.png';
import entertainment_district from '../districts/entertainment_district2.png';
import faith_district from '../districts/faith_district2.png';
import harbor_district from '../districts/harbor_district2.png';
import industrial_district from '../districts/industrial_district2.png';
import neighborhood_district from '../districts/neighborhood_district2.png';
import rocket_district from '../districts/rocket_district2.png';
import science_district from '../districts/science_district2.png';
import theater_district from '../districts/theater_district2.png';
import { TileDistricts } from '../../utils/types';

export const allDistrictImages: Record<TileDistricts, string> = 
{
  [TileDistricts.AQUEDUCT_DISTRICT]: aqueduct_district,
  [TileDistricts.AERODROME_DISTRICT]: aerodome_district,
  [TileDistricts.CENTER_DISTRICT]: center_district,
  [TileDistricts.COMMERCIAL_DISTRICT]: commercial_district,
  [TileDistricts.ENCAMPMENT_DISTRICT]: encampment_district,
  [TileDistricts.ENTERTAINMENT_DISTRICT]: entertainment_district,
  [TileDistricts.FAITH_DISTRICT]: faith_district,
  [TileDistricts.HARBOR_DISTRICT]: harbor_district,
  [TileDistricts.INDUSTRIAL_DISTRICT]: industrial_district,
  [TileDistricts.NEIGHBORHOOD_DISTRICT]: neighborhood_district,
  [TileDistricts.ROCKET_DISTRICT]: rocket_district,
  [TileDistricts.SCIENCE_DISTRICT]: science_district,
  [TileDistricts.THEATER_DISTRICT]: theater_district
};