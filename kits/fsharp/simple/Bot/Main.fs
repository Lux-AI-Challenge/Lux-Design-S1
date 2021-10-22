open System
open System.IO
open Lux.Agent

type PipedReader(input: TextReader, output: StreamWriter) =
    inherit TextReader()
    member val reader = input
    member val writer = output
    with 
        override self.ReadLine() =
            let input = self.reader.ReadLine()
            self.writer.WriteLine(input)
            input

[<EntryPoint>]
let main args =
    let inputStream = Console.In
    let logStream = StreamWriter($"logInput_{Random().Next()}.txt")
    let pipedStream = PipedReader(inputStream, logStream)
    let agent: GameStateIO = { gameState = GameStateIO.initialize(pipedStream) }
    //System.Threading.Thread.Sleep(10000)
    List.unfold (fun (agent: GameStateIO) ->
        let game = agent.update(pipedStream)

        (* Set actions *)
        let actions : seq<string> = 
            Bot.makeActions game.gameState
        
        (* AI Code Goes Above! *)

        (* Do not edit *)
        let command = 
            String.concat "," actions
        Console.WriteLine(command)
        agent.endTurn()
        Some ((), agent)
    ) agent
    |> ignore
    0