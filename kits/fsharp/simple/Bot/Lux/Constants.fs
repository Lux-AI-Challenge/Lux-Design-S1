module Lux.Constants

module INPUT_CONSTANTS =
    let RESEARCH_POINTS = "rp"
    let RESOURCES = "r"
    let UNITS = "u"
    let CITY = "c"
    let CITY_TILES = "ct"
    let ROADS = "ccd"
    let DONE = "D_DONE"

type DIRECTIONS =
    | NORTH
    | WEST
    | SOUTH
    | EAST
    | CENTER
    override this.ToString() =
        match this with
        | NORTH -> "n"
        | WEST -> "w"
        | SOUTH -> "s"
        | EAST -> "e"
        | CENTER -> "c"

type UNIT_TYPES =
    | WORKER = 0
    | CART = 1
    
let ParseUnitType value =
    match value with
        | 0 -> UNIT_TYPES.WORKER
        | 1 -> UNIT_TYPES.CART
        | _ -> failwith "Unexpected unit type encountered."

type RESOURCE_TYPES =
    | WOOD
    | URANIUM
    | COAL
    override this.ToString() =
        match this with
        | WOOD -> "wood"
        | URANIUM -> "uranium"
        | COAL -> "coal"
