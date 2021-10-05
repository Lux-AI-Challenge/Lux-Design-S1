import math, sys
from lux.game import Game
from lux.game_map import Cell, RESOURCE_TYPES
from lux.constants import Constants
from lux.game_constants import GAME_CONSTANTS
from lux import annotate

DIRECTIONS = Constants.DIRECTIONS
game_state = None
lets_build_city = None


def can_build_worker(player) -> bool:
  # get nr of cytitiles
  nr_cts = 0
  for k, c in player.cities.items():
    nr_cts += len(c.citytiles)
  return nr_cts > len(player.units)


def agent(observation, configuration):
    global game_state
    global lets_build_city
    max_tiles = 1

    ### Do not edit ###
    if observation["step"] == 0:
        game_state = Game()
        game_state._initialize(observation["updates"])
        game_state._update(observation["updates"][2:])
        game_state.id = observation.player
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

    # we iterate over all our units and do something with them
    for unit in player.units:
        if unit.is_worker() and unit.can_act():
            closest_dist = math.inf
            closest_resource_tile = None
            if unit.get_cargo_space_left() > 0:
                actions.append(annotate.text(unit.pos.x, unit.pos.y,"R"))
                # if the unit is a worker and we have space in cargo, lets find the nearest resource tile and try to mine it
                for resource_tile in resource_tiles:
                    if resource_tile.resource.type == Constants.RESOURCE_TYPES.COAL and not player.researched_coal(): continue
                    if resource_tile.resource.type == Constants.RESOURCE_TYPES.URANIUM and not player.researched_uranium(): continue
                    dist = resource_tile.pos.distance_to(unit.pos)
                    if dist < closest_dist:
                        closest_dist = dist
                        closest_resource_tile = resource_tile
                if closest_resource_tile is not None:
                    actions.append(unit.move(unit.pos.direction_to(closest_resource_tile.pos)))
            elif lets_build_city:
              actions.append(annotate.text(unit.pos.x, unit.pos.y,"B"))
              build_pos = lets_build_city
              actions.append(annotate.x(build_pos.x, build_pos.y))
              # if in build position -> create a citytile
              if unit.pos.equals(build_pos) and unit.can_build(game_state.map):
                actions.append(unit.build_city())
                max_tiles += 1
                lets_build_city = None
              else:
                move_dir = unit.pos.direction_to(build_pos)
                actions.append(unit.move(move_dir))
            else:
                # if unit is a worker and there is no cargo space left, and we have cities, lets return to them
                actions.append(annotate.text(unit.pos.x, unit.pos.y,"C"))
                if len(player.cities) > 0:
                    closest_dist = math.inf
                    closest_city_tile = None
                    for k, city in player.cities.items():
                        for city_tile in city.citytiles:
                            dist = city_tile.pos.distance_to(unit.pos)
                            if dist < closest_dist:
                                closest_dist = dist
                                closest_city_tile = city_tile
                    if closest_city_tile is not None:
                        move_dir = unit.pos.direction_to(closest_city_tile.pos)
                        actions.append(unit.move(move_dir))
      

    for k, city in player.cities.items():
      # get energy cost for the night to come
      cost = 10 * len(city.citytiles) * city.get_light_upkeep()
      fulled = city.fuel > 2 * cost
      for ct in city.citytiles:
        pxy = ct.pos
        actions.append(annotate.text(pxy.x, pxy.y, f"{fulled}"))
        if fulled: 
          if ct.can_act() and can_build_worker(player):
              actions.append(ct.build_worker())
          else:
            # choose a place to create a new citytile
            for x , y in [(pxy.x+1, pxy.y), (pxy.x-1, pxy.y), (pxy.x, pxy.y+1), (pxy.x, pxy.y-1) ]:
              cell = game_state.map.get_cell(x, y)
              #actions.append(annotate.text(x, y, f"{x},{y}"))

              if cell.citytile : continue
              if cell.has_resource() : continue
              if lets_build_city: continue
              if max_tiles > 1 :
                lets_build_city = None
              else: 
              # actions.append(annotate.x(x, y))
                lets_build_city = cell.pos
              break

        
    # you can add debug annotations using the functions in the annotate object
    # actions.append(annotate.circle(0, 0))
    
    return actions
