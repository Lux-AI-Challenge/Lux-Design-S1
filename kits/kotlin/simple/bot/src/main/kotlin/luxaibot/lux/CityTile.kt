package luxaibot.lux

class CityTile(var team: Int, var cityid: String, x: Int, y: Int, cooldown: Double) {
    var pos: Position
    var cooldown: Double
    fun canAct(): Boolean {
        return cooldown < 1
    }

    fun research(): String {
        return java.lang.String.format("r %d %d", pos.x, pos.y)
    }

    fun buildWorker(): String {
        return java.lang.String.format("bw %d %d", pos.x, pos.y)
    }

    fun buildCart(): String {
        return java.lang.String.format("bc %d %d", pos.x, pos.y)
    }

    init {
        pos = Position(x, y)
        this.cooldown = cooldown
    }
}
