"""
    circle(x::Integer, y::Integer) :: String

Returns the draw circle annotation action.
Will draw a unit sized circle on the visualizer at the current turn centered at the `Cell` at the given x, y coordinates.
"""
circle(x::Integer, y::Integer) = "dc $x $y"

"""
    x(x::Integer, y::Integer) :: String

Returns the draw X annotation action.
Will draw a unit sized X on the visualizer at the current turn centered at the `Cell` at the given x, y coordinates.
"""
x(x::Integer, y::Integer) = "dx $x $y"


"""
    line(x1::Integer, y1::Integer, x2::Integer, y2::Integer) :: String

Returns the draw line annotation action.
Will draw a line from the center of the `Cell` at (x1, y1) to the center of the `Cell` at (x2, y2).
"""
line(x1::Integer, y1::Integer, x2::Integer, y2::Integer) = "dl $x1 $y1 $x2 $y2"

"""
    text(x::Integer, y::Integer, message::AbstractString,
         fontsize::Integer = 16) :: String

Returns the draw text annotation action.
Will write text on top of the tile at (x, y) with the particular message and fontsize.
"""
text(x::Integer, y::Integer, message::AbstractString, fontsize::Integer = 16) =
    "dt $x $y '$message' $fontsize"

"""
    sidetext(message::AbstractString) :: String

Returns the draw side text annotation action.
Will write text that is displayed on that turn on the side of the visualizer.
"""
sidetext(message::AbstractString) = "dst '$message'"
