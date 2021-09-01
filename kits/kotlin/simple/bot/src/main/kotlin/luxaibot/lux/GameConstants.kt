package luxaibot.lux

// TODO: automate converting json to this format
class GameConstants {
    object UNIT_TYPES {
        const val WORKER = 0
        const val CART = 1
    }

    object RESOURCE_TYPES {
        const val WOOD = "wood"
        const val COAL = "coal"
        const val URANIUM = "uranium"
    }

    object PARAMETERS {
        const val DAY_LENGTH = 30
        const val NIGHT_LENGTH = 10
        const val MAX_DAYS = 360
        const val WOOD_GROWTH_RATE = 1.025
        const val MAX_WOOD_AMOUNT = 500
        const val CITY_ADJACENCY_BONUS = 5
        const val CITY_BUILD_COST = 100
        const val CITY_ACTION_COOLDOWN = 10
        const val MAX_ROAD = 6.0
        const val MIN_ROAD = 0.0
        const val CART_ROAD_DEVELOPMENT_RATE = 0.75
        const val PILLAGE_RATE = 0.5

        object LIGHT_UPKEEP {
            const val CITY = 23
            const val WORKER = 4
            const val CART = 10
        }

        object RESOURCE_CAPACITY {
            const val WORKER = 100
            const val CART = 2000
        }

        object WORKER_COLLECTION_RATE {
            const val WOOD = 20
            const val COAL = 5
            const val URANIUM = 2
        }

        object RESOURCE_TO_FUEL_RATE {
            const val WOOD = 1
            const val COAL = 10
            const val URANIUM = 40
        }

        object RESEARCH_REQUIREMENTS {
            const val COAL = 50
            const val URANIUM = 200
        }

        object UNIT_ACTION_COOLDOWN {
            const val CART = 3
            const val WORKER = 2
        }
    }
}
