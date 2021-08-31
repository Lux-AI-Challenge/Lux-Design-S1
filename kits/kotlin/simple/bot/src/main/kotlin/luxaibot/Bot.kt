package luxaibot

import luxaibot.lux.*
import java.lang.Exception
import java.util.ArrayList

object Bot {
    @Throws(Exception::class)
    @JvmStatic
    fun main(args: Array<String>) {
        val agent = Agent()
        // initialize
        agent.initialize()
        while (true) {
            /** Do not edit!  */
            // wait for updates
            agent.update()
            val actions = ArrayList<String>()
            val gameState: GameState = agent.gameState

            /** AI Code Goes Below!  */
            val player: Player = gameState.players.get(gameState.id)
            val opponent: Player = gameState.players.get((gameState.id + 1) % 2)
            val gameMap: GameMap = gameState.map!!
            val resourceTiles: ArrayList<Cell> = ArrayList<Cell>()
            for (y in 0 until gameMap.height) {
                for (x in 0 until gameMap.width) {
                    val cell: Cell = gameMap.getCell(x, y)!!
                    if (cell.hasResource()) {
                        resourceTiles.add(cell)
                    }
                }
            }

            // we iterate over all our units and do something with them
            for (i in 0 until player.units.size) {
                val unit = player.units.get(i)
                if (unit.isWorker && unit.canAct()) {
                    if (unit.cargoSpaceLeft > 0) {
                        // if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
                        var closestResourceTile: Cell? = null
                        var closestDist = 9999999.0
                        for (cell in resourceTiles) {
                            if (cell.resource!!.type == GameConstants.RESOURCE_TYPES.COAL && !player.researchedCoal()) continue
                            if (cell.resource!!.type == GameConstants.RESOURCE_TYPES.URANIUM && !player.researchedUranium()) continue
                            val dist: Double = cell.pos.distanceTo(unit.pos)
                            if (dist < closestDist) {
                                closestDist = dist
                                closestResourceTile = cell
                            }
                        }
                        if (closestResourceTile != null) {
                            val dir: Direction = unit.pos.directionTo(closestResourceTile.pos)
                            // move the unit in the direction towards the closest resource tile's position.
                            actions.add(unit.move(dir))
                        }
                    } else {
                        // if unit is a worker and there is no cargo space left, and we have cities, lets return to them
                        if (player.cities.size > 0) {
                            val city: City = player.cities.values.iterator().next()
                            var closestDist = 999999.0
                            var closestCityTile: CityTile? = null
                            for (citytile in city.citytiles) {
                                val dist: Double = citytile.pos.distanceTo(unit.pos)
                                if (dist < closestDist) {
                                    closestCityTile = citytile
                                    closestDist = dist
                                }
                            }
                            if (closestCityTile != null) {
                                val dir: Direction = unit.pos.directionTo(closestCityTile.pos)
                                actions.add(unit.move(dir))
                            }
                        }
                    }
                }
            }

            // you can add debug annotations using the static methods of the Annotate class.
            // actions.add(Annotate.circle(0, 0));
            /** AI Code Goes Above!  */
            /** Do not edit!  */
            val commandBuilder = StringBuilder("")
            for (i in actions.indices) {
                if (i != 0) {
                    commandBuilder.append(",")
                }
                commandBuilder.append(actions[i])
            }
            println(commandBuilder.toString())
            // end turn
            agent.endTurn()
        }
    }
}
