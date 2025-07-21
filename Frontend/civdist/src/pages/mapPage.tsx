import React, {useEffect, useState, useRef, useCallback} from 'react';
import { Link } from 'react-router-dom';
import { HexGrid, Layout, Hexagon} from 'react-hexgrid';
import './mapPage.css'
import './allPages.css';
import mapData from '../json/duel.json'
import {HexType, RiverDirections, TileType} from '../utils/types'

// terrain images
import {coast, desert_hills, desert_mountain, desert, grass_hills, grass_mountain, grass_forest, grass_hills_forest, grass, ocean, plains_hills, plains_mountain, plains_forest, plains_hills_forest, plains_jungle, plains_hills_jungle, plains, river, snow_hills, snow_mountain, snow, tundra_hills, tundra_mountain, tundra_forest, tundra_hills_forest, tundra} from '../images/terrainImport'
// district images
import {aqueduct_district, aerodome_district, center_district, commercial_district, encampment_district, entertainment_district, faith_district, harbor_district, industrial_district, neighborhood_district, rocket_district, science_district, theater_district} from '../images/districtImport'
// natural wonder images
import { cliffs_of_dover, crater_lake, dead_sea, galapagos_islands, great_barrier_reef, mount_everest, mount_lilimanjaro, pantanal, piopiotahi, torres_del_paine, tsingy_de_bemaraha, yosemite } from '../images/naturalWondersImport';
import { hover } from '@testing-library/user-event/dist/hover';

/*
/////////////////////////////////////////////////////////////////

TODO: Allow user to click on a city to focus on it and see city boundaries. CHANGE BOUNDARY OPACITY TO DRAW LINES. Change cityBoundaryTiles to a SET.
TODO: Checking adjacent tiles based on even or odd (for boundary) is correct??????????

TODO: Zoom breaks when resizing window!!

TODO: Add loading warning/prompt when map is being drawn

TODO: Add wonders - district

TODO: Add toggable hover with tile data and resize if too long with max width

TODO: Make toolbar on right of map. Change zoom to insert any value like textbox with limit of -50% to 150%?

TODO: Parse and save mapData to modify it so users can save their map? Change imageCache or minAndMaxCoords to useState since users can load new map?

TODO: Refactor code to make it nicer. Probably refactor drawing functions to make the more generic????

/////////////////////////////////////////////////////////////////
*/

