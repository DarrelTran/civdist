import { TileType, TileNone, TileFeatures, TileTerrain, TileWonders, TileDistricts, TileUniqueDistricts, TileNaturalWonders, TerrainFeatureKey, HexType, TileBonusResources, TileStrategicResources, TileLuxuryResources, TileArtifactResources } from "../types/types";
import { hasNaturalWonder } from "../utils/functions/civ/civFunctions";

export function getNaturalWonder(tile: TileType, natWonderMap: Map<TileNaturalWonders, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.FeatureType !== TileNone.NONE && hasNaturalWonder(tile.FeatureType))
    {
        const natWonder = natWonderMap.get(tile.FeatureType);

        if (natWonder)
            return {imgElement: natWonder, scaleType: HexType.TERRAIN};
    }

    return {imgElement: undefined, scaleType: -1};
}

export function getWonder(tile: TileType, wonderMap: Map<TileWonders, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.Wonder !== TileNone.NONE)
    {
        const wonder = wonderMap.get(tile.Wonder);

        if (wonder)
            return {imgElement: wonder, scaleType: HexType.DISTRICT};
    }

    return {imgElement: undefined, scaleType: -1};
}

export function getDistrict(tile: TileType, districtMap: Map<TileDistricts | TileUniqueDistricts, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.District !== TileNone.NONE)
    {
        const district = districtMap.get(tile.District);

        if (district)
            return {imgElement: district, scaleType: HexType.DISTRICT};
    }

    return {imgElement: undefined, scaleType: -1};
}

export function getTerrain(tile: TileType, terrainMap: Map<TerrainFeatureKey, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.TerrainType !== TileNone.NONE && tile.TerrainType !== TileTerrain.RIVER && !hasNaturalWonder(tile.FeatureType))
    {
        const terrain = terrainMap.get(`${tile.TerrainType}_${tile.FeatureType}`);

        if (terrain)
            return {imgElement: terrain, scaleType: HexType.TERRAIN};
    }

    return {imgElement: undefined, scaleType: -1};
}

export function getResource(tile: TileType, terrainMap: Map<TileBonusResources | TileLuxuryResources | TileStrategicResources | TileArtifactResources, HTMLImageElement>): {imgElement: HTMLImageElement | undefined, scaleType: number}
{
    if (tile.ResourceType !== TileNone.NONE)
    {
        const resource = terrainMap.get(tile.ResourceType);

        if (resource)
            return {imgElement: resource, scaleType: HexType.RESOURCE};
    }

    return {imgElement: undefined, scaleType: -1};
}