use std::{cell::RefCell,
          convert::{From, Into, TryFrom},
          ops::{Index, IndexMut},
          rc::Rc};

use crate::*;

/// Represents Game object type, either unit or city
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#The%20Map>
#[derive(Eq, PartialEq, Clone, fmt::Debug, Hash, Deserialize, Serialize)]
#[serde(try_from = "String", into = "String")]
pub enum ObjectType {
    /// City tile
    City,

    /// Unit with type `UnitType`
    Unit(UnitType),
}

/// Try convert from SCREAMING_SNAKE_CASE string
impl TryFrom<String> for ObjectType {
    type Error = LuxAiError;

    fn try_from(string: String) -> result::Result<Self, Self::Error> {
        let value = match string.as_str() {
            "CITY" => Self::City,
            _ =>
                Self::Unit(
                    UnitType::try_from(string)
                        .map_err(|e| Self::Error::UnknownObjectType(e.to_string()))?,
                ),
        };
        Ok(value)
    }
}

/// Convert into SCREAMING_SNAKE_CASE string
impl Into<String> for ObjectType {
    fn into(self) -> String {
        match self {
            Self::City => "CITY".to_string(),
            Self::Unit(unit_type) => unit_type.into(),
        }
    }
}

/// Represents one Game Map tile
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#The%20Map>
#[derive(Default, Clone, fmt::Debug)]
pub struct Cell {
    /// [`Position`] of tile
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub pos: Position,

    /// [`Resource`] which located on this tile
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub resource: Option<Resource>,

    /// [`CityTile`] located on this tile
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    /// Check <https://www.lux-ai.org/specs-2021#CityTiles>
    pub citytile: Option<Rc<RefCell<CityTile>>>,

    /// Road development progress of this tile
    ///
    /// The amount of Cooldown subtracted from a Unit's Cooldown whenever they
    /// perform an action on this tile. If there are roads, the more developed
    /// the road, the higher this Cooldown rate value is. Note that a Unit will
    /// always gain a base Cooldown amount whenever any action is performed.
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    /// Check <https://www.lux-ai.org/specs-2021#Roads>
    pub road: RoadAmount,
}

impl Cell {
    /// Creates empty [`Cell`]
    ///
    /// # Parameters
    ///
    /// - `position` - [`Position`] of tile
    ///
    /// # Returns
    ///
    /// Created empty [`Cell`], with no [`Resource`], [`CityTile`], and zero
    /// road development progress
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn new(position: Position) -> Self {
        Self {
            pos: position,
            ..Self::default()
        }
    }

    /// Returns `true` if this [`Cell`] has a non-depleted [`Resource`], `false`
    /// otherwise
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
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub fn has_resource(&self) -> bool {
        self.resource
            .as_ref()
            .map_or(false, |resource| resource.amount > 0)
    }
}

/// Represents Game Map
///
/// The map is organized such that the top left corner of the map is at `(0, 0)`
/// and the bottom right is at `(width - 1, height - 1)`. The map is always
/// square.
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#The%20Map>
#[derive(fmt::Debug, Clone)]
pub struct GameMap {
    /// Width of Game Map (along the `X` direction)
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub width: Coordinate,

    /// Height of Game Map (along the `Y` direction)
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub height: Coordinate,

    /// A 2D array of Cell objects, defining the current state of the map.
    /// `map[y][x]` represents the cell at coordinates (x, y) with `map[0][0]`
    /// being the top left Cell.
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub map: Vec<Vec<Cell>>,
}

/// Access [cells][`Cell`] by [`Position`]
impl Index<Position> for GameMap {
    type Output = Cell;

    /// Returns the [`Cell`] at the given `position`
    ///
    /// # Example
    ///
    /// ```
    /// let position = Position::new(1, 2);
    /// let cell = game_map[position];
    /// ```
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `position` - [`Position`] to get [`Cell`] from
    ///
    /// # Returns
    ///
    /// Reference to [`Cell`]
    fn index(&self, position: Position) -> &Self::Output {
        &self.map[position.y as usize][position.x as usize]
    }
}

/// Access [cells][`Cell`] by [`Position`]
impl IndexMut<Position> for GameMap {
    /// Returns the [`Cell`] at the given `position`
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `position` - [`Position`] to get [`Cell`] from
    ///
    /// # Returns
    ///
    /// Reference to [`Cell`]
    fn index_mut(&mut self, position: Position) -> &mut Self::Output {
        &mut self.map[position.y as usize][position.x as usize]
    }
}

impl GameMap {
    /// Creates empty `GameMap` with given `dimensions`
    ///
    /// # Parameters
    ///
    /// - `width` - the width of the map (along the x direction)
    /// - `height` - the height of the map (along the y direction)
    ///
    /// # Returns
    ///
    /// Created empty `GameMap`, with no `Resource` or `CityTile`
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn new(width: Coordinate, height: Coordinate) -> Self {
        let map = Self::empty_map(width as usize, height as usize);
        Self { height, width, map }
    }

    /// Returns dimensions of [`GameMap`] 2D grid
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Type parameters
    ///
    /// - `T` - desired type of width and height
    ///
    /// # Returns
    ///
    /// Pair of `width` and `height` with desired type `T`
    pub fn dimensions<T: From<Coordinate>>(&self) -> (T, T) {
        (self.width.into(), self.height.into())
    }

    /// Returns height of 2D grid
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Type parameters
    ///
    /// - `T` - desired type of height
    ///
    /// # Returns
    ///
    /// `height` with desired type `T`
    pub fn height<T: From<Coordinate>>(&self) -> T { self.height.into() }

    /// Returns width of 2D grid
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Type parameters
    ///
    /// - `T` - desired type of width
    ///
    /// # Returns
    ///
    /// `width` with desired type `T`
    pub fn width<T: From<Coordinate>>(&self) -> T { self.width.into() }

    /// Clears [`GameMap`] cells from [`Resource`], [`CityTile`] and road tiles
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    ///
    /// # Returns
    ///
    /// Nothing
    pub fn reset_state(&mut self) {
        self.map = Self::empty_map(self.width as usize, self.height as usize);
    }

    /// Returns the [`Cell`] at the given `position`
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `position` - [`Position`] to get [`Cell`] from
    ///
    /// # Returns
    ///
    /// Reference to [`Cell`]
    pub fn get_cell_by_pos(&self, position: Position) -> &Cell {
        self.get_cell(position.x, position.y)
    }

    /// Returns the [`Cell`] at the given `position`
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `x` - x [coordinate][`Coordinate`] of cell
    /// - `y` - y [coordinate][`Coordinate`] of cell
    ///
    /// # Returns
    ///
    /// Reference to [`Cell`]
    pub fn get_cell(&self, x: Coordinate, y: Coordinate) -> &Cell {
        &self.map[y as usize][x as usize]
    }

    fn empty_map(width: usize, height: usize) -> Vec<Vec<Cell>> {
        let mut map = vec![vec![Cell::default(); width]; height];

        for x in 0..width {
            for y in 0..height {
                map[y][x].pos = Position::new(x as Coordinate, y as Coordinate);
            }
        }

        map
    }
}
