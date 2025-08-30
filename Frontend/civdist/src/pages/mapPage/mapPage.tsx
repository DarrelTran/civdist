import React, {useEffect, useState, useRef, useCallback, JSX} from 'react';
import Select, { GroupBase, SelectInstance } from 'react-select'
import { Link, useNavigate } from 'react-router-dom';
import styles from './mapPage.module.css';
import common from '../common.module.css';
import { TileNone, TileWonders, TileDistricts, TileNaturalWonders, TileType, LeaderName, TileYields, PossibleErrors, VictoryType, TileBonusResources, TileLuxuryResources, TileStrategicResources, TileArtifactResources, TileUniqueDistricts, HexType} from '../../types/civTypes'
import {SaveType, DatabaseMapType} from '../../types/serverTypes'
import {TerrainFeatureKey, YieldImagesKey} from '../../types/imageTypes'
import { loadDistrictImages, loadNaturalWonderImages, loadResourceImages, loadTerrainImages, loadWonderImages, loadYieldDropdownImages, loadYieldImages } from '../../images/imageLoaders';
import { getYields } from '../../images/imageAttributeFinders';
import { BASE_TILE_SIZE, MIN_ZOOM, MAX_ZOOM } from '../../utils/constants';
import { Civilization, getCivilizationObject, Norway } from '../../civilization/civilizations';
import { yieldSelectStyle, nearbyCityFontSize, nearbyCityStyles, genericSingleSelectStyle, optionalVisualStyle } from './mapPageSelectStyles';
import { OptionsWithSpecialText, OptionsGenericString, OptionalVisualOptions } from '../../types/selectionTypes';
import { downloadMapJSON, getMapOddrString, getMinMaxXY, getOddrFromOddrString, getTextWidth, hexmapCacheToJSONArray } from '../../utils/misc/misc';
import { getOffsets, oddrToPixel, pixelToOddr } from '../../utils/hex/genericHex';
import { getScaledGridAndTileSizes, getScaledGridSizesFromTile } from '../../utils/imgScaling/scaling';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import Tooltip from '../../components/tooltip/tooltip';
import { allocateCitizensAuto, changeAppealToAdjFromDistrict, purgeTileForDistrict } from '../../utils/civ/civFunctions';
import { TITLE_CHAR_ANIM_DELAY_MS, TITLE_CHAR_ANIM_TIME_MS, TITLE_TEXT } from '../../utils/constants';
import Marquee from '../../components/marquee/marquee';
import HoldDownButton from '../../components/holdDownButton/holdDownButton';
import SaveDropdown from '../../components/saveDropdown/saveDropdown';
import { backend_addMap, backend_checkLoggedIn, backend_getAllMaps, backend_getMap, backend_logout, backend_refreshToken, backend_updateMap } from '../../REST/user';
import { useIdleTimer } from '../../hooks/idleDetector';
import { drawBorderLines, drawHexImage, drawResourceOnTile, drawRiversFromCache, drawTextWithBox, drawYieldsOnTile, getHexMapOffset, getImageAttributes, wrapCol, wrapRow } from '../../utils/drawing/hexmap';
import { formatSelectionYields, getCityOptions, getCivilizationOptions, getDistrictOptions, getNearbyCityOptions, getNearbyCityTextMaxWidth, getOptionalVisualMaxWidth, getOptionalVisualOptions, getSelectionYields, getVictoryTypeOptions } from './dropdownOptions';
import { useMessage } from '../../hooks/useMessage';
import { useThrottledCallback } from '../../hooks/throttledCallback';

// assuming all resources are revealed

/*
/////////////////////////////////////////////////////////////////

TODO: Change session storage to http cookies????

TODO: Add images to dropdown.

TODO: Remove number of re-renders! Remove unnecessary useCallbacks. Remove unnecessary dependencies or refactor them. Turn stuff into components.

TODO: Add documentation to functions. Read random comments to see if any extra issues need fixing.

TODO: Make page nice for mobile.

/////////////////////////////////////////////////////////////////
*/

