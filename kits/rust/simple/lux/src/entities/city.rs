use std::{cell::RefCell, fmt, rc::Rc};

use crate::*;

/// Collection of adjacent city tiles `CityTiles` with same team id `TeamId`
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#CityTiles>
#[derive(Clone, fmt::Debug)]
pub struct City {
    /// Id of this [`City`]. Each City id in the game is unique and will never
    /// be reused by new cities
    pub cityid: EntityId,

    /// Team id, whom this [`City`] belongs to
    pub teamid: TeamId,

    /// Amount of fuel that city has. This fuel is consumed by all
    /// [`CityTiles`][CityTile] in this [`City`] during each turn of night
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub fuel: FuelAmount,

    /// A list of [`CityTile`] objects that form this one City collectively. A
    /// City is defined as all [`CityTiles`][CityTile] that are connected
    /// via adjacent [`CityTiles`][CityTile].
    pub citytiles: Vec<Rc<RefCell<CityTile>>>,

    /// Light upkeep per turn of the City. Fuel in the City is subtracted by the
    /// light upkeep each turn of night.
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Day/Night%20Cycle>
    pub light_upkeep: FuelAmount,
}

impl City {
    /// Creates new [`City`]
    ///
    /// # Parameters
    ///
    /// - `teamid` - Team id, whom this city belongs to
    /// - `cityid` - City id used as command arguments
    /// - `fuel` - Amount of fuel that city has
    /// - `light_upkeep` - How many fuel required for city to live one turn more
    ///   on night_length. Check <https://www.lux-ai.org/specs-2021#Day/Night%20Cycle>
    ///
    /// # Returns
    ///
    /// A new created [`City`] with no [`CityTile`]
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#CityTiles>
    pub fn new(
        teamid: TeamId, cityid: EntityId, fuel: FuelAmount, light_upkeep: FuelAmount,
    ) -> Self {
        Self {
            teamid,
            cityid,
            fuel,
            citytiles: vec![],
            light_upkeep,
        }
    }

    /// Add [`CityTile`] to the [`City`]
    ///
    /// # Parameters
    ///
    /// - `self` - mutable reference to Self
    /// - `position` - [`Position`] of [`CityTile`]
    /// - `cooldown` - cooldown of [`City`]
    ///
    /// # Returns
    ///
    /// Nothing
    pub fn add_city_tile(&mut self, position: Position, cooldown: Cooldown) {
        let city_tile = CityTile::new(self.teamid, self.cityid.clone(), position, cooldown);
        self.citytiles.push(Rc::new(RefCell::new(city_tile)));
    }

    /// Light upkeep per turn of the [`City`]. Fuel in the [`City`] is
    /// subtracted by the light upkeep each turn of night.
    ///
    /// # Parameters
    ///
    /// - `self` - reference to Self
    ///
    /// # Returns
    ///
    /// Fuel amount
    pub fn get_light_upkeep(&self) -> FuelAmount { self.light_upkeep }

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
