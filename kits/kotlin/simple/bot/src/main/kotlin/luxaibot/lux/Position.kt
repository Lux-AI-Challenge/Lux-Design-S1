package luxaibot.lux

import java.lang.Error

data class Position(val x: Int, val y: Int) {
    fun isAdjacent(pos: Position): Boolean {
        val dx = x - pos.x
        val dy = y - pos.y
        return if (Math.abs(dx) + Math.abs(dy) > 1) {
            false
        } else true
    }

    fun translate(direction: Direction?, units: Int): Position {
        when (direction) {
            Direction.NORTH -> return Position(x, y - units)
            Direction.EAST -> return Position(x + units, y)
            Direction.SOUTH -> return Position(x, y + units)
            Direction.WEST -> return Position(x - units, y)
            Direction.CENTER -> return Position(x, y)
        }
        throw Error("Did not supply valid direction")
    }

    fun distanceTo(pos: Position): Double {
        return (Math.abs(pos.x - x) + Math.abs(pos.y - y)).toDouble()
    }

    fun directionTo(targetPos: Position): Direction {
        val checkDirections: Array<Direction> =
            arrayOf(Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST)
        var closestDirection: Direction = Direction.CENTER
        var closestDist = distanceTo(targetPos)
        for (dir in checkDirections) {
            val newpos = translate(dir, 1)
            val dist = targetPos.distanceTo(newpos)
            if (dist < closestDist) {
                closestDist = dist
                closestDirection = dir
            }
        }
        return closestDirection
    }

    override fun toString(): String {
        return "(" + x + ", " + y + ")"
    }
}
