## Lux AI

### Background

The night is dark and full of terrors. Two teams must fight off the darkness, collect resources, and advance through the ages. Daytime finds a desperate rush to gather and build the resources that can carry you through the impending night. Plan and expand carefully -- any city that fails to produce enough light cannot stave off the darkness, and will be consumed by darkness.

### Environment

In the Lux AI Challenge Season 1, both teams control a team of Units and CityTiles that collect resources to fuel their Cities, with the main objective to own as many CityTiles as possible at the end of the turn-based game. Both teams have complete information about the entire game state and will need to make use of that information to optimize resource collection, compete for resources against the opponent, and more. This document will go through the key features of this game.

### The Map

The world of Lux is represented as a 2d grid. Coordinates increase east (right) and south (down). The map width and height range can be 12, 16, 24, or 32 tiles long. The (0, 0) coordinate is at the top left.

The map has various features including resources (Wood, Coal, Uranium), units (Workers, Carts, CityTiles), and Roads.

In order to prevent maps from favoring one player over another, it is guaranteed that maps are always symmetric by vertical or horizontal reflection.

Each player will start with a single CityTile and a single worker on that CityTile

### Resources

There are 3 kinds of resources: Wood, Coal, and Uranium (in order of increasing fuel efficiency). These resources are collected by workers, then dropped off once a worker moves on top of a CityTile to then be converted into fuel for the city. Some resources require research points before they are possible to collect.

<table>
  <tr>
   <td>Resource Type
   </td>
   <td>Fuel Value
   </td>
   <td>Collection Rate
   </td>
   <td>Research Points
   </td>
  </tr>
  <tr>
   <td>Wood
   </td>
   <td>1
   </td>
   <td>20
   </td>
   <td>0
   </td>
  </tr>
  <tr>
   <td>Coal
   </td>
   <td>5
   </td>
   <td>10
   </td>
   <td>50
   </td>
  </tr>
  <tr>
   <td>Uranium
   </td>
   <td>25
   </td>
   <td>1
   </td>
   <td>200
   </td>
  </tr>
</table>


#### Collection Mechanics

At the end of each turn, units automatically receive resources from all adjacent (North, East, South, West, or Center) resource tiles they can collect resources from according to the current formula:

- Uranium, coal, then wood tiles do the following in order:
  - Determine the number of eligible workers (adjacent and have required research level)
  - If there is enough resources left, each eligible worker receives up to the collection rate (or up to their carrying capacity)
  - If there aren't enough resources to give to all workers, the resources distributed are evenly divided between workers (rounded down to the nearest integer).

### CityTile

A CityTile is a building that takes up one tile of space. Adjacent CityTiles collectively form a City. Each CityTile can perform the following actions provided the CityTile has a cooldown &lt; 1.

Actions

- Build Worker - Build Worker unit on top of CityTile (cannot build a worker if there are more workers + carts than friendly CityTiles)
- Build Cart - Build Cart unit on top of CityTile (cannot build a cart if there are more workers + carts than friendly CityTiles)
- Research - Increase your team’s Research Points by 1

### Units

There are two unit types, Workers, and Carts. Every unit can perform a single action once they have a cooldown &lt; 1 (See Overview: Cooldown).

All units can choose the move action and move in any of 5 directions, North, East, South, West, Center. Moreover, all mobile units can carry raw resources gained from automatic mining or resource transfer. Workers are capped at 100 units of resources and Carts are capped at 2000 units of resources.

Whenever a unit moves on top of a friendly CityTile, the City that CityTile forms converts all carried resources into fuel.

There can be at most one mobile unit on tiles without a CityTile. Moreover, units cannot move on top of the opposing team’s CityTiles. However, units can stack on top of each other on a friendly CityTile.

If two units attempt to move to the same tile that is not a CityTile, this is considered a collision and the move action is cancelled.

#### Unit Type: Worker

Actions

- Move - Move the unit in one of 5 directions, North, East, South, West, Center.
- Pillage - Reduce the road development level of the tile the unit is on by 0.25
- Transfer - Transfer any number of resources currently in the unit’s cargo to an adjacent unit (You only have to be adjacent at the start of a turn)
- Build CityTile - Build a CityTile right under this worker provided the worker has 100 Wood in their cargo and the tile is empty.