const MapPage = () => 
{
    const 
    {
        message: saveMessage,
        showError: showSaveError,
        showSuccess: showSaveSuccess,
    } = useMessage();

    const 
    {
        message: districtMessage,
        showError: showDistrictError,
        showSuccess: showDistrictSuccess,
    } = useMessage();

    const 
    {
        message: miscMessage,
        showError: showMiscError,
    } = useMessage();

    const nav = useNavigate();

    const idleUser = useIdleTimer(60 * 60 * 1000); // 60 minutes max idle

    const [zoomFactor, setZoomFactor] = useState<number>(1);

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoadingUserMaps, setIsLoadingUserMaps] = useState<boolean>(false);
    const [isSavingUserMaps, setIsSavingUserMaps] = useState<boolean>(false);

    // use ref since this will probably be updated a lot
    const hexmapCache = useRef<Map<string, TileType>>(new Map()); // oddr coords, tile
    const [mapCacheVersion, setMapCacheVersion] = useState<number>(0);
    const [mapJSON, setMapJSON] = useState<TileType[]>([]);

    const yieldAttributeCache = useRef<Map<string, {imgElement: HTMLImageElement | undefined, scaleType: HexType}[]>>(new Map()); // oddr str, attr
    const [yieldAttributeCacheVersion, setYieldAttributeCacheVersion] = useState<number>(0);

    const [civCompletedWonders, setCivCompletedWonders] = useState<Set<TileWonders>>(new Set());

    const [minAndMaxCoords, setMinAndMaxCoords] = useState(getMinMaxXY(mapJSON));

    const [winSize, setWinSize] = useState<{width: number, height: number}>({width: window.innerWidth, height: window.innerHeight});

    const [visualZoomInput, setVisualZoomInput] = useState<number>(100);

    const [originalGridSize, setOriginalGridSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(BASE_TILE_SIZE, minAndMaxCoords, winSize).tileX, y: getScaledGridAndTileSizes(BASE_TILE_SIZE, minAndMaxCoords, winSize).tileY}); 
    const [gridSize, setGridSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(BASE_TILE_SIZE, minAndMaxCoords, winSize).gridX, y: getScaledGridAndTileSizes(BASE_TILE_SIZE, minAndMaxCoords, winSize).gridY});

    const BASE_W = originalGridSize.x;
    const BASE_H = originalGridSize.y;
    
    const [originalTileSize, setOriginalTileSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(BASE_TILE_SIZE, minAndMaxCoords, winSize).tileX, y: getScaledGridAndTileSizes(BASE_TILE_SIZE, minAndMaxCoords, winSize).tileY});
    const [tileSize, setTileSize] = useState<{x: number, y: number}>({x: getScaledGridAndTileSizes(BASE_TILE_SIZE, minAndMaxCoords, winSize).tileX, y: getScaledGridAndTileSizes(BASE_TILE_SIZE, minAndMaxCoords, winSize).tileY});

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

    const [saveList, setSaveList] = useState<SaveType[]>
    ([
        {name: null, json: null, id: 0, textInputDisplay: 'block', textNameDisplay: 'none', inputText: ''},
        {name: null, json: null, id: 1, textInputDisplay: 'block', textNameDisplay: 'none', inputText: ''},
        {name: null, json: null, id: 2, textInputDisplay: 'block', textNameDisplay: 'none', inputText: ''},
        {name: null, json: null, id: 3, textInputDisplay: 'block', textNameDisplay: 'none', inputText: ''},
        {name: null, json: null, id: 4, textInputDisplay: 'block', textNameDisplay: 'none', inputText: ''},
    ]);

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

    function updateRiverCacheWithTile(tile: TileType, riverArray: TileType[])
    {
        if (riverTiles.length <= 0 && (tile.IsNEOfRiver || tile.IsNWOfRiver || tile.IsWOfRiver))
                riverArray.push(tile);
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
            const parsedStr = getOddrFromOddrString(oddr);

            if (parsedStr.col === -1 || parsedStr.row === -1)
                return;

            const col = parsedStr.col;
            const row = parsedStr.row;
            const px = oddrToPixel(col, row, tileSize.x, tileSize.y, getHexMapOffset(tileSize));

            if (oddrCoord.col === col && oddrCoord.row === row)
            {  
                theOpacity = opacity;

                if (tile.IsCity)
                {
                    textBoxPos = {x: px.x, y: px.y};
                    textBoxText = tile.CityName;
                }
            }
            else if (tile.IsCity && tile.CityName === dropdownCity)
            {
                theOpacity = 0.25;
            }
            else
            {
                theOpacity = 1;
            }

            const theImage = getImageAttributes(tile, naturalWondersImagesCache.current, wondersImagesCache.current, districtsImagesCache.current, terrainImagesCache.current).imgElement;
            if (theImage)
                drawHexImage(context, tile, theOpacity, theImage, naturalWondersImagesCache.current, wondersImagesCache.current, districtsImagesCache.current, terrainImagesCache.current, tileSize, gridSize);

            const yieldAttr = yieldAttributeCache.current.get(getMapOddrString(tile.X, tile.Y));
            if (optionalVisual.yields && yieldAttr)
                drawYieldsOnTile(context, tile, yieldAttr, tileSize, gridSize);
            else if (optionalVisual.resources)
                drawResourceOnTile(context, tile, tileSize, gridSize, resourceImagesCache.current);

            if (riverTiles.length <= 0)
                updateRiverCacheWithTile(tile, riverArray);
        });

        if (riverTiles.length <= 0)
            drawRiversFromCache(context, tileSize, gridSize, riverArray, hexmapCache.current);
        else
            drawRiversFromCache(context, tileSize, gridSize, riverTiles, hexmapCache.current);

        drawBorderLines(context, cityBoundaryTiles, tileSize, gridSize, minAndMaxCoords);

        drawTextWithBox(context, {x: textBoxPos.x, y: textBoxPos.y}, textBoxText, tileSize, gridSize);

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
    }, [tileSize, gridSize, cityBoundaryTiles, dropdownCity, optionalVisual, riverTiles, yieldAttributeCacheVersion]); // to ensure latest values are used

    function getMousePos(e: MouseEvent): {x: number, y: number} | undefined
    {
        const canvas = theCanvas.current;

        if (!canvas) 
            return undefined;

        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height; 

        const x = (e.clientX - rect.left) * scaleX;
        const yCanvasTopDown = (e.clientY - rect.top) * scaleY; // normal y
        const y = canvas.height - yCanvasTopDown; // account for map being flipped

        return { x, y };
    }

    // 33 = 0.033s; 1/0.033 = 30 fps
    const moveDelayMS = 33;

    const handleMouseMove = useThrottledCallback((e: MouseEvent) => 
    {
        const mousePos = getMousePos(e);

        if (mousePos)
        {
            const oddrCoord = pixelToOddr(mousePos, tileSize, getHexMapOffset(tileSize)); 
            const key = getMapOddrString(oddrCoord.col, oddrCoord.row);

            handleMouseHover(key, oddrCoord);
        }

    }, moveDelayMS) 

    const handleMouseClick = useCallback((e: MouseEvent) => 
    {
        const { minX, maxX, minY, maxY } = minAndMaxCoords;
        const mousePos = getMousePos(e);

        if (mousePos && scrollRef.current)
        {
            const { clientX, clientY } = e;

            const divRect = scrollRef.current.getBoundingClientRect(); // size will always be the same regardless of scroll
            const inDivBounds = clientX >= divRect.left && clientX <= divRect.right && clientY >= divRect.top && clientY <= divRect.bottom;

            const oddrCoord = pixelToOddr(mousePos, tileSize, getHexMapOffset(tileSize));
            const outOfHexBounds = oddrCoord.col < minX || oddrCoord.col > maxX || oddrCoord.row < minY || oddrCoord.row > maxY;

            // dont reset the clicked city stuff if click is out of bounds - only want to reset when click on the visible hexmap
            if (!inDivBounds || outOfHexBounds)
                return;

            const clickedTile = hexmapCache.current.get(getMapOddrString(oddrCoord.col, oddrCoord.row));

            if (clickedTile && clickedTile.IsCity)
            {
                if (!currentCity || (currentCity && currentCity.CityName !== clickedTile.CityName))
                {
                    setCurrentCity(clickedTile);

                    let tempMap = new Map<string, string[]>();

                    const cityTiles = cityOwnedTiles.get(`${clickedTile.Civilization},${clickedTile.CityName}`);

                    if (cityTiles)
                    {
                        cityTiles.forEach(tile => 
                        {
                            const [col, row] = [tile.X, tile.Y];

                            let neighborList: string[] = [];
                            if (tile.TileCity === clickedTile.CityName)
                            {
                                const offsets = getOffsets(row);
                                offsets.forEach((neighbor) => 
                                {
                                    let neighborCoord = {x: wrapCol(col + neighbor[0], minAndMaxCoords), y: wrapRow(row + neighbor[1], minAndMaxCoords)};
                                    const neighborStringCoord = getMapOddrString(neighborCoord.x, neighborCoord.y);
                                    let cacheTile = hexmapCache.current.get(neighborStringCoord);

                                    // if tile is not part of city's owned tiles, that means the connecting edge to the current tile's edge must be a 'border edge'
                                    if (cacheTile && cacheTile.TileCity !== clickedTile.CityName)
                                        neighborList.push(neighborStringCoord);
                                });
                            }

                            if (neighborList.length > 0)
                                tempMap.set(getMapOddrString(tile.X, tile.Y), neighborList);
                        });
                    }

                    setCityBoundaryTiles(tempMap);
                }
                else if (currentCity && currentCity.CityName === clickedTile.CityName)
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
    }, [tileSize, gridSize, currentCity, cityOwnedTiles]);

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
        
    }, [saveList, isLoggedIn])

    async function setupUser()
    {
        const response = await backend_checkLoggedIn();

        try
        {
            if (response.status === 201)
            {
                setIsLoggedIn(true);
                setIsLoadingUserMaps(true);

                const allMaps = await backend_getAllMaps(response.output);

                if (allMaps.status !== 200 && allMaps.status !== 404) // user may not have saved any maps yet
                {
                    showSaveError(`Error loading maps from database (${allMaps.status})!`);

                    return;
                }

                const maps: DatabaseMapType[] = allMaps.output;

                const newSaveList: SaveType[] = [];

                saveList.forEach((save, index) => 
                {
                    if (index < maps.length)
                    {
                        const mapData = maps[index];

                        save.id = mapData.id;
                        save.name = mapData.mapName;
                        save.inputText = '';
                        save.json = mapData.map;
                        save.textInputDisplay = 'none';
                        save.textNameDisplay = 'block';
                    }

                    newSaveList.push(save);
                });

                setSaveList(newSaveList);
            }
        }
        finally
        {
            setIsLoadingUserMaps(false);
        }
    }

    useEffect(() => 
    {
        const handleResize = () => 
        {
            setWinSize({ width: window.innerWidth, height: window.innerHeight })
        };
        window.addEventListener('resize', handleResize);

        loadAllImages();

        setupUser();

        if (mapJSON)
            setDropdownValues(mapJSON);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => 
    {
        const intervalMinutes = 50;
        const intervalID = setInterval(async () => 
        {
            if (!idleUser) // not idle - refresh so they stay logged in
            {
                const response = await backend_refreshToken();

                if (response.status !== 201)
                {
                    showMiscError(`Something went wrong (${response.status}).`);
                }
            }
            else // otherwise, logout
            {
                await handleLogout();
            }
        }, intervalMinutes * 60 * 1000)

        return () => clearInterval(intervalID);
    }, [idleUser])

    useEffect(() => 
    {
        const sizes = getScaledGridAndTileSizes(BASE_TILE_SIZE, minAndMaxCoords, winSize); 
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

            const theImage = getImageAttributes(tile, naturalWondersImagesCache.current, wondersImagesCache.current, districtsImagesCache.current, terrainImagesCache.current).imgElement;
            if (theImage)
                drawHexImage(context, tile, theOpacity, theImage, naturalWondersImagesCache.current, wondersImagesCache.current, districtsImagesCache.current, terrainImagesCache.current, tileSize, gridSize);

            const yieldAttr = yieldAttributeCache.current.get(getMapOddrString(tile.X, tile.Y));
            if (optionalVisual.yields && yieldAttr)
                drawYieldsOnTile(context, tile, yieldAttr, tileSize, gridSize);
            else if (optionalVisual.resources)
                drawResourceOnTile(context, tile, tileSize, gridSize, resourceImagesCache.current);

            if (riverTiles.length <= 0)
                updateRiverCacheWithTile(tile, riverArray);
        });

        if (riverTiles.length <= 0)
            drawRiversFromCache(context, tileSize, gridSize, riverArray, hexmapCache.current);
        else
            drawRiversFromCache(context, tileSize, gridSize, riverTiles, hexmapCache.current);

        drawBorderLines(context, cityBoundaryTiles, tileSize, gridSize, minAndMaxCoords);

        if (riverTiles.length <= 0)
            setRiverTiles(riverArray);
    }, [tileSize, gridSize, cityBoundaryTiles, dropdownCity, areImagesLoaded, mapJSON, mapCacheVersion, optionalVisual, riverTiles, yieldAttributeCacheVersion]);

    const initHexmapCache = useCallback((theMapJSON: TileType[]) => 
    {
        const hexmapCacheTemp = new Map<string, TileType>();
        const mountainCache = new Map<string, TileType>();
        const otherCache = new Map<string, TileType>();
        const cityTiles = new Map<string, TileType[]>();
        const cityCenterMap = new Map<string, TileType>();
        const civCompletedWondersTemp = new Set<TileWonders>();
        const yieldMap = new Map<string, {imgElement: HTMLImageElement | undefined, scaleType: HexType}[]>();

        let loadCount = 0;
        let totalTiles = theMapJSON.length;

        const context = theCanvas.current?.getContext('2d');
        if (!context) return;

        theMapJSON.forEach(shallowTile => 
        {
            const tile = structuredClone(shallowTile); // deep copy

            const imgAttributes = getImageAttributes(tile, naturalWondersImagesCache.current, wondersImagesCache.current, districtsImagesCache.current, terrainImagesCache.current); 
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
                    const cityTilesKey = `${tile.Civilization},${tile.TileCity}`; // only tiles with this exact data will be added to tileDatas
                    const tileDatas = cityTiles.get(cityTilesKey);
                    if (tileDatas)
                    {
                        if (tile.IsCity) // store city for later so it can be placed last (below)
                            cityCenterMap.set(cityTilesKey, tile);
                        else
                            tileDatas.push(tile); // add tile to map, no need to worry about correct civ/city as the map takes care of that

                        cityTiles.set(cityTilesKey, tileDatas);
                    }
                    else
                    {
                        cityTiles.set(cityTilesKey, [tile]);
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

                const yieldAttributes = getYields(tile, yieldImagesCache.current);
                yieldMap.set(getMapOddrString(tile.X, tile.Y), yieldAttributes);
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

        yieldAttributeCache.current = yieldMap;
        setYieldAttributeCacheVersion(yieldAttributeCacheVersion + 1);
    }, [mapJSON]);

    useEffect(() => 
    {
        // wait until the necessary data is ready
        if (!areImagesLoaded || mapJSON.length === 0) return;

        if (hexmapCache.current.size === 0) 
        {
            initHexmapCache(mapJSON);
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
        if (theZoom < MIN_ZOOM)
        {
            theZoom = MIN_ZOOM;
        }
        else if (theZoom > MAX_ZOOM)
        {
            theZoom = MAX_ZOOM;
        }

        setVisualZoomInput(theZoom);
        const multiplier = Math.abs(theZoom) / 100.0;
        setZoomFactor(multiplier);

        // or else at high zoom levels, will render too many pixels and lag
        if (theZoom < 1)
        {
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
        }
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

    function handleImportButtonClick()
    {
        fileInputRef.current?.click();
    }

    function resetInitialValues(theJSON: TileType[])
    {
        setDropdownValues(theJSON);
        setMapJSON(theJSON);
        setMinAndMaxCoords(getMinMaxXY(theJSON));
        setCurrentCity(undefined);
        setCityBoundaryTiles(new Map());
        setVisualZoomInput(100);
        setZoomFactor(1);
        setVisualYieldDropdown([]);
        setCityOwnedTiles(new Map());
        setCivCompletedWonders(new Set());
        setDropdownVictoryType(null);
        setDropdownCity(null);
        setDropdownCiv(null);
        setDropdownDistrict(null);
        setDropdownNearbyCity(null);
        setRiverTiles([]);

        if (nearbyCityRef.current)
            nearbyCityRef.current.clearValue();

        if (optionalVisualRef.current)
            optionalVisualRef.current.clearValue();

        if (zoomInputRef.current)
            zoomInputRef.current.value = '100';
    }

    function handleImportChange(e: React.ChangeEvent<HTMLInputElement>)
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

    function updateTilesWithDistrict(foundTile: TileType, cityTiles: TileType[], civObject: Civilization)
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

            // means will not be worked anymore after district placement
            if (foundTile.IsWorked) 
                workerReassigned = true;

            purgeTileForDistrict(foundTile);
            changeAppealToAdjFromDistrict(foundTile, hexmapCache.current);

            // if holy site exists, means extra production was already added
            // removed production will be re added with updateCityTilesWithProduction
            if (civObject instanceof Norway)
                civObject.removeProductionFromWorkedTiles(newCityTiles);

            // only need to recalculate worked tiles if a worker was reassigned
            if (workerReassigned)
            {
                const theCity = newCityTiles[newCityTiles.length - 1];
                newCityTiles = allocateCitizensAuto(newCityTiles, theCity, {population: theCity.Population});
            }

            const oddr = getMapOddrString(foundTile.X, foundTile.Y);
            const foundTileCache = hexmapCache.current.get(oddr);
            if (foundTileCache)
                hexmapCache.current.set(oddr, foundTile);

            // update hexmap cache
            newCityTiles.forEach((tile) => 
            {
                const newOddr = getMapOddrString(tile.X, tile.Y);
                const foundTileNew = hexmapCache.current.get(newOddr);
                if (foundTileNew)
                    foundTileNew.IsWorked = true;
            })

            if (civObject instanceof Norway)
                civObject.updateCityTilesWithProduction(foundTile, newCityTiles, hexmapCache.current);

            // update city owned tiles
            const cityMap = new Map(cityOwnedTiles);
            const tileList = cityMap.get(dropdownCity);
            if (tileList)
                cityMap.set(dropdownCity, newCityTiles);

            // district placement removes all yields
            yieldAttributeCache.current.set(oddr, []);

            // update yield cache with new production from stave church
            if (civObject instanceof Norway)
            {
                newCityTiles.forEach((tile) => 
                {
                    const newOddr = getMapOddrString(tile.X, tile.Y);
                    yieldAttributeCache.current.set(newOddr, getYields(tile, yieldImagesCache.current));
                })
            }

            setCityOwnedTiles(cityMap);
            setMapCacheVersion(mapCacheVersion + 1);
            setYieldAttributeCacheVersion(yieldAttributeCacheVersion + 1);
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
            showDistrictError(theError);

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
                    {
                        updateTilesWithDistrict(foundTile, dropdownCityOwnedTiles, theCiv);

                        showDistrictSuccess('Success!');
                    }
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
                    showDistrictError(theError);
                }
            }
        }
    }, [cityOwnedTiles, dropdownDistrict, dropdownCity, dropdownCiv, dropdownYields, mapCacheVersion, includeWonders, civCompletedWonders, dropdownNearbyCity, dropdownVictoryType])
    
    async function handleSaveClick(currID: number) 
    {
        const newSaveList: SaveType[] = [];

        saveList.forEach(async (save: SaveType) => 
        {
            if (save.id === currID)
            {
                // check input error before toggling visibility
                if (save.inputText.trim().length === 0 && save.textInputDisplay === 'block') 
                {
                    showSaveError('Please enter a valid save name!');

                    newSaveList.push(save);
                }
                else if (!mapJSON || (mapJSON && mapJSON.length === 0))
                {
                    showSaveError('Must load a map first!');

                    newSaveList.push(save);
                }
                else
                {
                    const mapToSave = hexmapCacheToJSONArray(hexmapCache.current);

                    if (!save.name)
                    {
                        const newSave = { ...save, name: save.inputText, textInputDisplay: 'none', textNameDisplay: 'block', json: mapToSave };

                        const addMapDatabase = async () =>
                        {
                            setIsSavingUserMaps(true);

                            try
                            {
                                const checkMapExists = await backend_getMap(newSave.id);
                                if (checkMapExists.status === 200) // already exists - patch/update
                                {
                                    const patchMapResponse = await backend_updateMap(newSave.id, mapToSave, save.inputText);

                                    if (patchMapResponse.status === 204)
                                    {
                                        newSaveList.push(newSave);
                                    }
                                    else
                                    {
                                        showSaveError(`Something went wrong when updating the map. (${patchMapResponse.status})`);
                                    }
                                }
                                else if (checkMapExists.status === 404) // does not exist - add new map
                                {
                                    const user = await backend_checkLoggedIn();
                                    
                                    if (user.status === 201)
                                    {
                                        const newMapResponse = await backend_addMap(mapToSave, user.output, save.inputText);

                                        if (newMapResponse.status === 201)
                                        {
                                            newSaveList.push(newSave);
                                        }
                                        else
                                        {
                                            showSaveError(`Something went wrong when adding a new map. (${newMapResponse.status})`);
                                        }
                                    }
                                    else
                                    {
                                        showSaveError(`Something went wrong when trying to verify the user. (${user.status})`);
                                    }
                                }
                                else
                                {
                                    showSaveError(`Something went wrong when checking if the map exists. (${checkMapExists.status})`);

                                    // error, don't do anything
                                    newSaveList.push(save);
                                }
                            }
                            finally
                            {
                                setIsSavingUserMaps(false);
                            }
                        }

                        await addMapDatabase();
                    }
                    else
                    {
                        newSaveList.push({ ...save, textInputDisplay: 'block', textNameDisplay: 'none', name: null });
                    }
                }

                showSaveSuccess('Success!');
            }
            else
            {
                newSaveList.push(save);
            }
        });

        setSaveList(newSaveList);
    }

    function handleSaveInput(inputVal: string, currID: number)
    {
        const newSaveList: SaveType[] = [];

        saveList.forEach((save: SaveType) => 
        {
            if (save.id === currID)
                newSaveList.push({...save, inputText: inputVal});
            else
                newSaveList.push(save);
        });

        setSaveList(newSaveList);
    }

    function handleLoadClick(currID: number)
    {
        for (let i = 0; i < saveList.length; i++)
        {
            const currSave = saveList[i];
            if (currSave.id === currID)
            {
                const savedMap = currSave.json;

                if (hexmapCache && savedMap)
                {
                    hexmapCache.current = new Map();

                    const json = JSON.parse(JSON.stringify(savedMap));
                    resetInitialValues(json);
                }

                break;
            }
        }
    }

    function handleExportButton()
    {
        if (hexmapCache.current.size > 0)
        {
            downloadMapJSON(hexmapCacheToJSONArray(hexmapCache.current), 'exportedMapJSON.json')
        }
        else
        {
            showSaveError('Must load/import a json first!');
        }
    }

    async function handleLogout()
    {
        const response = await backend_logout();

        if (response.status === 204)
        {
            nav('/');
        }
        else
        {
            showMiscError(`Something went wrong (${response.status}).`);
        }
    }

    function handleReset()
    {
        if (mapJSON && mapJSON.length > 0)
        {
            const newMapJSON = structuredClone(mapJSON);
            resetInitialValues(newMapJSON);
            initHexmapCache(newMapJSON);
        }
        else
        {
            showMiscError('No map loaded that can be reset!');
        }
    }

    return (
        <div className={styles.topSectionDiv}>

            <Marquee 
                text={TITLE_TEXT} 
                animTimeMS={TITLE_CHAR_ANIM_TIME_MS} 
                animTimeDelayMS={TITLE_CHAR_ANIM_DELAY_MS} 
                textDefaultColor='black' 
                textMovingColor={[0, 256]}
                topDivClassName={common.title}
            />

            <div style={{display: 'flex'}}>

                {
                    miscMessage && 
                    (
                        <span className={miscMessage.type === 'error' ? common.errorText : common.successText}>
                            {miscMessage.text}
                        </span>
                    )
                }

                <div style={{marginBottom: '5px', marginRight: '10px', display: 'flex', marginLeft: 'auto'}}>
                    <button className={common.smallButton} style={{marginRight: '5px'}} onClick={handleReset}>RESET</button>
                    <button className={common.smallButton} style={{marginRight: '5px', display: isLoggedIn ? 'none' : 'block'}} onClick={e => nav('/login')}>LOGIN</button>
                    <button className={common.smallButton} style={{marginRight: '5px', display: isLoggedIn ? 'block' : 'none'}} onClick={handleLogout}>LOGOUT</button> 
                    <button className={common.smallButton} onClick={e => {nav('/')}}>RETURN</button>
                </div>
            </div>

            <div style={{display: 'flex'}}>
                <div className={styles.outerDiv}>
                    <div className={styles.loadingSection}>
                        <div style={{display: 'flex'}}>
                            <button onClick={e => handleExportButton()} className={common.smallButton}>EXPORT</button>

                            <Tooltip text={'Download to file.'}>
                                <FontAwesomeIcon icon={faCircleQuestion} className={styles.questionMark} style={{marginRight: '5px'}}/>
                            </Tooltip>

                            <button onClick={handleImportButtonClick} className={common.smallButton}>IMPORT</button>
                            <input style={{display: 'none'}} type='file' ref={fileInputRef} onChange={e => handleImportChange(e)} accept='.json'/>

                        </div>
                        <SaveDropdown 
                            saveList={saveList} 
                            isLoading={isLoadingUserMaps}
                            isSaving={isSavingUserMaps}
                            containerDisplayType='block' 
                            handleSaveClick={handleSaveClick} 
                            handleSaveInput={handleSaveInput}
                            handleLoadClick={handleLoadClick}
                            maxSaveTextWidth={100}
                            dropdownButtonClassName={common.wideButton}
                            inputClassName={styles.saveDropdownInput}
                            saveEntryClassName={styles.saveDropdownEntry}
                            saveButtonClassName={styles.savesSaveButton}
                            loadButtonClassName={styles.savesLoadButton}
                            saveTextClassName={styles.saveText}
                            topmostDivStyle={{display: isLoggedIn ? 'block' : 'none'}}
                        />
                    </div>

                    {
                        saveMessage && 
                        (
                            <span className={saveMessage.type === 'error' ? common.errorText : common.successText}>
                                {saveMessage.text}
                            </span>
                        )
                    }
                </div>

                <div
                    ref={scrollRef}
                    style={{
                        overflow: 'auto',
                        border: '1px solid black',
                        minWidth: '50px',
                        maxWidth: gridSize.x > 0 ? gridSize.x / 1.5 : 'auto'
                    }}
                >
                    <canvas
                        ref={theCanvas}
                        width={gridSize.x}
                        height={gridSize.y}
                        style=
                        {
                            { 
                                display: 'block',
                                ...(zoomFactor < 1 ?
                                    {
                                        width: `${BASE_W * zoomFactor}px`,
                                        height: `${BASE_H * zoomFactor}px` 
                                    }
                                    :
                                    {
                                        transform: `scale(${zoomFactor})`,
                                        transformOrigin: "top left"
                                    }
                                )
                            }
                        }
                    />
                </div>

                <div className={styles.outerDiv}>
                    
                    <div className={styles.checkboxes}>
                        <div style={{display: 'flex'}}>
                            <span style={{fontWeight: '600'}}>Include City States</span>
                            <input type='checkbox' onChange={(e) => {setIncludeCityStates(e.target.checked)}}/>
                        </div>

                        <div style={{display: 'flex'}}>
                            <span style={{fontWeight: '600'}}>Account For Wonders</span>
                            <input type='checkbox' onChange={(e) => {setIncludeWonders(e.target.checked)}}/>
                            <Tooltip text='Consider wonders that may be built in the future.'>
                                <FontAwesomeIcon icon={faCircleQuestion} className={styles.questionMark}/>
                            </Tooltip>
                        </div>
                    </div>
                    
                    <div className={styles.districtSelectors}>
                        {/*Select Civilization*/}
                        <div style={{display: 'flex'}}>
                            <span className={styles.mandatory}>*</span>

                            <Select 
                                inputId='civilization-dropdown'
                                instanceId='civilization-dropdown'
                                value={dropdownCiv ? {label: dropdownCiv, value: dropdownCiv} : null}
                                options={getCivilizationOptions(uniqueCivilizations, includeCityStates)} 
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
                                <FontAwesomeIcon icon={faCircleQuestion} className={styles.questionMark}/>
                            </Tooltip>

                        </div>
                    
                        <div style={{display: 'flex'}}>
                            {/*Select City*/}
                            <span className={styles.mandatory}>*</span>
                            
                            <Select 
                                inputId='city-dropdown'
                                instanceId='city-dropdown'
                                value={dropdownCity ? {label: dropdownCity, value: dropdownCity} : null}
                                options={getCityOptions(uniqueCities, dropdownCiv)} 
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
                                <FontAwesomeIcon icon={faCircleQuestion} className={styles.questionMark}/>
                            </Tooltip>
                        </div>

                        <div style={{display: 'flex'}}>
                            {/* District Type Selection */}
                            <span className={styles.mandatory}>*</span>
                            <Select
                                inputId='district-dropdown'
                                instanceId='district-dropdown'
                                value={dropdownDistrict ? {label: dropdownDistrict, value: dropdownDistrict} : null}
                                options={getDistrictOptions()}
                                placeholder='Select a district'
                                styles={genericSingleSelectStyle}
                                onChange={val => {if (val && val.value) setDropdownDistrict(val.value); else setDropdownDistrict(null);}}
                            />

                            <Tooltip text='Select a district. Assumes all buildings will be built.'>
                                <FontAwesomeIcon icon={faCircleQuestion} className={styles.questionMark}/>
                            </Tooltip>
                        </div>

                        <div style={{display: 'flex'}}>
                            <span className={styles.mandatory}>*</span>
                            {/* Nearby City Selection */}
                            <Select 
                                inputId='nearbyCity-dropdown'
                                instanceId='nearbyCity-dropdown'
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
                                options=
                                {(() => 
                                    {
                                        const nearbyOptions = getNearbyCityOptions(uniqueCities, dropdownCity);

                                        if (nearbyOptions.length === 0)
                                            return undefined;
                                        else
                                            return nearbyOptions;
                                    }
                                )()} 
                                styles=
                                {(() => 
                                    {
                                        const nearbyOptions = getNearbyCityOptions(uniqueCities, dropdownCity);

                                        if (nearbyOptions.length === 0)
                                        {
                                            const width = getTextWidth('Select a nearby city', `${nearbyCityFontSize}px arial`);

                                            if (width)
                                                return nearbyCityStyles(width * 1.25);
                                        }
                                        else
                                            return nearbyCityStyles(getNearbyCityTextMaxWidth(nearbyOptions) * 1.25);
                                    }
                                )()}
                                placeholder='Select a nearby city'
                                ref={nearbyCityRef}
                            />

                            <Tooltip text='A city you see as a threat.'>
                                <FontAwesomeIcon icon={faCircleQuestion} className={styles.questionMark}/>
                            </Tooltip>

                        </div>

                        <div style={{display: 'flex'}}>
                            {/* Yields Selection */}
                            <Select 
                                inputId='yields-dropdown'
                                instanceId='yields-dropdown'
                                value={visualYieldDropdown}
                                options={getSelectionYields(areImagesLoaded, dropdownYieldImagesCache.current)} 
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
                                <FontAwesomeIcon icon={faCircleQuestion} className={styles.questionMark}/>
                            </Tooltip>
                        </div>

                        <div style={{display: 'flex'}}>
                            {/* Victory Type Selection */}
                            <Select
                                inputId='victoryType-dropdown'
                                instanceId='victoryType-dropdown'
                                value={dropdownVictoryType ? {label: dropdownVictoryType, value: dropdownVictoryType} : null}
                                options={getVictoryTypeOptions()}
                                placeholder='Select a victory type'
                                styles={genericSingleSelectStyle}
                                onChange={val => {if (val && val.value) setDropdownVictoryType(val.value); else setDropdownVictoryType(null)}}
                                isClearable
                            />

                            <Tooltip text={'The victory type you\'re aiming for.'}>
                                <FontAwesomeIcon icon={faCircleQuestion} className={styles.questionMark}/>
                            </Tooltip>
                        </div>

                        <HoldDownButton text='ADD' finishHoldDown={handleAddButton} className={common.wideButton}></HoldDownButton>
                    </div>

                    <div className={styles.miscOptions}>
                        <div style={{display: 'flex'}}>
                            <Select 
                                inputId='optionalVisuals-dropdown'
                                instanceId='optionalVisuals-dropdown'
                                options={getOptionalVisualOptions()} 
                                styles={optionalVisualStyle(getOptionalVisualMaxWidth() * 1.75)} 
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
                            <span style={{paddingRight: '5px', fontWeight: '600'}}>Zoom Level:</span>
                            <input 
                                onKeyDown={e => handleZoomKeyDown(e)} 
                                onClick={e => handleZoomClick(e)} 
                                ref={zoomInputRef} 
                                type='number' 
                                min={MIN_ZOOM} 
                                max={MAX_ZOOM} 
                                value={visualZoomInput} 
                                onChange={e => setVisualZoomInput(Number(e.target.value))} 
                                onBlur={e => handleZoomChange(Number(e.target.value))}
                            />

                            <Tooltip text={`${MIN_ZOOM} - ${MAX_ZOOM}%`}>
                                <FontAwesomeIcon icon={faCircleQuestion} className={styles.questionMark}/>
                            </Tooltip>
                        </div>

                        {
                            districtMessage && 
                            (
                                <span className={districtMessage.type === 'error' ? common.errorText : common.successText}>
                                    {districtMessage.text}
                                </span>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPage;