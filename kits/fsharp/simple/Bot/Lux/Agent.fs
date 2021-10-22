module Lux.Agent

open System
open GameObjects
open System.Collections.Generic
open System.IO

let private updateUnfold (gameState:Game) (input: TextReader) : option<Game * Game> =
    let updateInfo = input.ReadLine()
    if updateInfo = Constants.INPUT_CONSTANTS.DONE then
        None
    else
        let updates = updateInfo.Split(" ");
        let inputIdentifier : string = updates.[0];
        match inputIdentifier with
            | s when s = Constants.INPUT_CONSTANTS.RESEARCH_POINTS ->
                let team: int = Int32.Parse(updates.[1]);
                let newPoints = Int32.Parse(updates.[2])
                gameState.Players.[team].research_points <- newPoints
                Some(gameState, gameState)
            | s when s = Constants.INPUT_CONSTANTS.RESOURCES ->
                let r_type = updates.[1];
                let x = Int32.Parse(updates.[2]);
                let y = Int32.Parse(updates.[3]);
                let amt = (int)(Double.Parse(updates.[4]))
                gameState.GameMap._setResource(r_type, x, y, amt)
                Some(gameState, gameState)
            | s when s = Constants.INPUT_CONSTANTS.UNITS ->
                let unittype = Int32.Parse(updates.[1]);
                let team = Int32.Parse(updates.[2]);
                let unitid = updates.[3];
                let x = Int32.Parse(updates.[4]);
                let y = Int32.Parse(updates.[5]);
                let cooldown = Double.Parse(updates.[6]);
                let wood = Int32.Parse(updates.[7]);
                let coal = Int32.Parse(updates.[8]);
                let uranium = Int32.Parse(updates.[9]);
                let unit = new Unit(team, Constants.ParseUnitType unittype, unitid, x, y, cooldown, wood, coal, uranium);
                let newGameState = 
                    match gameState.Players with
                        | players ->
                            players.[team].Units <- unit::players.[team].Units
                            { gameState with 
                                Players = players
                            }
                        | _ -> failwith "More than two players present, do ghosts exits?"
                Some(newGameState, newGameState)
            | s when s = Constants.INPUT_CONSTANTS.CITY ->
                let team = Int32.Parse(updates.[1]);
                let cityid = updates.[2];
                let fuel = Double.Parse(updates.[3]);
                let lightUpkeep = Double.Parse(updates.[4]);
                gameState.Players.[team].Cities.Add(cityid, new City(team, cityid, fuel, lightUpkeep));
                Some(gameState, gameState)
            | s when s = Constants.INPUT_CONSTANTS.CITY_TILES ->
                let team = Int32.Parse(updates.[1]);
                let cityid = updates.[2];
                let x = Int32.Parse(updates.[3]);
                let y = Int32.Parse(updates.[4]);
                let cooldown = Double.Parse(updates.[5]);
                let city = gameState.Players.[team].Cities.Item cityid
                let citytile = city._add_city_tile(x, y, cooldown);
                gameState.GameMap.GetCell(x, y).Citytile <- citytile;
                gameState.Players.[team].city_tile_count <- gameState.Players.[team].city_tile_count + 1;
                Some(gameState, gameState)
            | s when s = Constants.INPUT_CONSTANTS.ROADS ->
                let x = Int32.Parse(updates.[1]);
                let y = Int32.Parse(updates.[2]);
                let road = Double.Parse(updates.[3]);
                let cell = gameState.GameMap.GetCell(x, y);
                cell.Road <- road;
                Some(gameState, gameState)
            | _ -> failwith "Unknown input string"

type IGameStateIO =
    abstract member update : unit -> Game
    abstract member endTurn: unit -> unit

type GameStateIO =
    {
        gameState : Game
    }
    static member initialize(input: TextReader) : Game =
        let id = Int32.Parse(input.ReadLine())
        let mapInfo: string = input.ReadLine()
        let mapInfoSplit: string[] = mapInfo.Split(" ")
        let mapWidth = Int32.Parse(mapInfoSplit.[0])
        let mapHeight = Int32.Parse(mapInfoSplit.[1])
        let map = new GameMap(mapWidth, mapHeight)
        let gameState : Game = 
            {
                Id = id 
                GameMap = map;
                Turn = 0;
                Players = [Player(0); Player(1)]
                }
        gameState

    member self.update(input: TextReader) =
        let newPlayer0 = 
            Player(0, [], new Dictionary<string, City>(), self.gameState.Players.[0].city_tile_count)
        let newPlayer1 = 
            Player(1, [], new Dictionary<string, City>(), self.gameState.Players.[1].city_tile_count)
        let newGameState = 
            { self.gameState with
                Turn = self.gameState.Turn + 1;
                Players = [newPlayer0; newPlayer1]
                GameMap = GameMap(self.gameState.GameMap.height, self.gameState.GameMap.width)
                }
            |> Seq.unfold (fun state ->
                updateUnfold state input
                )
            |> Seq.last
        { self with gameState = newGameState }

    /// Ends turn
    member self.endTurn() =
        Console.WriteLine("D_FINISH")
