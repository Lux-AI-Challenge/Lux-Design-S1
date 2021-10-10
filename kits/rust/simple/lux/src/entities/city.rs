use std::{cell::RefCell, fmt, rc::Rc};

use crate::*;

/// Collection of adjacent city tiles `CityTiles` with same team id `TeamId`
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#CityTiles>
#[derive(Clone, fmt::Debug)]
pub struct City {
    /// City id used as command arguments
    pub city_id: EntityId,

    /// Team id, whom this city belongs to
    pub team_id: TeamId,

    /// Amount of fuel that city has
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub fuel: FuelAmount,

    /// List of city tiles
    pub city_tiles: Vec<Rc<RefCell<CityTile>>>,

    /// How many fuel required for city to live one turn more on night_length
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Day/Night%20Cycle>
    pub light_up_keep: FuelAmount,
}

impl City {
    /// Creates new City
    ///
    /// # Parameters
    ///
    /// - `team_id` - Team id, whom this city belongs to
    /// - `city_id` - City id used as command arguments
    /// - `fuel` - Amount of fuel that city has
    /// - `light_up_keep` - How many fuel required for city to live one turn
    ///   more on night_length. Check <https://www.lux-ai.org/specs-2021#Day/Night%20Cycle>
    ///
    /// # Returns
    ///
    /// A new created `City` with no `CityTile`
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#CityTiles>
    pub fn new(
        team_id: TeamId, city_id: EntityId, fuel: FuelAmount, light_up_keep: FuelAmount,
    ) -> Self {
        Self {
            team_id,
            city_id,
            fuel,
            city_tiles: vec![],
            light_up_keep,
        }
    }

    /// Add `CityTile` to the `City`
    ///
    /// # Parameters
    ///
    /// - `self` - mutable reference to Self
    /// - `position` - position of `CityTile`
    /// - `cooldown` - cooldown of `CityTile`
    ///
    /// # Returns
    ///
    /// Nothing
    pub fn add_city_tile(&mut self, position: Position, cooldown: TurnAmount) {
        let city_tile = CityTile::new(self.team_id, self.city_id.clone(), position, cooldown);
        self.city_tiles.push(Rc::new(RefCell::new(city_tile)));
    }

    /// How many resources required to build city
    ///
    /// # Arguments
    ///
    /// None
    ///
    /// # Returns
    ///
    /// `ResourceAmount` value
    pub fn city_build_cost() -> ResourceAmount { GAME_CONSTANTS.parameters.city_build_cost }
}
