use super::*;

/// Annotations namespace
pub struct Annotate {}

impl Annotate {
    /// Returns annotate circle action
    ///
    /// Will draw a unit sized circle on the visualizer at the current turn
    /// centered at the [`Cell`] at the given `x`, `y` coordinates
    ///
    /// # Parameters
    ///
    /// - `x` - x coordinate of point to add circle to
    /// - `y` - y coordinate of point to add circle to
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn circle(x: Coordinate, y: Coordinate) -> Action {
        format!("{} {} {}", Commands::ANNOTATE_CIRCLE, x, y)
    }

    /// Returns annotate circle action
    ///
    /// Will draw a unit sized circle on the visualizer at the current turn
    /// centered at the [`Cell`] at the given `position` point
    ///
    /// # Parameters
    ///
    /// - `position` - point to add circle to
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn circle_at(position: Position) -> Action { Self::circle(position.x, position.y) }

    /// Returns annotate cross action
    ///
    /// Will draw a unit sized `X` on the visualizer at the current turn
    /// centered at the Cell at the given `x`, `y` coordinates
    ///
    /// # Parameters
    ///
    /// - `x` - x coordinate of point to add cross to
    /// - `y` - y coordinate of point to add cross to
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn x(x: Coordinate, y: Coordinate) -> Action {
        format!("{} {} {}", Commands::ANNOTATE_CROSS, x, y)
    }

    /// Returns annotate cross action
    ///
    /// Will draw a unit sized `X` on the visualizer at the current turn
    /// centered at the Cell at the given `position` point
    ///
    /// # Parameters
    ///
    /// - `position` - point to add cross to
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn x_at(position: Position) -> Action { Self::x(position.x, position.y) }

    /// Returns annotate line action
    ///
    /// Will draw a line from the center of the [`Cell`] at (x1, y1) to the
    /// center of the [`Cell`] at (x2, y2)
    ///
    /// # Parameters
    ///
    /// - `x1` - x coordinate of line start point
    /// - `y1` - y coordinate of line start point
    /// - `x2` - x coordinate of line end point
    /// - `y2` - y coordinate of line end point
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn line(x1: Coordinate, y1: Coordinate, x2: Coordinate, y2: Coordinate) -> Action {
        format!("{} {} {} {} {}", Commands::ANNOTATE_LINE, x1, y1, x2, y2)
    }

    /// Returns annotate line action
    ///
    /// Will draw a line from the center of the [`Cell`] at `from` point to the
    /// center of the [`Cell`] at `to` point
    ///
    /// # Parameters
    ///
    /// - `from` - line start point
    /// - `to` - line end point
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn line_by(from: Position, to: Position) -> Action {
        Self::line(from.x, from.y, to.x, to.y)
    }

    /// Returns annotate text action
    ///
    /// # Parameters
    ///
    /// - `x` - x coordinate of text
    /// - `y` - y coordinate of text
    /// - `message` - String to annotate
    /// - `font_size` - message font size
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn text(x: Coordinate, y: Coordinate, message: &str, font_size: i32) -> Action {
        format!(
            "{} {} {} '{}' {}",
            Commands::ANNOTATE_TEXT,
            x,
            y,
            message,
            font_size
        )
    }

    /// Annotate text command
    ///
    /// # Parameters
    ///
    /// - `position` - [`Position`] of text
    /// - `message` - String to annotate
    /// - `font_size` - message font size
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn text_at(position: Position, message: &str, font_size: i32) -> Action {
        Self::text(position.x, position.y, message, font_size)
    }

    /// Returns annotate text action
    ///
    /// # Parameters
    ///
    /// - `x` - x coordinate of text
    /// - `y` - y coordinate of text
    /// - `message` - String to annotate
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn text_default(x: Coordinate, y: Coordinate, message: &str) -> Action {
        Self::text(x, y, message, 16)
    }

    /// Returns annotate text action
    ///
    /// # Parameters
    ///
    /// - `position` - [`Position`] of text
    /// - `message` - String to annotate
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn text_at_default(position: Position, message: &str) -> Action {
        Self::text_at(position, message, 16)
    }

    /// Returns annotate sidetext action
    ///
    /// # Parameters
    ///
    /// - `message` - String to annotate
    ///
    /// # Returns
    ///
    /// Action to perform
    pub fn sidetext(message: &str) -> Action {
        format!("{} '{}'", Commands::ANNOTATE_SIDE_TEXT, message)
    }
}
