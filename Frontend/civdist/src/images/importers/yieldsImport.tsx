import food from '../resources/food2.png'
import production from '../resources/production2.png'
import culture from '../resources/culture2.png'
import gold from '../resources/gold2.png'
import faith from '../resources/faith2.png'
import science from '../resources/science2.png'
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