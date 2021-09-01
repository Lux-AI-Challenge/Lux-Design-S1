package luxaibot.lux

enum class Direction(val str: String) {
    NORTH("n"), EAST("e"), SOUTH("s"), WEST("w"), CENTER("c");

    override fun toString(): String {
        return str
    }
}
