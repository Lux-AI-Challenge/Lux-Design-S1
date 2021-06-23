import sys
if __package__ == "":
    # not sure how to fix this atm
    from lux.game import Game
    from lux.game_map import Cell, RESOURCE_TYPES
    from lux.constants import Constants
    from lux.game_constants import GAME_CONSTANTS
else:
    from .lux.game import Game
    from .lux.game_map import Cell, RESOURCE_TYPES
    from .lux.constants import Constants
    from .lux.game_constants import GAME_CONSTANTS
DIRECTIONS = Constants.DIRECTIONS
game_state = None

def agent(observation, configuration):
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
    width, height = game_state.map.width, game_state.map.height

    resource_tiles: list[Cell] = []
    for y in range(height):
        for x in range(width):
            cell = game_state.map.get_cell(x, y)
            if cell.has_resource():
                resource_tiles.append(cell)

    cities_to_build = 0
    for k, city in player.cities.items():
        if (city.fuel > city.get_light_upkeep() * GAME_CONSTANTS["PARAMETERS"]["NIGHT_LENGTH"] + 1000):
            # if our city has enough fuel to survive the whole night and 1000 extra fuel, lets increment citiesToBuild and let our workers know we have room for more city tiles
            cities_to_build += 1;
        for citytile in city.citytiles:
            if citytile.can_act():
                # you can use the following to get the citytile to research or build a worker
                # commands.push(citytile.research());
                # commands.push(citytile.buildWorker());
                pass

    # we iterate over all our units and do something with them
    for unit in player.units:
        if unit.is_worker():
            closest_dist = 999999999
            closest_resource_tile = None
            if unit.get_cargo_space_left() > 0:
                # if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
                for resource_tile in resource_tiles:
                    if resource_tile.resource.type == Constants.RESOURCE_TYPES.COAL and not player.researched_coal(): continue
                    if resource_tile.resource.type == Constants.RESOURCE_TYPES.URANIUM and not player.researched_uanium(): continue
                    dist = resource_tile.pos.distance_to(unit.pos)
                    if dist < closest_dist:
                        closest_dist = dist
                        closest_resource_tile = resource_tile
                if closest_resource_tile is not None:
                    actions.append(unit.move(unit.pos.direction_to(closest_resource_tile.pos)))
            else:
                # if unit is a worker and there is no cargo space left, and we have cities, lets return to them
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
                        if cities_to_build > 0 and unit.pos.is_adjacent(closest_city_tile.pos) and unit.can_build(game_state.map):
                            # here we consider building city tiles provided we are adjacent to a city tile and we can build
                            actions.append(unit.build_city())        
                        else:
                            actions.append(unit.move(move_dir))
    
    return actions