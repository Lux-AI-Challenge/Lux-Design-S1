use std::io::{prelude::*, BufRead, BufReader, BufWriter};

use super::*;

/// Represents Action performed by Agent
pub type Action = String;


/// Environment wrapper to interact with Lux AI API I/O
pub struct Environment {
    reader:  BufReader<io::Stdin>,
    writer:  BufWriter<io::Stdout>,
    actions: Vec<Action>,
}

impl Environment {
    /// Initializes Environment with stdout stdin
    ///
    /// # Parameters
    ///
    /// None
    ///
    /// # Returns
    ///
    /// A new created `Environment`
    pub fn new() -> Self {
        Self {
            reader:  BufReader::new(io::stdin()),
            writer:  BufWriter::new(io::stdout()),
            actions: vec![],
        }
    }

    /// Runs whole match with initialized `Agent`
    ///
    /// - Initializes `Agent`
    /// - On each turn:
    ///     - Updates `Agent`
    ///     - Runs `turn_handler` with `Agent` and `Environment`
    ///     - Flush all actions
    ///     - Flushes I/O
    ///     - Ends turn
    ///
    /// # Examples
    ///
    /// ```
    /// fn turn_handler(agent: &Agent, environment: &mut Environment) -> LuxAiResult {
    ///   // Do something
    ///   Ok(())
    /// };
    ///
    /// // ...
    ///
    /// let environment = Envitonment::new()?;
    /// environment.run_with_agent(&mut turn_handler)?;
    /// ```
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    /// - `turn_handler` - Function reference with Agent and Environment arguments
    ///
    /// # Returns
    ///
    /// Nothing or error
    pub fn run_with_agent<F: FnMut(&Agent, &mut Self) -> LuxAiResult>(
        &mut self, turn_handler: &mut F,
    ) -> LuxAiResult {
        let mut agent = Agent::new(self)?;

        loop {
            match agent.update_turn(self) {
                Err(LuxAiError::EmptyInput) => break,
                result => result?,
            };
            turn_handler(&agent, self)?;

            self.flush_actions()?;
            self.write_raw_action(Commands::FINISH.to_string())?;

            self.flush()?;
        }
        Ok(())
    }

    fn read_line(&mut self) -> LuxAiResult<String> {
        let mut line = String::new();
        match self.reader.read_line(&mut line) {
            Ok(0) => Err(LuxAiError::EmptyInput),
            Ok(_) => Ok(line),
            Err(err) => Err(LuxAiError::InputOutput(err)),
        }
    }

    /// Reads & parse `Command` from Lux AI API I/O
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    ///
    /// # Returns
    ///
    /// Read `Command` or error
    pub fn read_command(&mut self) -> LuxAiResult<Command> {
        let line = self.read_line()?;
        let command = Command::new(line);
        Ok(command)
    }

    /// Reads & parse `Command` from Lux AI API I/O with length constraint
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    /// - `arguments_count` - length of command arguments to expect
    ///
    /// # Returns
    ///
    /// Read `Command` or error
    pub fn read_len_command(&mut self, arguments_count: usize) -> LuxAiResult<Command> {
        let command = self.read_command()?;
        command.expect_arguments(arguments_count)?;
        Ok(command)
    }

    /// Add `Action` to actions cache
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    /// - `action` - `Action` to add to actions cache
    ///
    /// # Returns
    ///
    /// Nothing
    pub fn write_action(&mut self, action: Action) { self.actions.push(action); }

    /// Writes raw `Action` to Lux AI API I/O
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    /// - `action` - Action to write
    ///
    /// # Returns
    ///
    /// Nothing or I/O error
    pub fn write_raw_action(&mut self, action: Action) -> LuxAiResult {
        self.dump_raw_action(action)
            .map_err(|err| LuxAiError::InputOutput(err))
    }

    /// Flush actions cache into Lux AI API I/O
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    ///
    /// # Returns
    ///
    /// Nothing or I/O error
    pub fn flush_actions(&mut self) -> LuxAiResult {
        self.dump_actions()
            .map_err(|err| LuxAiError::InputOutput(err))
    }

    /// Flush Lux AI API I/O
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    ///
    /// # Returns
    ///
    /// Nothing or I/O error
    pub fn flush(&mut self) -> LuxAiResult {
        self.writer
            .flush()
            .map_err(|err| LuxAiError::InputOutput(err))
    }

    fn dump_raw_action(&mut self, action: Action) -> io::Result<()> {
        writeln!(self.writer, "{}", action)?;
        Ok(())
    }

    fn dump_actions(&mut self) -> io::Result<()> {
        for (i, action) in self.actions.iter().enumerate() {
            if i != 0 {
                write!(self.writer, ",")?;
            }
            write!(self.writer, "{}", action)?;
        }
        writeln!(self.writer, "")?;
        self.actions.clear();
        Ok(())
    }
}
