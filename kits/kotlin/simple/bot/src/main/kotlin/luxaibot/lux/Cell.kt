package luxaibot.lux

class Cell(x: Int, y: Int) {
    var pos: Position
    var resource: Resource? = null
    var road = 0.0
    var citytile: CityTile? = null
    fun hasResource(): Boolean {
        return resource != null && resource!!.amount > 0
    }

    init {
        pos = Position(x, y)
    }
}