const MapPage = () => 
{
    const baseTileSize : number = 10;

    const minAndMaxCoords = useRef<{minX: number, maxX: number, minY: number, maxY: number}>(getMinMaxXY()); // coords never change

    const [debugBool, setDebugBool] = useState<Boolean>(false); 
    const [winSize, setWinSize] = useState<{width: number, height: number}>({width: window.innerWidth, height: window.innerHeight});

    const [gridSize, setGridSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize).gridX, y: getScaledGridAndTileSizes(baseTileSize).gridY});
    const [tileSize, setTileSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize).tileX, y: getScaledGridAndTileSizes(baseTileSize).tileY});

    const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, REMOVE?????????
    const [currentTile, setCurrentTile] = useState<TileType>(); // store city name instead of entire tile???
    const [currentCity, setCurrentCity] = useState<TileType>();

    const [cityBoundaryTiles, setCityBoundaryTiles] = useState<TileType[]>([]); // city name, boundary tiles (List since city can own up to 36 tiles and boundary tiles should be way less than that)

    /**
     * - Shifting hex img's by the subtraction seen in drawMap() keeps correct oddr coordinate detection but visuals will break
     * - Adding this offset fixes the visuals and keeps the coordinates correct
     */
    const hexMapOffset = {x: tileSize.x * 2, y: tileSize.y * 2};

    const theCanvas = useRef<HTMLCanvasElement>(null);
    const imageCache = useRef<Map<string, {img: HTMLImageElement, tile: TileType}>>(new Map()); // oddr coords, {image, tile}
    const scrollRef = useRef<HTMLDivElement>(null);

    function getTextWidth(text: string, font: string)
    {
        const canvas = theCanvas.current;
        const context = canvas?.getContext('2d');
        if (canvas && context)
        {
            context.font = font;
            const size = context.measureText(text);

            return size.width;
        }
    }

    /**
     * SHOULD save context before calling this function and restore context after calling this function.
     * @param context 2D canvas context.
     * @param px X & y coordinates of the text box. Assumes that the hexmap has flipped y coordinates.
     * @param text 
     */
    function drawTextWithBox(context: CanvasRenderingContext2D, px: {x: number, y: number}, text: string)
    {
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
    }

    /**
     * 
     * @param context 
     * @param point1 The starting point
     * @param point2 The last point
     * @param strokeStyle 
     * @param lineWidth 
     */
    function drawLine(context: CanvasRenderingContext2D, point1: {x: number, y: number}, point2: {x: number, y: number}, strokeStyle: string, lineWidth: number)
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

    function drawRiver6PossibleDirections(context: CanvasRenderingContext2D, riverDirection: RiverDirections, startingPos: {x: number, y: number})
    {
        if (riverDirection === RiverDirections.EAST)
        {
            drawLine(context, getHexPoint(0, startingPos), getHexPoint(1, startingPos), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.NORTHEAST)
        {
            drawLine(context, getHexPoint(1, startingPos), getHexPoint(2, startingPos), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.NORTHWEST)
        {
            drawLine(context, getHexPoint(2, startingPos), getHexPoint(3, startingPos), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.SOUTHEAST)
        {
            drawLine(context, getHexPoint(5, startingPos), getHexPoint(6, startingPos), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.SOUTHWEST)
        {
            drawLine(context, getHexPoint(4, startingPos), getHexPoint(5, startingPos), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.WEST)
        {
            drawLine(context, getHexPoint(3, startingPos), getHexPoint(4, startingPos), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
    }

    function drawRiversFromCache(context: CanvasRenderingContext2D)
    {
        imageCache.current.forEach((value, oddr) => 
        {
            const [col, row] = oddr.split(',').map(Number);
            const px = oddrToPixel(col, row, tileSize.x, tileSize.y);

            let RiverEFlow = value.tile.RiverEFlow;
            let RiverSEFlow = value.tile.RiverSEFlow;
            let RiverSWFlow = value.tile.RiverSWFlow;

            let IsNEOfRiver = value.tile.IsNEOfRiver;
            let IsNWOfRiver = value.tile.IsNWOfRiver;
            let IsWOfRiver = value.tile.IsWOfRiver;

            context.globalAlpha = 0.75;

            if (RiverEFlow !== "NONE")
                drawRiver6PossibleDirections(context, RiverDirections.EAST, px);
            if (RiverSEFlow !== "NONE")
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHEAST, px);
            if (RiverSWFlow !== "NONE")
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHWEST, px);

            // draw missing rivers
            if (IsNEOfRiver)
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHWEST, px);
            if (IsNWOfRiver)
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHEAST, px);
            if (IsWOfRiver)
                drawRiver6PossibleDirections(context, RiverDirections.EAST, px);

            context.globalAlpha = 1;
        });
    }

    function drawRiversNoCache(context: CanvasRenderingContext2D)
    {
        mapData.forEach(tile => 
        {
            const px = oddrToPixel(tile.X, tile.Y, tileSize.x, tileSize.y);

            let RiverEFlow = tile.RiverEFlow;
            let RiverSEFlow = tile.RiverSEFlow;
            let RiverSWFlow = tile.RiverSWFlow;

            let IsNEOfRiver = tile.IsNEOfRiver;
            let IsNWOfRiver = tile.IsNWOfRiver;
            let IsWOfRiver = tile.IsWOfRiver;

            context.globalAlpha = 0.75;

            if (RiverEFlow !== "NONE")
                drawRiver6PossibleDirections(context, RiverDirections.EAST, px);
            if (RiverSEFlow !== "NONE")
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHEAST, px);
            if (RiverSWFlow !== "NONE")
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHWEST, px);

            // draw missing rivers
            if (IsNEOfRiver)
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHWEST, px);
            if (IsNWOfRiver)
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHEAST, px);
            if (IsWOfRiver)
                drawRiver6PossibleDirections(context, RiverDirections.EAST, px);

            context.globalAlpha = 1;
        });
    }

    function drawMapWithHoveredTile(context: CanvasRenderingContext2D, oddrCoord: {col: number, row: number}, opacity: number)
    {
        context.clearRect(0, 0, gridSize.x, gridSize.y);

        let textBoxPos = {x: -1, y: -1};
        let textBoxText = '';

        imageCache.current.forEach((value, oddr) => 
        {
            const [col, row] = oddr.split(',').map(Number);
            const imgAttributes = getImageAttributes(value.tile);
            const scale = getScaleFromType(imgAttributes.scaleType);

            const drawWidth = tileSize.x * scale.scaleW;
            const drawHeight = tileSize.y * scale.scaleH;
            const px = oddrToPixel(col, row, tileSize.x, tileSize.y);

            context.save();

            context.scale(1, -1);
            context.translate(0, -gridSize.y);

            context.globalAlpha = 1;

            if (oddrCoord.col === col && oddrCoord.row === row)
            {  
                if (value.tile.IsCity)
                {
                    textBoxPos = {x: px.x, y: px.y};
                    textBoxText = value.tile.CityName;
                }

                context.globalAlpha = opacity;
                setCurrentTile(value.tile);
            }

            for (let i = 0; i < cityBoundaryTiles.length; i++)
            {
                if (cityBoundaryTiles[i].X === col && cityBoundaryTiles[i].Y === row)
                {
                    context.globalAlpha = opacity;
                    break;
                }
            }

            context.drawImage(value.img, px.x - drawWidth / 2, px.y - drawHeight / 2, drawWidth, drawHeight);

            context.restore();
        });

        drawRiversFromCache(context);

        context.save();

        // keep in line with the flipped hexmap
        context.scale(1, -1);
        context.translate(0, -gridSize.y);
        // flip upright
        context.scale(1, -1);

        drawTextWithBox(context, {x: textBoxPos.x, y: textBoxPos.y}, textBoxText);

        context.restore();
    }
    
    const handleMouseHover = useCallback((key: string, oddrCoord: { col: number, row: number }) => 
    {
        const context = theCanvas.current?.getContext('2d');
        const hoveredImg = imageCache.current.get(key);
        if (hoveredImg && context && hoveredImg.img) 
        {
            drawMapWithHoveredTile(context, oddrCoord, 0.25);
        }
    }, [tileSize, gridSize, cityBoundaryTiles]); // to ensure latest values are used

    function getMousePos(e: MouseEvent): {x: number, y: number} | undefined
    {
        const rect = theCanvas.current?.getBoundingClientRect();
        if (!rect || !theCanvas.current) return undefined;

        const xPos = (e.clientX - rect.left) / (rect.right - rect.left) * theCanvas.current.width;
        const rawY = ((e.pageY - rect.top) / (rect.bottom - rect.top) * theCanvas.current.height) - window.scrollY;
        const yPos = theCanvas.current.height - rawY; // because map is flipped to make it look like the game

        return {x: xPos, y: yPos};
    }

    const handleMouseMove = useCallback((e: MouseEvent) => 
    {
        const mousePos = getMousePos(e);

        if (mousePos)
        {
            const oddrCoord = pixelToOddr(mousePos, tileSize);
            const key = `${oddrCoord.col},${oddrCoord.row}`;

            handleMouseHover(key, oddrCoord);
        }
    }, [handleMouseHover]); // add function like handleMouseHover as functions can change due to the function's dependencies

    const handleMouseClick = useCallback((e: MouseEvent) => 
    {
        const { minX, maxX, minY, maxY } = minAndMaxCoords.current;
        const mousePos = getMousePos(e);

        if (mousePos && scrollRef.current)
        {
            const { clientX, clientY } = e;

            const divRect = scrollRef.current.getBoundingClientRect(); // size will always be the same regardless of scroll
            const inDivBounds = clientX >= divRect.left && clientX <= divRect.right && clientY >= divRect.top && clientY <= divRect.bottom;

            const oddrCoord = pixelToOddr(mousePos, tileSize);
            const outOfHexBounds = oddrCoord.col < minX || oddrCoord.col > maxX || oddrCoord.row < minY || oddrCoord.row > maxY;

            // dont reset the clicked city stuff if click is out of bounds - only want to reset when click on the visible hexmap
            if (!inDivBounds || outOfHexBounds)
                return;
            
            if (currentTile && currentTile.IsCity)
            {
                if (!currentCity || (currentCity && currentCity.CityName !== currentTile.CityName))
                {
                    setCurrentCity(currentTile);

                    const neighborOffsetsEven = [[1,  0], [0, 1],   [-1, 1],
                                                [-1,  0], [-1, -1], [0, -1]];
                    const neighborOffsetsOdd  = [[1,  0], [1, 1],   [0, 1],
                                                [-1,  0], [0, -1],  [1, -1]];

                    let boundaryList: TileType[] = [];
                    imageCache.current.forEach((value, oddr) => 
                    {
                        const [col, row] = oddr.split(',').map(Number);

                        let bordersNonOwnedTiles = false;
                        if (value.tile.TileCity === currentTile.CityName)
                        {
                            if (row % 2 == 0)
                            {
                                neighborOffsetsEven.forEach((neighbor) => 
                                {
                                    let neighborCoord = {x: col + neighbor[0], y: row + neighbor[1]};
                                    let stringCoord = `${neighborCoord.x},${neighborCoord.y}`;
                                    let cacheTile = imageCache.current.get(stringCoord);
                                    if (cacheTile && cacheTile.tile.TileCity !== currentTile.CityName)
                                        bordersNonOwnedTiles = true;
                                });
                            }
                            else
                            {
                                neighborOffsetsOdd.forEach((neighbor) => 
                                {
                                    let neighborCoord = {x: col + neighbor[0], y: row + neighbor[1]};
                                    let stringCoord = `${neighborCoord.x},${neighborCoord.y}`;
                                    let cacheTile = imageCache.current.get(stringCoord);
                                    if (cacheTile && cacheTile.tile.TileCity !== currentTile.CityName)
                                        bordersNonOwnedTiles = true;
                                });
                            }
                        }

                        if (bordersNonOwnedTiles)
                            boundaryList.push(value.tile);
                    });

                    setCityBoundaryTiles(boundaryList);
                }
                else if (currentCity && currentCity.CityName === currentTile.CityName)
                {
                    setCityBoundaryTiles([]);
                    setCurrentCity(undefined);
                }
            }
            else
            {
                setCityBoundaryTiles([]);
                setCurrentCity(undefined);
            }
        }
    }, [tileSize, gridSize, currentTile, currentCity]);

    useEffect(() => 
    {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseClick);

        return () => 
        {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseClick)
        };
    }, [handleMouseMove, handleMouseClick]);

    useEffect(() => 
    {
        const handleResize = () => setWinSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => 
    {
        const sizes = getScaledGridAndTileSizes(baseTileSize);
        setTileSize({ x: sizes.tileX, y: sizes.tileY });
        setGridSize({ x: sizes.gridX, y: sizes.gridY });
    }, [winSize]);

    const drawMapNoCache = useCallback((context: CanvasRenderingContext2D) => 
    {
        const imageCacheTemp = new Map<string, { img: HTMLImageElement, tile: TileType }>();
        const imageCacheMountains = new Map<string, { img: HTMLImageElement, tile: TileType }>();
        const imageCacheOther = new Map<string, { img: HTMLImageElement, tile: TileType }>();

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        const tileW = tileSize.x;
        const tileH = tileSize.y;

        let loadCount = 0;
        let totalTiles = mapData.length;

        mapData.forEach(tile => 
        {
            const imgAttributes = getImageAttributes(tile);

            const img = new Image();
            img.src = imgAttributes.imagePath;

            img.onload = () => 
            {
                const key = `${tile.X},${tile.Y}`;
                const entry = { img, tile };

                if (tile.TerrainType?.includes("Mountain"))
                    imageCacheMountains.set(key, entry);
                else
                    imageCacheOther.set(key, entry);

                loadCount++;

                // .onload is asynchronous so wait for the last image to load and then draw everything
                if (loadCount === totalTiles) 
                {
                    const drawImages = (cache: Map<string, { img: HTMLImageElement, tile: TileType }>) => 
                    {
                        cache.forEach((value, key) => 
                        {
                            imageCacheTemp.set(key, value);

                            const imgAttributes = getImageAttributes(value.tile);
                            const scale = getScaleFromType(imgAttributes.scaleType);
                            const pixel = oddrToPixel(value.tile.X, value.tile.Y, tileW, tileH);

                            context.save();
                            // flip y coords to make everything look like in-game civ6
                            context.scale(1, -1);
                            context.translate(0, -gridSize.y);

                            const drawWidth = tileW * scale.scaleW;
                            const drawHeight = tileH * scale.scaleH;

                            for (let i = 0; i < cityBoundaryTiles.length; i++)
                            {
                                if (cityBoundaryTiles[i].X === value.tile.X && cityBoundaryTiles[i].Y === value.tile.X)
                                {
                                    context.globalAlpha = 0.25;
                                    break;
                                }
                            }

                            context.drawImage(
                                value.img,
                                pixel.x - drawWidth / 2,
                                pixel.y - drawHeight / 2,
                                drawWidth,
                                drawHeight
                            );

                            context.restore();
                        });
                    };

                    drawImages(imageCacheOther);     
                    drawImages(imageCacheMountains); // draw mountains last so overlapping parts show up
                    imageCache.current = imageCacheTemp;

                    drawRiversNoCache(context);
                }
            };
        });
    }, [tileSize, gridSize, cityBoundaryTiles]);

    const drawMapFromCache = useCallback((context: CanvasRenderingContext2D) =>
    {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        imageCache.current.forEach((value, oddr) => 
        {
            const [col, row] = oddr.split(',').map(Number);
            const imgAttributes = getImageAttributes(value.tile);
            const scale = getScaleFromType(imgAttributes.scaleType);

            const drawWidth = tileSize.x * scale.scaleW;
            const drawHeight = tileSize.y * scale.scaleH;
            const px = oddrToPixel(col, row, tileSize.x, tileSize.y);

            context.save();

            context.scale(1, -1);
            context.translate(0, -gridSize.y);

            for (let i = 0; i < cityBoundaryTiles.length; i++)
            {
                if (cityBoundaryTiles[i].X === value.tile.X && cityBoundaryTiles[i].Y === value.tile.Y)
                {
                    context.globalAlpha = 0.25;
                    break;
                }
            }

            context.drawImage(value.img, px.x - drawWidth / 2, px.y - drawHeight / 2, drawWidth, drawHeight);
            context.restore();
        });

        drawRiversFromCache(context);
    }, [tileSize, gridSize, cityBoundaryTiles]);

    useEffect(() => 
    {
        const context = theCanvas.current?.getContext('2d');
        if (context)
        {
            if (imageCache.current.size <= 0)
                drawMapNoCache(context);
            else
                drawMapFromCache(context);
        }
    }, [drawMapNoCache, drawMapFromCache]);

    return (
        <div style={{display: 'flex'}}>
            <div
                style=
                {{
                    overflow: 'scroll',
                    border: '1px solid black'
                }}
                ref={scrollRef}
            >
                <canvas
                    ref={theCanvas}
                    width={gridSize.x}
                    height={gridSize.y}
                    style={{display: 'block'}}
                />
            </div>

            <button onClick={() => {increaseZoom(1.1)}}>ZOOM</button>
            <button onClick={() => {decreaseZoom(1.1)}}>UN-ZOOM</button>

            <div>
                <select></select>
            </div>

            {<button onClick={testStuff}>TEST BUTTON</button>}
        </div>
    );

    /**
     * 
     * @param n The nth point on the hex. Point 0 is the bottom point on the right side of the hex and subsequent points are located on a counter-clockwise basis. Values >6 are the same as n % 6.
     * @param startingPos Typically the center of the hex.
     * @returns 
     */
    function getHexPoint(n: number, startingPos: {x: number, y: number}): {x: number, y: number}
    {
        let angleDeg = 60 * n - 30;
        let angleRad = Math.PI / 180 * angleDeg;
        return {x: startingPos.x + tileSize.x * Math.cos(angleRad), y: startingPos.y + tileSize.y * Math.sin(angleRad)};
    }

    function getScaledGridSizesFromTile(tileSize: {x: number, y: number}) 
    {
        const { minX, maxX, minY, maxY } = getMinMaxXY();
        const mapCols = maxX - minX + 1;
        const mapRows = maxY - minY + 1;

        const gridW = tileSize.x * Math.sqrt(3) * (mapCols + 2);
        const gridH = tileSize.y * 3/2 * (mapRows + 2);

        return { gridX: gridW, gridY: gridH };
    }

    function increaseZoom(zoomMultiplier: number) 
    {
        const theZoom = zoomLevel * zoomMultiplier;

        if (theZoom <= 2) 
        {
            const newTileSize = 
            {
                x: tileSize.x * zoomMultiplier,
                y: tileSize.y * zoomMultiplier
            };

            setZoomLevel(theZoom);
            setTileSize(newTileSize);

            // update gridSize (canvas size) to match enlarged map
            // since tiles got bigger
            // otherwise scroll won't show
            const sizes = getScaledGridSizesFromTile(newTileSize);
            setGridSize({ x: sizes.gridX, y: sizes.gridY });
        }
    }

    function decreaseZoom(zoomDivider: number) 
    {
        const theZoom = zoomLevel / zoomDivider;

        if (theZoom >= 0.5) 
        {
            const newTileSize = 
            {
                x: tileSize.x / zoomDivider,
                y: tileSize.y / zoomDivider
            };

            setZoomLevel(theZoom);
            setTileSize(newTileSize);

            const sizes = getScaledGridSizesFromTile(newTileSize);
            setGridSize({ x: sizes.gridX, y: sizes.gridY });
        }
    }

    // https://www.redblobgames.com/grids/hexagons/#hex-to-pixel
    function oddrToPixel(col: number, row: number, sizeX: number, sizeY: number) 
    {
        // hex to cartesian
        let x = Math.sqrt(3) * (col + 0.5 * (row & 1)) * sizeX + hexMapOffset.x;
        let y = 3/2 * row * sizeY + hexMapOffset.y;

        return { x, y };
    }

    function hexAxialRound(cubeCoords: {q: number, r: number, s: number})
    {
        let q = Math.round(cubeCoords.q);
        let r = Math.round(cubeCoords.r);
        let s = Math.round(cubeCoords.s);

        let q_diff = Math.abs(q - cubeCoords.q);
        let r_diff = Math.abs(r - cubeCoords.r);
        let s_diff = Math.abs(s - cubeCoords.s);

        if (q_diff > r_diff && q_diff > s_diff)
            q = -r-s;
        else if (r_diff > s_diff)
            r = -q-s;
        else
            s = -q-r

        return {q, r, s};
    }

    function pixelToAxial(point: {x: number, y: number}, size: {x: number, y: number})
    {
        // invert the scaling
        let x = (point.x - hexMapOffset.x) / size.x;
        let y = (point.y - hexMapOffset.y) / size.y;
        // cartesian to hex
        let q = (Math.sqrt(3)/3 * x  -  1/3 * y);
        let r = (2/3 * y);
        let s = -q - r;

        return hexAxialRound({q, r, s});
    }

    function axialToOddr(hex: {q: number, r: number, s: number})
    {
        var parity = hex.r&1;
        var col = hex.q + (hex.r - parity) / 2;
        var row = hex.r;

        return {col, row};
    }

    function pixelToOddr(point: {x: number, y: number}, size: {x: number, y: number})
    {
        return axialToOddr(pixelToAxial(point, size));
    }

    function getMinMaxXY() 
    {
        const allX = mapData.map(tile => tile.X);
        const allY = mapData.map(tile => tile.Y);

        return {
            minX: Math.min(...allX),
            maxX: Math.max(...allX),
            minY: Math.min(...allY),
            maxY: Math.max(...allY),
        };
    }

    function getTileScaleOddr(): number 
    {
        const { minX, maxX, minY, maxY } = minAndMaxCoords.current;

        const mapCols = maxX - minX + 1;
        const mapRows = maxY - minY + 1;

        const naturalWidth = Math.sqrt(3) * baseTileSize * (mapCols + 0.5); 
        const naturalHeight = baseTileSize * 3/2 * mapRows;

        const scaleX = winSize.width / naturalWidth;
        const scaleY = winSize.height / naturalHeight;

        return Math.min(scaleX, scaleY);
    }

    function getScaledGridAndTileSizes(baseTileSize: number): { tileX: number, tileY: number, gridX: number, gridY: number } 
    {
        const scale = getTileScaleOddr();
        const tileW = baseTileSize * scale;
        const tileH = baseTileSize * scale;

        const { minX, maxX, minY, maxY } = minAndMaxCoords.current;

        const mapCols = maxX - minX + 1;
        const mapRows = maxY - minY + 1;

        // width of hex = sqrt3 * size 
        const gridW = tileW * Math.sqrt(3) * (mapCols + 2);  // adding +2 works for some reason???

        // height of hex = 3/2 * size
        const gridH = tileH * 3/2 * (mapRows + 2); 

        return { tileX: tileW, tileY: tileH, gridX: gridW, gridY: gridH };
    }

    /**
     * 
     * @param tile 
     * Hex tile of TileType.
     * @returns 
     * The image type where imageType is the path to the actual image and scaleType returns the generic kind of image that will be displayed. Districts and natural wonders will take priority over terrain. Returns an empty string if the tile cannot be resolved.
     */
    function getImageAttributes(tile: TileType): {imagePath: string, scaleType: number}
    {    
        if (tile.FeatureType === "Cliffs of Dover")                                             return {imagePath: cliffs_of_dover, scaleType: HexType.TERRAIN};
        else if (tile.FeatureType === "Mount Kilimanjaro")                                      return {imagePath: mount_lilimanjaro, scaleType: HexType.TERRAIN};
        else if (tile.FeatureType === "Crater Lake")                                            return {imagePath: crater_lake, scaleType: HexType.TERRAIN};
        else if (tile.FeatureType === "Dead Sea")                                               return {imagePath: dead_sea, scaleType: HexType.TERRAIN};
        else if (tile.FeatureType === "Galápagos Islands")                                      return {imagePath: galapagos_islands, scaleType: HexType.TERRAIN};
        else if (tile.FeatureType === "Pantanal")                                               return {imagePath: pantanal, scaleType: HexType.TERRAIN};
        else if (tile.FeatureType === "Piopiotahi")                                             return {imagePath: piopiotahi, scaleType: HexType.TERRAIN};
        else if (tile.FeatureType === "Torres del Paine")                                       return {imagePath: torres_del_paine, scaleType: HexType.TERRAIN};
        else if (tile.FeatureType === "Tsingy de Bemaraha")                                     return {imagePath: tsingy_de_bemaraha, scaleType: HexType.TERRAIN};
        else if (tile.FeatureType === "Yosemite")                                               return {imagePath: yosemite, scaleType: HexType.TERRAIN};
        else if (tile.District === "DISTRICT_CITY_CENTER")                                      return {imagePath: center_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_COMMERCIAL_HUB")                                   return {imagePath: commercial_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_ENCAMPMENT")                                       return {imagePath: encampment_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_ENTERTAINMENT_COMPLEX")                            return {imagePath: entertainment_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_HARBOR")                                           return {imagePath: harbor_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_HOLY_SITE")                                        return {imagePath: faith_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_THEATER")                                          return {imagePath: theater_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_INDUSTRIAL_ZONE")                                  return {imagePath: industrial_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_NEIGHBORHOOD")                                     return {imagePath: neighborhood_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_AQUEDUCT")                                         return {imagePath: aqueduct_district, scaleType: HexType.DISTRICT};
        else if (tile.District === "DISTRICT_SPACEPORT")                                        return {imagePath: rocket_district, scaleType: HexType.DISTRICT};
        else if (tile.TerrainType === "Ocean")                                                  return {imagePath: ocean, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Coast and Lake")                                         return {imagePath: coast, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains" && tile.FeatureType === "Rainforest")            return {imagePath: plains_jungle, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains" && tile.FeatureType === "Woods")                 return {imagePath: plains_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains")                                                 return {imagePath: plains, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains (Hills)" && tile.FeatureType === "Rainforest")    return {imagePath: plains_hills_jungle, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains (Hills)" && tile.FeatureType === "Woods")         return {imagePath: plains_hills_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains (Hills)")                                         return {imagePath: plains_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains (Mountain)")                                      return {imagePath: plains_mountain, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland" && tile.FeatureType === "Woods")              return {imagePath: grass_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland")                                              return {imagePath: grass, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland (Hills)" && tile.FeatureType === "Woods")      return {imagePath: grass_hills_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland (Hills)")                                      return {imagePath: grass_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland (Mountain)")                                   return {imagePath: grass_mountain, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Desert")                                                 return {imagePath: desert, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Desert (Hills)")                                         return {imagePath: desert_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Desert (Mountain)")                                      return {imagePath: desert_mountain, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra" && tile.FeatureType === "Woods")                 return {imagePath: tundra_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra")                                                 return {imagePath: tundra, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra (Hills)" && tile.FeatureType === "Woods")         return {imagePath: tundra_hills_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra (Hills)")                                         return {imagePath: tundra_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra (Mountain)")                                      return {imagePath: tundra_mountain, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Snow")                                                   return {imagePath: snow, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Snow (Hills)")                                           return {imagePath: snow_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Snow (Mountain)")                                        return {imagePath: snow_mountain, scaleType: HexType.TERRAIN};

        return {imagePath: "", scaleType: -1};
    }

    /**
     * 
     * @param imgSize 
     * The size of the image on file in terms of:
     * - x (width)
     * - y (height)
     * @param imgTileSize 
     * The size of the hex/tile in the image in terms of:
     * - x (size/length from the center -> horizontal edge)
     * - y (size/length from the center -> vertical edge (pointy top))
     * @returns 
     * The multiplicative scale factor in terms of: 
     * - width
     * - height
     */
    function getScale(imgSize: {x: number, y: number}, imgTileSize: {x: number, y: number}): {scaleW: number, scaleH: number}
    {
        // how small the hex is compared to the image itself
        // because the <image> element uses the whole image, not just the hex
        // want to scale the hex inside to the image so that it fills the tiles
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
    function getScaleFromType(imgType: number): {scaleW: number, scaleH: number}
    {
        // all images are 128x128 px
        // and all district, terrain, etc images are of the same size if they belong to the same category 
        // ex: terrain images are always the same size (img and hex wise)

        if (imgType === HexType.DISTRICT) return getScale({x: 128, y: 128}, {x: 32, y: 32}); // actually 56x64, but this is to make the tile fit nicer
        else if (imgType === HexType.TERRAIN) return getScale({x: 128, y: 128}, {x: 32, y: 32});

        return {scaleW: -1, scaleH: -1};
    }

    function testStuff()
    {
        console.log('winX: ' + gridSize.x + ' winY: ' + gridSize.y)
    }
};

export default MapPage;