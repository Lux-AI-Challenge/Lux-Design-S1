package luxaibot.lux

class GameState {
    var map: GameMap? = null
    var turn = 0
    var id = 0
    var players: Array<Player> = arrayOf<Player>(Player(0), Player(1))
}
