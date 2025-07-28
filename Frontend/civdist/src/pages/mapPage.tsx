import React, {useEffect, useState, useRef, useCallback, JSX, cache} from 'react';
import { Link } from 'react-router-dom';
import './mapPage.css'
import './allPages.css';
import {TileNames, HexType, ImageDistrictType, ImageNaturalWondersType, ImageTerrainType, ImageWondersType, RiverDirections, TileType, LeaderName} from '../utils/types'
import { loadDistrictImages, loadNaturalWonderImages, loadTerrainImages, loadWonderImages } from '../utils/imageLoaders';
import { getTerrain, getDistrict, getNaturalWonder, getWonder } from '../utils/imageAttributeFinders';
import { baseTileSize, allPossibleDistricts } from '../utils/constants';
import { uglifyDistrictNames } from '../utils/localizeCivText';
import { Civilization, America } from '../utils/civilizations';

/***********  USING ODDR INSTEAD OF WHAT LOOKS LIKE EVENR BECAUSE Y IS FLIPPED ***********/

/*
/////////////////////////////////////////////////////////////////

TODO: Update hexmapCache and cityOwnedTiles when adding new district - WHEN ADDING DISTRICT ACCOUNT FOR EFFECTS OF DISTRICT LIKE THEATER ADDING APPEAL TO ADJ OR REMOVING STUFF LIKE IMPROVEMENTS

TODO: Check bonuses in buildings/unique buildings too

TODO: When getting entertainment/encampment/aqueduct/neighborhood/aerodrome/spaceport, check if it gets more adjacency for other districts and for encampment if its closer to a civ??

TODO: Add loading warning/prompt when map is being drawn

TODO: Save map JSON to backend/database.

TODO: Retrieve all saved JSON maps from player profile. Max 5?

TODO: Refactor code to make it nicer/more organized and remove redundancies. Remove unnecessary useCallbacks. Remove unnecessary dependencies or refactor them.

TODO: Add documentation to functions. Read random comments to see if any extra issues need fixing.

TODO: Add toggable hover with tile data and resize if too long with max width

TODO: Can civ6 cities have same name??

/////////////////////////////////////////////////////////////////
*/

