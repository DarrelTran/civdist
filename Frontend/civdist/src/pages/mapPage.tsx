import React, {useEffect, useState, useRef, useCallback, JSX, cache} from 'react';
import Select from 'react-select'
import { Link } from 'react-router-dom';
import './mapPage.css'
import './allPages.css';
import { TileNone, TileWonders, TileDistricts, TileNaturalWonders, TerrainFeatureKey, RiverDirections, TileType, LeaderName, TileYields} from '../utils/types'
import { loadDistrictImages, loadNaturalWonderImages, loadTerrainImages, loadWonderImages, loadYieldImages } from '../images/imageLoaders';
import { getTerrain, getDistrict, getNaturalWonder, getWonder } from '../images/imageAttributeFinders';
import { baseTileSize, allPossibleDistricts, allPossibleYields, CIV_NAME_DEFAULT, CITY_NAME_DEFAULT } from '../utils/constants';
import { Civilization, getCivilizationObject } from '../civilization/civilizations';
import { mapPageSelectStyle, nearbyCityFontSize, NearbyCityOption, nearbyCityStyles, YieldOption } from './mapPageSelectStyles';
import { getMapOddrString, getMinMaxXY, getOffsets, getTextWidth } from '../utils/functions/misc/misc';
import { getAngleBetweenTwoOddrHex, getHexPoint, oddrToPixel, pixelToOddr } from '../utils/functions/hex/genericHex';
import { getScaledGridAndTileSizes, getScaledGridSizesFromTile, getScaleFromType } from '../utils/functions/imgScaling/scaling';

/*
/////////////////////////////////////////////////////////////////

TODO: Take into account if district will delete a worked tile. If it is worked & no replacement = bad, worked and replacement = good, not worked = ok. CHECK improvement type and if bonus + orig yields can be a replacement.

TODO: Add option to consider wonders when scoring. Give wonders weight depending on typical civ victory type.

TODO: Put encampment on side towards civ player expects to be an enemy.

TODO: Fix scoring system - BROKEN????

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

TODO: Use <br> instead of grid style

TODO: Optimize wonder placements by removing check for district if corresponding building exists.

/////////////////////////////////////////////////////////////////
*/

