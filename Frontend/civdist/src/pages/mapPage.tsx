import React, {useEffect, useState, useRef, useCallback} from 'react';
import { Link } from 'react-router-dom';
import { HexGrid, Layout, Hexagon} from 'react-hexgrid';
import './mapPage.css'
import './allPages.css';
import mapData from '../json/duel.json'
// tile images
import {coast, desert_hills, desert_mountain, desert, grass_hills, grass_mountain, grass_forest, grass_hills_forest, grass, ocean, plains_hills, plains_mountain, plains_forest, plains_hills_forest, plains_jungle, plains_hills_jungle, plains, river, snow_hills, snow_mountain, snow, tundra_hills, tundra_mountain, tundra_forest, tundra_hills_forest, tundra} from '../images/tileImport'
import {aqueduct_district, aerodome_district, center_district, commercial_district, encampment_district, entertainment_district, faith_district, harbor_district, industrial_district, neighborhood_district, rocket_district, science_district, theater_district} from '../images/districtImport'
import {HexType, TileType} from '../utils/types'

/*
/////////////////////////////////////////////////////////////////

TODO: Add rivers
TODO: Add natural wonders
TODO: Add toggable hover with tile data
TODO: Add loading warning/prompt when map is being drawn

Wonders - district, Natural wonder - feature

/////////////////////////////////////////////////////////////////
*/

const MapPage = () => 
{
    const baseTileSize : number = 10;

    const [debugBool, setDebugBool] = useState<Boolean>(false); 
    const [winSize, setWinSize] = useState<{width: number, height: number}>({width: window.innerWidth, height: window.innerHeight});

    const [gridSize, setGridSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize).gridX, y: getScaledGridAndTileSizes(baseTileSize).gridY});
    const [tileSize, setTileSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize).tileX, y: getScaledGridAndTileSizes(baseTileSize).tileY});

    const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, REMOVE?????????

    /**
     * - Shifting hex img's by the subtraction seen in drawMap() keeps correct oddr coordinate detection but visuals will break
     * - Adding this offset fixes the visuals and keeps the coordinates correct
     */
    const hexMapOffset = {x: tileSize.x * 2, y: tileSize.y * 2};

    const theCanvas = useRef<HTMLCanvasElement>(null);
    const imageCache = useRef<Map<string, {img: HTMLImageElement, tile: TileType}>>(new Map());
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
     * SHOULD save before calling this functiuon and restore after calling this function.
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
            context.rect(px.x, -px.y - ((fontSize * 2) / 1.5), textWidth * 1.5, fontSize * 2);
            context.fill();

            context.globalAlpha = 1;

            context.fillStyle = 'white';
            context.font = font;
            context.fillText(text, px.x + (textWidth / 4), -px.y);
        }
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

            context.globalAlpha = (oddrCoord.col === col && oddrCoord.row === row) ? opacity : 1;
            context.drawImage(value.img, px.x - drawWidth / 2, px.y - drawHeight / 2, drawWidth, drawHeight);

            if (oddrCoord.col === col && oddrCoord.row === row && value.tile.IsCity)
            {  
                textBoxPos = {x: px.x, y: px.y};
                textBoxText = value.tile.CityName;
            }

            context.restore();
        });

        context.save();

        // keep in line with the flipped hexmap
        context.scale(1, -1);
        context.translate(0, -gridSize.y);
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
    }, [tileSize, gridSize]); // to ensure latest values are used

    const handleMouseMove = useCallback((e: MouseEvent) => 
    {
        const rect = theCanvas.current?.getBoundingClientRect();
        if (!rect || !theCanvas.current) return;

        const xPos = (e.clientX - rect.left) / (rect.right - rect.left) * theCanvas.current.width;
        const rawY = ((e.pageY - rect.top) / (rect.bottom - rect.top) * theCanvas.current.height) - window.scrollY;
        const yPos = theCanvas.current.height - rawY; // because map is flipped to make it look like the game

        const oddrCoord = pixelToOddr({ x: xPos, y: yPos }, tileSize);
        const key = `${oddrCoord.col},${oddrCoord.row}`;

        handleMouseHover(key, oddrCoord);
    }, [handleMouseHover]); // add function like handleMouseHover as functions can change due to the function's dependencies

    useEffect(() => 
    {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

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
                }
            };
        });
    }, [tileSize, gridSize]);

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

            context.drawImage(value.img, px.x - drawWidth / 2, px.y - drawHeight / 2, drawWidth, drawHeight);
            context.restore();
        });
    }, [tileSize, gridSize]);

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

    function getRiverEdgesForTile(tile: TileType, map: TileType[]): string[] 
    {
        const edges: string[] = [];
        const dirs = ['W', 'NW', 'NE'] as const;

        const neighborOffsets = {
            'W':  {x: -1, y:  0},
            'NW': {x: (tile.Y % 2 === 0 ? -1 : 0), y: -1},
            'NE': {x: (tile.Y % 2 === 0 ? 0 : 1),  y: -1},
        };

        dirs.forEach(dir => {
            const offset = neighborOffsets[dir];
            const neighbor = map.find(t => t.X === tile.X + offset.x && t.Y === tile.Y + offset.y);
            
            // if both this tile and neighbor have IsRiver, then the edge between them likely has a river
            if (tile.IsRiver && neighbor?.IsRiver)
                edges.push(dir);
        });

        return edges;
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
        const { minX, maxX, minY, maxY } = getMinMaxXY();

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

        const { minX, maxX, minY, maxY } = getMinMaxXY();

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
     * The image type where imageType is the path to the actual image and scaleType returns the generic kind of image that will be displayed. Districts will take priority over terrain. Returns an empty string if the tile cannot be resolved.
     */
    function getImageAttributes(tile: TileType): {imagePath: string, scaleType: number}
    {    
        if (tile.IsCity) return {imagePath: center_district, scaleType: HexType.DISTRICT};
        else if (tile.TerrainType === "Ocean") return {imagePath: ocean, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Coast and Lake") return {imagePath: coast, scaleType: HexType.TERRAIN};
        else if (tile.IsRiver) return {imagePath: river, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains" && tile.FeatureType === "Rainforest") return {imagePath: plains_jungle, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains" && tile.FeatureType === "Woods") return {imagePath: plains_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains") return {imagePath: plains, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains (Hills)" && tile.FeatureType === "Rainforest") return {imagePath: plains_hills_jungle, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains (Hills)" && tile.FeatureType === "Woods") return {imagePath: plains_hills_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains (Hills)") return {imagePath: plains_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Plains (Mountain)") return {imagePath: plains_mountain, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland" && tile.FeatureType === "Woods") return {imagePath: grass_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland") return {imagePath: grass, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland (Hills)" && tile.FeatureType === "Woods") return {imagePath: grass_hills_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland (Hills)") return {imagePath: grass_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Grassland (Mountain)") return {imagePath: grass_mountain, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Desert") return {imagePath: desert, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Desert (Hills)") return {imagePath: desert_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Desert (Mountain)") return {imagePath: desert_mountain, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra" && tile.FeatureType === "Woods") return {imagePath: tundra_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra") return {imagePath: tundra, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra (Hills)" && tile.FeatureType === "Woods") return {imagePath: tundra_hills_forest, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra (Hills)") return {imagePath: tundra_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Tundra (Mountain)") return {imagePath: tundra_mountain, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Snow") return {imagePath: snow, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Snow (Hills)") return {imagePath: snow_hills, scaleType: HexType.TERRAIN};
        else if (tile.TerrainType === "Snow (Mountain)") return {imagePath: snow_mountain, scaleType: HexType.TERRAIN};

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