module Lux.Annotate

let Circle(x: int, y: int) : string =
    $"dc {x} {y}"

let x(x: int, y: int) : string =
    $"dx {x} {y}"

let Line(x1: int, y1: int, x2: int, y2: int) : string =
    $"dl {x1} {y1} {x2} {y2}"

/// text at cell on map
let Text (x: int, y: int, message: string, fontsize: option<int>) : string =
    $"dt {x} {y} '{message}' {defaultArg fontsize 16}"
 
/// text besides map
let Sidetext(message: string) : string =
    $"dst '{message}'"
