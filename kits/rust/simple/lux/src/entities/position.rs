use std::{convert::{TryFrom, TryInto},
          fmt};

use crate::*;

/// Represents coordinate (x or y) on 2D grid
pub type Coordinate = i32;

/// Represents position on 2D grid
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
    /// Creates [`Position`] with given X and Y [`Coordinate`]
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
    /// [`Position`] with set coordinates
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

    /// Returns the [`Position`] equal to going in a `direction` `units` number
    /// of times from this [`Position`]
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference ([`Position `] to translate)
    /// - `direction` - [`Direction `] to translate to
    /// - `units` - amount of tiles to translate to
    ///
    /// # Returns
    ///
    /// Translated [`Position`]
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

    /// Returns the direction that would move you closest to `target` from this
    /// [`Position`] if you took a single step. In particular, will return
    /// [`Direction::Center`] if this [`Position`] is equal to the `target`.
    /// Note that this does not check for potential collisions with other
    /// units but serves as a basic pathfinding method
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference ([`Position`] relative to)
    /// - `target` - [`Position`] to find direction to
    ///
    /// # Returns
    ///
    /// [`Direction`] (relative to `self`) pointing to nearest to `target` tile
    ///
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn direction_to(&self, target: &Self) -> Direction {
        let mut closest_direction = Direction::Center;
        let mut closest_distance = target.distance_to(self);
        for direction in Direction::DIRECTIONS {
            let ref new_position = self.translate(direction, 1);
            let distance = target.distance_to(new_position);
            if distance < closest_distance {
                closest_direction = direction;
                closest_distance = distance;
            }
        }
        closest_direction
    }

    /// Returns [the Manhattan (rectilinear) distance](https://en.wikipedia.org/wiki/Taxicab_geometry) from this [`Position`] to `other` position
    ///
    /// # Parameters
    ///
    /// - `self` - Self value ([`Position`] from which to measure)
    /// - `other` - [`Position`] to which to measure
    ///
    /// # Returns
    ///
    /// Number of moves from one `self` position to `other`
    ///
    /// # See also
    ///
    /// Check <https://en.wikipedia.org/wiki/Taxicab_geometry>
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn distance_to(&self, other: &Self) -> f32 {
        let x_difference = (self.x - other.x).abs();
        let y_difference = (self.y - other.y).abs();
        (x_difference + y_difference) as f32
    }

    /// Returns `true` if this [`Position`] is adjacent or equal to `other`.
    /// `false` otherwise
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `other` - [`Position`] to check
    ///
    /// # Returns
    ///
    /// `true` if positions are adjacent
    ///
    /// # See also
    ///
    /// Check <https://en.wikipedia.org/wiki/Taxicab_geometry>
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn is_adjacent(&self, other: &Self) -> bool { self.distance_to(other) <= 1.0 }

    /// Returns `true` if this [`Position`] is equal to the `other` position
    /// object by checking `x`, `y` coordinates. `false` otherwise
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `other` - [`Position`] to compare with
    ///
    /// # Returns
    ///
    /// `true` if positions are equal
    pub fn equals(&self, other: &Self) -> bool { self == other }

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
