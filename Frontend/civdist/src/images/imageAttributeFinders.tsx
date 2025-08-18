import { TileType, TileNone, TileFeatures, TileTerrain, TileWonders, TileDistricts, TileUniqueDistricts, TileNaturalWonders, TerrainFeatureKey, HexType, TileBonusResources, TileStrategicResources, TileLuxuryResources, TileArtifactResources, YieldImagesKey, TileYields } from "../types/types";
import { hasNaturalWonder } from "../utils/functions/civ/civFunctions";

export function getNaturalWonder(tile: TileType, natWonderMap: Map<TileNaturalWonders, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: HexType}
{
    if (tile.FeatureType !== TileNone.NONE && hasNaturalWonder(tile.FeatureType))
    {
        const natWonder = natWonderMap.get(tile.FeatureType);

        if (natWonder)
            return {imgElement: natWonder, scaleType: HexType.TERRAIN};
    }

    return {imgElement: undefined, scaleType: HexType.UNKNOWN};
}

export function getWonder(tile: TileType, wonderMap: Map<TileWonders, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: HexType}
{
    if (tile.Wonder !== TileNone.NONE)
    {
        const wonder = wonderMap.get(tile.Wonder);

        if (wonder)
            return {imgElement: wonder, scaleType: HexType.DISTRICT};
    }

    return {imgElement: undefined, scaleType: HexType.UNKNOWN};
}

export function getDistrict(tile: TileType, districtMap: Map<TileDistricts | TileUniqueDistricts, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: HexType}
{
    if (tile.District !== TileNone.NONE)
    {
        const district = districtMap.get(tile.District);

        if (district)
            return {imgElement: district, scaleType: HexType.DISTRICT};
    }

    return {imgElement: undefined, scaleType: HexType.UNKNOWN};
}

export function getTerrain(tile: TileType, terrainMap: Map<TerrainFeatureKey, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: HexType}
{
    if (tile.TerrainType !== TileNone.NONE && tile.TerrainType !== TileTerrain.RIVER && !hasNaturalWonder(tile.FeatureType))
    {
        const terrain = terrainMap.get(`${tile.TerrainType}_${tile.FeatureType}`);

        if (terrain)
            return {imgElement: terrain, scaleType: HexType.TERRAIN};
    }

    return {imgElement: undefined, scaleType: HexType.UNKNOWN};
}

export function getResource(tile: TileType, resourceMap: Map<TileBonusResources | TileLuxuryResources | TileStrategicResources | TileArtifactResources, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: HexType}
{
    if (tile.ResourceType !== TileNone.NONE)
    {
        const resource = resourceMap.get(tile.ResourceType);

        if (resource)
            return {imgElement: resource, scaleType: HexType.RESOURCE};
    }

    return {imgElement: undefined, scaleType: HexType.UNKNOWN};
}

export function getYields(tile: TileType, yieldImageMap: Map<YieldImagesKey, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: HexType}[]
{
    const possibleYields = Object.values(TileYields);
    const yieldImages: {imgElement: HTMLImageElement | undefined, scaleType: number}[] = [];

    for (const key of Object.values(TileYields))
    {
        possibleYields.forEach((theYield) => 
        {
            if (key === theYield)
            {
                const yieldValue = tile[theYield];

                if (yieldValue > 12)
                {
                    const bigYield = yieldImageMap.get(`${theYield}_12`);
                    if (bigYield)
                        yieldImages.push({imgElement: bigYield, scaleType: HexType.YIELD});
                }
                else
                {
                    const normalYield = yieldImageMap.get(`${theYield}_${yieldValue}`);
                    if (normalYield)
                    {
                        yieldImages.push({imgElement: normalYield, scaleType: HexType.YIELD});
                    }
                }
            }
        })
    }

    return yieldImages;
}