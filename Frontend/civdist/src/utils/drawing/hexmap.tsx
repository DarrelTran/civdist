import { getDistrict, getDistrictHighlighter, getNaturalWonder, getResource, getTerrain, getWonder } from "../../images/imageAttributeFinders";
import { HexType, RiverDirections, TileArtifactResources, TileBonusResources, TileDistricts, TileLuxuryResources, TileNaturalWonders, TileNone, TileStrategicResources, TileType, TileUniqueDistricts, TileWonders } from "../../types/civTypes";
import {MiscImages, TerrainFeatureKey} from '../../types/imageTypes'
import { BASE_TILE_SIZE } from "../constants";
import { getHexPoint, getMapOddrString, getOddrFromOddrString, getOffsets, oddrToPixel } from "../hex/genericHex";
import { getScaleFromType } from "../imgScaling/scaling";
import { getTextWidth } from "../misc/misc";

/**
 * 
 * @param tile 
 * Hex tile of TileType.
 * @returns 
 * The image type where imageType is the path to the actual image and scaleType returns the generic kind of image that will be displayed.
 * Returns an empty string if the tile cannot be resolved.
 * Assumes that the terrain, district, wonder, and natural wonder maps are already initialized.
 * - Prioritization: Natural wonders > wonders > districts > terrain
 */
export function getImageAttributes
(
    tile: TileType, 
    natWondersCache: Map<TileNaturalWonders, HTMLImageElement>, 
    wondersCache: Map<TileWonders, HTMLImageElement>,
    districtCache: Map<TileDistricts | TileUniqueDistricts, HTMLImageElement>,
    terrainCache: Map<TerrainFeatureKey, HTMLImageElement>
):
{imgElement: HTMLImageElement | undefined, scaleType: number}
{    
    const natWonder = getNaturalWonder(tile, natWondersCache);
    const wonder = getWonder(tile, wondersCache);
    const district = getDistrict(tile, districtCache);
    const terrain = getTerrain(tile, terrainCache);

    if (natWonder.imgElement && natWonder.scaleType !== HexType.UNKNOWN)
        return natWonder;
    else if (wonder.imgElement && wonder.scaleType !== HexType.UNKNOWN)
        return wonder;
    else if (district.imgElement && district.scaleType !== HexType.UNKNOWN)
        return district;
    else if (terrain.imgElement && terrain.scaleType !== HexType.UNKNOWN)
        return terrain;

    return {imgElement: undefined, scaleType: -1};
}

export function getHexMapOffset(tileSize: {x: number, y: number})
{
    /**
     * - Shifting hex img's by the subtraction seen in drawMap() keeps correct oddr coordinate detection but visuals will break
     * - Adding this offset fixes the visuals and keeps the coordinates correct
     */
    return {x: tileSize.x * 2, y: tileSize.y * 2};
}

export function drawHexImage
(
    context: CanvasRenderingContext2D, 
    tile: TileType, 
    opacity: number, 
    img: HTMLImageElement,
    natWondersCache: Map<TileNaturalWonders, HTMLImageElement>, 
    wondersCache: Map<TileWonders, HTMLImageElement>,
    districtCache: Map<TileDistricts | TileUniqueDistricts, HTMLImageElement>,
    terrainCache: Map<TerrainFeatureKey, HTMLImageElement>,
    tileSize: {x: number, y: number},
    gridSize: {x: number, y: number}
)
{
    const hexMapOffset = getHexMapOffset(tileSize);
    const px = oddrToPixel(tile.X, tile.Y, tileSize.x, tileSize.y, hexMapOffset);
    const imgAttributes = getImageAttributes(tile, natWondersCache, wondersCache, districtCache, terrainCache);
    const scale = getScaleFromType(imgAttributes.scaleType); 

    const drawWidth = tileSize.x * scale.scaleW;
    const drawHeight = tileSize.y * scale.scaleH;

    context.save();
    // flip y coords to make everything look like in-game civ6
    context.scale(1, -1);
    context.translate(0, -gridSize.y);

    context.globalAlpha = opacity;

    context.drawImage(img, px.x - drawWidth / 2, px.y - drawHeight / 2, drawWidth, drawHeight);

    context.globalAlpha = 1;

    context.restore();
}

