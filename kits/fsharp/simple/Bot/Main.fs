open System
open Lux.Agent

[<EntryPoint>]
let main args =
    let agent: GameStateIO = { gameState = GameStateIO.initialize() }
    Threading.Thread.Sleep(10000)
    while true do
        let game = agent.update();

        (* Set actions *)
        let actions : seq<string> = 
            Bot.makeSimpleAction game.gameState
        
        (* AI Code Goes Above! *)

        (* Do not edit *)
        let command = 
            String.concat "," actions
        Console.WriteLine(command);
        agent.endTurn();
    0