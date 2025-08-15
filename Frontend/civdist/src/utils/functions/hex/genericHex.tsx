

// https://www.redblobgames.com/grids/hexagons

import { TileType } from "../../../types/types";

export function hexAxialRound(cubeCoords: {q: number, r: number, s: number})
{
    let q = Math.round(cubeCoords.q);
    let r = Math.round(cubeCoords.r);
    let s = Math.round(cubeCoords.s);

    const q_diff = Math.abs(q - cubeCoords.q);
    const r_diff = Math.abs(r - cubeCoords.r);
    const s_diff = Math.abs(s - cubeCoords.s);

    if (q_diff > r_diff && q_diff > s_diff)
        q = -r-s;
    else if (r_diff > s_diff)
        r = -q-s;
    else
        s = -q-r

    return {q, r, s};
}

export function oddrToAxial(hex: {x: number, y: number}): {q: number, r: number, s: number}
{
    let parity = hex.y & 1;

    const q = hex.x - (hex.y - parity) / 2;
    const r = hex.y;
    const s = -q - r;

    return {q, r, s};
}

export function axialToOddr(hex: {q: number, r: number, s: number})
{
    let parity = hex.r&1;
    let col = hex.q + (hex.r - parity) / 2;
    let row = hex.r;

    return {col, row};
}

/**
 * 
 * @param n The nth point on the hex. Point 0 is the bottom point on the right side of the hex and subsequent points are located on a counter-clockwise basis. Values >6 are the same as n % 6.
 * @param startingPos Typically the center of the hex, in pixels.
 * @returns 
 */
export function getHexPoint(n: number, startingPos: {x: number, y: number}, tileSize: {x: number, y: number}): {x: number, y: number}
{
    const angleDeg = 60 * n - 30;
    const angleRad = Math.PI / 180 * angleDeg;

    return {x: startingPos.x + tileSize.x * Math.cos(angleRad), y: startingPos.y + tileSize.y * Math.sin(angleRad)};
}

export function oddrToPixel(col: number, row: number, sizeX: number, sizeY: number, hexMapOffset: {x: number, y: number}) 
{
    // hex to cartesian
    const x = Math.sqrt(3) * (col + 0.5 * (row & 1)) * sizeX + hexMapOffset.x;
    const y = 3/2 * row * sizeY + hexMapOffset.y;

    return { x, y };
}

export function pixelToAxial(point: {x: number, y: number}, size: {x: number, y: number}, hexMapOffset: {x: number, y: number})
{
    // invert the scaling
    const x = (point.x - hexMapOffset.x) / size.x;
    const y = (point.y - hexMapOffset.y) / size.y;
    // cartesian to hex
    const q = (Math.sqrt(3)/3 * x  -  1/3 * y);
    const r = (2/3 * y);
    const s = -q - r;

    return hexAxialRound({q, r, s});
}

export function pixelToOddr(point: {x: number, y: number}, size: {x: number, y: number}, hexMapOffset: {x: number, y: number})
{
    return axialToOddr(pixelToAxial(point, size, hexMapOffset));
}

/**
 * @param oddr1 
 * @param oddr2 
 * @returns The angle between two hexagons in degrees - angle from oddr1 to oddr2.
 * - 0 = East
 * - 60 = Northeast
 * - 120 = Northwest
 * - 180 = West
 * - 240 = Southwest
 * - 300 = Southeast
 */
export function getAngleBetweenTwoOddrHex(oddr1: {x: number, y: number}, oddr2: {x: number, y: number})
{
    const axial1 = oddrToAxial(oddr1);
    const axial2 = oddrToAxial(oddr2);

    const dq = axial2.q - axial1.q;
    const dr = axial2.r - axial1.r;

    const angleRad = Math.atan2(dr, dq);
    const angleDegrees = angleRad * (180 / Math.PI);

    return angleDegrees;
}