const MapPage = () => 
{
    const [errorText, setErrorText] = useState<string>("");

    const hexmapCache = useRef<Map<string, TileType>>(new Map()); // oddr coords, tile
    const [mapCacheVersion, setMapCacheVersion] = useState<number>(0);
    const [mapJSON, setMapJSON] = useState<TileType[]>([]);

    const [civCompletedWonders, setCivCompletedWonders] = useState<Set<TileWonders>>(new Set());

    const [minAndMaxCoords, setMinAndMaxCoords] = useState(getMinMaxXY(mapJSON));

    const [winSize, setWinSize] = useState<{width: number, height: number}>({width: window.innerWidth, height: window.innerHeight});

    const [visualZoomInput, setVisualZoomInput] = useState<number>(100);
    const [visualYieldDropdown, setVisualYieldDropdown] = useState<{value: TileYields, label: TileYields, image: HTMLImageElement}[]>([]);

    const [originalGridSize, setOriginalGridSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize, minAndMaxCoords, winSize).tileX, y: getScaledGridAndTileSizes(baseTileSize, minAndMaxCoords, winSize).tileY}); 
    const [gridSize, setGridSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize, minAndMaxCoords, winSize).gridX, y: getScaledGridAndTileSizes(baseTileSize, minAndMaxCoords, winSize).gridY});
    
    const [originalTileSize, setOriginalTileSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize, minAndMaxCoords, winSize).tileX, y: getScaledGridAndTileSizes(baseTileSize, minAndMaxCoords, winSize).tileY});
    const [tileSize, setTileSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(baseTileSize, minAndMaxCoords, winSize).tileX, y: getScaledGridAndTileSizes(baseTileSize, minAndMaxCoords, winSize).tileY});

    const [currentTile, setCurrentTile] = useState<TileType>();
    const [currentCity, setCurrentCity] = useState<TileType>();

    const [cityBoundaryTiles, setCityBoundaryTiles] = useState<Map<string, string[]>>(new Map()); // <tile with boundary lines, neighboring tiles> - Uses the oddr coords
    
    // THE CITY CENTER TILE IS ALWAYS LAST
    const [cityOwnedTiles, setCityOwnedTiles] = useState<Map<string, TileType[]>>(new Map()); // <"civ,city", city's tiles> - owned tiles should have a maximum limit of 36 tiles per city

    // assuming civ has at least one city
    const [uniqueCivilizations, setUniqueCivilizations] = useState<Set<string>>(new Set());
    const [uniqueCities, setUniqueCities] = useState<Map<string, string[]>>(new Map()); // <civilization, cities>
    const [dropdownCiv, setDropdownCiv] = useState<string>(CIV_NAME_DEFAULT);
    const [includeCityStates, setIncludeCityStates] = useState<boolean>(false);
    const [includeWonders, setIncludeWonders] = useState<boolean>(false);
    const [dropdownCity, setDropdownCity] = useState<string>(CITY_NAME_DEFAULT);
    const [dropdownDistrict, setDropdownDistrict] = useState<string>(allPossibleDistricts()[0]);
    const [dropdownYields, setDropdownYields] = useState<TileYields[]>([]);

    const [nearbyCityDisplay, setNearbyCityDisplay] = useState<string>("none");
    const [dropdownNearbyCity, setDropdownNearbyCity] = useState<TileType>();

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
    const nearbyCityRef = useRef<Select>(null)

    const terrainImagesCache = useRef<Map<TerrainFeatureKey, HTMLImageElement>>(new Map());
    const wondersImagesCache = useRef<Map<TileWonders, HTMLImageElement>>(new Map());
    const naturalWondersImagesCache = useRef<Map<TileNaturalWonders, HTMLImageElement>>(new Map());
    const districtsImagesCache = useRef<Map<TileDistricts, HTMLImageElement>>(new Map());
    const yieldImagesCache = useRef<Map<TileYields, HTMLImageElement>>(new Map());

    const [areImagesLoaded, setAreImagesLoaded] = useState<boolean>(false);

    async function loadAllImages()
    {
        await loadTerrainImages(terrainImagesCache.current);
        await loadWonderImages(wondersImagesCache.current);
        await loadNaturalWonderImages(naturalWondersImagesCache.current);
        await loadDistrictImages(districtsImagesCache.current);
        await loadYieldImages(yieldImagesCache.current);

        setAreImagesLoaded(true);
    }

    /**
     * @param context 2D canvas context.
     * @param px X & y pixel coordinates of the text box. Assumes that the hexmap has flipped y coordinates.
     * @param text 
     */
    function drawTextWithBox(context: CanvasRenderingContext2D, px: {x: number, y: number}, text: string)
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

        const textWidth = getTextWidth(text, font, theCanvas.current);

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
            drawLine(context, getHexPoint(0, startingPos, tileSize), getHexPoint(1, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.NORTHEAST)
        {
            drawLine(context, getHexPoint(1, startingPos, tileSize), getHexPoint(2, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.NORTHWEST)
        {
            drawLine(context, getHexPoint(2, startingPos, tileSize), getHexPoint(3, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.SOUTHEAST)
        {
            drawLine(context, getHexPoint(5, startingPos, tileSize), getHexPoint(6, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.SOUTHWEST)
        {
            drawLine(context, getHexPoint(4, startingPos, tileSize), getHexPoint(5, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
        else if (riverDirection === RiverDirections.WEST)
        {
            drawLine(context, getHexPoint(3, startingPos, tileSize), getHexPoint(4, startingPos, tileSize), '#38afcd', Math.min(tileSize.x / 8, tileSize.y / 8));
        }
    }

    function drawRiversFromCache(context: CanvasRenderingContext2D)
    {
        hexmapCache.current.forEach((tile, oddr) => 
        {
            const [col, row] = oddr.split(',').map(Number);
            const px = oddrToPixel(col, row, tileSize.x, tileSize.y, hexMapOffset);

            let RiverEFlow = tile.RiverEFlow;
            let RiverSEFlow = tile.RiverSEFlow;
            let RiverSWFlow = tile.RiverSWFlow;

            let IsNEOfRiver = tile.IsNEOfRiver;
            let IsNWOfRiver = tile.IsNWOfRiver;
            let IsWOfRiver = tile.IsWOfRiver;

            context.globalAlpha = 0.75;

            if (RiverEFlow !== TileNone.NONE)
                drawRiver6PossibleDirections(context, RiverDirections.EAST, px);
            if (RiverSEFlow !== TileNone.NONE)
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHEAST, px);
            if (RiverSWFlow !== TileNone.NONE)
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
            const center = oddrToPixel(col, row, tileSize.x, tileSize.y, hexMapOffset);
            
            // check against all hex edges
            const offsets = getOffsets(row);

            offsets.forEach(([dx, dy], i) => 
            {
                const neighborKey = getMapOddrString(wrapCol(col + dx), wrapRow(row + dy));
                if (!neighbors.includes(neighborKey)) return; // if hex edge has neighbor not owned by city = draw on that edge

                const start = getHexPoint(i, center, tileSize);
                const end = getHexPoint((i + 1) % 6, center, tileSize);

                drawLine(context, start, end, 'yellow', Math.min(tileSize.x, tileSize.y) / 20);
            });
        });
    }

    function drawHexImage(context: CanvasRenderingContext2D, tile: TileType, opacity: number, img: HTMLImageElement)
    {
        const px = oddrToPixel(tile.X, tile.Y, tileSize.x, tileSize.y, hexMapOffset);
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
            const px = oddrToPixel(col, row, tileSize.x, tileSize.y, hexMapOffset);

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

        drawTextWithBox(context, {x: textBoxPos.x, y: textBoxPos.y}, textBoxText);
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
            const oddrCoord = pixelToOddr(mousePos, tileSize, hexMapOffset); 
            const key = getMapOddrString(oddrCoord.col, oddrCoord.row);

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

            const oddrCoord = pixelToOddr(mousePos, tileSize, hexMapOffset);
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
                            const offsets = getOffsets(row);
                            offsets.forEach((neighbor) => 
                            {
                                let neighborCoord = {x: wrapCol(col + neighbor[0]), y: wrapRow(row + neighbor[1])};
                                const neighborStringCoord = getMapOddrString(neighborCoord.x, neighborCoord.y);
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

        let firstCiv = CIV_NAME_DEFAULT;
        let firstCity = CITY_NAME_DEFAULT;

        for (let i = 0; i < theJSON.length; i++)
        {
            const tile = theJSON[i];
            if (tile.Civilization !== TileNone.NONE)
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
                        if (firstCiv === CIV_NAME_DEFAULT)
                            firstCiv = tile.Civilization;
                        if (firstCity === CITY_NAME_DEFAULT)
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
        const civVal = civDropdownRef.current ? civDropdownRef.current.value : CIV_NAME_DEFAULT;
        const cityVal = cityDropdownRef.current ? cityDropdownRef.current.value : CITY_NAME_DEFAULT;

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
        const sizes = getScaledGridAndTileSizes(baseTileSize, minAndMaxCoords, winSize); 
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
        const cityCenterMap = new Map<string, TileType>();
        const civCompletedWondersTemp = new Set<TileWonders>();

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
                const key = getMapOddrString(tile.X, tile.Y);

                if (tile.TerrainType?.includes("Mountain"))
                    mountainCache.set(key, tile);
                else
                    otherCache.set(key, tile);

                loadCount++;

                if (tile.TileCity !== TileNone.NONE && tile.Civilization !== TileNone.NONE)
                {
                    const cityTilesKey = `${tile.Civilization},${tile.TileCity}`;
                    const tileDatas = cityTiles.get(cityTilesKey);
                    if (tileDatas)
                    {
                        if (tile.IsCity)
                            cityCenterMap.set(cityTilesKey, tile);
                        else
                            tileDatas.push(tile);
                        cityTiles.set(cityTilesKey, tileDatas);
                    }
                    else
                    {
                        cityTiles.set(cityTilesKey, []);
                    }
                }

                if (tile.Wonder !== TileNone.NONE)
                {
                    const completedWonders = civCompletedWondersTemp.has(tile.Wonder);
                    if (!completedWonders)
                        civCompletedWondersTemp.add(tile.Wonder);
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

        cityCenterMap.forEach((val, key) => // so that the city center is always last
        {
            const cityData = cityTiles.get(key);
            if (cityData)
            {
                cityTiles.set(key, [...cityData, val]);
            }
        })

        setCityOwnedTiles(cityTiles);
        setCivCompletedWonders(civCompletedWondersTemp);
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
        const sizes = getScaledGridSizesFromTile(newTileSize, mapJSON);
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
        setVisualYieldDropdown([]);
        setCityOwnedTiles(new Map());
        setCivCompletedWonders(new Set());
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

    function updateTilesWithDistrict(foundTile: TileType)
    {
        if (dropdownCity)
        {
            const oddr = getMapOddrString(foundTile.X, foundTile.Y);
            hexmapCache.current.set(oddr, foundTile);

            const cityMap = new Map(cityOwnedTiles);
            const tileList = cityMap.get(dropdownCity);
            if (tileList)
            {
                for (let i = 0; i < tileList.length; i++)
                {
                    const tile = tileList[i];
                    if (tile.X === foundTile.X && tile.Y === foundTile.Y)
                    {
                        tileList[i] = foundTile;
                        break;
                    }
                }

                cityMap.set(dropdownCity, tileList);
            }

            setCityOwnedTiles(cityMap);
            setMapCacheVersion(mapCacheVersion + 1);
        }
    }

    function findCivLeader(): LeaderName | TileNone
    {
        if (dropdownCity && dropdownCiv)
        {
            const dropdownCityOwnedTiles = cityOwnedTiles.get(`${dropdownCiv},${dropdownCity}`);
            if (dropdownCityOwnedTiles)
            {
                if (dropdownCiv.includes("city-state"))
                    return LeaderName.CITY_STATE;
                else
                    return dropdownCityOwnedTiles[0].Leader;
            }
        }

        return TileNone.NONE;
    }

    function getTileFromDistrictType(district: string, civObj: Civilization, ownedTiles: TileType[])
    {
        if (district === TileDistricts.SCIENCE_DISTRICT)
            return includeWonders ? civObj.getCampusTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getCampusTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.THEATER_DISTRICT)
            return includeWonders ? civObj.getTheaterTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getTheaterTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.COMMERCIAL_DISTRICT)
            return includeWonders ? civObj.getCommercialHubTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getCommercialHubTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.HARBOR_DISTRICT)
            return includeWonders ? civObj.getHarborTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getHarborTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.INDUSTRIAL_DISTRICT)
            return includeWonders ? civObj.getIndustrialZoneTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getIndustrialZoneTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.FAITH_DISTRICT)
            return includeWonders ? civObj.getHolySiteTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getHolySiteTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.ENTERTAINMENT_DISTRICT)
            return includeWonders ? civObj.getEntertainmentZoneTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getEntertainmentZoneTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.AQUEDUCT_DISTRICT)
            return includeWonders ? civObj.getAqueductTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getAqueductTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.NEIGHBORHOOD_DISTRICT)
            return includeWonders ? civObj.getNeighborhoodTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getNeighborhoodTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.ROCKET_DISTRICT)
            return includeWonders ? civObj.getSpaceportTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders) : civObj.getSpaceportTile(ownedTiles, dropdownYields, hexmapCache.current, null);
        else if (district === TileDistricts.ENCAMPMENT_DISTRICT && dropdownNearbyCity)
            return includeWonders ? civObj.getEncampmentTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity) : civObj.getEncampmentTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity);
    }

    const handleAddButton = useCallback(() => 
    {
        let theError = "";

        let foundTile = undefined as TileType | undefined;

        const theCiv = getCivilizationObject(findCivLeader());
        if (dropdownCity && dropdownCiv && theCiv !== TileNone.NONE)
        {
            const dropdownCityOwnedTiles = cityOwnedTiles.get(`${dropdownCiv},${dropdownCity}`);

            if (dropdownCityOwnedTiles)
                foundTile = getTileFromDistrictType(dropdownDistrict, theCiv, dropdownCityOwnedTiles);
        }

        if (foundTile)
            updateTilesWithDistrict(foundTile);
        else if (dropdownCity === CITY_NAME_DEFAULT)
            theError = "ERROR: Need to load a map first!";
        else
            theError = "ERROR: The optimal tile may not exist or the district already exists.";

        if (theError.length > 0)
        {
            setErrorText(theError);
            setTimeout(() => 
            {
                setErrorText("");
            }, 4000)
        }
    }, [cityOwnedTiles, dropdownDistrict, dropdownCity, dropdownCiv, dropdownYields, mapCacheVersion, includeWonders, civCompletedWonders, dropdownNearbyCity])

    const getSelectionYields = useCallback(() => 
    {
        const allYields = allPossibleYields();
        const tempArr: YieldOption[] = [];

        for (let i = 0; i < allYields.length; i++)
        {
            const currYield = allYields[i];
            const currImage = yieldImagesCache.current.get(currYield);
            if (!currImage)
                tempArr.push({value: currYield, label: currYield, image: new Image()});
            else
            {
                tempArr.push({value: currYield, label: currYield, image: currImage});
            }
        }

        return tempArr;
    }, [areImagesLoaded])   

    function formatSelectionYields(option: YieldOption): JSX.Element
    {
        return <div>
            <span style={{paddingRight: '10px'}}>{option.label}</span>
            <img src={option.image.src} width={20} height={20}/>
        </div>
    }

    const getNearbyCityOptions = useCallback(() => 
    {
        const tempArr: NearbyCityOption[] = [];
        let i = 0;

        uniqueCities.forEach((cities, civ) => 
        {
            cities.forEach((city) => 
            {
                tempArr.push({value: `${civ},${city}`, label: <div key={i}> <span>{city}</span> <br/> <span>({civ})</span> </div>, text: `${city} (${civ})`});
                ++i;
            })
        })

        return tempArr;
    }, [uniqueCities])  

    useEffect(() => 
    {
        if (dropdownDistrict === TileDistricts.ENCAMPMENT_DISTRICT || dropdownDistrict === TileDistricts.AERODROME_DISTRICT)
            setNearbyCityDisplay('grid');
        else
            setNearbyCityDisplay('none');

    }, [dropdownDistrict])

    function getNearbyCityTextMaxWidth()
    {
        let max = 0;
        const opts = getNearbyCityOptions();
        
        if (opts.length > 0)
        {
            opts.forEach((vals) => 
            {
                const width = getTextWidth(vals.text, `${nearbyCityFontSize}px arial`, theCanvas.current);
                if (width)
                    max = Math.max(width);
            })
        }
        else
        {
            const theString = `${CITY_NAME_DEFAULT} (${CIV_NAME_DEFAULT})`;
            const width = getTextWidth(theString, `${nearbyCityFontSize}px arial`, theCanvas.current);
            if (width)
                max = Math.max(width);
        }

        return max;
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
                <span style={{color: 'red', fontWeight: 'bold', fontSize: '1.25em'}}>{errorText}</span>
                <div style={{display: 'grid'}}>
                    <div style={{display: 'flex'}}>
                        <span>Include City States</span>
                        <input type='checkbox' onChange={(e) => {setIncludeCityStates(e.target.checked)}}/>
                    </div>
                    {/*Select Civilization*/}
                    <select ref={civDropdownRef} onChange={(e) => {setDropdownCiv(e.target.value)}}>
                        {(  // return function and then call it
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
                                    return <option>{CIV_NAME_DEFAULT}</option>
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
                                if (dropdownCiv !== CIV_NAME_DEFAULT)
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
                                    return <option>{CITY_NAME_DEFAULT}</option>
                                }
                            }
                        )()}
                    </select> 
                    <div>
                        {/*Select District Type*/}
                        <select onChange={e => {setDropdownDistrict(e.target.value)}}>
                            {
                                allPossibleDistricts().map((value, index) => 
                                (
                                    <option value={value} key={index}>{value}</option>
                                ))
                            }
                        </select>

                        <div style={{display: nearbyCityDisplay}}>
                            <span>Select a nearby city: </span>
                            <div style={{display: 'flex'}}>

                                <Select 
                                    onChange=
                                    {
                                        val =>
                                        {
                                            if (val)
                                            {
                                                const allCities = cityOwnedTiles.get(val.value);
                                                if (allCities)
                                                    setDropdownNearbyCity(allCities[allCities.length - 1]);
                                            }
                                        }

                                    }
                                    options={getNearbyCityOptions()} 
                                    styles={nearbyCityStyles(getNearbyCityTextMaxWidth() * 1.25)}
                                />

                                <span style={{marginLeft: '5px', marginRight: '5px'}}>Distance: </span><input type='range' min={0} max={9999}></input>
                            </div>
                        </div>

                        {(
                            () => 
                            {
                                if (nearbyCityDisplay === 'none')
                                    return <br/>
                            }
                        )()}

                        <span>Account For Possible Wonders</span>
                        <input type='checkbox' onChange={(e) => {setIncludeWonders(e.target.checked)}}/>

                        <Select 
                            value={visualYieldDropdown}
                            options={getSelectionYields()} 
                            isMulti 
                            styles={mapPageSelectStyle}
                            onChange=
                            {
                                (e) => 
                                {
                                    const yields: TileYields[] = [];
                                    const opts: {value: TileYields, label: TileYields, image: HTMLImageElement}[] = [];

                                    e.forEach((opt) => { yields.push(opt.value); opts.push(opt);})

                                    setDropdownYields(yields);
                                    setVisualYieldDropdown(opts);
                                }
                            }
                            formatOptionLabel={formatSelectionYields}
                        />
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
                            <button>EXPORT</button>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <button onClick={handleInputButtonClick}>IMPORT</button>
                            <input style={{display: 'none'}} type='file' ref={fileInputRef} onChange={e => handleInputChange(e)} accept='.json'/>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <label>LOAD
                                <select>

                                </select>
                            </label>
                            <button>SAVE</button>
                        </div>
                    </div>
                </div>
            </div>

            {<button onClick={testStuff}>TEST BUTTON</button>}
        </div>
    );

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

    function testStuff()
    {
        /*
        const german = cityOwnedTiles.get("German Empire,Aachen");
        const aztec = cityOwnedTiles.get("Nan Madol city-state,Nan Madol");

        if (german && aztec)
        {
            const germanCity = german[german.length - 1];
            const aztecCity = aztec[aztec.length - 1];

            const x1 = germanCity.X;
            const y1 = germanCity.Y;
            const x2 = aztecCity.X;
            const y2 = aztecCity.Y;

            const even = (num: number) => {return (num % 2 == 0)};
            const odd = (num: number) => {return (num % 2 == 1)};

            const dx = x2 - x1;
            const dy = y2 - y1;
            const penalty = ( (even(y1) && odd(y2) && (x1 < x2)) || (even(y2) && odd(y1) && (x2 < x1)) ) ? 1 : 0;
            const distance = Math.max(Math.abs(dy), Math.abs(dx) + Math.floor(Math.abs(dy)/2) + penalty); 

            console.log('dist: ' + distance)
        }
        */

        const aachen = cityOwnedTiles.get(`German Empire,Aachen`);
        const nanMadol = cityOwnedTiles.get(`Aztec Empire,Tenochtitlan`);

        if (aachen && nanMadol)
        {
            const aachenCity = aachen[aachen.length - 1];
            const nanMadolCity = nanMadol[nanMadol.length - 1];

            const angle = getAngleBetweenTwoOddrHex({x: aachenCity.X, y: aachenCity.Y}, {x: nanMadolCity.X, y: nanMadolCity.Y});

            console.log(angle)
        }
    }
};

export default MapPage;