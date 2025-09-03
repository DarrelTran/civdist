import cityState from '../civ/dropdown/CityState.png'
import kongo from '../civ/dropdown/kongo.png'
import spain from '../civ/dropdown/spain.png'
import greece_pericles from '../civ/dropdown/greece_pericles.png'
import greece_gorgo from '../civ/dropdown/greece_gorgo.png'
import russia from '../civ/dropdown/russia.png'
import brazil from '../civ/dropdown/brazil.png'
import germany from '../civ/dropdown/germany.png'
import france from '../civ/dropdown/france.png'
import egypt from '../civ/dropdown/egypt.png'
import sumeria from '../civ/dropdown/sumeria.png'
import india from '../civ/dropdown/india.png'
import norway from '../civ/dropdown/norway.png'
import japan from '../civ/dropdown/japan.png'
import china from '../civ/dropdown/china.png'
import aztec from '../civ/dropdown/aztec.png'
import america from '../civ/dropdown/america.png'
import arabia from '../civ/dropdown/arabia.png'
import england from '../civ/dropdown/england.png'
import scythia from '../civ/dropdown/scythia.png'
import rome from '../civ/dropdown/rome.png'

import { LeaderName } from '../../types/civTypes';

export const allCivFlagImages: Record<LeaderName, string> = 
{
  [LeaderName.CITY_STATE]: cityState,
  [LeaderName.MVEMBA_A_NZINGA]: kongo,
  [LeaderName.PEDRO_II]: brazil,
  [LeaderName.PERICLES]: greece_pericles,
  [LeaderName.PETER_THE_GREAT]: russia,
  [LeaderName.PHILIP_II]: spain,
  [LeaderName.FREDERICK_BARBAROSSA]: germany,
  [LeaderName.CATHERINE_DE_MEDICI]: france,
  [LeaderName.CLEOPATRA]: egypt,
  [LeaderName.GANDHI]: india,
  [LeaderName.GILGAMESH]: sumeria,
  [LeaderName.GORGO]: greece_gorgo,
  [LeaderName.HARALD_HARDRADA]: norway,
  [LeaderName.HOJO_TOKIMUNE]: japan,
  [LeaderName.QIN_SHI_HUANG]: china,
  [LeaderName.MONTEZUMA_I]: aztec,
  [LeaderName.TEDDY_ROOSEVELT]: america,
  [LeaderName.SALADIN]: arabia,
  [LeaderName.VICTORIA]: england,
  [LeaderName.TOMYRIS]: scythia,
  [LeaderName.TRAJAN]: rome,
};