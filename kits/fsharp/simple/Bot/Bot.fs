module Bot

open System
open Lux.GameObjects
open Lux.GameConstants
open Lux.Constants

let makeActions (gameState: Game) : seq<string> =
    let player = gameState.Players.[gameState.Id];
    let opponent = gameState.Players.[(gameState.Id + 1) % 2];
    let gameMap = gameState.GameMap;
    let resourceTiles = seq {
        for y in 0..gameState.GameMap.height do
            for x in 0..gameState.GameMap.width do
                let cell = gameMap.GetCell(x, y)
                if (cell.HasResource()) then
                    yield cell
        }
    seq {
        // we iterate over all our units and do something with them
        for unit in player.Units do
            if (unit.IsWorker() && unit.CanAct()) then
                if (unit.GetCargoSpaceLeft() > 0) then
                    // if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
                    let mutable closestResourceTile = None;
                    let mutable closestDist = Int32.MaxValue;
                    for cell in resourceTiles do
                        match cell, cell.Resource with
                            | _,None -> ()
                            | cell, Some resource ->
                                match cell, resource.Type with
                                    | _, s when 
                                        s = GAME_CONSTANTS.ResourceTypes.Coal && not (player.ResearchedCoal()) ->
                                            ()
                                    | _, s when 
                                        s = GAME_CONSTANTS.ResourceTypes.Uranium && not (player.ResearchedUranium()) ->
                                            ()
                                    | cell, _ ->
                                        let dist = cell.Pos.DistanceTo(unit.Pos);
                                        if (dist < closestDist) then
                                            closestDist <- dist
                                            closestResourceTile <- Some cell
                    match closestResourceTile with
                        | Some tile -> 
                            let dir = unit.Pos.DirectionTo(tile.Pos);
                            // move the unit in the direction towards the closest resource tile's position.
                            yield unit.Move(dir)
                        | None -> ()
                else
                    // if unit is a worker and there is no cargo space left, and we have cities, lets return to them
                    if player.Cities.Count > 0 then
                        let mutable closestDist = Int32.MaxValue;
                        let mutable closestCityTile: option<CityTile> = None;
                        for city in player.Cities.Values do
                            for cityTile in city.CityTiles do
                                let dist = cityTile.Pos.DistanceTo(unit.Pos);
                                if (dist < closestDist) then
                                    closestCityTile <- Some cityTile
                                    closestDist <- dist
                        match closestCityTile with
                            | Some tile ->
                                let dir = unit.Pos.DirectionTo(tile.Pos);
                                yield unit.Move(dir);
                            | None -> ()
        // you can add debug annotations using the static methods of the Annotate class.
        // yield Annotate.Circle(0, 0);
    }

let makeSimpleAction (gameState: Game) = 
    let me = gameState.Players.[0]
    seq {
        for worker in me.Units do
            yield worker.Move(DIRECTIONS.NORTH)
    }