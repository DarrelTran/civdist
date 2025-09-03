import culture from '../victory/dropdown/culture.png'
import science from '../victory/dropdown/science.png'
import domination from '../victory/dropdown/domination.png'
import religious from '../victory/dropdown/religious.png'
import none from '../victory/dropdown/default.png'

import { VictoryType } from '../../types/civTypes';

export const allVictoryDropdownImages: Record<VictoryType, string> = 
{
  [VictoryType.CULTURE]: culture,
  [VictoryType.SCIENCE]: science,
  [VictoryType.DOMINATION]: domination,
  [VictoryType.RELIGIOUS]: religious,
  [VictoryType.NONE]: none
};