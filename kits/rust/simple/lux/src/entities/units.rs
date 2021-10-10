use std::{collections::HashMap,
          convert::{From, Into},
          fmt, str};

use serde::{Deserialize, Serialize};

use crate::*;

/// Cargo - map of resource amounts by resource type
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#Resources>
pub type Cargo = HashMap<ResourceType, ResourceAmount>;

/// Represents type of Unit
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#Units>
#[derive(Eq, PartialEq, Clone, fmt::Debug, Hash, Serialize, Deserialize)]
#[serde(from = "String", into = "String")]
pub enum UnitType {
    /// Worker unit
    Worker,
    /// Cart unit
    Cart,

    /// Not yet known unit (in case of extensibility)
    Unknown(String),
}

/// Convert from command argument
impl str::FromStr for UnitType {
    type Err = LuxAiError;

    fn from_str(string: &str) -> Result<Self, Self::Err> {
        let value = match string {
            "0" => Self::Worker,
            "1" => Self::Cart,
            _ => Err(Self::Err::UnknownUnit(string.to_string()))?,
        };
        Ok(value)
    }
}

/// Convert from SCREAMING_SNAKE_CASE string
impl From<String> for UnitType {
    fn from(string: String) -> Self {
        match string.as_str() {
            "WORKER" => Self::Worker,
            "CART" => Self::Cart,
            _ => Self::Unknown(string),
        }
    }
}

/// Convert into SCREAMING_SNAKE_CASE string
impl Into<String> for UnitType {
    fn into(self) -> String {
        match self {
            Self::Worker => "WORKER".to_string(),
            Self::Cart => "CART".to_string(),
            Self::Unknown(code) => code.to_string(),
        }
    }
}

impl UnitType {
    /// Returns cargo space available for unit
    ///
    /// # Examples
    ///
    /// ```
    /// let space = UnitType::Worker::cargo_space_available(); 
    /// ```
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Units>
    pub fn cargo_space_available(&self) -> ResourceAmount {
        GAME_CONSTANTS.parameters.resource_capacity[self]
    }
}

/// Represents Unit on `GameMap`
#[derive(Clone, fmt::Debug)]
pub struct Unit {
    /// `Position` of unit on 2D grid
    pub position:  Position,
    /// Team, whom unit belongs to
    pub team_id:   TeamId,
    /// Unit id, used in command arguments
    pub unit_id:   EntityId,
    /// Amount of turns to next action
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Cooldown>
    pub cooldown:  TurnAmount,
    /// Cargo, map amount of resources by types
    pub cargo:     Cargo,
    /// Type of unit
    pub unit_type: UnitType,
}

impl Unit {
    /// Creates new `CityTile`
    ///
    /// # Parameters
    ///
    /// - `team_id` - Team id, whom this city belongs to
    /// - `unit_type` - Unit type of
    /// - `unit_id` - Unit id used as command arguments
    /// - `position` - Where city tile is located
    /// - `cooldown` - turns to next action
    ///
    /// # Returns
    ///
    /// A new created `Unit`
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Units>
    pub fn new(
        team_id: TeamId, unit_type: UnitType, unit_id: EntityId, position: Position,
        cooldown: TurnAmount,
    ) -> Self {
        Self {
            team_id,
            unit_type,
            unit_id,
            position,
            cooldown,
            cargo: Cargo::new(),
        }
    }

    /// Returns sum of all resource amounts in Unit's cargo
    ///
    /// # Parameters
    ///
    /// - `self` - Self  reference
    ///
    /// # Returns
    ///
    /// Cargo space used by all resources, `ResourceAmount`
    pub fn cargo_space_used(&self) -> ResourceAmount { self.cargo.values().sum() }

    /// Returns cargo space available for unit
    ///
    /// # Parameters
    ///
    /// - `self` - Self  reference
    ///
    /// # Returns
    ///
    /// `ResourceAmount`
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Units>
    pub fn cargo_space_available(&self) -> ResourceAmount { self.unit_type.cargo_space_available() }

    /// Returns free cargo space (space available - space used)
    ///
    /// # Parameters
    ///
    /// - `self` - Self  reference
    ///
    /// # Returns
    ///
    /// Free cargo space, `ResourceAmount`
    pub fn cargo_space_left(&self) -> ResourceAmount {
        self.cargo_space_available() - self.cargo_space_used()
    }

    /// Check if Unit can perform action, i.e. cooldown is 0
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// `bool` value
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Cooldown>
    pub fn can_act(&self) -> bool { self.cooldown < 1 }

    /// Check if Unit can build CityTile, i.e. cooldown is 0 and unit is worker
    /// and cell not has resource and amount of resources is greater than
    /// needed
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    /// - `game_map` - reference to `GameMap`
    ///
    /// # Returns
    ///
    /// `bool` value
    pub fn can_build(&self, game_map: &GameMap) -> bool {
        let ref cell = game_map[self.position];
        self.unit_type == UnitType::Worker &&
            !cell.has_resource() &&
            self.can_act() &&
            self.cargo_space_used() > City::city_build_cost()
    }

    /// Check if Unit can pillage road, i.e. cooldown is 0 and unit is worker
    /// and road development progress > 0
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    /// - `game_map` - reference to `GameMap`
    ///
    /// # Returns
    ///
    /// `bool` value
    pub fn can_pillage(&self, game_map: &GameMap) -> bool {
        let ref cell = game_map[self.position];
        self.unit_type == UnitType::Worker && self.can_act() && cell.road_progress > 0.0
    }

    /// Command to move unit to given `direction`
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    /// - `direction` - `Direction` to move to
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn move_command(&self, direction: Direction) -> String {
        format!(
            "{} {} {}",
            Commands::MOVE,
            self.unit_id,
            direction.to_argument()
        )
    }

    /// Command to transfer resource to other unit
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    /// - `to_unit` - `Unit` reference, transfered to
    /// - `resource` - reference to tranfering `Resource`
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn transfer_command(&self, to_unit: &Unit, resource: &Resource) -> String {
        format!(
            "{} {} {} {}",
            Commands::TRANSFER,
            self.unit_id,
            to_unit.unit_id,
            resource.to_argument(),
        )
    }

    /// Command to build city
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn build_city_command(&self) -> String {
        format!("{} {}", Commands::BUILD_CITY, self.unit_id)
    }

    /// Command to pillage road
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn pillage_command(&self) -> String { format!("{} {}", Commands::PILLAGE, self.unit_id) }
}
