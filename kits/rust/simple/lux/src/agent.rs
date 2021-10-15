use std::fmt;

use crate::*;

/// Represents Agent state at given turn
#[derive(Clone, fmt::Debug)]
pub struct Agent {
    /// Team id of our Bot's Player
    pub team: TeamId,

    /// Turn index
    pub turn: TurnAmount,

    /// Whole GameMap
    ///
    /// # See also
    ///
    /// Check <https://www.lux-ai.org/specs-2021#The%20Map>
    pub game_map: GameMap,

    /// List of all players participating in match
    pub players: Vec<Player>,
}

impl Agent {
    /// Initializes Agent before match
    /// - read team_id
    /// - read game map dimensions
    ///
    /// # Parameters
    ///
    /// - `environment` - mutable reference to [`Environment`]
    ///
    /// # Returns
    /// Initialized `Agent` or error
    pub fn new(environment: &mut Environment) -> LuxAiResult<Self> {
        let team = Self::read_team(environment)?;
        let (width, height) = Self::read_map_dimensions(environment)?;
        let game_map = GameMap::new(width, height);
        let turn = 0;
        let players = (0..TEAM_COUNT)
            .map(|team_id| Player::new(team_id))
            .collect();

        Ok(Self {
            team,
            turn,
            game_map,
            players,
        })
    }

    /// Returns our Bot's [`Player`]
    ///
    /// # Parameters
    ///
    /// - `self` - Self reference
    ///
    /// # Returns
    ///
    /// `Player` reference
    pub fn player(&self) -> &Player { &self.players[self.team as usize] }

    /// Updates Agent's map for current turn
    /// - updates turn
    /// - reads research points for all `Player`'s
    /// - reads ALL units, resources, cities, city tiles and roads on `GameMap`
    ///
    /// # Parameters
    ///
    /// - `self` - mutable Self reference
    /// - `environment` - mutable `Environment` reference
    ///
    /// # Returns
    ///
    /// Nothing or error
    pub fn update_turn(&mut self, environment: &mut Environment) -> LuxAiResult {
        self.turn += 1;
        self.reset_players_state();
        self.game_map.reset_state();

        loop {
            let command = environment.read_command()?;
            match command.argument::<String>(0)?.as_str() {
                Commands::DONE => break,
                Commands::RESEARCH_POINTS => self.update_research_points(&command)?,
                Commands::RESOURCES => self.update_resources(&command)?,
                Commands::UNITS => self.update_unit(&command)?,
                Commands::CITY => self.update_city(&command)?,
                Commands::CITY_TILES => self.update_city_tile(&command)?,
                Commands::ROADS => self.update_road(&command)?,
                _ => continue,
            };
        }

        self.fix_dependencies();
        Ok(())
    }

    fn reset_players_state(&mut self) {
        for player in self.players.iter_mut() {
            player.reset_state();
        }
    }

    fn read_team(environment: &mut Environment) -> LuxAiResult<TeamId> {
        let command = environment.read_len_command(1)?;

        let team_id = command.argument(0)?;

        Ok(team_id)
    }

    fn read_map_dimensions(environment: &mut Environment) -> LuxAiResult<(Coordinate, Coordinate)> {
        let command = environment.read_len_command(2)?;

        let (width, height) = (command.argument(0)?, command.argument(1)?);

        Ok((width, height))
    }

    fn update_research_points(&mut self, command: &Command) -> LuxAiResult {
        command.expect_arguments(3)?;
        let (team_id, research_points) = (command.argument::<TeamId>(1)?, command.argument(2)?);

        self.players[team_id as usize].research_points = research_points;

        Ok(())
    }

    fn update_resources(&mut self, command: &Command) -> LuxAiResult {
        command.expect_arguments(5)?;
        let (resource_type, x, y, amount) = (
            command.argument(1)?,
            command.argument::<Coordinate>(2)?,
            command.argument::<Coordinate>(3)?,
            command.argument(4)?,
        );

        let position = Position::new(x, y);
        let resource = Resource::new(resource_type, amount);

        self.game_map[position].resource = Some(resource);

        Ok(())
    }

    fn update_unit(&mut self, command: &Command) -> LuxAiResult {
        command.expect_arguments(10)?;
        let (unit_type, team, unit_id, x, y, cooldown) = (
            command.argument(1)?,
            command.argument(2)?,
            command.argument(3)?,
            command.argument::<Coordinate>(4)?,
            command.argument::<Coordinate>(5)?,
            command.argument(6)?,
        );
        let argument_offset = 7;

        let position = Position::new(x, y);
        let mut unit = Unit::new(team, unit_type, unit_id, position, cooldown);
        for (index, resource_type) in ResourceType::VALUES.iter().enumerate() {
            let amount = command.argument(argument_offset + index)?;
            unit.cargo[*resource_type] = amount;
        }
        self.players[team as usize].units.push(unit);

        Ok(())
    }

    fn update_city(&mut self, command: &Command) -> LuxAiResult {
        command.expect_arguments(5)?;
        let (team_id, city_id, fuel, light_up_keep) = (
            command.argument(1)?,
            command.argument::<EntityId>(2)?,
            command.argument(3)?,
            command.argument(4)?,
        );

        let city = City::new(team_id, city_id.clone(), fuel, light_up_keep);
        self.players[team_id as usize].cities.insert(city_id, city);

        Ok(())
    }

    fn update_city_tile(&mut self, command: &Command) -> LuxAiResult {
        command.expect_arguments(6)?;

        let (team_id, city_id, x, y, cooldown) = (
            command.argument::<TeamId>(1)?,
            command.argument::<EntityId>(2)?,
            command.argument::<Coordinate>(3)?,
            command.argument::<Coordinate>(4)?,
            command.argument(5)?,
        );

        let position = Position::new(x, y);
        let city = self.players[team_id as usize]
            .cities
            .get_mut(&city_id)
            .ok_or(LuxAiError::CityNotExists(city_id))?;
        city.add_city_tile(position, cooldown);

        Ok(())
    }

    fn update_road(&mut self, command: &Command) -> LuxAiResult {
        command.expect_arguments(4)?;
        let (x, y, road) = (
            command.argument::<Coordinate>(1)?,
            command.argument::<Coordinate>(2)?,
            command.argument(3)?,
        );

        let position = Position::new(x, y);
        let cell = &mut self.game_map[position];
        cell.road = road;

        Ok(())
    }

    fn fix_dependencies(&mut self) {
        for player in self.players.iter_mut() {
            for (_city_id, city) in player.cities.iter_mut() {
                for city_tile in city.citytiles.iter() {
                    let position = city_tile.borrow().pos;
                    self.game_map[position].citytile = Some(city_tile.clone());
                }
            }
        }
    }
}
