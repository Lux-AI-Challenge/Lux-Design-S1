package luxaibot.lux

class Unit(
    teamid: Int,
    u_type: Int,
    unitid: String,
    x: Int,
    y: Int,
    cooldown: Double,
    wood: Int,
    coal: Int,
    uranium: Int
) {
    var pos: Position
    var team: Int
    var id: String
    var type: Int
    var cooldown: Double
    var cargo: Cargo
    val isWorker: Boolean
        get() = type == 0
    val isCart: Boolean
        get() = type == 1
    val cargoSpaceLeft: Int
        get() {
            val spaceused: Int = cargo.wood + cargo.coal + cargo.uranium
            return if (type == GameConstants.UNIT_TYPES.WORKER) {
                GameConstants.PARAMETERS.RESOURCE_CAPACITY.WORKER - spaceused
            } else {
                GameConstants.PARAMETERS.RESOURCE_CAPACITY.CART - spaceused
            }
        }

    fun canBuild(gameMap: GameMap): Boolean {
        val cell = gameMap.getCellByPos(pos)
        return if (!cell!!.hasResource() && canAct() && cargo.wood + cargo.coal + cargo.uranium >= GameConstants.PARAMETERS.CITY_BUILD_COST) true else false
    }

    fun canAct(): Boolean {
        return cooldown < 1
    }

    fun move(dir: Direction?): String {
        return java.lang.String.format("m %s %s", id, dir)
    }

    fun transfer(destId: String?, resourceType: String?, amount: Int): String {
        return String.format("t %s %s %s %d", id, destId, resourceType, amount)
    }

    fun buildCity(): String {
        return String.format("bcity %s", id)
    }

    fun pillage(): String {
        return String.format("p %s", id)
    }

    init {
        pos = Position(x, y)
        team = teamid
        id = unitid
        type = u_type
        this.cooldown = cooldown
        cargo = Cargo(wood, coal, uranium)
    }
}
