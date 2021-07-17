# Change Log

### v1.2.2

Changes:
- Output messages to agents after match is declared over


### v1.2.0

- CLI tool now lets you convert replays into replays with human readable state information and can also directly run matches and generate these stateful replays. You can also choose where the replay file is stored at. Moreover the tool has some syntax changes.
- Through the JS API only, you can reset a match's state to a given state (following the schema stored in stateful replays)
- You can now debug by adding text onto the game map or onto the side using two new debug functions
- All kits have been upgraded to have nicer syntax, along with a few bug fixes. Please download the new kits
- Cell `cooldown` is now renamed to `road` in all kits. 
- Typescript kit has been added!

Full ChangeLog:

New:
- CLI tool now lets you convert replays into replays with human readable state information and can also directly run matches and generate these stateful replays. You can also choose where the replay file is stored at. Moreover the tool has some syntax changes.
- Through the JS API, you can now start a match and reset its state to a given state (following the schema stored in the stateful replays) and continue running the match as normal. This is *not* provided via the CLI tool at the moment.
- Python kit made to be more intuitive and has better syntactical sugar
- Typescript kit has been added!

Changes:
- Cell cooldown (which is the road level) now renamed to road in all kits and in game engine code. Same with all the constants files too.
- All kits default to using manhattan distance now instead of euclidean.
- Some code refactoring
- Bin file / CLI tool has its own dedicated folder now.
- Moved get results function from design.ts to logic.ts and made it static / functional

Fixes:
- Fix bug where wood tiles may spawn under cities when the starting 2 city tiles are adjacent
- Fix bug with header files in the C++ kit.
- Fix errorneous comment and erroneous transfer function in JS kit
- Fix various typos in kits and specs
- Some undefined errors with map gen

### v1.1.2
Fixes:
- One off error with day/night cycle
- Carts consuming fuel rate at rate workers consume
- Fixed error messages to say CityTiles instead of City when referring to the actual tiles/buildings

Changes:
- Visualizer will no longer accept replays without the same minor version number (2nd digit in vx.y.z)

### v1.0.0

Initial release!
