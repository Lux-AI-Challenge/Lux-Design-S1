package lux;

public enum IOConstants {
    DONE("D_DONE"), RESEARCH_POINTS("rp"), RESOURCES("r"), UNITS("u"), CITY("c"), CITY_TILES("ct"), CELL_COOLDOWN("ccd");
    public String str;

    IOConstants(final String s) {
        this.str = s;
    }

    @Override
    public String toString() {
        return this.str;
    }
}