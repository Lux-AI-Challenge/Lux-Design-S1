use std::cell::Ref;

// import lux_ai crate
use lux_ai_api as lux_ai;

/// Entry point of Bot
fn main() -> lux_ai::LuxAiResult<()> {
    // Initialize Lux AI I/O environment
    let mut environment = lux_ai::Environment::new();
    // Create agent [lux_ai_api::Agent]
    let mut agent = lux_ai::Agent::new(&mut environment)?;

    // For every turn
    loop {
        // Update Agent state for current turn
        match agent.update_turn(&mut environment) {
            Err(lux_ai::LuxAiError::EmptyInput) => break,
            result => result?,
        };

        let ref game_map = agent.game_map;

        #[allow(unused_variables)]
        let ref opponent = agent.players[(agent.team_id as usize + 1) % 2];
        let player = agent.player();

        // Cache all resource cells
        let mut resource_cells: Vec<&lux_ai::GameMapCell> = vec![];
        for y in 0..game_map.height() {
            for x in 0..game_map.width() {
                let position = lux_ai::Position::new(x, y);
                resource_cells.push(&game_map[position]);
            }
        }

        // For every our unit
        for unit in player.units.iter() {
            match unit.unit_type {
                // If worker has zero cooldown
                lux_ai::UnitType::Worker if unit.can_act() => {
                    if unit.cargo_space_left() > 0.0 {
                        // If has cargo space left
                        let mut closest_distance = i32::max_value();
                        let mut closest_resource_cell: Option<&lux_ai::GameMapCell> = None;

                        // Find closest already researhed resource cell
                        for resource_cell in resource_cells.iter() {
                            let distance = resource_cell.position.distance_to(unit.position);
                            if let Some(resource) = &resource_cell.resource {
                                if player.is_researched(&resource.resource_type) &&
                                    distance < closest_distance
                                {
                                    closest_distance = distance;
                                    closest_resource_cell = Some(resource_cell);
                                }
                            }
                        }

                        // And if any move in that direction
                        if let Some(closest_resource_cell) = closest_resource_cell {
                            let direction =
                                unit.position.direction_to(closest_resource_cell.position);
                            environment.write_action(unit.move_command(direction));
                        }
                    } else {
                        // Else if no cargo space left
                        let mut closest_distance = i32::max_value();
                        let mut closest_city_tile: Option<Ref<lux_ai::CityTile>> = None;

                        // Find nearest city tile
                        for city in player.cities.values() {
                            for city_tile in city.city_tiles.iter() {
                                let city_tile = city_tile.borrow();
                                let distance = city_tile.position.distance_to(unit.position);

                                if distance < closest_distance {
                                    closest_distance = distance;
                                    closest_city_tile = Some(city_tile);
                                }
                            }
                        }

                        // And if any move in that direction
                        if let Some(closest_city_tile) = closest_city_tile {
                            let direction = unit.position.direction_to(closest_city_tile.position);
                            environment.write_action(unit.move_command(direction));
                        }
                    }
                },
                _ => {},
            }
        }

        // Flust all performed actions
        environment.flush_actions()?;
        // End our turn
        environment.write_raw_action(lux_ai::Commands::FINISH.to_string())?;

        // Flush I/O buffering
        environment.flush()?;
    }

    Ok(())
}
