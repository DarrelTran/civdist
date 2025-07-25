import aqueduct_district from './districts/aqueduct_district2.png';
import aerodome_district from './districts/aerodome_district2.png';
import center_district from './districts/center_district2.png';
import commercial_district from './districts/commercial_district2.png';
import encampment_district from './districts/encampment_district2.png';
import entertainment_district from './districts/entertainment_district2.png';
import faith_district from './districts/faith_district2.png';
import harbor_district from './districts/harbor_district2.png';
import industrial_district from './districts/industrial_district2.png';
import neighborhood_district from './districts/neighborhood_district2.png';
import rocket_district from './districts/rocket_district2.png';
import science_district from './districts/science_district2.png';
import theater_district from './districts/theater_district2.png';
import { ImageDistrictType } from '../utils/types';

export const allDistrictImages: Record<ImageDistrictType, string> = 
{
  [ImageDistrictType.AQUEDUCT_DISTRICT]: aqueduct_district,
  [ImageDistrictType.AERODOME_DISTRICT]: aerodome_district,
  [ImageDistrictType.CENTER_DISTRICT]: center_district,
  [ImageDistrictType.COMMERCIAL_DISTRICT]: commercial_district,
  [ImageDistrictType.ENCAMPMENT_DISTRICT]: encampment_district,
  [ImageDistrictType.ENTERTAINMENT_DISTRICT]: entertainment_district,
  [ImageDistrictType.FAITH_DISTRICT]: faith_district,
  [ImageDistrictType.HARBOR_DISTRICT]: harbor_district,
  [ImageDistrictType.INDUSTRIAL_DISTRICT]: industrial_district,
  [ImageDistrictType.NEIGHBORHOOD_DISTRICT]: neighborhood_district,
  [ImageDistrictType.ROCKET_DISTRICT]: rocket_district,
  [ImageDistrictType.SCIENCE_DISTRICT]: science_district,
  [ImageDistrictType.THEATER_DISTRICT]: theater_district
};