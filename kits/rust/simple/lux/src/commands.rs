use std::{fmt, str};

use crate::*;

/// Contains Lux Ai API commands definitions
pub struct Commands {}

impl Commands {
    /// Input city
    pub const CITY: &'static str = "c";
    /// Input city tile
    pub const CITY_TILES: &'static str = "ct";
    /// Input done
    pub const DONE: &'static str = "D_DONE";
    /// Output actions finished
    pub const FINISH: &'static str = "D_FINISH";
    /// Input researched points
    pub const RESEARCH_POINTS: &'static str = "rp";
    /// Input resource on tile
    pub const RESOURCES: &'static str = "r";
    /// Input road on tile
    pub const ROADS: &'static str = "ccd";
    /// Input unit on tile
    pub const UNITS: &'static str = "u";
}

impl Commands {
    /// Annotate circle on point
    pub const ANNOTATE_CIRCLE: &'static str = "dc";
    /// Annotate cross on point
    pub const ANNOTATE_CROSS: &'static str = "dx";
    /// Annotate line between two pooints
    pub const ANNOTATE_LINE: &'static str = "dl";
    /// Annotate text on point
    pub const ANNOTATE_SIDE_TEXT: &'static str = "dst";
    /// Annotate side text
    pub const ANNOTATE_TEXT: &'static str = "dt";
}

impl Commands {
    /// Action to build cart
    pub const BUILD_CART: &'static str = "bc";
    /// Action to build city
    pub const BUILD_CITY: &'static str = "bcity";
    /// Action to build worker
    pub const BUILD_WORKER: &'static str = "bw";
    /// Action to move unit
    pub const MOVE: &'static str = "m";
    /// Action to pillage road
    pub const PILLAGE: &'static str = "p";
    /// Action to research for city tile
    pub const RESEARCH: &'static str = "r";
    /// Action to transfer from unit to adjacent unit
    pub const TRANSFER: &'static str = "t";
}

/// Command argument or token
pub type CommandArgument = String;

/// Represents input command from Lux AI API environment
#[derive(fmt::Debug, PartialEq, Eq)]
pub struct Command {
    /// Command arguments
    pub arguments: Vec<CommandArgument>,
}

impl Command {
    /// Create command representation from line, parse into tokens
    ///
    /// # Parameters
    ///
    /// - `plain` - line containing `Command`
    ///
    /// # Returns
    ///
    /// Command with parsed `CommandArgument` arguments
    pub fn new(plain: String) -> Self {
        let tokens = plain.split_whitespace().map(|s| s.to_string()).collect();
        Self { arguments: tokens }
    }

    /// Returns argument converting into type `T` at position `argument_idx`
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `argument_idx` - index of argument to return (0 - for command type, 1
    ///   .. inf - for other)
    ///
    /// # Type parameters
    ///
    /// - `T` - type to convert argument to
    ///
    /// # Returns
    ///
    /// Argument converted to `T` type at position `argument_idx` or error
    pub fn argument<T: str::FromStr>(&self, argument_idx: usize) -> LuxAiResult<T> {
        let argument = self.arguments[argument_idx]
            .parse::<T>()
            .map_err(|_| LuxAiError::CommandFormat(self.arguments.clone()))?;
        Ok(argument)
    }

    /// Validates command to have exaclty `arguments_count` arguments (including
    /// command type)
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    /// - `arguments_count` - count of arguments
    ///
    /// # Returns
    /// 
    /// Nothing or error if argument count is not equal to `arguments_count`
    pub fn expect_arguments(&self, arguments_count: usize) -> LuxAiResult {
        if self.arguments.len() != arguments_count {
            Err(LuxAiError::CommandFormat(self.arguments.clone()))
        } else {
            Ok(())
        }
    }
}
