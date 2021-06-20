package lux;

// TODO: automate converting json to this format
public final class GameConstants {
    static class UNIT_TYPES { 
      static final int WORKER = 0;
      static final int CART = 1;
    }
    static class PARAMETERS {
      static final int DAY_LENGTH = 20;
      static final int NIGHT_LENGTH = 5;
      static final int MAX_DAYS = 200;
      static class LIGHT_UPKEEP {
        static final int CITY = 40;
        static final int WORKER = 4;
        static final int CART = 10;
      }
      static final int CITY_ADJACENCY_BONUS = 10;
      static final int CITY_WOOD_COST = 100;
      static class RESOURCE_CAPACITY {
        static final int WORKER = 100;
        static final int CART = 2000;
      }
      static class WORKER_COLLECTION_RATE {
        static final int WOOD = 20;
        static final int COAL = 10;
        static final int URANIUM = 1;
      }
      static class RESOURCE_TO_FUEL_RATE {
        static final int WOOD = 1;
        static final int COAL = 5;
        static final int URANIUM = 25;
      } 
      static class RESEARCH_REQUIREMENTS {
        static final int COAL = 40;
        static final int URANIUM = 100;
      }
      static final int CITY_ACTION_COOLDOWN = 10;
      static class UNIT_ACTION_COOLDOWN {
        static final int CART = 3;
        static final int WORKER = 2;
      }
      static final double MAX_CELL_COOLDOWN = 6;
      static final double MIN_CELL_COOLDOWN = 0;
      static final double CART_ROAD_DEVELOPMENT_RATE = 0.5;
      static final double PILLAGE_RATE = 0.25;
    }
}
