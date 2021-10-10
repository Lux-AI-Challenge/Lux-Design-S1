use std::{convert::{TryFrom, TryInto},
          fmt};

use crate::*;

/// Represents `GameMap` coordinate (x or y)
pub type Coordinate = i32;

/// Represents position of `GameMapCell` on `GameMap` 2D grid
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#The%20Map>
#[derive(Eq, PartialEq, Clone, Copy, fmt::Debug)]
pub struct Position {
    /// X coordinate
    pub x: Coordinate,
    /// Y coordinate
    pub y: Coordinate,
}

/// Default for Position is no existing: (-1, -1)
impl Default for Position {
    fn default() -> Self { Self::new(-1, -1) }
}

impl fmt::Display for Position {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { write!(f, "({}, {})", self.x, self.y) }
}

impl Position {
    /// Creates `Position` with given X and Y `Coordinate`
    ///
    /// # Parameters
    ///
    /// - `x` - X coordinate
    /// - `y` - Y coordinate
    ///
    /// # Type parameters
    ///
    /// - `T` - type of coordinates
    ///
    /// # Returns
    ///
    /// `Position` with set coordinates
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn new<T: TryInto<Coordinate> + TryFrom<Coordinate>>(x: T, y: T) -> Self
    where
        <T as TryFrom<Coordinate>>::Error: fmt::Debug,
        <T as TryInto<Coordinate>>::Error: fmt::Debug,
    {
        Self {
            x: x.try_into().unwrap(),
            y: y.try_into().unwrap(),
        }
    }

    /// Translate `Position` in given `Direction` by `units`
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference (Position to translate)
    /// - `direction` - Direction to translate to
    /// - `units` - amount of tiles to translate to
    ///
    /// # Returns
    ///
    /// Translated `Position`
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn translate(&self, direction: Direction, units: Coordinate) -> Self {
        match direction {
            Direction::North => Self::new(self.x, self.y - units),
            Direction::East => Self::new(self.x + units, self.y),
            Direction::South => Self::new(self.x, self.y + units),
            Direction::West => Self::new(self.x - units, self.y),
            Direction::Center => self.clone(),
        }
    }

    /// `Direction` (relative to `self`) pointing to nearest to `target` tile
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference (Position relative to)
    /// - `position` - `Position` to find direction to
    ///
    /// # Returns
    ///
    /// `Direction` which points to `target`
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn direction_to(&self, target: Position) -> Direction {
        let mut closest_direction = Direction::Center;
        let mut closest_distance = target.distance_to(*self);
        for direction in Direction::DIRECTIONS {
            let new_position = self.translate(direction, 1);
            let distance = target.distance_to(new_position);
            if distance < closest_distance {
                closest_direction = direction;
                closest_distance = distance;
            }
        }
        closest_direction
    }

    /// Amount of moves from `self` to `other`
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference (Position from which to measure)
    /// - `other` - `Position` to which to measure
    ///
    /// # Returns
    ///
    /// Amount of moves from one tile to other
    ///
    /// # See also
    ///
    /// Check <https://en.wikipedia.org/wiki/Taxicab_geometry>
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn distance_to(&self, other: Self) -> i32 {
        (self.x - other.x).abs() + (self.y - other.y).abs()
    }

    /// Checks if two tiles adjacent or equal
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `other` - `Position` to check
    ///
    /// # Returns
    ///
    /// `True` if `self` and `other` adjacent or equal
    ///
    /// # See also
    ///
    /// Check <https://en.wikipedia.org/wiki/Taxicab_geometry>
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn is_adjacent(&self, other: Self) -> bool { self.distance_to(other) <= 1 }

    /// Convert to command argument
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Returns
    ///
    /// Command argument - coordinates delimited by space
    pub fn to_argument(&self) -> String { format!("{} {}", self.x, self.y) }
}
