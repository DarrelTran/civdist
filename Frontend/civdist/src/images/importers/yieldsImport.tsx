import food_drop from '../yields/dropdown/food2.png'
import production_drop from '../yields/dropdown/production2.png'
import culture_drop from '../yields/dropdown/culture2.png'
import gold_drop from '../yields/dropdown/gold2.png'
import faith_drop from '../yields/dropdown/faith2.png'
import science_drop from '../yields/dropdown/science2.png'

import food1 from '../yields/food.png'
import food2 from '../yields/food_double.png'
import food3 from '../yields/food_triple.png'
import food4 from '../yields/food_quad.png'
import food5 from '../yields/food_quin.png'
import food6 from '../yields/food_6.png'
import food7 from '../yields/food_7.png'
import food8 from '../yields/food_8.png'
import food9 from '../yields/food_9.png'
import food10 from '../yields/food_10.png'
import food11 from '../yields/food_11.png'
import food12 from '../yields/food_12_plus.png'

import culture1 from '../yields/culture.png'
import culture2 from '../yields/culture_double.png'
import culture3 from '../yields/culture_triple.png'
import culture4 from '../yields/culture_quad.png'
import culture5 from '../yields/culture_quin.png'
import culture6 from '../yields/culture_6.png'
import culture7 from '../yields/culture_7.png'
import culture8 from '../yields/culture_8.png'
import culture9 from '../yields/culture_9.png'
import culture10 from '../yields/culture_10.png'
import culture11 from '../yields/culture_11.png'
import culture12 from '../yields/culture_12_plus.png'

import gold1 from '../yields/gold.png'
import gold2 from '../yields/gold_double.png'
import gold3 from '../yields/gold_triple.png'
import gold4 from '../yields/gold_quad.png'
import gold5 from '../yields/gold_quin.png'
import gold6 from '../yields/gold_6.png'
import gold7 from '../yields/gold_7.png'
import gold8 from '../yields/gold_8.png'
import gold9 from '../yields/gold_9.png'
import gold10 from '../yields/gold_10.png'
import gold11 from '../yields/gold_11.png'
import gold12 from '../yields/gold_12_plus.png'

import faith1 from '../yields/faith.png'
import faith2 from '../yields/faith_double.png'
import faith3 from '../yields/faith_triple.png'
import faith4 from '../yields/faith_quad.png'
import faith5 from '../yields/faith_quin.png'
import faith6 from '../yields/faith_6.png'
import faith7 from '../yields/faith_7.png'
import faith8 from '../yields/faith_8.png'
import faith9 from '../yields/faith_9.png'
import faith10 from '../yields/faith_10.png'
import faith11 from '../yields/faith_11.png'
import faith12 from '../yields/faith_12_plus.png'

import science1 from '../yields/science.png'
import science2 from '../yields/science_double.png'
import science3 from '../yields/science_triple.png'
import science4 from '../yields/science_quad.png'
import science5 from '../yields/science_quin.png'
import science6 from '../yields/science_6.png'
import science7 from '../yields/science_7.png'
import science8 from '../yields/science_8.png'
import science9 from '../yields/science_9.png'
import science10 from '../yields/science_10.png'
import science11 from '../yields/science_11.png'
import science12 from '../yields/science_12_plus.png'

import production1 from '../yields/production.png'
import production2 from '../yields/production_double.png'
import production3 from '../yields/production_triple.png'
import production4 from '../yields/production_quad.png'
import production5 from '../yields/production_quin.png'
import production6 from '../yields/production_6.png'
import production7 from '../yields/production_7.png'
import production8 from '../yields/production_8.png'
import production9 from '../yields/production_9.png'
import production10 from '../yields/production_10.png'
import production11 from '../yields/production_11.png'
import production12 from '../yields/production_12_plus.png'

import { TileYields, YieldImagesKey } from '../../types/types'

export const yieldDropdownImages: Record<TileYields, string> = 
{
    [TileYields.FAITH]: faith_drop,
    [TileYields.FOOD]: food_drop,
    [TileYields.PRODUCTION]: production_drop,
    [TileYields.CULTURE]: culture_drop,
    [TileYields.GOLD]: gold_drop,
    [TileYields.SCIENCE]: science_drop,
};

