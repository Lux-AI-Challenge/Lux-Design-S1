open System
open Lux.Agent

[<EntryPoint>]
let main args =
    let agent: GameStateIO = { gameState = GameStateIO.initialize() }
    while true do
        let game = agent.update()

        (* Set actions *)
        let actions : seq<string> = 
            Bot.takeActions game.gameState
        
        (* AI Code Goes Above! *)

        (* Do not edit *)
        let command = 
            String.concat "," actions
        Console.WriteLine(command)
        agent.endTurn()
    0