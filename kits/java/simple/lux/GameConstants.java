package lux;

// TODO: automate converting json to this format
public final class GameConstants {
    public static class UNIT_TYPES {
      public static final int WORKER = 0;
      public static final int CART = 1;
    }
    public static class RESOURCE_TYPES {
      public static final String WOOD = "wood";
      public static final String COAL = "coal";
      public static final String URANIUM = "uranium";
    }
    public static class PARAMETERS {
      public static final int DAY_LENGTH = 30;
      public static final int NIGHT_LENGTH = 10;
      public static final int MAX_DAYS = 360;
      public static class LIGHT_UPKEEP {
        public static final int CITY = 23;
        public static final int WORKER = 4;
        public static final int CART = 10;
      }
      public static final double WOOD_GROWTH_RATE = 1.025;
      public static final int MAX_WOOD_AMOUNT = 500;
      public static final int CITY_ADJACENCY_BONUS = 5;
      public static final int CITY_BUILD_COST = 100;
      public static class RESOURCE_CAPACITY {
        public static final int WORKER = 100;
        public static final int CART = 2000;
      }
      public static class WORKER_COLLECTION_RATE {
        public static final int WOOD = 20;
        public static final int COAL = 5;
        public static final int URANIUM = 2;
      }
      public static class RESOURCE_TO_FUEL_RATE {
        public static final int WOOD = 1;
        public static final int COAL = 10;
        public static final int URANIUM = 40;
      }
      public static class RESEARCH_REQUIREMENTS {
        public static final int COAL = 50;
        public static final int URANIUM = 200;
      }
      public static final int CITY_ACTION_COOLDOWN = 10;
      public static class UNIT_ACTION_COOLDOWN {
        public static final int CART = 3;
        public static final int WORKER = 2;
      }
      public static final double MAX_ROAD = 6;
      public static final double MIN_ROAD = 0;
      public static final double CART_ROAD_DEVELOPMENT_RATE = 0.75;
      public static final double PILLAGE_RATE = 0.5;
    }
}
