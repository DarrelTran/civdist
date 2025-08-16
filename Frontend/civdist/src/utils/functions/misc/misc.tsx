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