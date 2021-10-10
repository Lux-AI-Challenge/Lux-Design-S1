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
pub struct GameMapCell {
    /// `Position` of tile
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub position: Position,

    /// `Resource` which located on this tile
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    /// Check <https://www.lux-ai.org/specs-2021#Resources>
    pub resource: Option<Resource>,

    /// `CityTile` located on this tile
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    /// Check <https://www.lux-ai.org/specs-2021#CityTiles>
    pub city_tile: Option<Rc<RefCell<CityTile>>>,

    /// Road development progress of this tile
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    /// Check <https://www.lux-ai.org/specs-2021#Roads>
    pub road_progress: RoadAmount,
}

impl GameMapCell {
    /// Creates empty `GameMapCell`
    ///
    /// # Parameters
    ///
    /// - `position` - `Position` of tile
    ///
    /// # Returns
    ///
    /// Created empty `GameMapCell`, with no `Resource`, `CityTile`, and zero
    /// road development progress
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn new(position: Position) -> Self {
        Self {
            position,
            ..Self::default()
        }
    }

    /// Checks if tile contains any `Resource`
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
            .map_or(false, |resource| resource.amount > 0.0f32)
    }
}

/// Represents dimensions of `GameMap` 2D grid
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#The%20Map>
pub type GameMapDimensions = (usize, usize);

/// Represents Game Map
///
/// # See also
///
/// Check <https://www.lux-ai.org/specs-2021#The%20Map>
#[derive(fmt::Debug, Clone)]
pub struct GameMap {
    /// Dimensions (width and height) of Game Map
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub dimensions: GameMapDimensions,

    /// 2D grid of `GameMapCell`
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub cells: Vec<Vec<GameMapCell>>,
}

/// Access `GameMap` by `Position`
impl Index<Position> for GameMap {
    type Output = GameMapCell;

    fn index(&self, position: Position) -> &Self::Output {
        &self.cells[position.y as usize][position.x as usize]
    }
}

/// Access `GameMap` by `Position`
impl IndexMut<Position> for GameMap {
    fn index_mut(&mut self, position: Position) -> &mut Self::Output {
        &mut self.cells[position.y as usize][position.x as usize]
    }
}

impl GameMap {
    /// Creates empty `GameMap` with given `dimensions`
    ///
    /// # Parameters
    ///
    /// - `dimensions` - `GameMapDimensions` of 2D grid
    ///
    /// # Returns
    ///
    /// Created empty `GameMap`, with no `Resource` or `CityTile`
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub fn new(dimensions: GameMapDimensions) -> Self {
        Self {
            dimensions,
            cells: Self::empty_cells_map(dimensions),
        }
    }

    /// Returns dimensions of `GameMap` 2D grid
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
    pub fn dimensions<T: From<usize>>(&self) -> (T, T) {
        let (width, height) = self.dimensions;

        (width.into(), height.into())
    }

    /// Returns height of `GameMap` 2D grid
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
    pub fn height<T: From<usize>>(&self) -> T {
        let (_, height) = self.dimensions;
        height.into()
    }

    /// Returns width of `GameMap` 2D grid
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
    pub fn width<T: From<usize>>(&self) -> T {
        let (width, _) = self.dimensions;
        width.into()
    }

    /// Clears `GameMap` cells from `Resource`, `CityTile` and road tiles
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    ///
    /// # Returns
    ///
    /// Nothing
    pub fn reset_state(&mut self) { self.cells = Self::empty_cells_map(self.dimensions); }

    fn empty_cells_map((width, height): GameMapDimensions) -> Vec<Vec<GameMapCell>> {
        let mut cells = vec![vec![GameMapCell::default(); width]; height];

        for x in 0..width {
            for y in 0..height {
                cells[y][x].position = Position::new(x as Coordinate, y as Coordinate);
            }
        }

        cells
    }
}
