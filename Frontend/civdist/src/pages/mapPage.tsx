import React, {useEffect, useState, useRef, useCallback, JSX} from 'react';
import Select, { GroupBase, SelectInstance } from 'react-select'
import { Link } from 'react-router-dom';
import './mapPage.css'
import './allPages.css';
import { TileNone, TileWonders, TileDistricts, TileNaturalWonders, TerrainFeatureKey, RiverDirections, TileType, LeaderName, TileYields, PossibleErrors, VictoryType, TileBonusResources, TileLuxuryResources, TileStrategicResources, TileArtifactResources, TileUniqueDistricts, HexType, YieldImagesKey, OptionalVisualOptions} from '../types/types'
import { loadDistrictImages, loadNaturalWonderImages, loadResourceImages, loadTerrainImages, loadWonderImages, loadYieldDropdownImages, loadYieldImages } from '../images/imageLoaders';
import { getTerrain, getDistrict, getNaturalWonder, getWonder, getResource, getYields } from '../images/imageAttributeFinders';
import { baseTileSize, getAllPossibleDistricts, getAllPossibleYields, getAllPossibleVictoryTypes, minZoom, maxZoom } from '../utils/constants';
import { Civilization, getCivilizationObject } from '../civilization/civilizations';
import { yieldSelectStyle, nearbyCityFontSize, nearbyCityStyles, genericSingleSelectStyle } from './mapPageSelectStyles';
import { OptionsWithImage, OptionsWithSpecialText, OptionsGenericString } from '../types/selectionTypes';
import { getMapOddrString, getMinMaxXY, getTextWidth } from '../utils/functions/misc/misc';
import { getHexPoint, getOffsets, oddrToPixel, pixelToOddr } from '../utils/functions/hex/genericHex';
import { getScaledGridAndTileSizes, getScaledGridSizesFromTile, getScaleFromType, getTileScaleOddr } from '../utils/functions/imgScaling/scaling';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import Tooltip from '../components/tooltip';
import { allocateCitizensAuto, purgeTileForDistrict } from '../utils/functions/civ/civFunctions';

// assuming all resources are revealed

