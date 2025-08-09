import cliffs_of_dover from '../natural_wonders/cliffs_of_dover2.png'
import crater_lake from '../natural_wonders/crater_lake2.png'
import dead_sea from '../natural_wonders/dead_sea2.png'
import galapagos_islands from '../natural_wonders/galápagos_islands2.png'
import great_barrier_reef from '../natural_wonders/great_barrier_reef2.png'
import mount_everest from '../natural_wonders/mount_everest2.png'
import mount_lilimanjaro from '../natural_wonders/mount_lilimanjaro2.png'
import pantanal from '../natural_wonders/pantanal2.png'
import piopiotahi from '../natural_wonders/piopiotahi2.png'
import torres_del_paine from '../natural_wonders/torres_del_paine2.png'
import tsingy_de_bemaraha from '../natural_wonders/tsingy_de_bemaraha2.png'
import yosemite from '../natural_wonders/yosemite2.png'
import { TileNaturalWonders } from '../../types/types'

export const allNaturalWonderImages: Record<TileNaturalWonders, string> = 
{
  [TileNaturalWonders.CLIFFS_OF_DOVER]: cliffs_of_dover,
  [TileNaturalWonders.CRATER_LAKE]: crater_lake,
  [TileNaturalWonders.DEAD_SEA]: dead_sea,
  [TileNaturalWonders.GALAPAGOS_ISLANDS]: galapagos_islands,
  [TileNaturalWonders.GREAT_BARRIER_REEF]: great_barrier_reef,
  [TileNaturalWonders.MOUNT_EVEREST]: mount_everest,
  [TileNaturalWonders.MOUNT_LILIMANJARO]: mount_lilimanjaro,
  [TileNaturalWonders.PANTANAL]: pantanal,
  [TileNaturalWonders.PIOPIOTAHI]: piopiotahi,
  [TileNaturalWonders.TORRES_DEL_PAINE]: torres_del_paine,
  [TileNaturalWonders.TSINGY_DE_BEMARAHA]: tsingy_de_bemaraha,
  [TileNaturalWonders.YOSEMITE]: yosemite
};