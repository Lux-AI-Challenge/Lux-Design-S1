use std::fmt;

use crate::*;

/// Represents City tile of given team at position
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#CityTiles>
#[derive(Clone, PartialEq, fmt::Debug)]
pub struct CityTile {
    /// City id used as command arguments
    pub cityid: EntityId,

    /// Team id, whom this city belongs to
    pub teamid: TeamId,

    /// [`Position`] of city tile on map
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub pos: Position,

    /// Amount of turns to next action
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Cooldown>
    pub cooldown: Cooldown,
}

impl CityTile {
    /// Creates new [`CityTile`]
    ///
    /// # Parameters
    ///
    /// - `teamid` - Team id, whom this city belongs to
    /// - `cityid` - City id used as command arguments
    /// - `position` - Where city tile is located
    /// - `cooldown` - turns to next action
    ///
    /// # Returns
    ///
    /// A new created [`CityTile`]
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#CityTiles>
    pub fn new(teamid: TeamId, cityid: EntityId, position: Position, cooldown: Cooldown) -> Self {
        Self {
            teamid,
            cityid,
            pos: position,
            cooldown,
        }
    }

    /// Check if [`CityTile`] can perform action, i.e. cooldown is less than
    /// `1.0`
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

    /// Returns research action
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
    pub fn research(&self) -> Action {
        format!("{} {}", Commands::RESEARCH, self.pos.to_argument())
    }

    /// Returns build worker action. When applied and requirements are met, a
    /// worker will be built at the [`City`].
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
    pub fn build_worker(&self) -> Action {
        format!("{} {}", Commands::BUILD_WORKER, self.pos.to_argument())
    }

    /// Returns the build cart action. When applied and requirements are met, a
    /// cart will be built at the [`City`].
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
    pub fn build_cart(&self) -> Action {
        format!("{} {}", Commands::BUILD_CART, self.pos.to_argument())
    }
}
