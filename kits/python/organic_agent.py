from .lux.game import Game
from .lux.game_map import Cell
from .lux.constants import Constants
from .lux.game_constants import GAME_CONSTANTS
DIRECTIONS = Constants.DIRECTIONS
game_state = None

def organic_agent(observation, configuration):
    global game_state

    ### Do not edit ###
    if observation["step"] == 0:
        game_state = Game()
        game_state._initialize(observation["updates"])
        game_state._update(observation["updates"][2:])
    else:
        game_state._update(observation["updates"])
    
    actions = []

    ### AI Code goes down here! ### 
    player = game_state.players[observation.player]
    opponent = game_state.players[(observation.player + 1) % 2]
    game_map = game_state.map
    width, height = game_map.width, game_map.height

    resource_tiles: list[Cell] = []
    for y in range(height):
        for x in range(width):
            cell = game_map.get_cell(x, y)
            if cell.has_resource():
                resource_tiles.append(cell)
    
    cities_to_build = 0
    for k, city in player.cities.items():
        if (city.fuel > city.get_light_upkeep() * GAME_CONSTANTS["PARAMETERS"]["NIGHT_LENGTH"]):
            cities_to_build += 1;
        for city_tile in city.citytiles:
            if city_tile.can_act():
                if len(player.units) < player.city_tile_count:
                    actions.append(city_tile.build_worker())
                else:
                    actions.append(city_tile.research())

    moved_on_tiles = set()
    targeted_resources = set()

    for unit in player.units:
        if unit.is_worker():
            if unit.get_cargo_space_left() > 0:
                closest_dist = 999999999
                closest_resource_tile = None
                for resource_tile in resource_tiles:
                    if resource_tile.resource.type == Constants.RESOURCE_TYPES.COAL and not player.researched_coal(): continue
                    if resource_tile.resource.type == Constants.RESOURCE_TYPES.URANIUM and not player.researched_uanium(): continue
                    if resource_tile not in targeted_resources:
                        dist = resource_tile.pos.distance_to(unit.pos)
                        if dist < closest_dist:
                            closest_dist = dist
                            closest_resource_tile = resource_tile
                if closest_resource_tile is not None:
                    targeted_resources.add(closest_resource_tile)
                    move_dir = unit.pos.direction_to(closest_resource_tile.pos)
                    new_pos = unit.pos.translate(move_dir, 1)
                    new_cell = game_map.get_cell_by_pos(new_pos)
                    if new_cell not in moved_on_tiles:
                        actions.append(unit.move(move_dir))
                        moved_on_tiles.add(new_cell)
            else:
                # if we have cities, return to them
                if len(player.cities) > 0:
                    closest_dist = 999999
                    closest_city_tile = None
                    for k, city in player.cities.items():
                        for city_tile in city.citytiles:
                            dist = city_tile.pos.distance_to(unit.pos)
                            if dist < closest_dist:
                                closest_dist = dist
                                closest_city_tile = city_tile
                    if closest_city_tile is not None:
                        move_dir = unit.pos.direction_to(closest_city_tile.pos)
                        if cities_to_build > 0 and unit.pos.is_adjacent(closest_city_tile.pos) and unit.can_build(game_map):
                            actions.append(unit.build_city())        
                        else:
                            new_cell = game_map.get_cell_by_pos(unit.pos.translate(move_dir, 1))
                            if new_cell not in moved_on_tiles:
                                actions.append(unit.move(move_dir))
                                moved_on_tiles.add(new_cell)
    
    return actions