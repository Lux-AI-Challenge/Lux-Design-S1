@enum Directions north south west east center
"""
    Position(x::Integer, y::Integer) :: Position

Position on the map. Starts with (0, 0) for the top left corner.
"""
struct Position
    x :: Int
    y :: Int
end
"""
    is_adjacent(obj::Position, pos::Position) :: Bool

Returns true if this Position is adjacent to pos. False otherwise.
"""
function is_adjacent(obj::Position, pos::Position)
    Δx = obj.x - pos.x
    Δy = obj.y - pos.y
    Δx^2 + Δy^2 ≤ 2 
end
"""
    equals(obj::Position, pos::Position) :: Bool

Returns true if this Position is equal to the other pos object by checking x, y coordinates. False otherwise.
"""
equals(obj::Position, pos::Position) :: Bool = obj.x == pos.x && obj.y == pos.y
"""
    translate(obj::Position, direction::Directions, units::Integer) :: Position

Returns the Position equal to going in a direction units number of times from this Position.
"""
function translate(obj::Position, direction::Directions, units::Integer)
    x = obj.x
    y = obj.y
    if direction == north
        x -= units
    elseif direction == south
        x += units
    elseif direction == west
        y -= units
    elseif direction == east
        y += units
    elseif direction == center
    end
    Position(x, y)
end
"""
    distance_to(obj::Position, pos::Position) :: Float64

Returns the Manhattan (rectilinear) distance from this Position to pos,
"""
distance_to(obj::Position, pos::Position) = abs(obj.x - pos.x) + abs(obj.y - pos.y)
"""
    direction_to(obj::Position, target_pos::Position) :: Directions

Returns the direction that would move you closest to target_pos from this Position if you took a single step. In particular, will return DIRECTIONS.CENTER if this Position is equal to the target_pos. Note that this does not check for potential collisions with other units but serves as a basic pathfinding method.
"""
function direction_to(obj::Position, target_pos::Position)
    Δx = obj.x - target_pos.x
    Δy = obj.y - target_pos.y
    if Δx == Δy == 0
        center
    elseif abs(Δx) ≥ abs(Δy)
        obj.x > target_pos.x ? west : east
    else
        obj.y < target_pos.y ? south : north
    end
end
"""
    CityTile(cityid::AbstractString, team::Integer, pos::Position, cooldown::Real) :: CityTile

"""
struct CityTile
    cityid :: String
    team :: Int
    pos :: Position
    cooldown :: Float64
end
"""
    research(obj::CityTile) :: String

Returns the research action.
"""
function research(obj::CityTile)
    x, y = obj.pos
    "r $x $y"
end
"""
    build_worker(obj::CityTile) :: String

Returns the build worker action. When applied and requirements are met, a worker will be built at the City.
"""
function build_worker(obj::CityTile)
    x, y = obj.pos
    "bw $x $y"
end
"""
    build_cart(obj::CityTile) :: String

Returns the build cart action. When applied and requirements are met, a cart will be built at the City.
"""
function build_cart(obj::CityTile)
    x, y = obj.pos
    "bc $x $y"
end
"""
    Resource(type::AbstractString, amount::Integer) :: Resource

"""
mutable struct Resource
    type :: String
    amount :: Int
end
"""
    Cell(pos::Position,
         resource::Union{Nothing, Resource} = nothing,
         citytile::Union{Nothing, CityTile} = nothing,
         road::Real = 0)

"""
mutable struct Cell
    pos :: Position
    resource :: Union{Nothing, Resource}
    citytile :: Union{Nothing, CityTile}
    road :: Float64
    Cell(pos::Position,
         resource::Union{Nothing, Resource} = nothing,
         citytile::Union{Nothing, CityTile} = nothing,
         road::Real = 0) =
        new(pos, resource, citytile, road)
end
"""
    has_resource(obj::Cell) :: Bool

Returns true if this Cell has a non-depleted Resource, false otherwise.
"""
has_resource(obj::Cell) :: Bool = isa(obj.resource, Resource) && obj.resource.amount > 0
"""
    GameMap(dim::Integer)

The map is organized such that the top left corner of the map is at (0, 0) and the bottom right is at (width - 1, height - 1). The map is always square.
"""
struct GameMap
    map :: Matrix{Cell}
    function GameMap(dim::Integer) :: GameMap
        new([ Cell(Position(i, j)) for i in 0:dim - 1, j in 0:dim - 1])
    end
end
"""
    get_cell_by_pos(obj::GameMap, pos::Position) :: Cell

Returns the Cell at the given pos.
"""
get_cell_by_pos(obj::GameMap, pos::Position) :: Cell = get_cell(obj, pos.x, pos.y)
"""
    get_cell(obj::GameMap, x::Integer, y::Integer) :: Cell

Returns the Cell at the given pos.
"""
get_cell(obj::GameMap, x::Integer, y::Integer) :: Cell = obj.map[x + 1, y + 1]
"""
    Cargo(;wood::Integer = 0,
           coal::Integer = 0,
           uranium::Integer = 0) :: Cargo
"""
struct Cargo
    wood :: Int
    coal :: Int
    uranium :: Int
    Cargo(;wood::Integer = 0,
           coal::Integer = 0,
           uranium::Integer = 0) =
        new(wood, coal, uranium)
end
"""
    City(cityid::AbstractString, teamid::Integer,
         fuel::Real, lightupkeep::Real, citytiles::AbstractVector{CityTile} = CityTile[]) :: City

"""
struct City
    cityid :: String
    team :: Int
    fuel :: Float64
    lightupkeep :: Float64
    citytiles :: Vector{CityTile}
    function City(cityid::AbstractString, teamid::Integer,
                  fuel::Real, lightupkeep::Real,
                  citytiles::AbstractVector{CityTile} = CityTile[])
        new(cityid, teamid, fuel, lightupkeep, citytiles)
    end