#### Unit Type: Cart

Actions

- Move - Move the unit in one of 5 directions, North, East, South, West, Center.
- Transfer - Transfer any number of resources currently in the unit’s Cargo to an adjacent unit (You only have to be adjacent at the start of a turn)

### Cooldown

CityTiles, Workers and Carts all have a cooldown mechanic after each action. Units can only perform an action when they have &lt; 1 Cooldown.

After an action is performed, the unit’s Cooldown will increase by a Base Cooldown (see table below) and then subtracted by the level of the Road it ends its turn on. CityTiles however will always get their Cooldown increased by 10.

At the end of each turn, a unit’s cooldown will reduce by 1

Table of Base Cooldown values

<table>
  <tr>
   <td>Unit Type
   </td>
   <td>Base Cooldown
   </td>
  </tr>
  <tr>
   <td>CityTile
   </td>
   <td>10
   </td>
  </tr>
  <tr>
   <td>Worker
   </td>
   <td>2
   </td>
  </tr>
  <tr>
   <td>Cart
   </td>
   <td>3
   </td>
  </tr>
</table>


### Roads

As carts travel across the map, they start to create roads which allow all units to move faster (see Overview: Cooldown). Each time a cart travels onto a tile, the road level of that tile increases by 0.5. The higher the road level, the faster units can move and perform actions. All tiles start with a road level of 0, and are capped at 6.

Moreover, CityTiles automatically have the max road level of 6.

Roads can also be destroyed by workers via the pillage action. (See Unit Type: Worker)

### Day/Night Cycle

The Day/Night cycle consists of a 40 turn cycle, the first 30 turns being day turns, the last 10 being night turns. There are a total of 360 turns in a match, forming 9 cycles.

During the night, units and Cities need to produce light to survive. Each turn of night, each unit and CityTile will consume an amount of fuel, see table below for rates. Mobile units in particular will use their carried resources to produce light whereas CityTiles will use their fuel to produce light.

Workers and Carts will only need to consume resources if they are not on a CityTile. When outside the City, Workers and Carts must consume whole units of resources to satisfy their night needs, e.g. if a worker carries 1 wood and 5 uranium on them, they will consume a full wood for 1 fuel, then a full uranium to fulfill the last 3 fuel requirements, wasting 22 fuel. Mobile units will always consume the least efficient resources first.

Lastly, at night, units gain 2x more Base Cooldown

Should any unit during the night run out of fuel, they will be removed from the game and disappear into the night forever. Should a City run out of fuel however, the entire City with all of the CityTiles it owns will fall into darkness and be removed from the game.

<table>
  <tr>
   <td>Unit
   </td>
   <td>Fuel Burn in City
   </td>
   <td>Fuel Burn Outside City
   </td>
  </tr>
  <tr>
   <td>CityTile
   </td>
   <td>30 - 5 * number of adjacent friendly CityTiles
   </td>
   <td>N/A
   </td>
  </tr>
  <tr>
   <td>Cart
   </td>
   <td>0
   </td>
   <td>10
   </td>
  </tr>
  <tr>
   <td>Worker
   </td>
   <td>0
   </td>
   <td>4
   </td>
  </tr>
</table>


### Game Resolution order

Actions in the game are first all validated against the current game state to see if they are valid. Then the actions, along with game events, are resolved in the following order

1. CityTile actions
2. Unit actions
3. Resource collection
4. Resource drops on CityTiles
5. If night time, make units consume resources and CityTiles consume fuel

### Victory

#### Victory conditions and tiebreakers

At the conclusion of 360 turns the winner is determined according to tiebreakers:

1. Number of cities
2. Number of units
3. Total fuel generated
4. Coin flip

Note that the first tiebreaker will never change, however, the next 3 tiebreakers may change or be removed and we may allow ties in the competition.

### Note on Game Rule Changes

Our team at the Lux AI Challenge reserves the right to make any changes on game rules during the course of the competition. We will work to keep our decision-making as transparent as possible and avoid making changes late on in the competition.