const MapPage = () => 
{
    const hexmapCache = useRef<Map<string, TileType>>(new Map()); // oddr coords, tile
    const [mapCacheVersion, setMapCacheVersion] = useState<number>(0);
    const [mapJSON, setMapJSON] = useState<TileType[]>([]);

    const [minAndMaxCoords, setMinAndMaxCoords] = useState(getMinMaxXY(mapJSON));

    const [winSize, setWinSize] = useState<{width: number, height: number}>({width: window.innerWidth, height: window.innerHeight});

    const [visualZoomInput, setVisualZoomInput] = useState<number>(100);

    const [originalGridSize, setOriginalGridSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize).tileX, y: getScaledGridAndTileSizes(baseTileSize).tileY}); 
    const [gridSize, setGridSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize).gridX, y: getScaledGridAndTileSizes(baseTileSize).gridY});
    
    const [originalTileSize, setOriginalTileSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize).tileX, y: getScaledGridAndTileSizes(baseTileSize).tileY});
    const [tileSize, setTileSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize).tileX, y: getScaledGridAndTileSizes(baseTileSize).tileY});

    const [currentTile, setCurrentTile] = useState<TileType>(); // store city name instead of entire tile???
    const [currentCity, setCurrentCity] = useState<TileType>();

    const [cityBoundaryTiles, setCityBoundaryTiles] = useState<Map<string, string[]>>(new Map()); // <tile with boundary lines, neighboring tiles> - Uses the oddr coords
    const [cityOwnedTiles, setCityOwnedTiles] = useState<Map<string, TileType[]>>(new Map()); // <city, city's tiles> - owned tiles should have a maximum limit of 36 tiles per city

    // assuming civ has at least one city
    const [uniqueCivilizations, setUniqueCivilizations] = useState<Set<string>>(new Set());
    const [uniqueCities, setUniqueCities] = useState<Map<string, string[]>>(new Map()); // <civilization, cities>
    const [dropdownCiv, setDropdownCiv] = useState<string>();
    const [includeCityStates, setIncludeCityStates] = useState<boolean>(false);
    const [dropdownCity, setDropdownCity] = useState<string>();
    const [dropdownDistrict, setDropdownDistrict] = useState<string>(allPossibleDistricts[0]);

    /**
     * - Shifting hex img's by the subtraction seen in drawMap() keeps correct oddr coordinate detection but visuals will break
     * - Adding this offset fixes the visuals and keeps the coordinates correct
     */
    const hexMapOffset = {x: tileSize.x * 2, y: tileSize.y * 2};

    const theCanvas = useRef<HTMLCanvasElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const zoomInputRef = useRef<HTMLInputElement>(null);
    const civDropdownRef = useRef<HTMLSelectElement>(null);
    const cityDropdownRef = useRef<HTMLSelectElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const terrainImagesCache = useRef<Map<ImageTerrainType, HTMLImageElement>>(new Map());
    const wondersImagesCache = useRef<Map<ImageWondersType, HTMLImageElement>>(new Map());
    const naturalWondersImagesCache = useRef<Map<ImageNaturalWondersType, HTMLImageElement>>(new Map());
    const districtsImagesCache = useRef<Map<ImageDistrictType, HTMLImageElement>>(new Map());

    const [areImagesLoaded, setAreImagesLoaded] = useState<boolean>(false);

    async function loadAllImages()
    {
        await loadTerrainImages(terrainImagesCache.current);
        await loadWonderImages(wondersImagesCache.current);
        await loadNaturalWonderImages(naturalWondersImagesCache.current);
        await loadDistrictImages(districtsImagesCache.current);

        setAreImagesLoaded(true);
    }

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
        hexmapCache.current.forEach((tile, oddr) => 
        {
            const [col, row] = oddr.split(',').map(Number);
            const px = oddrToPixel(col, row, tileSize.x, tileSize.y);

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

    function wrapCol(x: number)
    {
        const { minX, maxX } = minAndMaxCoords;
        const width = maxX - minX + 1;
        // assuming min starts at 0
        return ((x + width) % width);
    };

    function wrapRow(y: number)
    {
        const { minY, maxY } = minAndMaxCoords;
        const height = maxY - minY + 1;
        return ((y + height) % height);
    };

    /**
     * Assume drawn using the cache as hovering over a tile (necessary for click) only considers drawing from the cache. 
     * @param context 
     */
    function drawBorderLines(context: CanvasRenderingContext2D) 
    {
        cityBoundaryTiles.forEach((neighbors, tileKey) => 
        {
            const [col, row] = tileKey.split(',').map(Number);
            const center = oddrToPixel(col, row, tileSize.x, tileSize.y);

            // check against all hex edges
            const offsets = (row % 2 === 0) ? [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]] : [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]];

            offsets.forEach(([dx, dy], i) => 
            {
                const neighborKey = `${wrapCol(col + dx)},${wrapRow(row + dy)}`;
                if (!neighbors.includes(neighborKey)) return; // if hex edge has neighbor not owned by city = draw on that edge

                const start = getHexPoint(i, center);
                const end = getHexPoint((i + 1) % 6, center);

                drawLine(context, start, end, 'yellow', Math.min(tileSize.x, tileSize.y) / 20);
            });
        });
    }

    function drawHexImage(context: CanvasRenderingContext2D, tile: TileType, opacity: number, img: HTMLImageElement)
    {
        const px = oddrToPixel(tile.X, tile.Y, tileSize.x, tileSize.y);
        const imgAttributes = getImageAttributes(tile);
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

    function drawMapWithHoveredTile(context: CanvasRenderingContext2D, oddrCoord: {col: number, row: number}, opacity: number)
    {
        context.clearRect(0, 0, gridSize.x, gridSize.y);

        let textBoxPos = {x: -1, y: -1};
        let textBoxText = '';

        let theOpacity = opacity;

        hexmapCache.current.forEach((tile, oddr) => 
        {
            const [col, row] = oddr.split(',').map(Number);
            const px = oddrToPixel(col, row, tileSize.x, tileSize.y);

            if (oddrCoord.col === col && oddrCoord.row === row)
            {  
                theOpacity = opacity;

                if (tile.IsCity)
                {
                    textBoxPos = {x: px.x, y: px.y};
                    textBoxText = tile.CityName;
                }

                setCurrentTile(tile);
            }
            else if (tile.IsCity && tile.CityName === dropdownCity)
            {
                theOpacity = 0.25;
            }
            else
            {
                theOpacity = 1;
            }

            const theImage = getImageAttributes(tile).imgElement;
            if (theImage)
                drawHexImage(context, tile, theOpacity, theImage);
        });

        drawRiversFromCache(context);
        drawBorderLines(context);

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
        const hoveredImg = hexmapCache.current.get(key);
        if (hoveredImg && context) 
        {
            drawMapWithHoveredTile(context, oddrCoord, 0.3);
        }
    }, [tileSize, gridSize, cityBoundaryTiles, dropdownCity]); // to ensure latest values are used

    function getMousePos(e: MouseEvent): {x: number, y: number} | undefined
    {
        const rect = theCanvas.current?.getBoundingClientRect();
        if (!rect || !theCanvas.current) return undefined;

        const xPos = (e.clientX - rect.left) / (rect.right - rect.left) * theCanvas.current.width;
        const rawY = ((e.pageY - rect.top) / (rect.bottom - rect.top) * theCanvas.current.height) - window.scrollY;
        const yPos = theCanvas.current.height - rawY; // because map is flipped to make it look like the game!!!!

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
        const { minX, maxX, minY, maxY } = minAndMaxCoords;
        const mousePos = getMousePos(e);

        if (mousePos && scrollRef.current)
        {
            const { clientX, clientY } = e;

            const divRect = scrollRef.current.getBoundingClientRect(); // size will always be the same regardless of scroll
            const inDivBounds = clientX >= divRect.left && clientX <= divRect.right && clientY >= divRect.top && clientY <= divRect.bottom;

            const oddrCoord = pixelToOddr(mousePos, tileSize);
            const outOfHexBounds = oddrCoord.col < minX || oddrCoord.col > maxX || oddrCoord.row < minY || oddrCoord.row > maxY;

            console.log('click at ' + oddrCoord.col + ' and ' + oddrCoord.row)

            // dont reset the clicked city stuff if click is out of bounds - only want to reset when click on the visible hexmap
            if (!inDivBounds || outOfHexBounds)
                return;
            
            if (currentTile && currentTile.IsCity)
            {
                if (!currentCity || (currentCity && currentCity.CityName !== currentTile.CityName))
                {
                    if (currentCity && currentCity.CityName !== currentTile.CityName)
                        setCurrentCity(currentTile);

                    let tempMap = new Map<string, string[]>();
                    hexmapCache.current.forEach((tile, oddr) => 
                    {
                        const [col, row] = oddr.split(',').map(Number);

                        let neighborList: string[] = [];
                        if (tile.TileCity === currentTile.CityName)
                        {
                            const offsets = (row % 2 === 0) ? [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]] : [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]];
                            offsets.forEach((neighbor) => 
                            {
                                let neighborCoord = {x: wrapCol(col + neighbor[0]), y: wrapRow(row + neighbor[1])};
                                let neighborStringCoord = `${neighborCoord.x},${neighborCoord.y}`;
                                let cacheTile = hexmapCache.current.get(neighborStringCoord);

                                if (cacheTile && cacheTile.TileCity !== currentTile.CityName)
                                {
                                    neighborList.push(neighborStringCoord);
                                }
                            });
                        }

                        if (neighborList.length > 0)
                            tempMap.set(oddr, neighborList);
                    });

                    setCityBoundaryTiles(tempMap);
                }
                else if (currentCity && currentCity.CityName === currentTile.CityName)
                {
                    setCityBoundaryTiles(new Map());
                    setCurrentCity(undefined);
                }
            }
            else
            {
                setCityBoundaryTiles(new Map());
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

    function setDropdownValues(theJSON: TileType[])
    {
        let tempCivSet = new Set<string>();
        let tempCitySet = new Map<string, string[]>();

        let firstCiv = undefined;
        let firstCity = undefined;

        for (let i = 0; i < theJSON.length; i++)
        {
            const tile = theJSON[i];
            if (tile.Civilization !== "NONE")
            {
                tempCivSet.add(tile.Civilization);

                if (tile.IsCity)
                {
                    let cityList = tempCitySet.get(tile.Civilization);
                    if (cityList)
                    {
                        cityList.push(tile.CityName);
                        tempCitySet.set(tile.Civilization, cityList);
                    }
                    else
                    {
                        tempCitySet.set(tile.Civilization, [tile.CityName]);
                    }
                    
                    if (includeCityStates || (!includeCityStates && !tile.Civilization.includes("city-state")))
                    {
                        if (!firstCiv)
                            firstCiv = tile.Civilization;
                        if (!firstCity)
                            firstCity = tile.CityName;
                    }
                }
            }
        }

        setDropdownCiv(firstCiv);
        setDropdownCity(firstCity);
        setUniqueCivilizations(tempCivSet);
        setUniqueCities(tempCitySet);
    }

    useEffect(() => 
    {
        const civVal = civDropdownRef.current ? civDropdownRef.current.value : undefined;
        const cityVal = cityDropdownRef.current ? cityDropdownRef.current.value : undefined;

        // get latest values
        if (civVal !== dropdownCiv)
            setDropdownCiv(civVal);

        if (cityVal !== dropdownCity)
            setDropdownCity(cityVal);
    }, [includeCityStates, dropdownCity, dropdownCiv]) 

    useEffect(() => 
    {
        const handleResize = () => 
        {
            setWinSize({ width: window.innerWidth, height: window.innerHeight })
        };
        window.addEventListener('resize', handleResize);

        loadAllImages();

        if (mapJSON)
            setDropdownValues(mapJSON);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => 
    {
        const sizes = getScaledGridAndTileSizes(baseTileSize);
        setOriginalTileSize({ x: sizes.tileX, y: sizes.tileY });
        setOriginalGridSize({ x: sizes.gridX, y: sizes.gridY });

        if (visualZoomInput === 100) 
        {
            setTileSize({x: sizes.tileX, y: sizes.tileY});
            setGridSize({x: sizes.gridX, y: sizes.gridY});
        }
    }, [winSize, minAndMaxCoords]);

    const drawMapFromCache = useCallback((context: CanvasRenderingContext2D) =>
    {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        hexmapCache.current.forEach((tile, oddr) => 
        {
            let theOpacity = 1;
            if (tile.IsCity && dropdownCity && tile.CityName === dropdownCity)
                theOpacity = 0.25;

            const theImage = getImageAttributes(tile).imgElement;
            if (theImage)
                drawHexImage(context, tile, theOpacity, theImage);
        });

        drawRiversFromCache(context);
        drawBorderLines(context);
    }, [tileSize, gridSize, cityBoundaryTiles, dropdownCity, areImagesLoaded, mapJSON, mapCacheVersion]);

    const initHexmapCache = useCallback(() => 
    {
        const hexmapCacheTemp = new Map<string, TileType>();
        const mountainCache = new Map<string, TileType>();
        const otherCache = new Map<string, TileType>();
        const cityTiles = new Map<string, TileType[]>();

        let loadCount = 0;
        let totalTiles = mapJSON.length;

        const context = theCanvas.current?.getContext('2d');
        if (!context) return;

        mapJSON.forEach(tile => 
        {
            const imgAttributes = getImageAttributes(tile);
            const img = imgAttributes.imgElement;

            if (img)
            {
                const key = `${tile.X},${tile.Y}`;

                if (tile.TerrainType?.includes("Mountain"))
                    mountainCache.set(key, tile);
                else
                    otherCache.set(key, tile);

                loadCount++;

                if (tile.TileCity !== "NONE")
                {
                    const tileDatas = cityTiles.get(tile.TileCity);
                    if (tileDatas)
                    {
                        tileDatas.push(tile);
                        cityTiles.set(tile.TileCity, tileDatas);
                    }
                    else
                    {
                        cityTiles.set(tile.TileCity, []);
                    }
                }

                if (loadCount === totalTiles) 
                {
                    otherCache.forEach((value, key) => hexmapCacheTemp.set(key, value));
                    // mountains last will go on top
                    mountainCache.forEach((value, key) => hexmapCacheTemp.set(key, value));
                    hexmapCache.current = hexmapCacheTemp;

                    drawMapFromCache(context);
                }
            }
        });

        setCityOwnedTiles(cityTiles);
    }, [drawMapFromCache, mapJSON]);

    useEffect(() => 
    {
        // wait until the necessary data is ready
        if (!dropdownCity || !areImagesLoaded || mapJSON.length === 0) return;

        if (hexmapCache.current.size === 0) 
        {
            initHexmapCache();
        } 
        else 
        {
            const context = theCanvas.current?.getContext('2d');
            if (context) 
                drawMapFromCache(context);
        }
    }, [dropdownCity, areImagesLoaded, mapJSON, minAndMaxCoords, mapCacheVersion, initHexmapCache, drawMapFromCache]);

    const handleZoomChange = useCallback((zoomLevel: number) =>
    {
        let theZoom = zoomLevel;
        if (theZoom < 50)
        {
            theZoom = 50;
            setVisualZoomInput(50);
        }
        else if (theZoom > 200)
        {
            theZoom = 200;
            setVisualZoomInput(200);
        }

        const multiplier = Math.abs(theZoom) / 100.0;

        const newTileSize = 
        {
            x: originalTileSize.x * multiplier,
            y: originalTileSize.y * multiplier
        };

        setTileSize(newTileSize);

        // update gridSize (canvas size) to match enlarged map
        // since tiles got bigger
        // otherwise scroll won't show
        const sizes = getScaledGridSizesFromTile(newTileSize);
        setGridSize({ x: sizes.gridX, y: sizes.gridY });
    }, [originalGridSize, originalTileSize]);

    function handleZoomKeyDown(e: React.KeyboardEvent<HTMLDivElement>) 
    {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') 
        {
            zoomInputRef.current?.focus();
        }
        else if (e.key === 'Enter')
        {
            zoomInputRef.current?.blur();
        }
    }

    function handleZoomClick(e: React.MouseEvent<HTMLInputElement>) 
    {
        zoomInputRef.current?.focus();
    };

    function handleInputButtonClick()
    {
        fileInputRef.current?.click();
    }

    function resetInitialValues(theJSON: TileType[])
    {
        setDropdownValues(theJSON);
        setMapJSON(theJSON);
        setMinAndMaxCoords(getMinMaxXY(theJSON));
        setCurrentTile(undefined);
        setCurrentCity(undefined);
        setCityBoundaryTiles(new Map());
        setVisualZoomInput(100);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const file = e.target.files?.[0];

        if (hexmapCache && file)
        {
            hexmapCache.current = new Map();

            const reader = new FileReader();

            reader.onload = () => 
            {
                try
                {
                    const json = JSON.parse(reader.result as string);
                    resetInitialValues(json);
                }
                catch(error)
                {
                    console.log(error)
                }
            }

            reader.readAsText(file);
        }
    }   

    function handleAddButton()
    {
        const oddr = `${12},${14}`
        const temp = hexmapCache.current.get(oddr);
        if (temp && dropdownCiv)
        {
            temp.District = uglifyDistrictNames(dropdownDistrict, dropdownCiv);
            hexmapCache.current.set(oddr, temp);
            setMapCacheVersion(mapCacheVersion + 1);
        }
    }

    return (
        <div style={{display: 'flex'}}>
            <div
                ref={scrollRef}
                style={{
                    overflow: 'auto',
                    border: '1px solid black'
                }}
            >
                <canvas
                    ref={theCanvas}
                    width={gridSize.x}
                    height={gridSize.y}
                    style={{ display: 'block' }}
                />
            </div>

            <div style={{alignContent: 'center', marginLeft: '10px', paddingLeft: '5px', paddingRight: '5px', marginRight: '10px', border: '1px solid black'}}>
                <div style={{display: 'grid'}}>
                    <div style={{display: 'flex'}}>
                        Include City States
                        <input type='checkbox' onChange={(e) => {setIncludeCityStates(e.target.checked)}}/>
                    </div>
                    {/*Select Civilization*/}
                    <select ref={civDropdownRef} onChange={(e) => {setDropdownCiv(e.target.value)}}>
                        {(
                            () => 
                            {
                                const civArr = Array.from(uniqueCivilizations);
                                const elements: JSX.Element[] = [];
                                
                                for (let i = 0; i < civArr.length; i++)
                                {
                                    let civ = civArr[i];
                                    if (includeCityStates || (!includeCityStates && !civ.includes("city-state")))
                                    {
                                        elements.push(<option value={civ} key={i}>{civ}</option>);
                                    }
                                }

                                if (elements.length > 0)
                                    return elements;
                                else
                                    return <option>Unknown Civilization</option>
                            }
                        )()}
                    </select> 
                </div>
                <div>
                    {/*Select City*/}
                    <select ref={cityDropdownRef} onChange={(e) => {setDropdownCity(e.target.value)}}>
                        {(
                            () => 
                            {
                                // can't use civDropdownRef as this select doesnt know when to re-render compared to something like an useEffect
                                if (dropdownCiv)
                                {
                                    let cityList = uniqueCities.get(dropdownCiv);
                                    if (cityList)
                                    {
                                        return cityList.map((city, index) => 
                                        (
                                            <option value={city} key={index}>{city}</option>
                                        ))
                                    }
                                }
                                else
                                {
                                    return <option>Unknown City</option>
                                }
                            }
                        )()}
                    </select> 
                    <div>
                        {/*Select District Type*/}
                        <select onChange={e => {setDropdownDistrict(e.target.value)}}>
                            {
                                allPossibleDistricts.map((value, index) => 
                                (
                                    <option value={value} key={index}>{value}</option>
                                ))
                            }
                        </select> 
                        <button onClick={handleAddButton}>ADD</button>
                    </div>
                    <div>
                        <span style={{paddingRight: '5px'}}>Zoom Level:</span>
                        <input 
                            onKeyDown={e => handleZoomKeyDown(e)} 
                            onClick={e => handleZoomClick(e)} 
                            ref={zoomInputRef} 
                            type='number' 
                            min={50} 
                            max={200} 
                            value={visualZoomInput} 
                            onChange={e => setVisualZoomInput(Number(e.target.value))} 
                            onBlur={e => handleZoomChange(Number(e.target.value))}
                        />
                    </div>
                    <div style={{display: 'grid'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <button>SAVE</button>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <button onClick={handleInputButtonClick}>LOAD FROM DISK</button>
                            <input style={{display: 'none'}} type='file' ref={fileInputRef} onChange={e => handleInputChange(e)} accept='.json'/>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <label>LOAD FROM PROFILE
                                <select>

                                </select>
                            </label>
                        </div>
                    </div>
                </div>
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
        const { minX, maxX, minY, maxY } = getMinMaxXY(mapJSON);
        const mapCols = maxX - minX + 1;
        const mapRows = maxY - minY + 1;

        const gridW = tileSize.x * Math.sqrt(3) * (mapCols + 2);
        const gridH = tileSize.y * 3/2 * (mapRows + 2);

        return { gridX: gridW, gridY: gridH };
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

    function getMinMaxXY(theJSON: TileType[]) 
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

    function getTileScaleOddr(): number 
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

    function getScaledGridAndTileSizes(baseTileSize: number): { tileX: number, tileY: number, gridX: number, gridY: number } 
    {
        const scale = getTileScaleOddr();
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
    function getImageAttributes(tile: TileType): {imgElement: HTMLImageElement | undefined, scaleType: number}
    {    
        const natWonder = getNaturalWonder(tile, naturalWondersImagesCache.current);
        const wonder = getWonder(tile, wondersImagesCache.current);
        const district = getDistrict(tile, districtsImagesCache.current);
        const terrain = getTerrain(tile, terrainImagesCache.current);

        if (natWonder.imgElement && natWonder.scaleType !== -1)
            return natWonder;
        else if (wonder.imgElement && wonder.scaleType !== -1)
            return wonder;
        else if (district.imgElement && district.scaleType !== -1)
            return district;
        else if (terrain.imgElement && terrain.scaleType !== -1)
            return terrain;

        return {imgElement: undefined, scaleType: -1};
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
        /*
        const temp = new America(LeaderName.TEDDY_ROOSEVELT);
        const aach = cityOwnedTiles.get("Aachen");
        const c = hexmapCache.current.get('12,16')
        if (aach && c)
        {
            const v = temp.getCampusBonuses(c, aach);
            console.log('12,16 has ' + v + ' campus bonus')
        }
        */
    }
};

export default MapPage;