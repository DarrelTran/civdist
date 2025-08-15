import { HexType, TileType } from "../../../types/types";
import { getMinMaxXY } from "../misc/misc";

/**
 * How small the hex is compared to the image itself because the <image> element uses the whole image, not just the hex.
 * Want to scale the hex inside to the image so that it fills the tiles and images have no gaps between each other.
 * @param imgSize 
 * The size of the image on file in terms of:
 * - x (width)
 * - y (height)
 * @param imgTileSize 
 * The size of the hex/tile in the image in terms of:
 * - x (size/length from the center -> horizontal edge)
 * - y (size/length from the center -> vertical edge)
 * @returns 
 * The multiplicative scale factor in terms of: 
 * - width
 * - height
 */
export function getScale(imgSize: {x: number, y: number}, imgTileSize: {x: number, y: number}): {scaleW: number, scaleH: number}
{
    let ratioX = imgTileSize.x / imgSize.x;
    let ratioY = imgTileSize.y / imgSize.y;

    return {scaleW: 1 / ratioX, scaleH: 1 / ratioY};
}

/**
 * 
 * @param imgType 
 * The image type returned from getImageType().
 * @returns 
 * The multiplicative scale factor in terms of: 
 * - width
 * - height
 */
export function getScaleFromType(imgType: number): {scaleW: number, scaleH: number}
{
    // all images are 128x128 px
    // and all district, terrain, etc images are of the same size if they belong to the same category 
    // ex: terrain images are always the same size (img and hex wise)

    if (imgType === HexType.DISTRICT)           return getScale({x: 128, y: 128}, {x: 32, y: 32}); // actually 56x64, but this is to make the tile fit nicer
    else if (imgType === HexType.TERRAIN)       return getScale({x: 128, y: 128}, {x: 32, y: 32});
    else if (imgType === HexType.RESOURCE)      return getScale({x: 38, y: 38}, {x: 19, y: 19});
    else if (imgType === HexType.YIELD)   return getScale({x: 128, y: 128}, {x: 24, y: 24});

    return {scaleW: -1, scaleH: -1};
}

export function getScaledGridSizesFromTile(tileSize: {x: number, y: number}, mapJSON: TileType[]) 
{
    const { minX, maxX, minY, maxY } = getMinMaxXY(mapJSON);
    const mapCols = maxX - minX + 1;
    const mapRows = maxY - minY + 1;

    const gridW = tileSize.x * Math.sqrt(3) * (mapCols + 2);
    const gridH = tileSize.y * 3/2 * (mapRows + 2);

    return { gridX: gridW, gridY: gridH };
}

export function getTileScaleOddr(minAndMaxCoords: {minX: number, maxX: number, minY: number, maxY: number}, baseTileSize: number, winSize: {width: number, height: number}): number 
{
    const { minX, maxX, minY, maxY } = minAndMaxCoords;

    const mapCols = maxX - minX + 1;
    const mapRows = maxY - minY + 1;

    const naturalWidth = Math.sqrt(3) * baseTileSize * (mapCols + 0.5); 
    const naturalHeight = baseTileSize * 3/2 * mapRows;

    const scaleX = winSize.width / naturalWidth;
    const scaleY = winSize.height / naturalHeight;

    return Math.min(scaleX, scaleY);
}

export function getScaledGridAndTileSizes(baseTileSize: number, minAndMaxCoords: {minX: number, maxX: number, minY: number, maxY: number}, winSize: {width: number, height: number}): { tileX: number, tileY: number, gridX: number, gridY: number } 
{
    const scale = getTileScaleOddr(minAndMaxCoords, baseTileSize, winSize);
    let tileW = baseTileSize * scale;
    let tileH = baseTileSize * scale;

    const minTileW = 8;
    const minTileH = 8;

    if (tileW < minTileW)
        tileW = minTileW;
    if (tileH < minTileH)
        tileH = minTileH;

    const { minX, maxX, minY, maxY } = minAndMaxCoords;

    const mapCols = maxX - minX + 1;
    const mapRows = maxY - minY + 1;

    // width of hex = sqrt3 * size 
    const gridW = tileW * Math.sqrt(3) * (mapCols + 2);  // adding +2 works for some reason???

    // height of hex = 3/2 * size
    const gridH = tileH * 3/2 * (mapRows + 2); 

    return { tileX: tileW, tileY: tileH, gridX: gridW, gridY: gridH };
}