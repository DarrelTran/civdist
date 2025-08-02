/**
 * Offsets are ordered counterclockwise.
 * @param row 
 * @returns 
 */
export function getOffsets(row: number): number[][]
{
    const offsets = (row % 2 === 0) ? [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]] : [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]];

    return offsets;
}

/**
 * 
 * @param x 
 * @param y 
 * @returns Converts the x and y into an oddr string for use in the mapPage's map caches.
 */
export function getMapOddrString(x: number, y: number)
{
    return `${x},${y}`;
}