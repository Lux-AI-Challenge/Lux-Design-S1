pub mod agent;
pub mod amounts;
pub mod annotate;
pub mod commands;
pub mod entities;
pub mod environment;
pub mod game_constants;

use std::{fmt, io, result};

use serde::{Deserialize, Serialize};

pub use self::{agent::*, amounts::*, annotate::*, commands::*, entities::*, environment::*,
               game_constants::*};

/// Count of teams participating in match
pub const TEAM_COUNT: TeamId = 2;

/// Represents generic error related to Lux Ai API crate
#[derive(thiserror::Error, Debug)]
pub enum LuxAiError {
    /// I/O error
    #[error("Input/Output error: ")]
    InputOutput(#[from] io::Error),

    /// Unknown Command format
    #[error("Command format error: {0:?}")]
    CommandFormat(Vec<String>),

    /// City not exists, Command semantic error
    #[error("City not exists: {0}")]
    CityNotExists(String),

    /// Resource not exists, Command semantic error
    #[error("Unknown resource: {0}")]
    UnknownResource(String),

    /// Object Type not exists, Command semantic error
    #[error("Unknown object type: {0}")]
    UnknownObjectType(String),

    /// Unit not exists, Command semantic error
    #[error("Unknown unit: {0}")]
    UnknownUnit(String),

    /// Empty input, to handle end of match
    #[error("Empty input error")]
    EmptyInput,
}

/// Result of action containing value of maybe `LuxAiError`
pub type LuxAiResult<T = ()> = result::Result<T, LuxAiError>;

/// Team id (0 or 1) used in command arguments
pub type TeamId = u8;

/// Entity id used in command arguments for identification objects (units and
/// cities)
pub type EntityId = String;

/// Direction of `GameMap` 2D grid
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#The%20Map>
#[derive(Serialize, Deserialize, Eq, PartialEq, Clone, Copy, fmt::Debug, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Direction {
    /// North, (0, -1) in (x, y) representation
    North,
    /// West, (-1, 0) in (x, y) representation
    West,
    /// West, (+1, 0) in (x, y) representation
    East,
    /// South, (0, +1) in (x, y) representation
    South,
    /// Center, (0, 0) in (x, y) representation
    Center,
}

impl Direction {
    /// Contains all relative directions (North, South, West, East)
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub const DIRECTIONS: [Direction; 4] = [Self::North, Self::West, Self::East, Self::South];

    /// Converts into command argument
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Returns
    ///
    /// Argument string - first lowercase letter representation from
    /// `GAME_CONSTANTS.directions`
    pub fn to_argument(&self) -> String { GAME_CONSTANTS.directions[self].clone() }
}
