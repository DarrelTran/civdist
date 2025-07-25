import cliffs_of_dover from './natural_wonders/cliffs_of_dover2.png'
import crater_lake from './natural_wonders/crater_lake2.png'
import dead_sea from './natural_wonders/dead_sea2.png'
import galapagos_islands from './natural_wonders/galápagos_islands2.png'
import great_barrier_reef from './natural_wonders/great_barrier_reef2.png'
import mount_everest from './natural_wonders/mount_everest2.png'
import mount_lilimanjaro from './natural_wonders/mount_lilimanjaro2.png'
import pantanal from './natural_wonders/pantanal2.png'
import piopiotahi from './natural_wonders/piopiotahi2.png'
import torres_del_paine from './natural_wonders/torres_del_paine2.png'
import tsingy_de_bemaraha from './natural_wonders/tsingy_de_bemaraha2.png'
import yosemite from './natural_wonders/yosemite2.png'
import { ImageNaturalWondersType } from '../utils/types'

export const allNaturalWonderImages: Record<ImageNaturalWondersType, string> = 
{
  [ImageNaturalWondersType.CLIFFS_OF_DOVER]: cliffs_of_dover,
  [ImageNaturalWondersType.CRATER_LAKE]: crater_lake,
  [ImageNaturalWondersType.DEAD_SEA]: dead_sea,
  [ImageNaturalWondersType.GALAPAGOS_ISLANDS]: galapagos_islands,
  [ImageNaturalWondersType.GREAT_BARRIER_REEF]: great_barrier_reef,
  [ImageNaturalWondersType.MOUNT_EVEREST]: mount_everest,
  [ImageNaturalWondersType.MOUNT_LILIMANJARO]: mount_lilimanjaro,
  [ImageNaturalWondersType.PANTANAL]: pantanal,
  [ImageNaturalWondersType.PIOPIOTAHI]: piopiotahi,
  [ImageNaturalWondersType.TORRES_DEL_PAINE]: torres_del_paine,
  [ImageNaturalWondersType.TSINGY_DE_BEMARAHA]: tsingy_de_bemaraha,
  [ImageNaturalWondersType.YOSEMITE]: yosemite
};