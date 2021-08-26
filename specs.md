# Lux AI Season 1 Specifications

For documentation on the API, see [this document](https://github.com/Lux-AI-Challenge/Lux-Design-2021/blob/master/kits/). To get started developing a bot, see our [Github](https://github.com/Lux-AI-Challenge/Lux-Design-2021)

## Background

The night is dark and full of terrors. Two teams must fight off the darkness, collect resources, and advance through the ages. Daytime finds a desperate rush to gather and build the resources that can carry you through the impending night. Plan and expand carefully -- any city that fails to produce enough light will be consumed by darkness.

## Environment

In the Lux AI Challenge Season 1, two competing teams control a team of [Units](#Units) and [CityTiles](#CityTile) that collect resources to fuel their Cities, with the main objective to own as many [CityTiles](#CityTiles) as possible at the end of the turn-based game. Both teams have complete information about the entire game state and will need to make use of that information to optimize resource collection, compete for scarce resources against the opponent, and build cities to gain points.

Each competitor must program their own agent in their language of choice. Each turn, your agent gets 3 seconds of time to submit their actions, excess time is not saved across turns. Each game, you are given a pool of 60 seconds that is tapped into each time you go over a turn's 3 second limit. Upon using up all 60 seconds and going over the 3 second limit, your agent freezes and can no longer submit additional actions.

The rest of the document will go through the key features of this game.

## The Map

The world of Lux is represented as a 2d grid. Coordinates increase east (right) and south (down). The map is always a square and can be 12, 16, 24, or 32 tiles long. The (0, 0) coordinate is at the top left.

![](https://raw.githubusercontent.com/Lux-AI-Challenge/Lux-Design-2021/master/assets/game_board.png)

The map has various features including [Resources](#Resources) (Wood, Coal, Uranium), [Units](#Units) ([Workers](#Workers), [Carts](#Carts)), [CityTiles](#CityTiles), and [Road](#Roads).

In order to prevent maps from favoring one player over another, it is guaranteed that maps are always symmetric by vertical or horizontal reflection.

Each player will start with a single [CityTile](#CityTiles) and a single worker on that [CityTile](#CityTiles)

## Resources

There are 3 kinds of resources: Wood, Coal, and Uranium (in order of increasing fuel efficiency). These resources are collected by workers, then dropped off once a worker moves on top of a [CityTile](#CityTiles) to then be converted into fuel for the city. Some resources require research points before they are possible to collect.

Wood in particular can regrow. Each turn, every wood tile's wood amount increases by 1% of its current wood amount rounded up. Wood tiles that have been depleted will not regrow. Only wood tiles with less than 500 wood will regrow.

<table>
  <tr>
   <td>Resource Type
   </td>
   <td>Research Points<br>Pre-requisite
   </td>
   <td>Fuel Value<br>per Unit
   </td>
   <td>Units Collected<br>per Turn
   </td>
  </tr>
  <tr>
   <td>Wood
   </td>
   <td>0
   </td>
   <td>1
   </td>
   <td>20
   </td>
  </tr>
  <tr>
   <td>Coal
   </td>
   <td>50
   </td>
   <td>10
   </td>
   <td>5
   </td>
  </tr>
  <tr>
   <td>Uranium
   </td>
   <td>200
   </td>
   <td>40
   </td>
   <td>2
   </td>
  </tr>
</table>

### Collection Mechanics

At the end of each turn, [Workers](#Workers) automatically receive resources from all adjacent (North, East, South, West, or Center) resource tiles they can collect resources from according to the current formula:

- Uranium, coal, then wood tiles do the following in order:
  - Determine the number of eligible workers (adjacent and have required research level)
  - If there are enough resources left, each eligible worker receives up to the collection rate (or up to their carrying capacity)
  - If there aren't enough resources to give to all workers, the resources distributed are evenly divided between workers (rounded down to the nearest integer).

[Workers](#Workers) will always receive resources from the North, then West, Center, East, then South directions in that order.

[Workers](#Workers) cannot mine while on [CityTiles](#CityTiles). Instead, if there is at least one Worker on a CityTile, that CityTile will automatically collect adjacent resources at the same rate as a worker each turn and directly convert it all to fuel. The collection mechanic for a CityTile is the same as a worker and you can treat a CityTile as an individual Worker collecting resources.

## Actions

There are Units and CityTiles that can perform actions each turn given certain conditions. In general, all actions are simultaneously applied and are validated against the state of the game at the start of a turn. The next few sections describe the Units and CityTiles in detail.

## CityTiles

A CityTile is a building that takes up one tile of space. Adjacent CityTiles collectively form a City. Each CityTile can perform a single action provided the CityTile has a [Cooldown](#Cooldown) &lt; 1.

Actions

- Build Worker - Build [Worker](#Workers) unit on top of this CityTile (cannot build a worker if current number of owned workers + carts equals the number of owned CityTiles)
- Build Cart - Build [Carts](#Carts) unit on top of this CityTile (cannot build a cart if there are if current number of owned workers + carts equals the number of owned CityTiles)
- Research - Increase your team’s Research Points by 1

## Units

There are two unit types, [Workers](#Workers), and [Carts](#Carts). Every unit can perform a single action once they have a [Cooldown](#Cooldown) &lt; 1.

All units can choose the move action and move in any of 5 directions, North, East, South, West, Center. Moreover, all units can carry raw resources gained from automatic mining or resource transfer. [Workers](#Workers) are capped at 100 units of resources and [Carts](#Carts) are capped at 2000 units of resources.

Whenever a unit moves on top of a friendly [CityTile](#CityTiles), the City that [CityTile](#CityTiles) forms converts all carried resources into fuel.

There can be at most one unit on tiles without a [CityTile](#CityTiles). Moreover, units cannot move on top of the opposing team’s [CityTiles](#CityTiles). However, units can stack on top of each other on a friendly [CityTile](#CityTiles).

If two units attempt to move to the same tile that is not a [CityTile](#CityTiles), this is considered a collision and the move action is cancelled.

### Workers

Actions

- Move - Move the unit in one of 5 directions, North, East, South, West, Center.
- Pillage - Reduce the [Road](#Roads) level of the tile the unit is on by 0.5
- Transfer - Send any amount of a single resource-type from own cargo to another (start-of-turn) adjacent Unit, up to the latter's cargo-capcity. Excess is returned to the original unit.
- Build [CityTile](#CityTiles) - Build a [CityTile](#CityTiles) right under this worker provided the worker has 100 total resources of any type in their cargo (full cargo) and the tile is empty. If building is successful, all carried resources are consumed and a new [CityTile](#CityTiles) is built with 0 starting resources.

### Carts

Actions

- Move - Move the unit in one of 5 directions, North, East, South, West, Center.
- Transfer - Send any amount of a single resource-type from own cargo to another (start-of-turn) adjacent Unit, up to the latter's cargo-capcity. Excess is returned to the original unit.

## Cooldown

[CityTiles](#CityTiles), [Workers](#Workers) and [Carts](#Carts) all have a cooldown mechanic after each action. [Units](#Units) and [CityTiles](#CityTiles) can only perform an action when they have &lt; 1 Cooldown.

At the **end of each turn**, after [Road](#roads) have been built and pillaged, each unit's Cooldown decreases by 1 and further decreases by the level of the [Road](#Roads) the unit is on at the end of the turn. CityTiles are not affected by road levels however, cooldown decreases by 1 only for them. The minimum Cooldown is 0.

After an action is performed, the unit’s Cooldown will increase by a Base Cooldown.

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

## Roads

As [Carts](#Carts) travel across the map, they start to create roads which allow all [Units](#Units) to move faster (see [Cooldown](#Cooldown)). At the end of each turn, [Cart](#Carts) will upgrade the road level of the tile it ends on by 0.5. The higher the road level, the faster [Units](#Units) can move and perform actions. All tiles start with a road level of 0, and are capped at 6.

Moreover, [CityTiles](#CityTiles) automatically have the max road level of 6.

Roads can also be destroyed by [Workers](#Workers) via the pillage action which reduces road level by 0.5 each time.

If a City is consumed by darkness, the road level of all tiles in the City's CityTiles will go back to 0.

## Day/Night Cycle

The Day/Night cycle consists of a 40 turn cycle, the first 30 turns being day turns, the last 10 being night turns. There are a total of 360 turns in a match, forming 9 cycles.

During the night, [Units](#Units) and Cities need to produce light to survive. Each turn of night, each [Unit](#Units) and [CityTile](#CityTiles) will consume an amount of fuel, see table below for rates. [Units](#Units) in particular will use their carried resources to produce light whereas [CityTiles](#CityTiles) will use their fuel to produce light.

[Workers](#Workers) and [Carts](#Carts) will only need to consume resources if they are not on a [CityTile](#CityTiles). When outside the City, Workers and [Carts](#Carts) must consume whole units of resources to satisfy their night needs, e.g. if a worker carries 1 wood and 5 uranium on them, they will consume a full wood for 1 fuel, then a full uranium to fulfill the last 3 fuel requirements, wasting 37 fuel. [Units](#Units) will always consume the least efficient resources first.

Lastly, at night, [Units](#Units) gain 2x more Base [Cooldown](#Cooldown)

Should any [Unit](#Units) during the night run out of fuel, they will be removed from the game and disappear into the night forever. Should a City run out of fuel however, the entire City with all of the [CityTiles](#CityTiles) it owns will fall into darkness and be removed from the game.

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

## Game Resolution order

To help avoid confusion over smaller details of how each turn is resolved, we provide the game resolution order here and how actions are applied.

Actions in the game are first all validated against the current game state to see if they are valid. Then the actions, along with game events, are resolved in the following order and simultaneously within each step

1. [CityTile](#CityTiles) actions along with increased cooldown
2. [Unit](#Units) actions along with increased cooldown
3. [Roads](#Roads) are created
4. [Resource](#Resources) collection
5. [Resource](#Resources) drops on [CityTiles](#CityTiles)
6. If night time, make [Units](#Units) consume resources and [CityTiles](#CityTiles) consume fuel
7. Regrow wood tiles that are not depleted to 0
8. [Cooldowns](#Cooldown) are handled / computed for each unit and CityTile

The only exception to the validation criteria is that units may move smoothly between spaces, meaning if two units are adjacent, they can swap places in one turn. 

Otherwise, actions such as one unit building a CityTile, then another unit moving on top of the new CityTile, are not allowed as the current state does not have this newly built city and units cannot move on top of other units outside of CityTiles.

## Win Conditions

At the conclusion of 360 turns the winner is whichever team has the most [CityTiles](#CityTiles) on the map. If that is a tie, then whichever team has the most units owned on the board wins. If still a tie, the game is marked as a tie.

A game may end early if a team no longer has any more [Units](#Units) or [CityTiles](#CityTiles). Then the other team wins.

## Note on Game Rule Changes 
(This is also in the [competition rules](https://www.kaggle.com/c/lux-ai-2021/rules))

Our team at the Lux AI Challenge reserves the right to make any changes on game rules during the course of the competition. We will work to keep our decision-making as transparent as possible and avoid making changes late on in the competition.