export function getDistanceBetweenTwoOddrHex(oddr1: {x: number, y: number}, oddr2: {x: number, y: number})
{
    const even = (num: number) => {return (num % 2 == 0)};
    const odd = (num: number) => {return (num % 2 == 1)};

    const dx = oddr2.x - oddr1.x;
    const dy = oddr2.y - oddr1.y;
    const penalty = ( (even(oddr1.y) && odd(oddr2.y) && (oddr1.x < oddr2.x)) || (even(oddr2.y) && odd(oddr1.y) && (oddr2.x < oddr1.x)) ) ? 1 : 0;
    const distance = Math.max(Math.abs(dy), Math.abs(dx) + Math.floor(Math.abs(dy) / 2) + penalty); 

    return distance;
}

/**
 * Requires conversion from oddr to cube first.
 * @param cube1Vec 
 * @param cube2Vec 
 * @returns 2D cross product.
 */
export function getCubeCrossProduct(cube1Vec: {q: number, r: number, s: number}, cube2Vec: {q: number, r: number, s: number})
{
    return cube1Vec.q * cube2Vec.r - cube1Vec.r * cube2Vec.q;
}

/**
 * Vector parameter order doesn't matter.
 * @param cube1Vec 
 * @param cube2Vec 
 * @returns 
 */
export function getCubeDotProduct(cube1Vec: {q: number, r: number, s: number}, cube2Vec: {q: number, r: number, s: number})
{
    return cube1Vec.q * cube2Vec.q + cube1Vec.r * cube2Vec.r;
}

/**
 * 
 * @param cube1 
 * @param cube2 
 * @returns (cube2 - cube1).
 */
export function getCubeVector(cube2: {q: number, r: number, s: number}, cube1: {q: number, r: number, s: number}): {q: number, r: number, s: number}
{
    return {q: cube2.q - cube1.q, r: cube2.r - cube1.r, s: cube2.s - cube1.s};
}

/**
 * 
 * @param baseTile 
 * @param targetTile 
 * @param checkTile 
 * @param angleThreshold 
 * @param checkHexDistance How many hexes away from the baseTile the checkTile can be. 
 * @returns If the checkTile is pointed towards the targetTile and in front of the baseTile.
 */
export function isFacingTargetHex(baseTile: TileType, targetTile: TileType, checkTile: TileType, angleThreshold: number, checkHexDistance: number): boolean
{
    const base = oddrToAxial({ x: baseTile.X, y: baseTile.Y });
    const target = oddrToAxial({ x: targetTile.X, y: targetTile.Y });
    const check = oddrToAxial({ x: checkTile.X, y: checkTile.Y });

    // keep relationship between target, base, and check
    const baseToTarget = getCubeVector(base, target);
    const baseToCheck = getCubeVector(base, check);

    const dot = getCubeDotProduct(baseToTarget, baseToCheck);

    // lengths
    const lenA = Math.hypot(baseToTarget.q, baseToTarget.r);
    const lenB = Math.hypot(baseToCheck.q, baseToCheck.r);

    // cosine similarity - [-1, 1], just to get the angle
    // 0 = perpendicular
    // 1 = perfectly aligned
    // 1 = opposite
    const cosine = dot / (lenA * lenB);

    // Math.min/max to prevent weird decimals
    const angle = Math.acos(Math.max(-1, Math.min(1, cosine))) * (180 / Math.PI);

    const isInFrontCone = angle <= angleThreshold;

    const isClose = getDistanceBetweenTwoOddrHex({ x: baseTile.X, y: baseTile.Y }, { x: checkTile.X, y: checkTile.Y }) <= checkHexDistance;

    if (isInFrontCone && isClose) 
    {
        return true;
    }

    return false;
}

/**
 * Offsets are ordered counterclockwise - uses oddr coordinates.
 * @param row 
 * @returns 
 */
export function getOffsets(row: number): number[][]
{
    const offsets = (row % 2 === 0) ? [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]] : [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]];

    return offsets;
}