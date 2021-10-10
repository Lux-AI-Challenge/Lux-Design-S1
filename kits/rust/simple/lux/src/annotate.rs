use super::*;


/// Annotations namespace
pub struct Annotate {}

impl Annotate {
    /// Annotate circle command
    ///
    /// # Parameters
    /// 
    /// - `position` - `Position` of point to add circle
    ///
    /// # Returns 
    ///
    /// Action to perform
    pub fn circle_command(position: Position) -> String {
        format!("{} {}", Commands::ANNOTATE_CIRCLE, position.to_argument())
    }

    /// Annotate cross command
    ///
    /// # Parameters
    /// 
    /// - `position` - `Position` of point to add cross
    ///
    /// # Returns 
    ///
    /// Action to perform
    pub fn cross_command(position: Position) -> String {
        format!("{} {}", Commands::ANNOTATE_CROSS, position.to_argument())
    }

    /// Annotate line command
    ///
    /// # Parameters
    /// 
    /// - `from` - `Position` of line start point 
    /// - `to` - `Position` of line end point
    ///
    /// # Returns 
    ///
    /// Action to perform
    pub fn line_command(from: Position, to: Position) -> String {
        format!(
            "{} {} {}",
            Commands::ANNOTATE_LINE,
            from.to_argument(),
            to.to_argument(),
        )
    }

    /// Annotate text command
    ///
    /// # Parameters
    /// 
    /// - `position` - `Position` of point of text
    /// - `message` - String to annotate
    /// - `font_size` - message font size
    ///
    /// # Returns 
    ///
    /// Action to perform
    pub fn text_command(position: Position, message: &str, font_size: i32) -> String {
        format!(
            "{} {} '{}' {}",
            Commands::ANNOTATE_TEXT,
            position.to_argument(),
            message,
            font_size
        )
    }

    /// Annotate text command
    ///
    /// # Parameters
    /// 
    /// - `position` - `Position` of point of text
    /// - `message` - String to annotate
    ///
    /// # Returns 
    ///
    /// Action to perform
    pub fn text_command_default(position: Position, message: &str) -> String {
        Self::text_command(position, message, 16)
    }

    /// Annotate side text command
    ///
    /// # Parameters
    /// 
    /// - `message` - String to annotate
    ///
    /// # Returns 
    ///
    /// Action to perform
    pub fn sidetext_command(message: &str) -> String {
        format!("{} '{}'", Commands::ANNOTATE_SIDE_TEXT, message)
    }
}
