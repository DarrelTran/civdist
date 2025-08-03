export enum HexType
{
    TERRAIN,
    DISTRICT
}

export enum RiverDirections
{
  NORTHEAST, 
  EAST, 
  SOUTHEAST, 
  SOUTHWEST, 
  WEST, 
  NORTHWEST
}

// FOR terrain images
/** Format is: "TileTerrain_[TileFeatures | TileNone]" EXCLUDING the brackets */
export type TerrainFeatureKey = `${TileTerrain}_${TileFeatures | TileNone}`;

export enum TileNone {NONE = "NONE"}
/*********************** CIV TILE NAMES ***********************/

/** */
export enum TileNaturalWonders
{
  CLIFFS_OF_DOVER = 'Cliffs of Dover',
  CRATER_LAKE = 'CRATER_LAKE',
  DEAD_SEA = 'Dead Sea',
  GALAPAGOS_ISLANDS = 'Galápagos Islands',
  GREAT_BARRIER_REEF = 'Great Barrier Reef',
  MOUNT_EVEREST = 'Mount Everest',
  MOUNT_LILIMANJARO = 'Mount Kilimanjaro',
  PANTANAL = 'Pantanal',
  PIOPIOTAHI = 'Piopiotahi',
  TORRES_DEL_PAINE = 'Torres del Paine',
  TSINGY_DE_BEMARAHA = 'Tsingy de Bemaraha',
  YOSEMITE = 'Yosemite'
}

export enum TileWonders
{
  ALHAMBRA = 'Alhambra',
  BIG_BEN = 'Big Ben',
  BOLSHOI_THEATRE = 'Bolshoi Theatre',
  BROADWAY = 'Broadway',
  CHICHEN_ITZA = 'Chichen Itza',
  COLOSSEUM = 'Colosseum',
  COLOSSUS = 'Colossus',
  CRISTO_REDENTOR = 'Cristo Redentor',
  EIFFEL_TOWER = 'Eiffel Tower',
  ESTADIO_DO_MARACANA = 'Estádio do Maracanã',
  FORBIDDEN_CITY = 'Forbidden City',
  GREAT_LIBRARY = 'Great Library',
  GREAT_ZIMBABWE = 'Great Zimbabwe',
  GREAT_LIGHTHOUSE = 'Great Lighthouse',
  HAGIA_SOPHIA = 'Hagia Sophia',
  HANGING_GARDENS = 'Hanging Gardens',
  HERMITAGE = 'Hermitage',
  HUEY_TEOCALLI = 'Huey Teocalli',
  MAHABODHI_TEMPLE = 'Mahabodhi Temple',
  MONT_ST_MICHEL = 'Mont St. Michel',
  ORACLE = 'Oracle',
  OXFORD_UNIVERSITY = 'Oxford University',
  PETRA = 'Petra',
  POTALA_PALACE = 'Potala Palace',
  PYRAMIDS = 'Pyramids',
  RUHR_VALLEY = 'Ruhr Valley',
  STONEHENGE = 'Stonehenge',
  SYDNEY_OPERA_HOUSE = 'Sydney Opera House', 
  TERRACOTTA_ARMY = 'Terracotta Army',
  VENETIAN_ARSENAL = 'Venetian Arsenal'
}

export enum TileDistricts
{
  AERODROME_DISTRICT = 'Aerodrome',
  AQUEDUCT_DISTRICT = 'Aqueduct',
  SCIENCE_DISTRICT = 'Campus',
  CENTER_DISTRICT = 'City Center',
  COMMERCIAL_DISTRICT = 'Commercial Hub',
  ENCAMPMENT_DISTRICT = 'Encampment',
  ENTERTAINMENT_DISTRICT = 'Entertainment Complex',
  HARBOR_DISTRICT = 'Harbor',
  FAITH_DISTRICT = 'Holy Site',
  INDUSTRIAL_DISTRICT = 'Industrial Zone',
  NEIGHBORHOOD_DISTRICT = 'Neighborhood',
  ROCKET_DISTRICT = 'Spaceport',
  THEATER_DISTRICT = 'Theater Square'
}

export enum TileUniqueDistricts
{
  BATH_DISTRICT = 'Bath',
  STREET_CARNIVAL_DISTRICT = 'Street Carnival',
  LAVRA_DISTRICT = 'Lavra',
  ROYAL_NAVY_DOCKYARD_DISTRICT = 'Royal Navy Dockyard',
  HANSA_DISTRICT = 'Hansa',
  MBANZA_DISTRICT = 'Mbanza',
  ACROPOLIS_DISTRICT = 'Acropolis'
}

