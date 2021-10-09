"""
    GameConstants(jsonfile::AbstractString = joinpath(pkgdir(LuxAI), "src", "lux", "game_constants.json"))

This will contain constants on all game parameters like the max turns, the light upkeep of CityTiles etc.
If there are any crucial changes to the starter kits, typically only this object will change.
"""
struct GameConstants
    UNIT_TYPES :: NamedTuple{(:WORKER, :CART), NTuple{2, Int8}}
    RESOURCE_TYPES :: NamedTuple{(:WOOD, :COAL, :URANIUM), NTuple{3, String}}
    INPUTS :: NamedTuple{(:RESEARCH_POINTS, :RESOURCES, :UNITS, :CITY, :CITY_TILES, :ROADS, :DONE), NTuple{7, String}}
    DIRECTIONS :: NamedTuple{(:NORTH, :WEST, :EAST, :SOUTH, :CENTER), NTuple{5, String}}
    PARAMETERS :: NamedTuple{(:DAY_LENGTH, :NIGHT_LENGTH, :MAX_DAYS, :LIGHT_UPKEEP, :WOOD_GROWTH_RATE, :MAX_WOOD_AMOUNT, :CITY_BUILD_COST, :CITY_ADJACENCY_BONUS, :RESOURCE_CAPACITY, :WORKER_COLLECTION_RATE, :RESOURCE_TO_FUEL_RATE, :RESEARCH_REQUIREMENTS, :CITY_ACTION_COOLDOWN, :UNIT_ACTION_COOLDOWN, :MAX_ROAD, :MIN_ROAD, :CART_ROAD_DEVELOPMENT_RATE, :PILLAGE_RATE), Tuple{Int, Int, Int, NamedTuple{(:CITY, :WORKER, :CART), NTuple{3, Int}}, Float64, Float64, Int, Int, NamedTuple{(:WORKER, :CART), NTuple{2, Int}}, NamedTuple{(:WOOD, :COAL, :URANIUM), NTuple{3, Int}}, NamedTuple{(:WOOD, :COAL, :URANIUM), NTuple{3, Int}}, NamedTuple{(:COAL, :URANIUM), NTuple{2, Int}}, Int, NamedTuple{(:WORKER, :CART), NTuple{2, Int}}, Int, Int, Float64, Float64}}
end

StructType(::Type{GameConstants}) = Struct()
