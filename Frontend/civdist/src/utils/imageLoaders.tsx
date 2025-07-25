import {allTerrainImages} from '../images/terrainImport'
import {allDistrictImages} from '../images/districtImport'
import {allNaturalWonderImages} from '../images/naturalWondersImport';
import {allWonderImages} from '../images/wondersImport'
import { ImageTerrainType, ImageDistrictType, ImageNaturalWondersType, ImageWondersType } from './types';

export async function loadTerrainImages(terrainMap: Map<ImageTerrainType, HTMLImageElement>)
{
    for (const terrain of Object.values(ImageTerrainType)) 
    {
        const src = allTerrainImages[terrain];
        const img = new Image();
        img.src = src;

        await new Promise(resolve => (img.onload = resolve));

        terrainMap.set(terrain, img);
    }
}

export async function loadWonderImages(wonder: Map<ImageWondersType, HTMLImageElement>)
{
    const wondersCache = new Map<ImageWondersType, HTMLImageElement>();
    for (const wonders of Object.values(ImageWondersType)) 
    {
        const src = allWonderImages[wonders];
        const img = new Image();
        img.src = src;
        
        await new Promise(resolve => (img.onload = resolve));

        wonder.set(wonders, img);
    }
}

export async function loadNaturalWonderImages(nat: Map<ImageNaturalWondersType, HTMLImageElement>)
{
    const natWondersCache = new Map<ImageNaturalWondersType, HTMLImageElement>();
    for (const wonders of Object.values(ImageNaturalWondersType)) 
    {
        const src = allNaturalWonderImages[wonders];
        const img = new Image();
        img.src = src;
        
        await new Promise(resolve => (img.onload = resolve));

        nat.set(wonders, img);
    }
}

export async function loadDistrictImages(dist: Map<ImageDistrictType, HTMLImageElement>)
{
    const districtCache = new Map<ImageDistrictType, HTMLImageElement>();
    for (const district of Object.values(ImageDistrictType)) 
    {
        const src = allDistrictImages[district];
        const img = new Image();
        img.src = src;
        
        await new Promise(resolve => (img.onload = resolve));

        dist.set(district, img);
    }
}