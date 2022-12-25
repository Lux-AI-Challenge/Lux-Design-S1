# C# Kit

This is the folder for the C# kit. Please make sure to read the instructions as they are important regarding how you will write a bot and submit it to the competition servers.

Make sure to check our [Discord](https://discord.gg/aWJt3UAcgn) or the [Kaggle forums](https://www.kaggle.com/c/lux-ai-2021/discussion) for announcements if there are any breaking changes.

## Getting Started

To get started, download the `simple` folder from this repository.

Then navigate to that folder via command line e.g. `cd simple` or for windows `chdir simple`.

Your main code will go into `Bot/Bot.cs` and you can use create other files to help you as well. You should leave `main.py` and the `Lux` package alone in `Bot/`. Read the `Bot.Kt` file to get an idea of how a bot is programmed and a feel for the C# API.

Make sure you have dotnet core 3.1 (higher versions are probably fine too).

To confirm your setup, in your bot folder run

```
compile.bat
```

and this should produce a `Bot.dll` file in `Bot/bin/Release/netcoreapp3.1` which comprise your compiled bot. To then test run your bot, run

```
lux-ai-2021 run.bat run.bat --out=replay.json
```

which should produce no errors.

To debug your bot locally you can use any remote dotnet debugger (embedded in your preferred IDE).
First, start a game with `debug.bat` script (also increase the bot timeout):

```lux-ai-2021 run.sh debug.sh --maxtime=9999999```

Then, connect the debugger to the running process. Now you can use breakpoints and other debug features!

If you find some bugs or unfixable errors, please let an admin know via Discord, the forums, or email us.

Note that your submitted bot must include the compiled `.dll` file with it or else it will not work on the competition servers.

## Developing

Now that you have some code and you checked that your code works by trying to submit something, you are now ready to start programming your bot and having fun!

If you haven't read it already, take a look at the [design specifications for the competition](https://lux-ai.org/specs-2021). This will go through the rules and objectives of the competition.

All of our kits follow a common API through which you can use to access various functions and properties that will help you develop your strategy and bot. The markdown version is here: https://github.com/Lux-AI-Challenge/Lux-Design-2021/blob/master/kits/README.md

## Submitting to Kaggle

Not ready yet.

