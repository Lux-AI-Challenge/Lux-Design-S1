package luxaibot.lux

enum class IOConstants(val str: String) {
    DONE("D_DONE"), RESEARCH_POINTS("rp"), RESOURCES("r"), UNITS("u"), CITY("c"), CITY_TILES("ct"), ROADS("ccd");

    override fun toString(): String {
        return str
    }
}
