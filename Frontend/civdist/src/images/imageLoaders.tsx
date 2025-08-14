import { TileNone, TileDistricts, TileFeatures, TileTerrain, TileWonders, TileNaturalWonders, TerrainFeatureKey, TileYields, TileBonusResources, TileLuxuryResources, TileStrategicResources, TileArtifactResources, TileUniqueDistricts } from "../types/types";
import { allWonderImages } from "./importers/wondersImport";
import { allDistrictImages } from "./importers/districtImport";
import { allTerrainImages } from "./importers/terrainImport";
import { allNaturalWonderImages } from "./importers/naturalWondersImport";
import { allYieldImages } from "./importers/yieldsImport";
import { allResourceImages } from "./importers/resourcesImport";

async function loadImages<T extends string | number | symbol>(theMap: Map<T, HTMLImageElement>, imageImport: Record<T, string>)
{
    for (const key of Object.keys(imageImport) as T[]) 
    {
        const src = imageImport[key];
        const img = new Image();
        if (src)
        {
            img.src = src;

            await new Promise<void>(resolve => {img.onload = () => resolve()});

            theMap.set(key, img);
        }
    }
}

export async function loadTerrainImages(terrainMap: Map<string, HTMLImageElement>) 
{
    loadImages(terrainMap, allTerrainImages);
}

export async function loadWonderImages(wonder: Map<TileWonders, HTMLImageElement>)
{
    loadImages(wonder, allWonderImages);
}

export async function loadNaturalWonderImages(nat: Map<TileNaturalWonders, HTMLImageElement>)
{
    loadImages(nat, allNaturalWonderImages);
}

export async function loadDistrictImages(dist: Map<TileDistricts | TileUniqueDistricts, HTMLImageElement>)
{
    loadImages(dist, allDistrictImages);
}

export async function loadYieldImages(yieldCache: Map<TileYields, HTMLImageElement>)
{
    loadImages(yieldCache, allYieldImages);
}

export async function loadResourceImages(resources: Map<TileBonusResources | TileLuxuryResources | TileStrategicResources | TileArtifactResources, HTMLImageElement>)
{
    loadImages(resources, allResourceImages);
}