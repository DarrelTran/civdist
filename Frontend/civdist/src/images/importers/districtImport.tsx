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

import aqueduct_dropdown from '../districts/dropdown/aqueduct_district.png';
import aerodome_dropdown from '../districts/dropdown/aerodome_district.png';
import center_dropdown from '../districts/dropdown/center_district.png';
import commercial_dropdown from '../districts/dropdown/commercial_district.png';
import encampment_dropdown from '../districts/dropdown/encampment_district.png';
import entertainment_dropdown from '../districts/dropdown/entertainment_district.png';
import faith_dropdown from '../districts/dropdown/faith_district.png';
import harbor_dropdown from '../districts/dropdown/harbor_district.png';
import industrial_dropdown from '../districts/dropdown/industrial_district.png';
import neighborhood_dropdown from '../districts/dropdown/neighborhood_district.png';
import rocket_dropdown from '../districts/dropdown/rocket_district.png';
import science_dropdown from '../districts/dropdown/science_district.png';
import theater_dropdown from '../districts/dropdown/theater_district.png';

import { TileDistricts, TileUniqueDistricts } from '../../types/civTypes';

export const allDistrictImages: Record<TileDistricts | TileUniqueDistricts, string> = 
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
  [TileDistricts.THEATER_DISTRICT]: theater_district,

  [TileUniqueDistricts.BATH_DISTRICT]: aqueduct_district,
  [TileUniqueDistricts.STREET_CARNIVAL_DISTRICT]: entertainment_district,
  [TileUniqueDistricts.LAVRA_DISTRICT]: faith_district,
  [TileUniqueDistricts.ROYAL_NAVY_DOCKYARD_DISTRICT]: harbor_district,
  [TileUniqueDistricts.HANSA_DISTRICT]: industrial_district,
  [TileUniqueDistricts.MBANZA_DISTRICT]: neighborhood_district,
  [TileUniqueDistricts.ACROPOLIS_DISTRICT]: theater_district
};

export const allDistrictDropdownImages: Record<TileDistricts | TileUniqueDistricts, string> = 
{
  [TileDistricts.AQUEDUCT_DISTRICT]: aqueduct_dropdown,
  [TileDistricts.AERODROME_DISTRICT]: aerodome_dropdown,
  [TileDistricts.CENTER_DISTRICT]: center_dropdown,
  [TileDistricts.COMMERCIAL_DISTRICT]: commercial_dropdown,
  [TileDistricts.ENCAMPMENT_DISTRICT]: encampment_dropdown,
  [TileDistricts.ENTERTAINMENT_DISTRICT]: entertainment_dropdown,
  [TileDistricts.FAITH_DISTRICT]: faith_dropdown,
  [TileDistricts.HARBOR_DISTRICT]: harbor_dropdown,
  [TileDistricts.INDUSTRIAL_DISTRICT]: industrial_dropdown,
  [TileDistricts.NEIGHBORHOOD_DISTRICT]: neighborhood_dropdown,
  [TileDistricts.ROCKET_DISTRICT]: rocket_dropdown,
  [TileDistricts.SCIENCE_DISTRICT]: science_dropdown,
  [TileDistricts.THEATER_DISTRICT]: theater_dropdown,

  [TileUniqueDistricts.BATH_DISTRICT]: aqueduct_dropdown,
  [TileUniqueDistricts.STREET_CARNIVAL_DISTRICT]: entertainment_dropdown,
  [TileUniqueDistricts.LAVRA_DISTRICT]: faith_dropdown,
  [TileUniqueDistricts.ROYAL_NAVY_DOCKYARD_DISTRICT]: harbor_dropdown,
  [TileUniqueDistricts.HANSA_DISTRICT]: industrial_dropdown,
  [TileUniqueDistricts.MBANZA_DISTRICT]: neighborhood_dropdown,
  [TileUniqueDistricts.ACROPOLIS_DISTRICT]: theater_dropdown,
}