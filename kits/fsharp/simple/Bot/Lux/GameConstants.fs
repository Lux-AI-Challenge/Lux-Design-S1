namespace Lux

open FSharp.Data

module GameConstants =
    type private jsonFormat = JsonProvider<"./Lux/game_constants.json">
    let GAME_CONSTANTS = jsonFormat.Parse("./Lux/game_constants.json")