export function drawYieldsOnTile
(
    context: CanvasRenderingContext2D, 
    tile: TileType, 
    yieldAttr: {imgElement: HTMLImageElement | undefined, scaleType: HexType}[],
    tileSize: {x: number, y: number},
    gridSize: {x: number, y: number}
)
{
    const hexMapOffset = getHexMapOffset(tileSize);
    const px = oddrToPixel(tile.X, tile.Y, tileSize.x, tileSize.y, hexMapOffset);
    const imgAttributes = yieldAttr;

    // only using the tile scale instead of the img scale as the tile scale changes on zoom change
    const tileScaleY = tileSize.y / BASE_TILE_SIZE;
    const tileScaleX = tileSize.x / BASE_TILE_SIZE;
    
    const leftTop = getHexPoint(3, px, tileSize);
    const leftBottom = getHexPoint(4, px, tileSize);
    const left = {x: leftTop.x, y: (leftTop.y + leftBottom.y) / 2};

    const rightTop = getHexPoint(0, px, tileSize);
    const rightBottom = getHexPoint(1, px, tileSize);
    const right = {x: rightTop.x, y: (rightTop.y + rightBottom.y) / 2};

    let yieldPosIndex = 0;
    const yieldPositions: {x: number, y: number}[] = 
    [
        // top-left
        {x: left.x + 4 * tileScaleX, y: left.y + 4 * tileScaleY},
        // top-middle
        {x: px.x, y: px.y + 4 * tileScaleY},
        // top-right
        {x: right.x - 4 * tileScaleX, y: right.y + 4 * tileScaleX},
        // bottom-left 
        {x: left.x + 4 * tileScaleX, y: left.y - 4 * tileScaleY},
        // bottom-middle
        {x: px.x, y: px.y - 4 * tileScaleY},
        // bottom-right
        {x: right.x - 4 * tileScaleX, y: right.y - 4 * tileScaleX}
    ];

    imgAttributes.forEach((attr) => 
    {
        if (!attr.imgElement || attr.scaleType === HexType.UNKNOWN)
            return;

        const scale = getScaleFromType(attr.scaleType); 
        const img = attr.imgElement;

        const drawWidth = tileSize.x / 8 * scale.scaleW;
        const drawHeight = tileSize.y / 8 * scale.scaleH;

        if (img)
        {
            context.save();

            context.scale(1, -1);
            context.translate(0, -gridSize.y);

            context.drawImage(img, yieldPositions[yieldPosIndex].x - drawWidth / 2, yieldPositions[yieldPosIndex].y - drawHeight / 2, drawWidth, drawHeight);
            context.restore();

            ++yieldPosIndex;
        }
    })
}

export function drawResourceOnTile
(
    context: CanvasRenderingContext2D, 
    tile: TileType,
    tileSize: {x: number, y: number},
    gridSize: {x: number, y: number},
    resourceImages: Map<TileBonusResources | TileLuxuryResources | TileStrategicResources | TileArtifactResources, HTMLImageElement>
)
{
    if (tile.ResourceType !== TileNone.NONE && tile.District === TileNone.NONE)
    {
        const hexMapOffset = getHexMapOffset(tileSize);
        const px = oddrToPixel(tile.X, tile.Y, tileSize.x, tileSize.y, hexMapOffset);
        const imgAttributes = getResource(tile, resourceImages);

        if (!imgAttributes.imgElement || imgAttributes.scaleType === HexType.UNKNOWN)
            return;

        const scale = getScaleFromType(imgAttributes.scaleType); 
        const img = imgAttributes.imgElement;

        // divide 2 since want img centered on tile and resources are roughly half the tile's size
        // resource = 19x19 ; tile = 32x32
        const drawWidth = tileSize.x / 2 * scale.scaleW;
        const drawHeight = tileSize.y / 2 * scale.scaleH;

        if (img)
        {
            context.save();

            context.scale(1, -1);
            context.translate(0, -gridSize.y);

            context.drawImage(img, px.x - drawWidth / 2, px.y - drawHeight / 2, drawWidth, drawHeight);

            context.restore();
        }
    }
}

export function wrapCol(x: number, minAndMaxCoords: {minX: number, maxX: number, minY: number, maxY: number})
{
    const { minX, maxX } = minAndMaxCoords;
    const width = maxX - minX + 1;
    // assuming min starts at 0
    return ((x + width) % width);
};

