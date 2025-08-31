import city_highlight from '../misc/cityHighlight.png'
import enemy_highlight from '../misc/enemyCityHighlight.png'
import { MiscImages } from '../../types/imageTypes';

export const allMiscImages: Record<MiscImages, string> = 
{
  [MiscImages.CURRENT_CITY]: city_highlight,
  [MiscImages.ENEMY_CITY]: enemy_highlight
};