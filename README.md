# Lux AI Challenge: Season 1

Welcome to the season 1 of the Lux AI Challenge! This repository is the entire codebase that runs the game engine for your bots to compete on. 

This was built by the Lux AI Challenge team, using the [Dimensions](https://github.com/StoneT2000/Dimensions) package.

Here are some important links:

Season 1 Specifications: https://lux-ai.org/specs-2021

Bot API Documentation: https://github.com/Lux-AI-Challenge/Lux-Design-2021/tree/master/kits

Competition Discord (for announcements, strategy talk etc.): https://discord.com/invite/DZSm47VHMz

Competition Leaderboard: Not yet released

The visualizer for the competition is at https://2021vis.lux-ai.org/. To get a local copy of the visualizer, see https://github.com/Lux-AI-Challenge/LuxViewer2021

![](./assets/game_replay.gif)

## Getting Started

You will need Node.js version 12 or above. See installation instructions [here](https://nodejs.org/en/download/), you can just download the recommended version.

Open up the command line, and install the competition design with

```
npm install -g @lux-ai/2021-challenge
```

To run a match from the command line (CLI), simply run

```
lux-ai-2021 path/to/botfile path/to/otherbotfile
```

and the match will run with some logging and store error logs and a replay in a new `errorlogs` folder and `replays` folder

For a full list of commands from the CLI, run

```
lux-ai-2021 --help
```

or go to the [next section](#CLI-Usage) to see more instructions on how to use the command line tool.

The [kits](https://github.com/Lux-AI-Challenge/Lux-Design-2021/tree/master/kits) folder in this repository holds all of the available starter kits you can use to start competing and building an AI agent and show you how to get started with your language of choice and run a match with that bot. You can also follow the following direct links

- Python: https://github.com/Lux-AI-Challenge/Lux-Design-2021/tree/master/kits/python
- Javascript: https://github.com/Lux-AI-Challenge/Lux-Design-2021/tree/master/kits/js
- C++: https://github.com/Lux-AI-Challenge/Lux-Design-2021/tree/master/kits/cpp
- Java: https://github.com/Lux-AI-Challenge/Lux-Design-2021/tree/master/kits/java

To stay up to date on changes and updates to the competition and the engine, see https://github.com/Lux-AI-Challenge/Lux-Design-2021/blob/master/ChangeLog.md or watch for announcements on the forums or the [Discord](https://discord.com/invite/DZSm47VHMz)

## CLI Usage

The CLI tool has several options. For example, one option is the seed and to set a seed of 100 simply run

```
lux-ai-2021 --seed=100 path/to/botfile path/to/otherbotfile
```

which will run a match using seed 100.

You can tell the CLI tool whether to store the agent logs or match replays via `--storeLogs, --storeReplay`. Set these boolean options like so

```
# to set to true
lux-ai-2021 --statefulReplay
# to set to false
lux-ai-2021 --storeLogs=false
```

By default the tool will generate minimum, **action-based**, replays that are small in size and work in the visualizer but it does not have state information e.g. resources on the map in each turn. To generate **stateful** replays, set the `--statefulReplay` option to true. To convert a action-based replay to a stateful one, set the `--convertToStateful` option to true and pass the file to convert.

Choose where the replay file is stored at by setting `--out=path/to/file.json`

You can also change the logging levels by setting `--loglevel=x` for number x from 0 to 4. The default is 2 which will print to terminal all game warnings and errors.

## Contributing

See the [guide on contributing](https://github.com/Lux-AI-Challenge/Lux-Design-2021/tree/master/CONTRIBUTING.md)

## Authors

Original design for season 1 concevied by [Bovard](https://github.com/bovard) and [Stone](https://github.com/StoneT2000)

UI/UX Design by [Isa](https://github.com/p-isa)

With balance testing help from [David](https://github.com/holypegasus)
