use std::{cmp, fmt, str};

use serde::{Deserialize, Serialize};

use crate::*;

/// Represents amount of resource
pub type ResourceAmount = i32;

/// Represents type of resource (Wood, Coal or Uranium)
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#Resources>
#[derive(Serialize, Deserialize, Eq, PartialEq, Clone, Copy, fmt::Debug, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ResourceType {
    /// Wood resource
    Wood,
    /// Coal resource
    Coal,
    /// Uranium resource
    Uranium,
}

/// Convert from command argument into `ResourceType`
impl str::FromStr for ResourceType {
    type Err = LuxAiError;

    fn from_str(string: &str) -> Result<Self, Self::Err> {
        let value = match string.to_lowercase().as_str() {
            "wood" => Self::Wood,
            "coal" => Self::Coal,
            "uranium" => Self::Uranium,
            _ => Err(Self::Err::UnknownResource(string.to_string()))?,
        };
        Ok(value)
    }
}

impl ResourceType {
    /// All known types of `ResourceType` (Wood, Coal, Uranium)
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub const VALUES: [Self; 3] = [Self::Wood, Self::Coal, Self::Uranium];

    /// Converts into command argument
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Returns
    ///
    /// Argument string - snake_case representation from
    /// `GAME_CONSTANTS.resource_types`
    pub fn to_argument(&self) -> String { GAME_CONSTANTS.resource_types[self].clone() }

    /// Returns required research points earned to collect resource type
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Returns
    ///
    /// Amount of research points required
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub fn required_research_points(&self) -> ResearchPointAmount {
        let research_points = &GAME_CONSTANTS.parameters.research_requirements;
        research_points.get(self).cloned().unwrap_or(0)
    }
}

/// Represents amount of givent `ResourceType`
///
/// # See also
///
/// Check https://www.lux-ai.org/specs-2021#Resources<>
#[derive(PartialEq, Clone, fmt::Debug)]
pub struct Resource {
    /// Type of resource
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub resource_type: ResourceType,

    /// Amount of resource
    pub amount: ResourceAmount,
}

/// Compare `Resource` amounts of same type
impl PartialOrd for Resource {
    fn partial_cmp(&self, other: &Self) -> Option<cmp::Ordering> {
        if self.resource_type == other.resource_type {
            self.amount.partial_cmp(&other.amount)
        } else {
            None
        }
    }
}

impl Resource {
    /// Creates resource of given `resource_type` with given `amount`
    ///
    /// # Parameters
    ///
    /// - `resource_type` - `ResourceType` of resource
    /// - `amount` - amount of resource
    ///
    /// # Returns
    ///
    /// `Resource` of `ResourceType` with `ResourceAmount` amount
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub fn new(resource_type: ResourceType, amount: ResourceAmount) -> Self {
        Self {
            resource_type,
            amount,
        }
    }

    /// Converts into command argument
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Returns
    ///
    /// Argument string - resource type and amount separated by space
    pub fn to_argument(&self) -> String {
        format!("{} {}", self.resource_type.to_argument(), self.amount)
    }
}
