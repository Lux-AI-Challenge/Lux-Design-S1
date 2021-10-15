use std::{collections::HashMap, fmt};

use crate::*;

/// Represents Player of given team
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#Environment>
#[derive(Clone, fmt::Debug, Default)]
pub struct Player {
    /// Researched points of [`Player`]
    pub research_points: ResearchPointAmount,

    /// [`Player`]'s team
    pub team: TeamId,

    /// List of [`Unit`] owned by current [`Player`]
    pub units: Vec<Unit>,

    /// Map of [`City`] by [`City`]'s id
    pub cities: HashMap<String, City>,

    /// Count of city tiles
    pub city_tile_count: u32,
}

impl Player {
    /// Creates new [`Player`]
    ///
    /// # Parameters
    ///
    /// - `team` - [`Player`]'s team id
    ///
    /// # Returns
    ///
    /// Created [`Player`] with zero research points and none cities and units
    ///
    /// # See also:
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Environment>
    pub fn new(team: TeamId) -> Self {
        Self {
            team,
            ..Self::default()
        }
    }

    /// Check if [`Player`] has enough research points to collect resources with
    /// [`ResourceType`]
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `resource_type` - resource type to check
    ///
    /// # Returns
    ///
    /// `bool` value
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub fn is_researched(&self, resource_type: ResourceType) -> bool {
        self.research_points >= resource_type.required_research_points()
    }

    /// Clear all units and cities for [`Player`]
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    ///
    /// # Returns
    ///
    /// Nothing
    pub fn reset_state(&mut self) {
        self.units = vec![];
        self.cities = Default::default();
        self.city_tile_count = 0;
    }

    /// Whether or not [`Player`] has enough research points to mine coal
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Returns
    ///
    /// `bool` value
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub fn researched_coal(&self) -> bool { self.is_researched(ResourceType::Coal) }

    /// Whether or not [`Player`] has enough research points to mine uranium
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Returns
    ///
    /// `bool` value
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub fn researched_uranium(&self) -> bool { self.is_researched(ResourceType::Uranium) }
}