export enum TileBuildings
{
  AIRPORT = 'Airport',
  AMPHITHEATER = 'Amphitheater',
  ARENA = 'Arena',
  ARMORY = 'Armory',
  BANK = 'Bank',
  BARRACKS = 'Barracks',
  BROADCAST_CENTER = 'Broadcast Center',
  MEDIEVAL_WALLS = 'Medieval Walls',
  CATHEDRAL = 'Cathedral',
  DAR_E_MEHR = 'Dar-e Mehr',
  ELECTRONICS_FACTORY = 'Electronics Factory',
  FACTORY = 'Factory',
  FILM_STUDIO = 'Film Studio',
  GRANARY = 'Granary',
  GURDWARA = 'Gurdwara',
  HANGAR = 'Hangar',
  LIBRARY = 'Library',
  LIGHTHOUSE = 'Lighthouse',
  MADRASA = 'Madrasa',
  MARKET = 'Market',
  MEETING_HOUSE = 'Meeting House',
  MILITARY_ACADEMY = 'Military Academy',
  MONUMENT = 'Monument',
  MOSQUE = 'Mosque',
  MUSEUM_ART = 'Art Museum',
  ARCHAEOLOGICAL_MUSEUM = 'Archaeological Museum',
  PAGODA = 'Pagoda',
  PALACE = 'Palace',
  POWER_PLANT = 'Power Plant',
  RESEARCH_LAB = 'Research Lab',
  SEAPORT = 'Seaport',
  SEWER = 'Sewer',
  SHIPYARD = 'Shipyard',
  SHRINE = 'Shrine',
  STABLE = 'Stable',
  STADIUM = 'Stadium',
  RENAISSANCE_WALLS = 'Renaissance Walls',
  STAVE_CHURCH = 'Stave Church',
  STOCK_EXCHANGE = 'Stock Exchange',
  STUPA = 'Stupa',
  SYNAGOGUE = 'Synagogue',
  TEMPLE = 'Temple',
  UNIVERSITY = 'University',
  ANCIENT_WALLS = 'Ancient Walls',
  WAT = 'Wat',
  WATER_MILL = 'Water Mill',
  WORKSHOP = 'Workshop',
  ZOO = 'Zoo'
}

export enum TileTerrain
{
  OCEAN = 'Ocean',
  COAST = 'Coast and Lake',
  PLAINS = 'Plains',
  PLAINS_HILLS = 'Plains (Hills)',
  PLAINS_MOUNTAIN = 'Plains (Mountain)',
  GRASSLAND = 'Grassland',
  GRASSLAND_HILLS = 'Grassland (Hills)',
  GRASSLAND_MOUNTAIN = 'Grassland (Mountain)',
  DESERT = 'Desert',
  DESERT_HILLS = 'Desert (Hills)',
  DESERT_MOUNTAIN = 'Desert (Mountain)',
  TUNDRA = 'Tundra',
  TUNDRA_HILLS = 'Tundra (Hills)',
  TUNDRA_MOUNTAIN = 'Tundra (Mountain)',
  SNOW = 'Snow',
  SNOW_HILLS = 'Snow (Hills)',
  SNOW_MOUNTAIN = 'Snow (Mountain)',
  /** Use IsRiver */
  RIVER = 'River'
}

export enum TileFeatures
{
  RAINFOREST = 'Rainforest',
  WOODS = 'Woods',
  OASIS = 'Oasis',
  MARSH = 'Marsh',
  ICE = 'Ice',
  FLOODPLAINS = 'Floodplains'
}

export enum TileImprovements
{
  FARM = 'Farm',
  MINE = 'Mine',
  QUARRY = 'Quarry',
  FISHING_BOATS = 'Fishing Boats',
  PASTURE = 'Pasture',
  PLANTATION = 'Plantation',
  CAMP = 'Camp',
  LUMBER_MILL = 'Lumber Mill',
  OIL_WELL = 'Oil Well',
  OFFSHORE_OIL_RIG = 'Offshore Oil Rig',
  SEASIDE_RESORT = 'Seaside Resort',
  FORT = 'Fort',
  AIRSTRIP = 'Airstrip',
  CHATEAU = 'Château',
  COLOSSAL_HEAD = 'Colossal Head',
  GREAT_WALL = 'Great Wall',
  KURGAN = 'Kurgan',
  MISSION = 'Mission',
  ROMAN_FORT = 'Roman Fort',
  SPHINX = 'Sphinx',
  STEPWELL = 'Stepwell',
  ZIGGURAT = 'Ziggurat',
  MISSILE_SILO = 'Missile Silo'
}

export enum TileBonusResources
{
  BANANAS = 'Bananas',
  CATTLE = 'Cattle',
  COPPER = 'Copper',
  CRABS = 'Crabs',
  DEER = 'Deer',
  FISH = 'Fish',
  RICE = 'Rice',
  SHEEP = 'Sheep',
  STONE = 'Stone',
  WHEAT = 'Wheat'
}

export enum TileLuxuryResources
{
  CITRUS = 'Citrus',
  COCOA = 'Cocoa',
  COFFEE = 'Coffee',
  COTTON = 'Cotton',
  DIAMONDS = 'Diamonds',
  DYES = 'Dyes',
  FURS = 'Furs',
  GYPSUM = 'Gypsum',
  INCENSE = 'Incense',
  IVORY = 'Ivory',
  JADE = 'Jade',
  MARBLE = 'Marble',
  MERCURY = 'Mercury',
  PEARLS = 'Pearls',
  SALT = 'Salt',
  SILK = 'Silk',
  SILVER = 'Silver',
  SPICES = 'Spices',
  SUGAR = 'Sugar',
  TEA = 'Tea',
  TRUFFLES = 'Truffles',
  TOBACCO = 'Tobacco',
  WHALES = 'Whales',
  WINE = 'Wine',
  JEANS = 'Jeans',
  PERFUME = 'Perfume',
  COSMETICS = 'Cosmetics',
  TOYS = 'Toys',
  CINNAMON = 'Cinnamon',
  CLOVES = 'Cloves'
}

