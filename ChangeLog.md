# Change Log

### v2.1.0

- Docker option for compilation for C++ bots (preferred) and arbitrarily any other languages that can be compiled to a machine executable
- Any 100 resources held by worker can be used to build a city. Will expend in order of wood, coal, then uranium to build a city (which in current specs means all held resources)
- Changed syntax for text annotations
- Starter kits have been updated with new readmes, apis, etc. and should be redownloaded
- Python users can now specify which python command to use if their default python is not python 3.7 e.g. `lux-ai-2021 bot1 bot2 --python=python3`

Full Changelog:

New:
- Docker option for compilation for C++ bots (preferred) and arbitrarily any other languages that can be compiled to a machine executable
- Any 100 resources held by worker can be used to build a city. Will expend in order of wood, coal, then uranium to build a city (which in current specs means all held resources)
- CLI tool accepts a `--memory` argument to specify max amount of memory in MB allowed for agents
- Python users can now specify which python command to use if their default python is not python 3.7 e.g. `lux-ai-2021 bot1 bot2 --python=python3`


Changes:
- Changed syntax for text annotations
- Starter kits have been updated with new readmes, apis, etc. and should be redownloaded

Fixes: 
- Java, Python, C++ kits have correct annotation commands
- CLI tool's engine tiebreaker now matches Kaggle's

### v2.0.2

- Wood auto regrows each turn by 1% of its current valued rounded upwards and is capped at 400. Wood tiles with more than 400 wood do not regrow.
- Uranium made more powerful. Collect at 4/turn and convert in ratio of 1 uranium to 20 fuel
- Pilage rate bumped up to 0.5
- Resource generation has been tweaked
- Starter kits now updated with main.py files that will output stderr to kaggle servers, previously it did not
- Maps are restricted to square sizes only now, with sizes being 12, 16, 24, 32
- Bug fixes

Full Changelog:

New: 

- Wood auto regrows each turn by 1% of its current valued rounded upwards and is capped at 400. Wood tiles with more than 400 wood do not regrow.
- Uranium made more powerful. Collect at 4/turn and convert in ratio of 1 uranium to 20 fuel
- Pilage rate bumped up to 0.5
- Resource generation has been tweaked

Fixes:
- Resources sorted correctly
- Workers now actually spend 100 wood to build cities.
- Starter kits now updated with main.py files that will output stderr to kaggle servers, previously it did not


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