/*
/////////////////////////////////////////////////////////////////

TODO: Fix gap in city border lines!

TODO: Optimize hexmap drawing.

TODO: yieldTesting.json wrong encampment????

TODO: Get new worked tile if district is placed over worked one!! RULES: Yields affected by favored or disfavored yields. Prioritzes food? Districts are least priority? Disfavored = remove tiles that have more of the disfavored yield. Favored = keep tiles that have more of this.
TODO: Test calculated worked tile by manually adding favored/disfavored yields and checking yieldTesting.json.

TODO: Add toggable hover with tile data and resize if too long with max width

TODO: Update hexmapCache and cityOwnedTiles when adding new district - WHEN ADDING DISTRICT ACCOUNT FOR EFFECTS OF DISTRICT LIKE THEATER ADDING APPEAL TO ADJ OR REMOVING STUFF LIKE IMPROVEMENTS

TODO: Check bonuses in buildings/unique buildings too

TODO: Add tooltip question mark to explain the dropdowns and stuff.

TODO: Add loading warning/prompt when map is being drawn

TODO: Save map JSON to backend/database.

TODO: Retrieve all saved JSON maps from player profile. Max 5?

TODO: Refactor code to make it nicer/more organized and remove redundancies. Remove unnecessary useCallbacks. Remove unnecessary dependencies or refactor them.

TODO: Add documentation to functions. Read random comments to see if any extra issues need fixing.

TODO: Can civ6 cities have same name??

TODO: Change all selects to the Select from react-hexgrid so can add little icons next to text.

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

    const [dropdownCiv, setDropdownCiv] = useState<string | null>(null);

    const [includeCityStates, setIncludeCityStates] = useState<boolean>(false);
    const [includeWonders, setIncludeWonders] = useState<boolean>(false);

    const [dropdownCity, setDropdownCity] = useState<string | null>(null);

    const [dropdownDistrict, setDropdownDistrict] = useState<string | null>(null);

    const [dropdownYields, setDropdownYields] = useState<TileYields[]>([]);
    const [visualYieldDropdown, setVisualYieldDropdown] = useState<{value: TileYields, label: TileYields, image: HTMLImageElement}[]>([]);

    const [dropdownVictoryType, setDropdownVictoryType] = useState<string | null>(null);

    const [dropdownNearbyCity, setDropdownNearbyCity] = useState<TileType | null>(null);

    const [optionalVisual, setOptionalVisual] = useState<{yields: boolean, resources: boolean}>({yields: false, resources: false});

    /**
     * - Shifting hex img's by the subtraction seen in drawMap() keeps correct oddr coordinate detection but visuals will break
     * - Adding this offset fixes the visuals and keeps the coordinates correct
     */
    const hexMapOffset = {x: tileSize.x * 2, y: tileSize.y * 2};

    const theCanvas = useRef<HTMLCanvasElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const zoomInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const nearbyCityRef = useRef<SelectInstance<OptionsWithSpecialText, false, GroupBase<OptionsWithSpecialText>> | null>(null);
    const optionalVisualRef = useRef<SelectInstance<OptionsGenericString, false, GroupBase<OptionsGenericString>> | null>(null);

    const terrainImagesCache = useRef<Map<TerrainFeatureKey, HTMLImageElement>>(new Map());
    const wondersImagesCache = useRef<Map<TileWonders, HTMLImageElement>>(new Map());
    const naturalWondersImagesCache = useRef<Map<TileNaturalWonders, HTMLImageElement>>(new Map());
    const districtsImagesCache = useRef<Map<TileDistricts | TileUniqueDistricts, HTMLImageElement>>(new Map());
    const dropdownYieldImagesCache = useRef<Map<TileYields, HTMLImageElement>>(new Map());
    const yieldImagesCache = useRef<Map<YieldImagesKey, HTMLImageElement>>(new Map());
    const resourceImagesCache = useRef<Map<TileBonusResources | TileLuxuryResources | TileStrategicResources | TileArtifactResources, HTMLImageElement>>(new Map());

    const [areImagesLoaded, setAreImagesLoaded] = useState<boolean>(false);
    const [riverTiles, setRiverTiles] = useState<TileType[]>([]);

    async function loadAllImages()
    {
        await loadTerrainImages(terrainImagesCache.current);
        await loadWonderImages(wondersImagesCache.current);
        await loadNaturalWonderImages(naturalWondersImagesCache.current);
        await loadDistrictImages(districtsImagesCache.current);
        await loadYieldDropdownImages(dropdownYieldImagesCache.current);
        await loadResourceImages(resourceImagesCache.current);
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

    function updateRiverCacheWithTile(tile: TileType, riverArray: TileType[])
    {
        if (riverTiles.length <= 0 && (tile.IsNEOfRiver || tile.IsNWOfRiver || tile.IsWOfRiver))
                riverArray.push(tile);
    }

    function drawRiversFromCache(context: CanvasRenderingContext2D)
    {
        const drawRiverTile = (context: CanvasRenderingContext2D, tile: TileType) => 
        {
            const [col, row] = [tile.X, tile.Y];
            const px = oddrToPixel(col, row, tileSize.x, tileSize.y, hexMapOffset);

            let IsNEOfRiver = tile.IsNEOfRiver;
            let IsNWOfRiver = tile.IsNWOfRiver;
            let IsWOfRiver = tile.IsWOfRiver;

            if (IsNEOfRiver)
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHWEST, px);
            if (IsNWOfRiver)
                drawRiver6PossibleDirections(context, RiverDirections.SOUTHEAST, px);
            if (IsWOfRiver)
                drawRiver6PossibleDirections(context, RiverDirections.EAST, px);
        }

        if (riverTiles.length <= 0)
        {
            hexmapCache.current.forEach((tile, oddr) => 
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
        if (currentCity)
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
    }

    function drawResourceOnTile(context: CanvasRenderingContext2D, tile: TileType)
    {
        if (tile.ResourceType !== TileNone.NONE && tile.District === TileNone.NONE)
        {
            const px = oddrToPixel(tile.X, tile.Y, tileSize.x, tileSize.y, hexMapOffset);
            const imgAttributes = getResource(tile, resourceImagesCache.current);
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

    function drawYieldsOnTile(context: CanvasRenderingContext2D, tile: TileType)
    {
        const px = oddrToPixel(tile.X, tile.Y, tileSize.x, tileSize.y, hexMapOffset);
        const imgAttributes = getYields(tile, yieldImagesCache.current);

        // only using the tile scale instead of the img scale as the tile scale changes on zoom change
        const tileScaleY = tileSize.y / baseTileSize;
        const tileScaleX = tileSize.x / baseTileSize;
        
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
        const riverArray: TileType[] = [];
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

            if (optionalVisual.yields)
                drawYieldsOnTile(context, tile);
            else if (optionalVisual.resources)
                drawResourceOnTile(context, tile);

            updateRiverCacheWithTile(tile, riverArray);
                
        });

        drawRiversFromCache(context);
        drawBorderLines(context);

        drawTextWithBox(context, {x: textBoxPos.x, y: textBoxPos.y}, textBoxText);

        if (riverTiles.length <= 0)
            setRiverTiles(riverArray);
    }
    
    const handleMouseHover = useCallback((key: string, oddrCoord: { col: number, row: number }) => 
    {
        const context = theCanvas.current?.getContext('2d');
        const hoveredImg = hexmapCache.current.get(key);
        if (hoveredImg && context) 
        {
            drawMapWithHoveredTile(context, oddrCoord, 0.3);
        }
    }, [tileSize, gridSize, cityBoundaryTiles, dropdownCity, optionalVisual, currentCity, riverTiles]); // to ensure latest values are used

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

            // dont reset the clicked city stuff if click is out of bounds - only want to reset when click on the visible hexmap
            if (!inDivBounds || outOfHexBounds)
                return;
            
            if (currentTile && currentTile.IsCity)
            {
                if (!currentCity || (currentCity && currentCity.CityName !== currentTile.CityName))
                {
                    setCurrentCity(currentTile);

                    let tempMap = new Map<string, string[]>();

                    const cityTiles = cityOwnedTiles.get(`${currentTile.Civilization},${currentTile.CityName}`);

                    if (cityTiles)
                    {
                        cityTiles.forEach(tile => 
                        {
                            const [col, row] = [tile.X, tile.Y];

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
                                tempMap.set(getMapOddrString(tile.X, tile.Y), neighborList);
                        });
                    }

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
    }, [tileSize, gridSize, currentTile, currentCity, cityOwnedTiles]);

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
                }
            }
        }

        setUniqueCivilizations(tempCivSet);
        setUniqueCities(tempCitySet);
    }

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
        const riverArray: TileType[] = [];
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        hexmapCache.current.forEach(tile => 
        {
            let theOpacity = 1;
            if (tile.IsCity && dropdownCity && tile.CityName === dropdownCity)
                theOpacity = 0.25;

            const theImage = getImageAttributes(tile).imgElement;
            if (theImage)
                drawHexImage(context, tile, theOpacity, theImage);

            if (optionalVisual.yields)
                drawYieldsOnTile(context, tile);
            else if (optionalVisual.resources)
                drawResourceOnTile(context, tile);

            updateRiverCacheWithTile(tile, riverArray);
        });

        drawRiversFromCache(context);
        drawBorderLines(context);

        if (riverTiles.length <= 0)
            setRiverTiles(riverArray);
    }, [tileSize, gridSize, cityBoundaryTiles, dropdownCity, areImagesLoaded, mapJSON, mapCacheVersion, optionalVisual, riverTiles]);

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
        if (!areImagesLoaded || mapJSON.length === 0) return;

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
    }, [areImagesLoaded, mapJSON, minAndMaxCoords, mapCacheVersion, initHexmapCache, drawMapFromCache]);

    const handleZoomChange = useCallback((zoomLevel: number) =>
    {
        let theZoom = zoomLevel;
        if (theZoom < minZoom)
        {
            theZoom = minZoom;
            setVisualZoomInput(minZoom);
        }
        else if (theZoom > maxZoom)
        {
            theZoom = maxZoom;
            setVisualZoomInput(maxZoom);
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
        setDropdownVictoryType(null);
        setDropdownCity(null);
        setDropdownCiv(null);
        setDropdownDistrict(null);
        setDropdownNearbyCity(null);

        if (nearbyCityRef.current)
            nearbyCityRef.current.clearValue();

        if (optionalVisualRef.current)
            optionalVisualRef.current.clearValue();
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

    function updateTilesWithDistrict(foundTile: TileType, cityTiles: TileType[])
    {
        if (dropdownCity)
        {
            // update city local variable
            for (let i = 0; i < cityTiles.length; i++)
            {
                const currTile = cityTiles[i];
                if (currTile.X === foundTile.X && currTile.Y === foundTile.Y)
                {
                    cityTiles[i] = foundTile;
                    break;
                }
            }
            
            let newCityTiles = cityTiles;
            let workerReassigned = false;

            if (foundTile.IsWorked) // means will not be worked anymore after district placement
                workerReassigned = true;

            purgeTileForDistrict(foundTile);

            if (workerReassigned)
            {
                const theCity = cityTiles[cityTiles.length - 1];
                newCityTiles = allocateCitizensAuto(cityTiles, theCity, {population: theCity.Population});
            }

            const oddr = getMapOddrString(foundTile.X, foundTile.Y);
            hexmapCache.current.set(oddr, foundTile);

            const cityMap = new Map(cityOwnedTiles);
            const tileList = cityMap.get(dropdownCity);
            if (tileList)
                cityMap.set(dropdownCity, newCityTiles);

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

    /**
     * 
     * @param district 
     * @param civObj 
     * @param ownedTiles 
     * @returns The tile or undefined if dropdownNearbyCity is not set.
     */
    function getTileFromDistrictType(civObj: Civilization, ownedTiles: TileType[]): TileType | undefined
    {
        let victoryType = dropdownVictoryType;
        if (!victoryType)
            victoryType = VictoryType.NONE;

        if (dropdownNearbyCity)
        {
            if (dropdownDistrict === TileDistricts.SCIENCE_DISTRICT)
                return includeWonders ? civObj.getCampusTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getCampusTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.THEATER_DISTRICT)
                return includeWonders ? civObj.getTheaterTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getTheaterTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.COMMERCIAL_DISTRICT)
                return includeWonders ? civObj.getCommercialHubTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getCommercialHubTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.HARBOR_DISTRICT)
                return includeWonders ? civObj.getHarborTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getHarborTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.INDUSTRIAL_DISTRICT)
                return includeWonders ? civObj.getIndustrialZoneTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getIndustrialZoneTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.FAITH_DISTRICT)
                return includeWonders ? civObj.getHolySiteTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getHolySiteTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.ENTERTAINMENT_DISTRICT)
                return includeWonders ? civObj.getEntertainmentZoneTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getEntertainmentZoneTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.AQUEDUCT_DISTRICT)
                return includeWonders ? civObj.getAqueductTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getAqueductTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.NEIGHBORHOOD_DISTRICT)
                return includeWonders ? civObj.getNeighborhoodTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getNeighborhoodTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.ROCKET_DISTRICT)
                return includeWonders ? civObj.getSpaceportTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getSpaceportTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.ENCAMPMENT_DISTRICT)
                return includeWonders ? civObj.getEncampmentTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getEncampmentTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);
            
            else if (dropdownDistrict === TileDistricts.AERODROME_DISTRICT)
                return includeWonders ? civObj.getAerodromeTile(ownedTiles, dropdownYields, hexmapCache.current, civCompletedWonders, dropdownNearbyCity, victoryType) : civObj.getAerodromeTile(ownedTiles, dropdownYields, hexmapCache.current, null, dropdownNearbyCity, victoryType);

        }
    }

    const handleAddButton = useCallback(() => 
    {
        let theError = "";

        if (mapJSON.length <= 0)
                theError = "ERROR: Need to load a map first!"; 
        else if (!dropdownCiv)
            theError = "ERROR: Need to select a civilization!"; 
        else if (!dropdownCity)
            theError = "ERROR: Need to select a city!"; 
        else if (!dropdownDistrict)
            theError = "ERROR: Need to select a district!"; 
        else if (!dropdownNearbyCity)
            theError = "ERROR: Need to select a nearby city!"; 
    
        if (theError.length > 0)
        {
            setErrorText(theError);
            setTimeout(() => 
            {
                setErrorText("");
            }, 4000)

            return;
        }

        try
        {
            let foundTile = undefined as TileType | undefined;

            const theCiv = getCivilizationObject(findCivLeader());
            if (dropdownCity && dropdownCiv && theCiv !== TileNone.NONE)
            {
                const dropdownCityOwnedTiles = cityOwnedTiles.get(`${dropdownCiv},${dropdownCity}`);

                if (dropdownCityOwnedTiles)
                {
                    foundTile = getTileFromDistrictType(theCiv, dropdownCityOwnedTiles);

                    if (foundTile)
                        updateTilesWithDistrict(foundTile, dropdownCityOwnedTiles);
                }
            }
        }
        catch(err)
        {
            if (err instanceof Error)
            {
                if (err.message === PossibleErrors.DISTRICT_ALREADY_EXISTS)
                    theError = `${dropdownDistrict} already exists!`;
                else if (err.message === PossibleErrors.FAILED_TO_FIND_TILE)
                    theError = 'Failed to find an optimal tile.';

                if (theError.length > 0)
                {
                    setErrorText(theError);
                    setTimeout(() => 
                    {
                        setErrorText("");
                    }, 4000)
                }
            }
        }
    }, [cityOwnedTiles, dropdownDistrict, dropdownCity, dropdownCiv, dropdownYields, mapCacheVersion, includeWonders, civCompletedWonders, dropdownNearbyCity, dropdownVictoryType])

    const getSelectionYields = useCallback(() => 
    {
        const allYields = getAllPossibleYields();
        const tempArr: OptionsWithImage[] = [];

        if (areImagesLoaded)
        {
            for (let i = 0; i < allYields.length; i++)
            {
                const currYield = allYields[i];
                const currImage = dropdownYieldImagesCache.current.get(currYield);
                if (currImage)
                    tempArr.push({value: currYield, label: currYield, image: currImage});
            }
        }

        return tempArr;
    }, [areImagesLoaded])    

    function formatSelectionYields(option: OptionsWithImage): JSX.Element
    {
        return <div>
            <span style={{paddingRight: '10px'}}>{option.label}</span>
            <img src={option.image.src} width={20} height={20}/>
        </div>
    }

    const getNearbyCityOptions = useCallback(() => 
    {
        const tempArr: OptionsWithSpecialText[] = [];

        uniqueCities.forEach((cities, civ) => 
        {
            cities.forEach((city) => 
            {
                if (city !== dropdownCity)
                    tempArr.push({value: `${civ},${city}`, label: <div> <span>{city}</span> <br/> <span>({civ})</span> </div>, text: `${city} (${civ})`});
            })
        })

        return tempArr;
    }, [uniqueCities, dropdownCity])  

    const getCivilizationOptions = useCallback(() => 
    {
        const tempArr: OptionsGenericString[] = [];

        uniqueCivilizations.forEach((civ) => 
        {
            if (includeCityStates || (!includeCityStates && !civ.includes("city-state")))
            {
                tempArr.push({value: civ, label: civ});
            }
        })

        return tempArr;
    }, [uniqueCivilizations, includeCityStates])   

    const getCityOptions = useCallback(() => 
    {
        const tempArr: OptionsGenericString[] = [];
        if (dropdownCiv)
        {
            const cityList = uniqueCities.get(dropdownCiv);

            if (cityList)
            {
                for (let i = 0; i < cityList.length; i++)
                {
                    const theCity = cityList[i];
                    tempArr.push({value: theCity, label: theCity});
                }
            }
        }

        return tempArr;
    }, [uniqueCities, dropdownCiv, getCivilizationOptions]) 

    function getDistrictOptions() 
    {
        const tempArr: OptionsGenericString[] = [];
        const allDistricts = getAllPossibleDistricts();

        for (let i = 0; i < allDistricts.length; i++)
        {
            const theDistrict = allDistricts[i];
            tempArr.push({value: theDistrict, label: theDistrict});
        }

        return tempArr;
    }

    function getVictoryTypeOptions() 
    {
        const tempArr: OptionsGenericString[] = [];
        const allVictoryTypes = getAllPossibleVictoryTypes();

        for (let i = 0; i < allVictoryTypes.length; i++)
        {
            const theVictoryType = allVictoryTypes[i];
            tempArr.push({value: theVictoryType, label: theVictoryType});
        }

        return tempArr;
    }

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
            const theString = 'Select a nearby city.';
            const width = getTextWidth(theString, `${nearbyCityFontSize}px arial`, theCanvas.current);
            if (width)
                max = Math.max(width);
        }

        return max;
    }

    function getOptionalVisualOptions() 
    {
        const tempArr: OptionsGenericString[] = [];

        for (const visuals of Object.values(OptionalVisualOptions))
        {
            tempArr.push({label: visuals, value: visuals});
        }

        return tempArr;
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

            <div style={{alignContent: 'center', margin: '0px 10px', padding: '0px 10px', border: '1px solid black'}}>
                <span style={{color: 'red', fontWeight: 'bold', fontSize: '1.25em'}}>{errorText}</span>
                <div style={{display: 'grid'}}>

                    <div style={{display: 'flex'}}>
                        <Select 
                            options={getOptionalVisualOptions()} 
                            styles={genericSingleSelectStyle} 
                            onChange=
                            {
                                val =>
                                {
                                    if (val)
                                    {
                                        if (val.value === OptionalVisualOptions.SHOW_YIELDS)
                                            setOptionalVisual({yields: true, resources: false});
                                        else if (val.value === OptionalVisualOptions.SHOW_RESOURCES)
                                            setOptionalVisual({yields: false, resources: true});
                                    }
                                    else
                                    {
                                        setOptionalVisual({yields: false, resources: false});
                                    }
                                }
                            }
                            placeholder={'Select an optional visual'}
                            isClearable
                            ref={optionalVisualRef}
                        />
                    </div>

                    <div style={{display: 'flex'}}>
                        <span>Include City States</span>
                        <input type='checkbox' onChange={(e) => {setIncludeCityStates(e.target.checked)}}/>
                    </div>

                    <div style={{display: 'flex'}}>
                        <span>Account For Wonders</span>
                        <input type='checkbox' onChange={(e) => {setIncludeWonders(e.target.checked)}}/>
                        <Tooltip text='Consider wonders that may be built in the future.'>
                            <FontAwesomeIcon icon={faCircleQuestion} className='questionMark'/>
                        </Tooltip>
                    </div>
                    
                    {/*Select Civilization*/}
                    <div style={{display: 'flex'}}>
                        <span className='mandatory'>*</span>

                        <Select 
                            value={dropdownCiv ? {label: dropdownCiv, value: dropdownCiv} : null}
                            options={getCivilizationOptions()} 
                            styles={genericSingleSelectStyle} 
                            onChange=
                            {
                                val => 
                                { 
                                    if (val && val.value) 
                                        setDropdownCiv(val.value); 
                                    else 
                                        setDropdownCiv(null);

                                    setDropdownCity(null);
                                }
                            } 
                            placeholder={'Select a civilization'}
                        />

                        <Tooltip text='Select a civilization.'>
                            <FontAwesomeIcon icon={faCircleQuestion} className='questionMark'/>
                        </Tooltip>

                    </div>

                    <div style={{display: 'flex'}}>
                        {/*Select City*/}
                        <span className='mandatory'>*</span>
                        
                        <Select 
                            value={dropdownCity ? {label: dropdownCity, value: dropdownCity} : null}
                            options={getCityOptions()} 
                            styles={genericSingleSelectStyle} 
                            onChange=
                            {
                                val => 
                                { 
                                    if (val && val.value) 
                                    {
                                        setDropdownCity(val.value); 
                                    }
                                    else 
                                    {
                                        setDropdownCity(null); 
                                    }
                                }
                            } 
                            placeholder={'Select a city'}
                        />
                        
                        <Tooltip text={dropdownCiv ? `${dropdownCiv}'s cities.` : 'Select a civilization first!'}>
                            <FontAwesomeIcon icon={faCircleQuestion} className='questionMark'/>
                        </Tooltip>
                    </div>

                    <div style={{display: 'flex'}}>
                        {/* District Type Selection */}
                        <span className='mandatory'>*</span>
                        <Select
                            value={dropdownDistrict ? {label: dropdownDistrict, value: dropdownDistrict} : null}
                            options={getDistrictOptions()}
                            placeholder='Select a district'
                            styles={genericSingleSelectStyle}
                            onChange={val => {if (val && val.value) setDropdownDistrict(val.value); else setDropdownDistrict(null);}}
                        />

                        <Tooltip text='Select a district.'>
                            <FontAwesomeIcon icon={faCircleQuestion} className='questionMark'/>
                        </Tooltip>
                    </div>

                    <div style={{display: 'flex'}}>
                        <span className='mandatory'>*</span>
                        {/* Nearby City Selection */}
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
                                    else
                                    {
                                        setDropdownNearbyCity(null);
                                    }
                                }

                            }
                            options={getNearbyCityOptions()} 
                            styles={nearbyCityStyles(getNearbyCityTextMaxWidth() * 1.25)}
                            placeholder='Select a nearby city'
                            ref={nearbyCityRef}
                        />

                        <Tooltip text='A city you see as a threat.'>
                            <FontAwesomeIcon icon={faCircleQuestion} className='questionMark'/>
                        </Tooltip>

                    </div>

                    <div style={{display: 'flex'}}>
                        {/* Yields Selection */}
                        <Select 
                            value={visualYieldDropdown}
                            options={getSelectionYields()} 
                            isMulti 
                            styles={yieldSelectStyle}
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
                            placeholder='Select your yield(s)'
                        />

                        <Tooltip text='Your most important yields.'>
                            <FontAwesomeIcon icon={faCircleQuestion} className='questionMark'/>
                        </Tooltip>
                    </div>

                    <div style={{display: 'flex'}}>
                        {/* Victory Type Selection */}
                        <Select
                            value={dropdownVictoryType ? {label: dropdownVictoryType, value: dropdownVictoryType} : null}
                            options={getVictoryTypeOptions()}
                            placeholder='Select a victory type'
                            styles={genericSingleSelectStyle}
                            onChange={val => {if (val && val.value) setDropdownVictoryType(val.value); else setDropdownVictoryType(null)}}
                            isClearable
                        />

                        <Tooltip text={'The victory type you\'re aiming for.'}>
                            <FontAwesomeIcon icon={faCircleQuestion} className='questionMark'/>
                        </Tooltip>
                    </div>

                    <br/>

                    <button onClick={handleAddButton}>ADD</button>

                    <div style={{display: 'flex'}}>
                        <span style={{paddingRight: '5px'}}>Zoom Level:</span>
                        <input 
                            onKeyDown={e => handleZoomKeyDown(e)} 
                            onClick={e => handleZoomClick(e)} 
                            ref={zoomInputRef} 
                            type='number' 
                            min={minZoom} 
                            max={maxZoom} 
                            value={visualZoomInput} 
                            onChange={e => setVisualZoomInput(Number(e.target.value))} 
                            onBlur={e => handleZoomChange(Number(e.target.value))}
                        />

                        <Tooltip text={'50 - 300%'}>
                            <FontAwesomeIcon icon={faCircleQuestion} className='questionMark'/>
                        </Tooltip>
                    </div>

                    <div style={{display: 'grid'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <button>EXPORT</button>

                            <Tooltip text={'Download to file.'}>
                                <FontAwesomeIcon icon={faCircleQuestion} className='questionMark'/>
                            </Tooltip>

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

    function testStuff()
    {
        
    }
};

export default MapPage;