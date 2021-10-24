use std::{convert::{Into, TryFrom},
          fmt,
          ops::{Index, IndexMut},
          str};

use serde::{Deserialize, Serialize};

use crate::*;

/// Cargo - map of resource amounts by resource type
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#Resources>
#[derive(Clone, Copy, Default, fmt::Debug)]
pub struct Cargo {
    /// Amount of wood held by Unit
    pub wood:    ResourceAmount,
    /// Amount of coal held by Unit
    pub coal:    ResourceAmount,
    /// Amount of uranium held by Unit
    pub uranium: ResourceAmount,
}

impl Index<ResourceType> for Cargo {
    type Output = ResourceAmount;

    /// Returns amount of resource for given [`ResourceType`]
    ///
    /// # Arguments:
    ///
    /// - `self` - reference to Self
    /// - `resource_type` - type of [`Resource`]
    ///
    /// Returns:
    ///
    /// [`ResourceAmount`]
    fn index(&self, resource_type: ResourceType) -> &Self::Output {
        match resource_type {
            ResourceType::Wood => &self.wood,
            ResourceType::Coal => &self.coal,
            ResourceType::Uranium => &self.uranium,
        }
    }
}

impl IndexMut<ResourceType> for Cargo {
    /// Returns mutable reference to amount of resource for given
    /// [`ResourceType`]
    ///
    /// # Arguments:
    ///
    /// - `self` - reference to Self
    /// - `resource_type` - type of [`Resource`]
    ///
    /// Returns:
    ///
    /// mutable reference to [`ResourceAmount`]
    fn index_mut(&mut self, resource_type: ResourceType) -> &mut Self::Output {
        match resource_type {
            ResourceType::Wood => &mut self.wood,
            ResourceType::Coal => &mut self.coal,
            ResourceType::Uranium => &mut self.uranium,
        }
    }
}

/// Represents type of Unit
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#Units>
#[derive(Eq, PartialEq, Clone, Copy, fmt::Debug, Hash, Serialize, Deserialize)]
#[serde(try_from = "String", into = "String")]
pub enum UnitType {
    /// Worker unit
    Worker,
    /// Cart unit
    Cart,
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
impl TryFrom<String> for UnitType {
    type Error = LuxAiError;

    fn try_from(string: String) -> Result<Self, Self::Error> {
        let value = match string.as_str() {
            "WORKER" => Self::Worker,
            "CART" => Self::Cart,
            _ => Err(Self::Error::UnknownUnit(string.to_string()))?,
        };
        Ok(value)
    }
}

/// Convert into SCREAMING_SNAKE_CASE string
impl Into<String> for UnitType {
    fn into(self) -> String {
        match self {
            Self::Worker => "WORKER".to_string(),
            Self::Cart => "CART".to_string(),
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
    /// # Arguments
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// [`ResourceAmount`] that given unit type can hold
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Units>
    pub fn cargo_space_available(&self) -> ResourceAmount {
        GAME_CONSTANTS.parameters.resource_capacity[self]
    }
}

/// Represents Unit on [`GameMap`]
#[derive(Clone, fmt::Debug)]
pub struct Unit {
    /// [`Position`] of unit on 2D grid
    pub pos: Position,

    /// Team, whom unit belongs to
    pub team: TeamId,

    /// Unit id, used in command arguments
    pub id: EntityId,

    /// Amount of turns to next action
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Cooldown>
    pub cooldown: Cooldown,

    /// [`Cargo`], map amount of resources by types
    pub cargo: Cargo,

    /// Type of unit
    pub unit_type: UnitType,
}

impl Unit {
    /// Creates new [`CityTile`]
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
    /// A new created [`Unit`]
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Units>
    pub fn new(
        team: TeamId, unit_type: UnitType, id: EntityId, pos: Position, cooldown: Cooldown,
    ) -> Self {
        Self {
            team,
            unit_type,
            id,
            pos,
            cooldown,
            cargo: Cargo::default(),
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
    /// Cargo space used by all resources, [`ResourceAmount`]
    pub fn cargo_space_used(&self) -> ResourceAmount {
        ResourceType::VALUES
            .into_iter()
            .map(|resource_type| self.cargo[resource_type])
            .sum()
    }

    /// Returns free cargo space (space available - space used)
    ///
    /// Note that any Resource takes up the same space, e.g. 70 wood takes up as
    /// much space as 70 uranium, but 70 uranium would produce much more fuel
    /// than wood when deposited at a City
    ///
    /// # Parameters
    ///
    /// - `self` - Self  reference
    ///
    /// # Returns
    ///
    /// Free cargo space, [`ResourceAmount`]
    pub fn get_cargo_space_left(&self) -> ResourceAmount {
        self.unit_type.cargo_space_available() - self.cargo_space_used()
    }

    /// Check if [`Unit`] can perform action, i.e. cooldown is less than 1
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
    pub fn can_act(&self) -> bool { self.cooldown < 1.0 }

    /// Check if Unit can build [`CityTile`], i.e. cooldown is less than 1 and
    /// unit is worker and cell not has resource and amount of resources is
    /// greater than needed
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    /// - `game_map` - reference to [`GameMap`]
    ///
    /// # Returns
    ///
    /// `true` if the [`Unit`] can build a [`City`] on the tile it is on now.
    pub fn can_build(&self, game_map: &GameMap) -> bool {
        let ref cell = game_map[self.pos];
        self.unit_type == UnitType::Worker &&
            !cell.has_resource() &&
            self.can_act() &&
            self.cargo_space_used() >= City::city_build_cost()
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
        let ref cell = game_map[self.pos];
        self.unit_type == UnitType::Worker && self.can_act() && cell.road > 0.0
    }

    /// Returns action to move unit to given `direction`
    ///
    /// When applied, Unit will move in the specified direction by one Unit,
    /// provided there are no other units in the way or opposition cities.
    /// (Units can stack on top of each other however when over a friendly City)
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    /// - `direction` - [`Direction`] to move to
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn move_(&self, direction: Direction) -> Action {
        format!("{} {} {}", Commands::MOVE, self.id, direction.to_argument())
    }

    /// Returns action to transfer resource to other (`to_unit`) [`Unit`]
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    /// - `to_unit` - [`Unit`] reference, transfered to
    /// - `resource_type` - [`ResourceType`] of transfering resource
    /// - `resource_amount` - [`ResourceAmount`] of transfering resource
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn transfer(
        &self, to_unit: &Unit, resource_type: ResourceType, resource_amount: ResourceAmount,
    ) -> Action {
        format!(
            "{} {} {} {} {}",
            Commands::TRANSFER,
            self.id,
            to_unit.id,
            resource_type.to_argument(),
            resource_amount
        )
    }

    /// Returns action to build [`City`]
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn build_city(&self) -> Action { format!("{} {}", Commands::BUILD_CITY, self.id) }

    /// Returns action to pillage road
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn pillage(&self) -> Action { format!("{} {}", Commands::PILLAGE, self.id) }
}