end
"""
    get_light_upkeep(obj::City) :: Float64

Returns the light upkeep per turn of the City. Fuel in the City is subtracted by the light upkeep each turn of night.
"""
get_light_upkeep(obj::City) :: Float64 = obj.lightupkeep
"""
    Unit(id::AbstractString, team::Int, pos::Position, unit_type::AbstractString,
         cooldown::Real, cargo::Cargo) :: Unit

"""
struct Unit
    id :: String
    pos :: Position
    team :: Int
    cooldown :: Float64
    cargo :: Cargo
    # Internal
    unit_type :: String
    function Unit(id::AbstractString, team::Int, pos::Position, unit_type::AbstractString,
                  cooldown::Real, cargo::Cargo)
        new(id, pos, team, cooldown, cargo, unit_type)
    end
end
"""
    can_act(obj::Union{CityTile, Unit}) :: Bool

Whether this City or Unit can perform an action this turn, which is when the Cooldown is less than 1.
"""
can_act(obj::Union{CityTile, Unit}) :: Bool = obj.cooldown < 1
"""
    get_cargo_space_left(obj::Unit, gameconstants::GameConstants = GAME_CONSTANTS) :: Int

Returns the amount of space left in the cargo of this Unit.
Note that any Resource takes up the same space, e.g. 70 wood takes up as much space as 70 uranium, but 70 uranium would produce much more fuel than wood when deposited at a City.
"""
function get_cargo_space_left(obj::Unit,
                              gameconstants::GameConstants = GAME_CONSTANTS) :: Bool
    space_used = obj.cargo.wood + obj.cargo.coal + obj.cargo.uranium
    rc = gameconstants.PARAMETERS.RESOURCE_CAPACITY
    space_capacity = rc[obj.unit_type]
    space_capacity - space_used
end
"""
    can_build(obj::Unit, gameconstants::GameConstants = GAME_CONSTANTS) :: Bool

Returns true if the Unit can build a City on the tile it is on now. False otherwise.
Checks that the tile does not have a Resource over it still and the Unit has a Cooldown of less than 1.
"""
function can_build(obj::Unit, game_map::GameMap,
                   gameconstants::GameConstants = GAME_CONSTANTS) :: Bool
    cell = get_cell_by_pos(game_map, obj.pos)
    !has_resource(cell) &&
        can_act(obj) &&
        (obj.cargo.wood + obj.cargo.coal + obj.cargo.uranium) ≥
            gameconstants.PARAMETERS.CITY_BUILD_COST
end
"""
    move(obj::Unit, dir::Directions, gameconstants::GameConstants = game.configuration) :: String

Returns the move action. When applied, Unit will move in the specified direction by one Unit, provided there are no other units in the way or opposition cities. (Units can stack on top of each other however when over a friendly City).
"""
move(obj::Unit, dir::Directions, gameconstants::GameConstants = game.configuration) :: String =
    "m $(obj.id) $(gameconstants[string(dir)])"
"""
    transfer(obj::Unit,
             dest_id::AbstractString, resourceType::AbstractString, amount::Integer) :: String

Returns the transfer action. Will transfer from this Unit the selected Resource type by the desired amount to the Unit with id dest_id given that both units are adjacent at the start of the turn. (This means that a destination Unit can receive a transfer of resources by another Unit but also move away from that Unit)
"""
transfer(obj::Unit, dest_id::AbstractString, resourceType::AbstractString, amount::Integer) :: String =
    "t $(obj.id) $dest_id $resourceType $amount"
"""
    build_city(obj::Unit) :: String

Returns the build City action. When applied, Unit will try to build a City right under itself provided it is an empty tile with no City or resources and the worker is carrying 100 units of resources. All resources are consumed if the city is succesfully built.
"""
build_city(obj::Unit) :: String = "bcity $(obj.id)"
"""
    pillage(obj::Unit) :: String

Returns the pillage action. When applied, Unit will pillage the tile it is currently on top of and remove 0.5 of the road level.
"""
pillage(obj::Unit) :: String = "p $(obj.id)"
"""
    Player(team::Integer,
           research_points::Integer = 0,
           units::Vector{Unit} = Unit[],
           cities::Dict{String, City} = Dict{String, City}())

This contains information on a particular player of a particular team.
"""
mutable struct Player
    team :: Int
    research_points :: Int
    units :: Vector{Unit}
    cities :: Dict{String, City}
    city_tile_count :: Int
    Player(team::Integer,
           research_points::Integer = 0,
           units::Vector{Unit} = Unit[],
           cities::Dict{String, City} = Dict{String, City}(),
           city_tile_count::Integer = 0) =
        new(team, research_points, units, cities, city_tile_count)
end
"""
    research_coal(obj::Player, gameconstants::GameConstants = GAME_CONSTANTS) :: Bool

Whether or not this player's team has researched coal and can mine coal.
"""
research_coal(obj::Player, gameconstants::GameConstants = GAME_CONSTANTS) :: Bool =
    obj.research_points ≥ gameconstants.PARAMETERS.RESEARCH_REQUIREMENTS.coal
"""
    researched_uranium(obj::Player, gameconstants::GameConstants = GAME_CONSTANTS) :: Bool

Whether or not this player's team has researched coal and can mine uranium.
"""
researched_uranium(obj::Player, gameconstants::GameConstants = GAME_CONSTANTS) :: Bool =
    obj.research_points ≥ gameconstants.PARAMETERS.RESEARCH_REQUIREMENTS.uranium
