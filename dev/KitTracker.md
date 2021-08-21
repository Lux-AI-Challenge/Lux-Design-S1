# Kit Tracker

A list of every tracker and their constants file / location

| Kit Type | Path                    | Variants and Locations                                       |
| -------- | ----------------------- | ------------------------------------------------------------ |
| JS       | lux/game_constants.json | kits/js/simple, kaggle-environments/.../lux_ai_2021/test_agents/{js_simple} |
| TS       | lux/game_constants.json | kits/ts/simple |
| C++      | lux/constants.hpp       | kits/cpp/{simple, simple-transpiled}                                   |
| Python   | lux/constants.json      | kits/python/{simple}, kaggle-environments/.../lux_ai_2021/test_agents/python/lux/game_constants.json |
| Java     | lux/Constants.java      | kits/java/{simple}                                   |

All kits have a constants.json, not all of them use it though, but they should always be in sync.