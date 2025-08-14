import food from '../yields/food2.png'
import production from '../yields/production2.png'
import culture from '../yields/culture2.png'
import gold from '../yields/gold2.png'
import faith from '../yields/faith2.png'
import science from '../yields/science2.png'
import { TileYields } from '../../types/types'

export const allYieldImages: Record<TileYields, string> = 
{
    [TileYields.FAITH]: faith,
    [TileYields.FOOD]: food,
    [TileYields.PRODUCTION]: production,
    [TileYields.CULTURE]: culture,
    [TileYields.GOLD]: gold,
    [TileYields.SCIENCE]: science,
};