export function wrapRow(y: number, minAndMaxCoords: {minX: number, maxX: number, minY: number, maxY: number})
{
    const { minY, maxY } = minAndMaxCoords;
    const height = maxY - minY + 1;
    return ((y + height) % height);
};

/**
 * 
 * @param context 
 * @param point1 The starting point
 * @param point2 The last point
 * @param strokeStyle 
 * @param lineWidth 
 */
export function drawLine
(
    context: CanvasRenderingContext2D, 
    point1: {x: number, y: number}, 
    point2: {x: number, y: number}, 
    strokeStyle: string, 
    lineWidth: number,
    gridSize: {x: number, y: number}
)
{
    context.save();

    context.scale(1, -1);
    context.translate(0, -gridSize.y);

    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.stroke();

    context.restore();
}

export function drawRiver6PossibleDirections
(
    context: CanvasRenderingContext2D, 
    riverDirection: RiverDirections, 
    startingPos: {x: number, y: number},
    tileSize: {x: number, y: number},
    gridSize: {x: number, y: number}
)
{
    if (riverDirection === RiverDirections.EAST)
    {
        drawLine(context, getHexPoint(0, startingPos, tileSize), getHexPoint(1, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8), gridSize);
    }
    else if (riverDirection === RiverDirections.NORTHEAST)
    {
        drawLine(context, getHexPoint(1, startingPos, tileSize), getHexPoint(2, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8), gridSize);
    }
    else if (riverDirection === RiverDirections.NORTHWEST)
    {
        drawLine(context, getHexPoint(2, startingPos, tileSize), getHexPoint(3, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8), gridSize);
    }
    else if (riverDirection === RiverDirections.SOUTHEAST)
    {
        drawLine(context, getHexPoint(5, startingPos, tileSize), getHexPoint(6, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8), gridSize);
    }
    else if (riverDirection === RiverDirections.SOUTHWEST)
    {
        drawLine(context, getHexPoint(4, startingPos, tileSize), getHexPoint(5, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8), gridSize);
    }
    else if (riverDirection === RiverDirections.WEST)
    {
        drawLine(context, getHexPoint(3, startingPos, tileSize), getHexPoint(4, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8), gridSize);
    }
}

/**
 * Assume drawn using the cache as hovering over a tile (necessary for click) only considers drawing from the cache. 
 * @param context 
 */
export function drawBorderLines
(
    context: CanvasRenderingContext2D, 
    cityBoundaryTiles: Map<string, string[]>,
    tileSize: {x: number, y: number},
    gridSize: {x: number, y: number},
    minAndMaxCoords: {minX: number, maxX: number, minY: number, maxY: number}
) 
{
    const hexMapOffset = getHexMapOffset(tileSize);
    cityBoundaryTiles.forEach((neighbors, tileKey) => 
    {
        const parsedStr = getOddrFromOddrString(tileKey);

        if (parsedStr.col === -1 || parsedStr.row === -1)
            return;

        const col = parsedStr.col;
        const row = parsedStr.row;

        const center = oddrToPixel(col, row, tileSize.x, tileSize.y, hexMapOffset);
        
        // check against all hex edges
        const offsets = getOffsets(row);

        offsets.forEach(([dx, dy], i) => 
        {
            const neighborKey = getMapOddrString(wrapCol(col + dx, minAndMaxCoords), wrapRow(row + dy, minAndMaxCoords));
            
            if (!neighbors.includes(neighborKey)) 
                return; // if hex edge has neighbor not owned by city = draw on that edge

            const start = getHexPoint(i, center, tileSize);
            const end = getHexPoint((i + 1) % 6, center, tileSize);

            drawLine(context, start, end, 'yellow', Math.min(tileSize.x, tileSize.y) / 20, gridSize);
        });
    });
} 

/**
 * Will try to draw from the river cache, otherwise, will draw using the hexmapcache.
 * @param context 
 * @param tileSize 
 * @param gridSize 
 * @param riverTiles 
 * @param hexmapCache 
 */
