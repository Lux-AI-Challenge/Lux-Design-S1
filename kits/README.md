# Lux AI Season 1 Kits

This folder contains all official kits provided by the Lux AI team or the Lux AI Challenge Season 1. 

There are 2 kinds of bots provided by us, a `simple` bot strategy and a `organic` bot strategy that work on simple heurstics in each starter kit folder.

## API

This section details the general API each kit adheres to. It follows the conventions of Python but other kits are exactly the same, differing only in syntax and naming conventions. Any individual difference should be noted in the comments in the kits themselves.

Some methods you may notice are for generating an **action**, e.g. moving a unit, transferring resources, building units. These action methods always return a string, which should be added to the `actions` array, of which there are examples of how to do so in the starter kits.

### game_state

The `game_state` object is provided to you and contains the complete information about the current state of the game at the current turn `game_state.turn`. Each agent/player in the game has an id, with your bot's id equal to `game_state.id` and the other team's id being `(game_state.id + 1 ) % 2`.

Additionally in the game state, are the following nested objects, `map` of type [GameMap](#GameMap), and `players` which is a list with two [Player](#Player) objects indexed by the player's team id. The kits will show how to retrieve those objects. The rest of this section details the properties and methods of each type of object used in the kits.

### <u>GameMap</u>

The map is organized such that the top left corner of the map is at `(0, 0)` and the bottom right is at `(width, height)`

Properties:

- `height: int` - the height of the map (along the y direction)
- `width: int` - the width of the map (along the x direction)
- `map: List[List[Cell]]` - A 2D array of Cell objects, defining the current state of the map.

Methods:

- `get_cell_by_pos(pos: Position)` - returns the Cell at the given pos
- `get_cell(x: int, y: int)` - returns the Cell at the given x, y coordinates

### <u>Position</u>

Properties:

- `x: int` - the x coordinate of the Position
- `y: int` - the y coordinate of the Position

Methods:

- `is_adjacent(pos: Position) -> bool` - returns true if this Position is adjacent to `pos`. False otherwise

- `equals(pos: Position) -> bool` - returns true if this Position is equal to the other `pos` object by checking x, y coordinates. False otherwise

- `translate(direction: DIRECTIONS, units: int) -> Position` - returns the Position equal to going in a `direction` `units` number of times from this Position

- `distance_to(pos: Position) -> float` - returns the [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) from this Position to `pos`

- `direction_to(target_pos: Position) -> DIRECTIONS` - returns the direction that would move you closest to `target_pos` from this Position if you took a single step. In particular, will return `DIRECTIONS.CENTER` if this Position is equal to the `target_pos`. Note that this does not check for potential collisions with other units but serves as a basic pathfinding method

### <u>Cell</u>

Properties:

- `pos: Position`
- `resource: Resource` - contains details of a Resource at this Cell. This may be equal to `None` or `null` equivalents in other languages. You should always use the function `has_resource` to check if this Cell has a Resource or not
- `cooldown: float` - the amount of Cooldown subtracted from a unit's Cooldown whenever they perform an action on this tile. If there are roads, the more developed the road, the higher this Cooldown value is. Note that a unit will aways gain a base Cooldown amount whenever any action is performed.
- `citytile: CityTile` - the citytile that is on this Cell. Equal to `none` or `null` equivalents in other languages if there is no CityTile here.

Methods:

- `has_resource() -> bool` - returns true if this Cell has a non-depleted Resource, false otherwise

### <u>City</u>

Properties:

- `cityid: str` - the id of this City. Each City id in the game is unique and will never be reused by new cities
- `team: int` - the id of the team this City belongs to. 
- `fuel: float` - the fuel stored in this City. This fuel is consumed by all CityTiles in this City during each turn of night.
- `citytiles: list[CityTile]` - a list of CityTile objects that form this one City collectively. A City defined as all CityTiles that are connected via adjacent CityTiles.

Methods:

- `get_light_upkeep() -> float` - returns the light upkeep per turn of the City. Fuel in the City is subtracted by the light upkeep each turn of night.

### <u>CityTile</u>

Properties:

- `cityid: str` - the id of the City this CityTile is a part of. Each City id in the game is unique and will never be reused by new cities
- `team: int` - the id of the team this CityTile belongs to. 
- `pos: Position` - the Position of this City on the map
- `cooldown: float` - the current Cooldown of this City. 

Methods:

- `can_act() -> bool` - whether this City can perform an action this turn, which is when the Cooldown is less than 1

- `research() -> str` - returns the research action

- `build_worker() -> str` - returns the build worker action. When applied and requirements are met, a worker will be built at the City.

- `build_cart() -> str` - returns the build cart action. When applied and requirements are met, a cart will be built at the City.

### <u>Unit</u>

Properties:

- `pos: Position` - the Position of this unit on the map
- `team: int` - the id of the team this unit belongs to. 
- `id: int` - the id of this unit. This is unique and cannot be repeated by any other unit or City
- `cooldown: float` - the current Cooldown of this unit. Note that when this is less than 1, the unit can perform an action
- `cargo.wood: int` - the amount of wood held by this unit
- `cargo.coal: int` - the amount of coal held by this unit
- `cargo.uranium: int` - the amount of uranium held by this unit

Methods:

- `get_cargo_space_left(): int` - returns the amount of space left in the cargo of this unit. Note that any Resource takes up the same space, e.g. 70 wood takes up as much space as 70 uranium, but 70 uranium would produce much more fuel than wood when deposited at a City
- `can_build(): bool` - returns true if the unit can build a City on the tile it is on now. False otherwise. Checks that the tile does not have a Resource over it still and the unit has a Cooldown of less than 1
- `can_move(): bool`  - returns true if the unit can perform an action. False otherwise. Essentially just checks the Cooldown of the unit is less than 1
- `move(dir): str` - returns the move action. When applied, unit will move in the specified direction by one unit, provided there are no other units in the way or opposition cities. (Unit's can stack on top of each other however when over a friendly City)
- `transfer(dest_id, resourceType, amount): str` - returns the transfer action. Will transfer from the selected Resource type by the desired amount to the unit with id `dest_id` provided both units are adjacent at the moment. (This means that a destination unit can receive a transfer of resources by another unit but also move away from that unit)
- `build_city(): str` - returns the build City action. When applied, unit will try to build a City right under itself provided it is an empty tile with no City or resources and the worker is carrying 100 wood.
- `pillage(): str` - returns the pillage action. When applied, unit will pillage the tile it is currently on top of and remove 0.25 of the road level.

### <u>Player</u>

This contains information on a particular player of a particular team.

Properties:

- `team: int` - the team id of this player

- `research_points: int` - the current total number of research points the player's team has
- `units: list[Unit]` - a list of every unit owned by this player's team.
- `cities: Dict[str, City]` - a dictionary / map mapping City id to each separate City owned by this player's team. To get the individual CityTiles, you will need to access the `citytiles` property of the `City`.

Methods:

- `researched_coal() - bool` - whether or not this player's team has researched coal and can mine coal.
- `researched_uranium() - bool` - whether or not this player's team has researched uranium and can mine uranium.

### <u>Annotate</u>

The annotation object lets you create annotation commands that show up on the visualizer when debug mode is turned on. Note that these commands are stripped by competition servers but are available to see when running matches locally.

Methods

- `circle(x: int, y: int) -> str` - returns the draw circle annotation action. Will draw a unit sized circle on the visualizer at the current turn centered at the Cell at the given x, y coordinates

- `x(x: int, y: int) -> str` - returns the draw X annotation action. Will draw a unit sized X on the visualizer at the current turn centered at the Cell at the given x, y coordinates

- `line(x1: int, y1: int, x2: int, y2: int) -> str` - returns the draw line annotation action. Will draw a line from the center of the Cell at (x1, y1) to the center of the Cell at (x2, y2).

Note that all of these will be colored according to the team that created the annotation (blue or orange)

### <u>GameConstants</u>

This will contain constants on all game parameters like the max turns, the light upkeep of CityTiles etc.

If there are any changes to the starter kits, typically only this object will change.