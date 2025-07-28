import { TileNone, TileDistricts, TileFeatures, TileTerrain, TileWonders, TileNaturalWonders, TerrainFeatureKey } from "./types";
import { allWonderImages } from "../images/wondersImport";
import { allDistrictImages } from "../images/districtImport";
import { allTerrainImages } from "../images/terrainImport";
import { allNaturalWonderImages } from "../images/naturalWondersImport";

export async function loadTerrainImages(terrainMap: Map<string, HTMLImageElement>) 
{
    for (const key in allTerrainImages) 
    {
        const src = allTerrainImages[key as TerrainFeatureKey];
        const img = new Image();
        if (src)
        {
            img.src = src;

            await new Promise(resolve => (img.onload = resolve));

            terrainMap.set(key, img);
        }
    }
}

export async function loadWonderImages(wonder: Map<TileWonders, HTMLImageElement>)
{
    for (const wonders of Object.values(TileWonders)) 
    {
        const src = allWonderImages[wonders];
        const img = new Image();
        img.src = src;
        
        await new Promise(resolve => (img.onload = resolve));

        wonder.set(wonders, img);
    }
}

export async function loadNaturalWonderImages(nat: Map<TileNaturalWonders, HTMLImageElement>)
{
    for (const wonders of Object.values(TileNaturalWonders)) 
    {
        const src = allNaturalWonderImages[wonders];
        const img = new Image();
        img.src = src;
        
        await new Promise(resolve => (img.onload = resolve));

        nat.set(wonders, img);
    }
}

export async function loadDistrictImages(dist: Map<TileDistricts, HTMLImageElement>)
{
    for (const district of Object.values(TileDistricts)) 
    {
        const src = allDistrictImages[district];
        const img = new Image();
        img.src = src;
        
        await new Promise(resolve => (img.onload = resolve));

        dist.set(district, img);
    }
}