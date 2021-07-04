from typing import Dict

from .constants import Constants
from .game_map import Position
from .game_constants import GAME_CONSTANTS

UNIT_TYPES = Constants.UNIT_TYPES


class Player:
    def __init__(self, team):
        self.team = team
        self.research_points = 0
        self.units: list[Unit] = []
        self.cities: Dict[str, City] = {}
        self.city_tile_count = 0
    def researched_coal(self) -> bool:
        return self.research_points >= GAME_CONSTANTS["PARAMETERS"]["RESEARCH_REQUIREMENTS"]["COAL"]
    def researched_uranium(self) -> bool:
        return self.research_points >= GAME_CONSTANTS["PARAMETERS"]["RESEARCH_REQUIREMENTS"]["URANIUM"]


class City:
    def __init__(self, teamid, cityid, fuel, light_upkeep):
        self.cityid = cityid
        self.team = teamid
        self.fuel = fuel
        self.citytiles: list[CityTile] = []
        self.light_upkeep = light_upkeep
    def _add_city_tile(self, x, y, cooldown):
        ct = CityTile(self.team, self.cityid, x, y, cooldown)
        self.citytiles.append(ct)
        return ct
    def get_light_upkeep(self):
        return self.light_upkeep


class CityTile:
    def __init__(self, teamid, cityid, x, y, cooldown):
        self.cityid = cityid
        self.team = teamid
        self.pos = Position(x, y)
        self.cooldown = cooldown
    def can_act(self) -> bool:
        """
        Whether or not this unit can research or build
        """
        return self.cooldown < 1
    def research(self) -> str:
        """
        returns command to ask this tile to research this turn
        """
        return "r {} {}".format(self.pos.x, self.pos.y)
    def build_worker(self) -> str:
        """
        returns command to ask this tile to build a worker this turn
        """
        return "bw {} {}".format(self.pos.x, self.pos.y)
    def build_cart(self) -> str:
        """
        returns command to ask this tile to build a cart this turn
        """
        return "bc {} {}".format(self.pos.x, self.pos.y)


class Cargo:
    def __init__(self):
        self.wood = 0
        self.coal = 0
        self.uranium = 0

    def __str__(self) -> str:
        return f"Cargo | Wood: {self.wood}, Coal: {self.coal}, Uranium: {self.uranium}"


class Unit:
    def __init__(self, teamid, u_type, unitid, x, y, cooldown, wood, coal, uranium):
        self.pos = Position(x, y)
        self.team = teamid
        self.id = unitid
        self.type = u_type
        self.cooldown = cooldown
        self.cargo = Cargo()
        self.cargo.wood = wood
        self.cargo.coal = coal
        self.cargo.uranium = uranium
    def is_worker(self) -> bool:
        return self.type == UNIT_TYPES.WORKER

    def is_cart(self) -> bool:
        return self.type == UNIT_TYPES.CART

    def get_cargo_space_left(self):
        """
        get cargo space left in this unit
        """
        spaceused = self.cargo.wood + self.cargo.coal + self.cargo.uranium
        if self.type == UNIT_TYPES.WORKER:
            return GAME_CONSTANTS["PARAMETERS"]["RESOURCE_CAPACITY"]["WORKER"] - spaceused
        else:
            return GAME_CONSTANTS["PARAMETERS"]["RESOURCE_CAPACITY"]["CART"] - spaceused
    
    def can_build(self, game_map) -> bool:
        """
        whether or not the unit can build where it is right now
        """
        cell = game_map.get_cell_by_pos(self.pos)
        if not cell.has_resource() and self.can_act() and self.cargo.wood >= GAME_CONSTANTS["PARAMETERS"]["CITY_WOOD_COST"]:
            return True
        return False

    def can_act(self) -> bool:
        """
        whether or not the unit can move or not. This does not check for potential collisions into other units or enemy cities
        """
        return self.cooldown < 1

    def move(self, dir) -> str:
        """
        return the command to move unit in the given direction
        """
        return "m {} {}".format(self.id, dir)

    def transfer(self, dest_id, resourceType, amount) -> str:
        """
        return the command to transfer a resource from a source unit to a destination unit as specified by their ids
        """
        return "t {} {} {} {}".format(self.id, dest_id, resourceType, amount)

    def build_city(self) -> str:
        """
        return the command to build a city right under the worker
        """
        return "bcity {}".format(self.id)

    def pillage(self) -> str:
        """
        return the command to pillage whatever is underneath the worker
        """
        return "p {}".format(self.id)
