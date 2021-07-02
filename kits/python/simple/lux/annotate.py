def circle(x: int, y: int) -> str:
    return f"dc {x} {y}"

def x(x: int, y: int) -> str:
    return f"dx {x} {y}"

def line(x1: int, y1: int, x2: int, y2: int) -> str:
    return f"dl {x1} {y1} {x2} {y2}"
