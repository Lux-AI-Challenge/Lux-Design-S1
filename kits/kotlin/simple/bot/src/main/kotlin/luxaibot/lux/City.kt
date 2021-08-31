package luxaibot.lux

import java.util.ArrayList

class City(var team: Int, var cityid: String, var fuel: Double, lightUpKeep: Double) {
    var citytiles: ArrayList<CityTile> = ArrayList<CityTile>()
    var lightUpkeep = 0.0

    fun _add_city_tile(x: Int, y: Int, cooldown: Double): CityTile {
        val ct = CityTile(team, cityid, x, y, cooldown)
        citytiles.add(ct)
        return ct
    }

    init {
        lightUpkeep = lightUpKeep
    }
}
