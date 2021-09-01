package luxaibot.lux

import java.util.*

@Suppress("UNUSED_CHANGED_VALUE")
class Agent {
    private val scanner: Scanner
    var gameState: GameState = GameState()

    /**
     * Initialize Agent for the `Match` User should edit this according to their
     * `Design`
     */
    fun initialize() {
        // get agent ID
        gameState.id = scanner.nextLine().toInt()
        val mapInfo = scanner.nextLine()
        val mapInfoSplit = mapInfo.split(" ").toTypedArray()
        val mapWidth = mapInfoSplit[0].toInt()
        val mapHeight = mapInfoSplit[1].toInt()
        gameState.map = GameMap(mapWidth, mapHeight)
    }

    /**
     * Updates agent's own known state of `Match` User should edit this according to
     * their `Design`.
     */
    fun update() {
        // wait for the engine to send any updates
        gameState.map = GameMap(gameState.map!!.width, gameState.map!!.height)
        gameState.turn += 1
        gameState.players.get(0).cities = HashMap<String, City>()
        gameState.players.get(0).units.clear()
        gameState.players.get(1).cities = HashMap<String, City>()
        gameState.players.get(1).units.clear()
        while (true) {
            val updateInfo = scanner.nextLine()
            if (updateInfo == IOConstants.DONE.str) {
                break
            }
            val updates = updateInfo.split(" ").toTypedArray()
            val inputIdentifier = updates[0]
            if (inputIdentifier == IOConstants.RESEARCH_POINTS.str) {
                val team = updates[1].toInt()
                gameState.players.get(team).researchPoints = updates[2].toInt()
            } else if (inputIdentifier == IOConstants.RESOURCES.str) {
                val type = updates[1]
                val x = updates[2].toInt()
                val y = updates[3].toInt()
                val amt = updates[4].toDouble().toInt()
                gameState.map!!._setResource(type, x, y, amt)
            } else if (inputIdentifier == IOConstants.UNITS.str) {
                var i = 1
                val unittype = updates[i++].toInt()
                val team = updates[i++].toInt()
                val unitid = updates[i++]
                val x = updates[i++].toInt()
                val y = updates[i++].toInt()
                val cooldown = updates[i++].toDouble()
                val wood = updates[i++].toInt()
                val coal = updates[i++].toInt()
                val uranium = updates[i++].toInt()
                val unit = Unit(team, unittype, unitid, x, y, cooldown, wood, coal, uranium)
                gameState.players.get(team).units.add(unit)
            } else if (inputIdentifier == IOConstants.CITY.str) {
                var i = 1
                val team = updates[i++].toInt()
                val cityid = updates[i++]
                val fuel = updates[i++].toDouble()
                val lightUpkeep = updates[i++].toDouble()
                gameState.players.get(team).cities.put(cityid, City(team, cityid, fuel, lightUpkeep))
            } else if (inputIdentifier == IOConstants.CITY_TILES.str) {
                var i = 1
                val team = updates[i++].toInt()
                val cityid = updates[i++]
                val x = updates[i++].toInt()
                val y = updates[i++].toInt()
                val cooldown = updates[i++].toDouble()
                val city: City = gameState.players.get(team).cities.get(cityid)!!
                val citytile: CityTile = city._add_city_tile(x, y, cooldown)
                gameState.map!!.getCell(x, y)!!.citytile = citytile
                gameState.players.get(team).cityTileCount += 1
            } else if (inputIdentifier == IOConstants.ROADS.str) {
                var i = 1
                val x = updates[i++].toInt()
                val y = updates[i++].toInt()
                val road = updates[i++].toDouble()
                val cell: Cell = gameState.map!!.getCell(x, y)!!
                cell.road = road
            }
        }
    }

    /**
     * End a turn
     */
    fun endTurn() {
        println("D_FINISH")
        System.out.flush()
    }

    /**
     * Constructor for a new agent User should edit this according to their `Design`
     */
    init {
        scanner = Scanner(System.`in`)
    }
}
