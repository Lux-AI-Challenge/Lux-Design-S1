package luxaibot.lux

class GameMap(val width: Int, val height: Int) {
    val map: Array<Array<Cell?>>

    init {
        map = Array<Array<Cell?>>(height) { arrayOfNulls<Cell>(width) }
        for (y in 0 until height) {
            for (x in 0 until width) {
                map[y][x] = Cell(x, y)
            }
        }
    }

    fun getCellByPos(pos: Position): Cell? {
        return map[pos.y][pos.x]
    }

    fun getCell(x: Int, y: Int): Cell? {
        return map[y][x]
    }

    /** Internal use only  */
    internal fun _setResource(rType: String, x: Int, y: Int, amount: Int) {
        val cell: Cell? = getCell(x, y)
        cell!!.resource = Resource(rType, amount)
    }
}
