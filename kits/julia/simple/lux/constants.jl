"""
    GameConstants(;DAY_LENGTH = 30, NIGHT_LENGTH = 10, MAX_DAYS = 360,
                   LIGHT_UPKEEP = (CITY = 23, WORKER = 4, CART = 10),
                   WOOD_GROWTH_RATE = 1.025, MAX_WOOD_AMOUNT = 500,
                   CITY_BUILD_COST = 100, CITY_ADJACENCY_BONUS = 5,
                   RESOURCE_CAPACITY = (WORKER = 100, CART = 2000),
                   WORKER_COLLECTION_RATE = (WOOD = 20, COAL = 5, URANIUM = 2),
                   RESOURCE_TO_FUEL_RATE = (WOOD = 1, COAL = 10, URANIUM = 40),
                   RESEARCH_REQUIREMENTS = (COAL = 50, URANIUM = 200),
                   CITY_ACTION_COOLDOWN = 10,
                   UNIT_ACTION_COOLDOWN = (WORKER = 2, CART = 3),
                   MAX_ROAD = 6, MIN_ROAD = 0,
                   CART_ROAD_DEVELOPMENT_RATE = 0.75,
                   PILLAGE_RATE = 0.5)

This will contain constants on all game parameters like the max turns, the light upkeep of CityTiles etc.
If there are any crucial changes to the starter kits, typically only this object will change.
"""
struct GameConstants
    DAY_LENGTH :: Int
    NIGHT_LENGTH :: Int
    MAX_DAYS :: Int
    LIGHT_UPKEEP :: NamedTuple{(:CITY, :WORKER, :CART), NTuple{3, Int}}
    WOOD_GROWTH_RATE :: Float64
    MAX_WOOD_AMOUNT :: Int
    CITY_BUILD_COST :: Int
    CITY_ADJACENCY_BONUS :: Int
    RESOURCE_CAPACITY :: NamedTuple{(:WORKER, :CART), NTuple{2, Int}}
    WORKER_COLLECTION_RATE :: NamedTuple{(:WOOD, :COAL, :URANIUM), NTuple{3, Int}}
    RESOURCE_TO_FUEL_RATE :: NamedTuple{(:WOOD, :COAL, :URANIUM), NTuple{3, Int}}
    RESEARCH_REQUIREMENTS :: NamedTuple{(:COAL, :URANIUM), NTuple{2, Int}}
    CITY_ACTION_COOLDOWN :: Int
    UNIT_ACTION_COOLDOWN :: NamedTuple{(:WORKER, :CART), NTuple{2, Int}}
    MAX_ROAD :: Int
    MIN_ROAD :: Int
    CART_ROAD_DEVELOPMENT_RATE :: Float64
    PILLAGE_RATE :: Float64
    function GameConstants(;DAY_LENGTH = 30,
                            NIGHT_LENGTH = 10,
                            MAX_DAYS = 360,
                            LIGHT_UPKEEP = (CITY = 23, WORKER = 4, CART = 10),
                            WOOD_GROWTH_RATE = 1.025,
                            MAX_WOOD_AMOUNT = 500,
                            CITY_BUILD_COST = 100,
                            CITY_ADJACENCY_BONUS = 5,
                            RESOURCE_CAPACITY = (WORKER = 100, CART = 2000),
                            WORKER_COLLECTION_RATE = (WOOD = 20, COAL = 5, URANIUM = 2),
                            RESOURCE_TO_FUEL_RATE = (WOOD = 1, COAL = 10, URANIUM = 40),
                            RESEARCH_REQUIREMENTS = (COAL = 50, URANIUM = 200),
                            CITY_ACTION_COOLDOWN = 10,
                            UNIT_ACTION_COOLDOWN = (WORKER = 2, CART = 3),
                            MAX_ROAD = 6,
                            MIN_ROAD = 0,
                            CART_ROAD_DEVELOPMENT_RATE = 0.75,
                            PILLAGE_RATE = 0.5)
        new(DAY_LENGTH, NIGHT_LENGTH, MAX_DAYS, LIGHT_UPKEEP, WOOD_GROWTH_RATE, MAX_WOOD_AMOUNT,
            CITY_BUILD_COST, CITY_ADJACENCY_BONUS, RESOURCE_CAPACITY, WORKER_COLLECTION_RATE,
            RESOURCE_TO_FUEL_RATE, RESEARCH_REQUIREMENTS, CITY_ACTION_COOLDOWN,
            UNIT_ACTION_COOLDOWN, MAX_ROAD, MIN_ROAD, CART_ROAD_DEVELOPMENT_RATE, PILLAGE_RATE)
    end
end

const GAME_CONSTANTS = GameConstants()