export function drawRiversFromCache
(
    context: CanvasRenderingContext2D,
    tileSize: {x: number, y: number},
    gridSize: {x: number, y: number},
    riverTiles: TileType[],
    hexmapCache: Map<string, TileType>
)
{
    const drawRiverTile = (context: CanvasRenderingContext2D, tile: TileType) => 
    {
        const hexMapOffset = getHexMapOffset(tileSize);
        const [col, row] = [tile.X, tile.Y];
        const px = oddrToPixel(col, row, tileSize.x, tileSize.y, hexMapOffset);

        let IsNEOfRiver = tile.IsNEOfRiver;
        let IsNWOfRiver = tile.IsNWOfRiver;
        let IsWOfRiver = tile.IsWOfRiver;

        if (IsNEOfRiver)
            drawRiver6PossibleDirections(context, RiverDirections.SOUTHWEST, px, tileSize, gridSize);
        if (IsNWOfRiver)
            drawRiver6PossibleDirections(context, RiverDirections.SOUTHEAST, px, tileSize, gridSize);
        if (IsWOfRiver)
            drawRiver6PossibleDirections(context, RiverDirections.EAST, px, tileSize, gridSize);
    }

    if (riverTiles.length <= 0)
    {
        hexmapCache.forEach((tile, oddr) => 
        {
            drawRiverTile(context, tile)
        });
    }
    else
    {
        riverTiles.forEach((tile) => 
        {
            drawRiverTile(context, tile);
        })
    }
}

export function drawCityHighlight
(
    context: CanvasRenderingContext2D, 
    tile: TileType, 
    tileSize: {x: number, y: number}, 
    gridSize: {x: number, y: number}, 
    highlightType: MiscImages.CURRENT_CITY | MiscImages.ENEMY_CITY, 
    opacity: number,
    miscMap: Map<MiscImages, HTMLImageElement>
)
{
    const hexMapOffset = getHexMapOffset(tileSize);
    const px = oddrToPixel(tile.X, tile.Y, tileSize.x, tileSize.y, hexMapOffset);
    const imgAttributes = getDistrictHighlighter(highlightType, miscMap);
    const scale = getScaleFromType(imgAttributes.scaleType); 

    const drawWidth = tileSize.x * scale.scaleW;
    const drawHeight = tileSize.y * scale.scaleH;

    const img = imgAttributes.imgElement;

    if (img)
    {
        context.save();
        
        context.scale(1, -1);
        context.translate(0, -gridSize.y);

        context.globalAlpha = opacity;

        context.drawImage(img, px.x - drawWidth / 2, px.y - drawHeight / 2, drawWidth, drawHeight);

        context.globalAlpha = 1;

        context.restore();
    }
}

/**
 * @param context 2D canvas context.
 * @param px X & y pixel coordinates of the text box. Assumes that the hexmap has flipped y coordinates.
 * @param text 
 */
export function drawTextWithBox
(
    context: CanvasRenderingContext2D, 
    px: {x: number, y: number}, 
    text: string,
    tileSize: {x: number, y: number},
    gridSize: {x: number, y: number}
)
{
    context.save();

    // keep in line with the flipped hexmap
    context.scale(1, -1);
    context.translate(0, -gridSize.y);
    // flip upright
    context.scale(1, -1);

    const minTile = Math.min(tileSize.x, tileSize.y);
    const fontSize = minTile / 1.5;
    //const fontSize = minGrid / minTile;
    const font = `${fontSize}px arial`;

    const textWidth = getTextWidth(text, font);

    if (textWidth)
    {
        context.globalAlpha = 0.5;

        context.beginPath();

        let xPosRect = px.x;
        let yPosRect = -px.y - ((fontSize * 2) / 1.5);
        let widthRect = textWidth * 1.5;
        let heightRect = fontSize * 2;
        let finalXPosRect = xPosRect + widthRect;

        let xPosText = px.x + (textWidth / 4);
        let yPosText = -px.y;

        if (finalXPosRect >= gridSize.x)
        {
            let diff = (finalXPosRect - gridSize.x) * 1.1;
            xPosRect = xPosRect - diff;
            xPosText = xPosText - diff;
        }

        context.rect(xPosRect, yPosRect, widthRect, heightRect);
        context.fill();

        context.globalAlpha = 1;

        context.fillStyle = 'white';
        context.font = font;

        context.fillText(text, xPosText, yPosText);
    }

    context.restore();
}