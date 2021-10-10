use std::fmt;

use crate::*;

/// Represents City tile of given team at position
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#CityTiles>
#[derive(Clone, PartialEq, Eq, fmt::Debug)]
pub struct CityTile {
    /// City id used as command arguments
    pub city_id: EntityId,

    /// Team id, whom this city belongs to
    pub team_id: TeamId,

    /// Position of city tile on map
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub position: Position,

    /// Amount of turns to next action
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Cooldown>
    pub cooldown: TurnAmount,
}

impl CityTile {
    /// Creates new `CityTile`
    ///
    /// # Parameters
    ///
    /// - `team_id` - Team id, whom this city belongs to
    /// - `city_id` - City id used as command arguments
    /// - `position` - Where city tile is located
    /// - `cooldown` - turns to next action
    ///
    /// # Returns
    ///
    /// A new created `CityTile`
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#CityTiles>
    pub fn new(
        team_id: TeamId, city_id: EntityId, position: Position, cooldown: TurnAmount,
    ) -> Self {
        Self {
            team_id,
            city_id,
            position,
            cooldown,
        }
    }

    /// Check if CityTile can perform action, i.e. cooldown is 0
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

    /// Command to research
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// Action to perform
    ///
    /// # See also:
    ///
    /// Check <https://www.lux-ai.org/specs-2021#CityTiles>
    pub fn research_command(&self) -> Action {
        format!("{} {}", Commands::RESEARCH, self.position.to_argument())
    }

    /// Command to build worker
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// Action to perform
    ///
    /// # See also:
    ///
    /// Check <https://www.lux-ai.org/specs-2021#CityTiles>
    pub fn build_worker_command(&self) -> Action {
        format!("{} {}", Commands::BUILD_WORKER, self.position.to_argument())
    }

    /// Command to build cart
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// Action to perform
    ///
    /// # See also:
    ///
    /// Check <https://www.lux-ai.org/specs-2021#CityTiles>
    pub fn build_cart_command(&self) -> Action {
        format!("{} {}", Commands::BUILD_CART, self.position.to_argument())
    }
}
