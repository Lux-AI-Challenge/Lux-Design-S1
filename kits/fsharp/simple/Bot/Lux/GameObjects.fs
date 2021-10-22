module Lux.GameObjects

open Constants
open System.Collections.Generic
open GameConstants

// GameMap:
type Resource(r_type: string, amount: int) =
    member self.Type = r_type
    member self.amount = amount

type Position(_x, _y) =
    member self.x = _x
    member self.y = _y
    static member (-) (self: Position, pos: Position) : int =
        abs(pos.x - self.x) + abs(pos.y - self.y)

    /// Returns Manhattan (L1/grid) distance to pos
    member self.DistanceTo(pos: Position) =
        self - pos

    member self.IsAdjacent(pos: Position) =
        (self - pos) <= 1

    static member op_Equality (self: Position, pos: Position) : bool =
        self.x = pos.x && self.y = pos.y

    member self.translate(direction, units): Position =
        match direction with
            | NORTH ->
                Position(self.x, self.y - units)
            | EAST ->
                Position(self.x + units, self.y)
            | SOUTH ->
                Position(self.x, self.y + units)
            | WEST -> 
                Position(self.x - units, self.y)
            | CENTER ->
                Position(self.x, self.y)

    /// Return closest position to target_pos from this position
    member self.DirectionTo(target_pos: 'Position') : DIRECTIONS =
        let check_dirs = [
                NORTH;
                EAST;
                SOUTH;
                WEST;
            ]
        let closest_dist_init, closest_dir_init = (self.DistanceTo(target_pos), DIRECTIONS.CENTER)
        let closest_dist, closest_dir =
            check_dirs
            |> List.fold (fun (closest_dist, closest_dir) direction ->
                let newpos = self.translate(direction, 1)
                let dist = target_pos.DistanceTo(newpos)
                if dist < closest_dist then
                    dist, direction
                else 
                    closest_dist, closest_dir
            ) (closest_dist_init, closest_dir_init)
        closest_dir

    override self.ToString() =
        sprintf "(%d, %d)" self.x self.y

// GameObjects:
type CityTile(teamid, cityid, x, y, cooldown: float) =
    member self.Cityid: string = cityid
    member self.Team = teamid
    member self.Pos = Position(x, y)
    member self.Cooldown = cooldown
    /// Whether or not this unit can research or build
    member self.CanAct() : bool =
        self.Cooldown < 1.0
    /// returns command to ask this tile to research this turn
    member self.Research() : string =
        sprintf "r %d %d" self.Pos.x self.Pos.y
    /// returns command to ask this tile to build a worker this turn
    member self.BuildWorker() : string =
        sprintf "bw %d %d" self.Pos.x self.Pos.y
            
    /// returns command to ask this tile to build a cart this turn
    member self.BuildCart() : string =
        sprintf "bc %d %d" self.Pos.x self.Pos.y
            
type Cell(x, y) =
    member self.Pos: Position = Position(x, y)
    member val Resource: option<Resource> = None with get, set
    member val Citytile: option<CityTile> = None with get, set
    member val Road = 0.0 with get, set
    member self.HasResource() =
        match self.Resource with
            | None ->
                false
            | Some resource ->
                resource.amount > 0

type City(teamid: int, cityid: string, fuel: float, light_upkeep_init: float) =
    member self.cityid = cityid
    member self.team = teamid
    member self.fuel = fuel
    member val CityTiles: List<CityTile> = new List<CityTile>() with get, set
    member self.light_upkeep = light_upkeep_init
    member self._add_city_tile(x, y, cooldown) =
        let ct = CityTile(self.team, self.cityid, x, y, cooldown)
        self.CityTiles.Add(ct)
        Some ct
    //member self.get_light_upkeep() =
    //    self.light_upkeep

