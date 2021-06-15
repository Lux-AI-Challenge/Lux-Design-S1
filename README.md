# LuxDesign

This repository will hold the game logic file (the Design), all the public Docker images bots are run on, and starter kits for every language

Change this name some time later

## Getting Started

Install the design with

```
npm install -g lux-ai-challenge-2020
```

To run a match from command line, simply run

```
lux-ai-run path/to/bot path/to/otherbot
```

and the match will run with some logging and store error logs and a replay in a new `errorlogs` folder and `replays` folder

The `kits` folder in this repository holds all of the available starter its you can use to start competing and building an AI agent.


## Development

First install all necessary dependencies via

```
npm install
```

To run tests, run

```
npm test
```

## Publishing

Whenever a change is made to game logic, first build the new package via

```
npm run build
```


Then a few places need to be updated. First, the Lux Design package hosted on npm needs to be updated. This is done via first changing the package version to a higher one, then running

```
npm publish
```

Next, the visualizer needs an update. In the visualizer's repository, make sure to install the latest Lux Design hosted on npm that was just updated, then push that change to master.

Next, Kaggle Environments needs to receive an update. In `kaggle_engine` folder