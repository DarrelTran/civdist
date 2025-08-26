import { TileType } from "../../../types/types";

export function getMinMaxXY(theJSON: TileType[]) 
{
    const allX = theJSON.map(tile => tile.X);
    const allY = theJSON.map(tile => tile.Y);

    return {
        minX: Math.min(...allX),
        maxX: Math.max(...allX),
        minY: Math.min(...allY),
        maxY: Math.max(...allY),
    };
}

/**
 * 
 * @param x Oddr X;
 * @param y Oddr Y;
 * @returns Converts the x and y into an oddr string for use in the mapPage's map caches.
 */
export function getMapOddrString(x: number, y: number)
{
    return `${x},${y}`;
}

/**
 * 
 * @param oddrStr Oddr str from getMapOddrString
 * @returns The col & row of the oddr if no errors occured. If any errors occured returns -1 for the col and row.
 */
export function getOddrFromOddrString(oddrStr: string): {col: number, row: number}
{
    const badRes = {col: -1, row: -1};
    const parts = oddrStr.split(',').map(Number);

    if (parts.length !== 2)
        return badRes;

    const [col, row] = parts.map(Number);

    if (Number.isNaN(col) || Number.isNaN(row))
        return badRes;

    return {col: col, row: row};
}

export function getTextWidth(text: string, font: string): number | undefined
{
    let canvas = document.createElement('canvas');

    const context = canvas?.getContext('2d');
    if (canvas && context)
    {
        context.font = font;
        const size = context.measureText(text);

        canvas.remove();

        return size.width;
    }

    canvas.remove();

    return undefined;
}

export function hexmapCacheToJSONArray(cache: Map<string, TileType>): TileType[]
{
    const jsonArray: TileType[] = [];

    cache.forEach((tile) => 
    {
        jsonArray.push(tile);
    })

    return jsonArray;
}

export function downloadMapJSON(theJSON: TileType[], fileName: string)
{
    const parsedJSON = JSON.stringify(theJSON)

    let element = document.createElement('a');

    element.setAttribute('href',
        'data:text/plain;charset=utf-8,'
        + encodeURIComponent(parsedJSON));

    element.setAttribute('download', fileName);
    document.body.appendChild(element);
    element.click();

    element.remove();
}