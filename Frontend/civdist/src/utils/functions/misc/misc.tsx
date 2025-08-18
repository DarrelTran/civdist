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

export function getSaveID(saveType: string, idNumber: number)
{
    return `${saveType},${idNumber}`;
}

/**
 * 
 * @param idStr Save str from getSaveID
 * @returns The save type & id if no errors occured. If any errors occured returns null for the string and -1 for the id.
 */
export function getIDFromSaveID(idStr: string): {type: string | null, id: number}
{
    const badRes = {type: null, id: -1};
    const parts = idStr.split(',');

    if (parts.length !== 2)
        return badRes;

    const [type, id] = parts;
    const idNum = Number(id);

    // the type should never be empty
    if (type.length <= 0 || Number.isNaN(idNum))
        return badRes;

    return {type: type, id: idNum};
}

export function getTextWidth(text: string, font: string, canvas: HTMLCanvasElement | null): number | undefined
{
    const context = canvas?.getContext('2d');
    if (canvas && context)
    {
        context.font = font;
        const size = context.measureText(text);

        return size.width;
    }

    return undefined;
}