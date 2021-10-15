use std::{collections::HashMap, fmt};

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

use super::*;


/// Included `game_constants.json`
const GAME_CONSTANTS_JSON_STRING: &str = include_str!("game_constants.json");

/// Contains all parametes controlling game mechanics (day light turns, resource
/// capacity, and others)
///
/// In case of parameters changes please update
/// `./game_constants.json` and this struct
#[derive(Serialize, Deserialize, fmt::Debug)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub struct GameConstantsParameters {
    /// Day length in turns
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Day/Night%20Cycle>
    pub day_length: TurnAmount,

    /// Night length in turns
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Day/Night%20Cycle>
    pub night_length: TurnAmount,

    /// Max days in days
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Day/Night%20Cycle>
    pub max_days: DayAmount,

    /// Fuel amount for City tile or Unit to keep light for one turn
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Day/Night%20Cycle>
    pub light_upkeep: HashMap<ObjectType, FuelAmount>,

    /// Wood growth rate per one turn
    ///
    /// Each turn wood tile's wood amount increases by 2.5% of its current wood
    /// amount rounded up
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub wood_growth_rate: f32,

    /// Max wood amount per tile
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub max_wood_amount: ResourceAmount,

    /// How many total resources is required to build a city tile
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Units>
    pub city_build_cost: ResourceAmount,

    /// Bonus to light up keep fuel burn on adjacent friendly city tiles
    ///
    /// Used in formula:
    /// ```
    /// let city_tile_light_up_keep = light_upkeep[ObjectType::CityTile] - GAME_CONSTANTS.parameters.city_adjacency_bonus * "number of adjacent friendly CityTiles"
    /// ```
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Day/Night%20Cycle>
    pub city_adjacency_bonus: FuelAmount,

    /// How much amount of resource can unit hold in cargo
    ///
    /// # See also
    ///
    /// Chec <https://www.lux-ai.org/specs-2021#Units>
    pub resource_capacity: HashMap<UnitType, ResourceAmount>,

    /// How many resource units collected per turn for resource type
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub worker_collection_rate: HashMap<ResourceType, ResourceAmount>,

    /// Fuel from one unit of resoure
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub resource_to_fuel_rate: HashMap<ResourceType, FuelAmount>,

    /// How many research points is needed to gather resource of given type
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub research_requirements: HashMap<ResourceType, ResearchPointAmount>,

    /// City tile action cooldown
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Cooldown>
    pub city_action_cooldown: TurnAmount,

    /// Unit action cooldown
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Cooldown>
    pub unit_action_cooldown: HashMap<UnitType, TurnAmount>,

    /// Max road development level
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Roads>
    pub max_road: RoadAmount,

    /// Min road development level
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Roads>
    pub min_road: RoadAmount,

    /// How much Cart upgrades road development rate for one move
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Roads>
    pub cart_road_development_rate: RoadAmount,

    /// How much Worker pillage road in one turn
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Roads>
    pub pillage_rate: RoadAmount,
}

/// Contains game paramers along with several game object definitions
///
/// In case of game constants changes please update `./game_constants.json` and
/// this struct
#[derive(Serialize, Deserialize, fmt::Debug)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub struct GameConstants {
    /// Unit type encoding into internal Lux AI format
    ///
    /// Used in command arguments encoding
    pub unit_types: HashMap<UnitType, u8>,

    /// Resource types encoding into internal Lux AI format
    ///
    /// Used in command arguments encoding
    pub resource_types: HashMap<ResourceType, String>,

    /// Directions encoding into internal Lux AI format
    ///
    /// Used in command arguments encoding
    pub directions: HashMap<Direction, String>,

    /// Contains all game parameters
    pub parameters: GameConstantsParameters,
}

lazy_static! {
    /// Loaded and parsed game constants
    ///
    /// # Examples
    ///
    /// ```
    /// let max_days = lux_ai_api::GAME_CONSTANTS.parameters.max_days;
    /// let resource_capacity =
    /// lux_ai_api::GAME_CONSTANTS.parameters.resource_capacity[lux_ai_api::UnitType::Worker];
    /// ```
    ///
    /// NOTE: spec/values maybe outdated, to update upload new `game_constants.json` and update structs [GameConstants] and [GameConstantsParameters]
    ///
    /// # See also
    ///
    /// All described here: <https://www.lux-ai.org/specs-2021>
    pub static ref GAME_CONSTANTS: GameConstants = serde_json::from_str(GAME_CONSTANTS_JSON_STRING)
        .unwrap_or_else(|err| panic!("Cannot load game_constants.json: {}", err));
}