export enum TileStrategicResources
{
  ALUMINUM = 'Aluminum',
  COAL = 'Coal',
  HORSES = 'Horses',
  IRON = 'Iron',
  NITER = 'Niter',
  OIL = 'Oil',
  URANIUM = 'Uranium'
}

export enum TilePantheons
{
  DANCE_OF_THE_AURORA = 'Dance of the Aurora',
  DESERT_FOLKLORE = 'Desert Folklore',
  SACRED_PATH = 'Sacred Path',
  RIVER_GODDESS = 'River Goddess',
  MONUMENT_TO_THE_GODS = 'Monument to the Gods',
  DIVINE_SPARK = 'Divine Spark',
  LADY_OF_THE_REEDS_AND_MARSHES = 'Lady of the Reeds and Marshes',
  GOD_OF_THE_SEA = 'God of the Sea',
  GOD_OF_THE_OPEN_SKY = 'God of the Open Sky',
  GODDESS_OF_THE_HUNT = 'Goddess of the Hunt',
  STONE_CIRCLES = 'Stone Circles',
  RELIGIOUS_IDOLS = 'Religious Idols',
  GOD_OF_CRAFTSMEN = 'God of Craftsmen',
  GODDESS_OF_FESTIVALS = 'Goddess of Festivals',
  ORAL_TRADITION = 'Oral Tradition',
  GOD_OF_THE_FORGE = 'God of the Forge',
  GOD_OF_WAR = 'God of War',
  INITIATION_RITES = 'Initiation Rites',
  GOD_OF_HEALING = 'God of Healing',
  FERTILITY_RITES = 'Fertility Rites',
  RELIGIOUS_SETTLEMENTS = 'Religious Settlements',
  GODDESS_OF_THE_HARVEST = 'Goddess of the Harvest',
  CITY_PATRON_GODDESS = 'City Patron Goddess',
  EARTH_GODDESS = 'Earth Goddess'
}

export enum TileYields
{
  FOOD = 'Food', 
  PRODUCTION = 'Production', 
  GOLD = 'Gold', 
  SCIENCE = 'Science', 
  CULTURE = 'Culture', 
  FAITH = 'Faith'
}

export enum LeaderName
{
  TEDDY_ROOSEVELT = "Teddy Roosevelt",
  SALADIN = "Saladin",
  PEDRO_II = "Pedro II",
  QIN_SHI_HUANG = "Qin Shi Huang",
  CLEOPATRA = "Cleopatra",
  VICTORIA = "Victoria",
  CATHERINE_DE_MEDICI = "Catherine de Medici",
  FREDERICK_BARBAROSSA = "Frederick Barbarossa",
  PERICLES = "Pericles",
  GORGO = "Gorgo",
  GANDHI = "Gandhi",
  HOJO_TOKIMUNE = "Hojo Tokimune",
  MVEMBA_A_NZINGA = "Mvemba a Nzinga",
  PETER_THE_GREAT = "Peter",
  TOMYRIS = "Tomyris",
  GILGAMESH = "Gilgamesh",
  PHILIP_II = "Philip II",
  HARALD_HARDRADA = "Harald Hardrada",
  TRAJAN = "Trajan",
  MONTEZUMA_I = "Montezuma"
}

export type TileType =
{
  X: number,
  Y: number,
  TerrainType: TileTerrain | TileNone.NONE,
  /** CONTAINS NATURAL WONDERS */
  FeatureType: TileFeatures | TileNaturalWonders | TileNone.NONE,
  ResourceType: TileBonusResources | TileStrategicResources | TileLuxuryResources | TileNone.NONE,
  ImprovementType: TileImprovements | TileNone.NONE,
  IsHills: boolean,
  IsMountain: boolean,
  IsWater: boolean,
  IsLake: boolean,
  IsFlatlands: boolean,
  IsCity: boolean,
  IsWorked: boolean,
  TileCity: string,
  CityPantheon: TilePantheons | TileNone.NONE,
  FoundedReligion: string,
  IsRiver: boolean,
  IsNEOfRiver: boolean,
  IsWOfRiver: boolean,
  IsNWOfRiver: boolean,
  RiverSWFlow: string,
  RiverEFlow: string,
  RiverSEFlow: string,
  Appeal: number,
  Continent: string,
  Civilization: string,
  Leader: LeaderName,
  CityName: string,
  District: TileDistricts | TileUniqueDistricts | TileNone.NONE,
  Buildings: TileBuildings[],
  /** DOES NOT CONTAIN NATURAL WONDERS */
  Wonder: TileWonders | TileNone.NONE,
  Food: number, 
  Production: number, 
  Gold: number, 
  Science: number, 
  Culture: number, 
  Faith: number
}