type GameMap(width, height) =
    member self.height = height
    member self.width = width
    // member self.map: List[List[Cell]] = [None] * height
    member val map: Cell[,] = Array2D.init width height (fun x y -> Cell(x,y))
    // for y in 0 .. self.height) do
    //     self.map.[y] = [None] * width
    //     for x in range(0, self.width) do
    //         self.map[y][x] = Cell(x, y)

    member self.GetCellByPos(pos: Position) : Cell =
        self.map.[pos.x, pos.y]

    member self.GetCell(x, y) : Cell =
        self.map.[x, y]

    /// do not use this function, this is for internal tracking of state
    member self._setResource(r_type, x, y, amount) =
        self.GetCell(x, y).Resource <- Some(Resource(r_type, amount))

type Cargo(wood, coal, uranium) =
    member self.wood = wood
    member self.coal = coal
    member self.uranium = uranium
    new() =
        Cargo(0, 0, 0)

    member self.__str__() : string =
        sprintf "Cargo | Wood: %d, Coal: %d, Uranium: %d" self.wood self.coal self.uranium

type Unit(teamid, u_type, unitid, x, y, cooldown, wood, coal, uranium) =
    member val Pos = Position(x, y)
    member val team: int = teamid with get, set
    member val id: string = unitid with get, set
    member private self.u_type = u_type
    member self.cooldown = cooldown
    member self.cargo : Cargo = new Cargo(wood, coal, uranium)
    member self.IsWorker() : bool =
        self.u_type = UNIT_TYPES.WORKER

    member self.IsCart() : bool =
        self.u_type = UNIT_TYPES.CART

    /// get cargo space left in this unit
    member self.GetCargoSpaceLeft() =
        let spaceused = self.cargo.wood + self.cargo.coal + self.cargo.uranium
        if self.u_type = UNIT_TYPES.WORKER then
            GAME_CONSTANTS.Parameters.ResourceCapacity.Worker - spaceused
            //GAME_CONSTANTS["PARAMETERS"]["RESOURCE_CAPACITY"]["WORKER"] - spaceused
        else
            GAME_CONSTANTS.Parameters.ResourceCapacity.Cart - spaceused
            //GAME_CONSTANTS["PARAMETERS"]["RESOURCE_CAPACITY"]["CART"] - spaceused
            
    /// whether or not the unit can build where it is right now
    member self.CanBuild(game_map: GameMap) : bool =
        let cell = game_map.GetCellByPos(self.Pos)
        not (cell.HasResource()) 
        && self.CanAct() 
        && (self.cargo.wood + self.cargo.coal + self.cargo.uranium) >= GAME_CONSTANTS.Parameters.CityBuildCost

    /// whether or not the unit can move or not. This does not check for potential collisions into other units or enemy cities
    member self.CanAct() : bool =
        self.cooldown < 1.0

    /// return the command to move unit in the given direction
    member self.Move(dir: DIRECTIONS) : string =
        sprintf "m %s %s" self.id (dir.ToString())
        // $"m {self.id} {dir}"

    /// return the command to transfer a resource from a source unit to a destination unit as specified by their ids
    member self.Transfer(dest_id, resourceType, amount) : string =
        sprintf "t %s %d %d %d" self.id dest_id resourceType amount 

    /// return the command to build a city right under the worker
    member self.BuildCity() : string =
        sprintf "bcity %s" self.id 

    /// return the command to pillage whatever is underneath the worker
    member self.pillage() : string =
        sprintf "p %s" self.id 

type Player(team, units, cities, tilecount) =
    new(teamId) =
        Player(teamId, [], new Dictionary<string, City>(), 0)
    member val team: int = team with get, set
    member val research_points = 0 with get, set
    member val Units: list<Unit> = units with get, set
    member val Cities: Dictionary<string, City> = cities
    member val city_tile_count: int = tilecount with get, set
    member self.ResearchedCoal() : bool =
        self.research_points >= GAME_CONSTANTS.Parameters.ResearchRequirements.Coal
    member self.ResearchedUranium() : bool =
        self.research_points >= GAME_CONSTANTS.Parameters.ResearchRequirements.Uranium

type Game =
    {
        Id: int
        Turn: int
        GameMap: GameMap
        Players: list<Player>
    }
    member private self._reset_player_states() =
        { self with
            Players = 
                [
                    Player(0, [], new Dictionary<string, City>(), 0);
                    Player(1, [], new Dictionary<string, City>(), 0);
                ]
        }