using System;

namespace Bot.Lux
{
	public class GameConstants
	{
		public static class UNIT_TYPES
		{
			public static int WORKER = 0;
			public static int CART = 1;
		}
		public static class RESOURCE_TYPES
		{
			public static String WOOD = "wood";
			public static String COAL = "coal";
			public static String URANIUM = "uranium";
		}
		public static class PARAMETERS
		{
			public static int DAY_LENGTH = 30;
			public static int NIGHT_LENGTH = 10;
			public static int MAX_DAYS = 360;
			public static class LIGHT_UPKEEP
			{
				public static int CITY = 23;
				public static int WORKER = 4;
				public static int CART = 10;
			}
			public static double WOOD_GROWTH_RATE = 1.025;
			public static int MAX_WOOD_AMOUNT = 500;
			public static int CITY_ADJACENCY_BONUS = 5;
			public static int CITY_BUILD_COST = 100;
			public static class RESOURCE_CAPACITY
			{
				public static int WORKER = 100;
				public static int CART = 2000;
			}
			public static class WORKER_COLLECTION_RATE
			{
				public static int WOOD = 20;
				public static int COAL = 5;
				public static int URANIUM = 2;
			}
			public static class RESOURCE_TO_FUEL_RATE
			{
				public static int WOOD = 1;
				public static int COAL = 10;
				public static int URANIUM = 40;
			}
			public static class RESEARCH_REQUIREMENTS
			{
				public static int COAL = 50;
				public static int URANIUM = 200;
			}
			public static int CITY_ACTION_COOLDOWN = 10;
			public static class UNIT_ACTION_COOLDOWN
			{
				public static int CART = 3;
				public static int WORKER = 2;
			}
			public static double MAX_ROAD = 6;
			public static double MIN_ROAD = 0;
			public static double CART_ROAD_DEVELOPMENT_RATE = 0.75;
			public static double PILLAGE_RATE = 0.5;
		}
	}
}