export const yieldHexmapImages: Record<YieldImagesKey, string> = 
{
    [`${TileYields.FOOD}_1`]: food1,
    [`${TileYields.FOOD}_2`]: food2,
    [`${TileYields.FOOD}_3`]: food3,
    [`${TileYields.FOOD}_4`]: food4,
    [`${TileYields.FOOD}_5`]: food5,
    [`${TileYields.FOOD}_6`]: food6,
    [`${TileYields.FOOD}_7`]: food7,
    [`${TileYields.FOOD}_8`]: food8,
    [`${TileYields.FOOD}_9`]: food9,
    [`${TileYields.FOOD}_10`]: food10,
    [`${TileYields.FOOD}_11`]: food11,
    [`${TileYields.FOOD}_12`]: food12,

    [`${TileYields.GOLD}_1`]: gold1,
    [`${TileYields.GOLD}_2`]: gold2,
    [`${TileYields.GOLD}_3`]: gold3,
    [`${TileYields.GOLD}_4`]: gold4,
    [`${TileYields.GOLD}_5`]: gold5,
    [`${TileYields.GOLD}_6`]: gold6,
    [`${TileYields.GOLD}_7`]: gold7,
    [`${TileYields.GOLD}_8`]: gold8,
    [`${TileYields.GOLD}_9`]: gold9,
    [`${TileYields.GOLD}_10`]: gold10,
    [`${TileYields.GOLD}_11`]: gold11,
    [`${TileYields.GOLD}_12`]: gold12,

    [`${TileYields.CULTURE}_1`]: culture1,
    [`${TileYields.CULTURE}_2`]: culture2,
    [`${TileYields.CULTURE}_3`]: culture3,
    [`${TileYields.CULTURE}_4`]: culture4,
    [`${TileYields.CULTURE}_5`]: culture5,
    [`${TileYields.CULTURE}_6`]: culture6,
    [`${TileYields.CULTURE}_7`]: culture7,
    [`${TileYields.CULTURE}_8`]: culture8,
    [`${TileYields.CULTURE}_9`]: culture9,
    [`${TileYields.CULTURE}_10`]: culture10,
    [`${TileYields.CULTURE}_11`]: culture11,
    [`${TileYields.CULTURE}_12`]: culture12,

    [`${TileYields.PRODUCTION}_1`]: production1,
    [`${TileYields.PRODUCTION}_2`]: production2,
    [`${TileYields.PRODUCTION}_3`]: production3,
    [`${TileYields.PRODUCTION}_4`]: production4,
    [`${TileYields.PRODUCTION}_5`]: production5,
    [`${TileYields.PRODUCTION}_6`]: production6,
    [`${TileYields.PRODUCTION}_7`]: production7,
    [`${TileYields.PRODUCTION}_8`]: production8,
    [`${TileYields.PRODUCTION}_9`]: production9,
    [`${TileYields.PRODUCTION}_10`]: production10,
    [`${TileYields.PRODUCTION}_11`]: production11,
    [`${TileYields.PRODUCTION}_12`]: production12,

    [`${TileYields.SCIENCE}_1`]: science1,
    [`${TileYields.SCIENCE}_2`]: science2,
    [`${TileYields.SCIENCE}_3`]: science3,
    [`${TileYields.SCIENCE}_4`]: science4,
    [`${TileYields.SCIENCE}_5`]: science5,
    [`${TileYields.SCIENCE}_6`]: science6,
    [`${TileYields.SCIENCE}_7`]: science7,
    [`${TileYields.SCIENCE}_8`]: science8,
    [`${TileYields.SCIENCE}_9`]: science9,
    [`${TileYields.SCIENCE}_10`]: science10,
    [`${TileYields.SCIENCE}_11`]: science11,
    [`${TileYields.SCIENCE}_12`]: science12,

    [`${TileYields.FAITH}_1`]: faith1,
    [`${TileYields.FAITH}_2`]: faith2,
    [`${TileYields.FAITH}_3`]: faith3,
    [`${TileYields.FAITH}_4`]: faith4,
    [`${TileYields.FAITH}_5`]: faith5,
    [`${TileYields.FAITH}_6`]: faith6,
    [`${TileYields.FAITH}_7`]: faith7,
    [`${TileYields.FAITH}_8`]: faith8,
    [`${TileYields.FAITH}_9`]: faith9,
    [`${TileYields.FAITH}_10`]: faith10,
    [`${TileYields.FAITH}_11`]: faith11,
    [`${TileYields.FAITH}_12`]: faith12
}