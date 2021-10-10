use std::{collections::HashMap, fmt};

use crate::*;

/// Represents Player of given team_id
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#Environment>
#[derive(Clone, fmt::Debug, Default)]
pub struct Player {
    /// Researched points of `Player`
    pub research_points: ResearchPointAmount,
    /// `Player`'s team
    pub team_id:         TeamId,
    /// List of `Unit` for `Player`
    pub units:           Vec<Unit>,
    /// Map of `City` by `City`'s id
    pub cities:          HashMap<String, City>,
    /// Count of city tiles
    pub city_tile_count: u32,
}

impl Player {
    /// Creates new `Player`
    ///
    /// # Parameters
    ///
    /// - `team_id` - Player's team_id
    ///
    /// # Returns
    ///
    /// Created `Player` with zero research points and none cities and unitss
    ///
    /// # See also:
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Environment>
    pub fn new(team_id: TeamId) -> Self {
        Self {
            team_id,
            ..Self::default()
        }
    }

    /// Check if `Player` has enough research points to collect resources with
    /// `ResourceType`
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
    pub fn is_researched(&self, resource_type: &ResourceType) -> bool {
        self.research_points >= resource_type.required_research_points()
    }

    /// Clear all units and cities for `Player`
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
}
