package luxaibot.lux

import java.util.ArrayList
import java.util.HashMap

data class Player(val team: Int) {
    var researchPoints = 0
    var units = ArrayList<Unit>()
    var cities = HashMap<String, City>()
    var cityTileCount = 0
    fun researchedCoal(): Boolean {
        return researchPoints >= GameConstants.PARAMETERS.RESEARCH_REQUIREMENTS.COAL
    }

    fun researchedUranium(): Boolean {
        return researchPoints >= GameConstants.PARAMETERS.RESEARCH_REQUIREMENTS.URANIUM
    }
}
