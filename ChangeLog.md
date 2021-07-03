# Change Log

### v1.2.0
New:
- Via the CLI tool, replays can be converted into stateful replays and you can also directly generate stateful replays. Run the help command for instructions on how to do so.
- Through the JS API, you can now start a match and reset its state to a given state (following the schema stored in the stateful replays) and continue running the match as normal. This is *not* provided via the CLI tool at the moment.
- Python kit made to be more intuitive and has better syntactical sugar

Changes:
- Cell cooldown (which is the road level) now renamed to road in all kits and in game engine code. Same with all the constants files too.
- All kits default to using manhattan distance now instead of euclidean.
- Some code refactoring
- Bin file / CLI tool has its own dedicated folder now.
- Moved get results function from design.ts to logic.ts and made it statci / functional

Fixes:
- Fix bug where wood tiles may spawn under cities when the starting 2 city tiles are adjacent
- Fix bug with header files in the C++ kit.
- Fix errorneous comment in JS kit
- Fix various typos in kits and specs

### v1.1.2
Fixes:
- One off error with day/night cycle
- Carts consuming fuel rate at rate workers consume
- Fixed error messages to say CityTiles instead of City when referring to the actual tiles/buildings

Changes:
- Visualizer will no longer accept replays without the same minor version number (2nd digit in vx.y.z)

### v1.0.0

Initial release!
