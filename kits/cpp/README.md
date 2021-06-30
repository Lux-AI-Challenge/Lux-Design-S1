# C++ Kit

This is the folder for the C++ kit. Please make sure to read the instructions as they are important regarding how you will write a bot and submit it to our servers.

Make sure to check our discord or the Kaggle forum for announcements if there are any breaking changes.

## Getting Started

To get started, download the `simple` folder from this repository or via this URL: https://github.com/Lux-AI-Challenge/Lux-Design-2021/raw/master/kits/cpp/simple.zip

Then navigate to that folder via command line e.g. `cd simple` or for windows `chdir simple`.

Your main code will go into `main.cpp` and you can use create other files to help you as well. You should leave `main.py, compile.sh, package-lock.json, package.json` and the entire `lux` and `internals` subfolders alone. Read the `main.cpp` file to get an idea of how a bot is programmed and a feel for the C++ API.

The kit uses https://emscripten.org/ to transpile C++ to Web Assembly / JS which can then be run on the competition servers.

To setup, make sure to follow the instructions here https://emscripten.org/docs/getting_started/downloads.html. This will show you how to setup emscripten for Windows, Linux, or MacOS.

After setting up and running the `source ./emsdk_env.sh` (or `emsdk_env.bat` on Windows) command provided in the instructions, you should now have a program called `emcc` that you can run. 

To then test your installation and setup, run 

```
sh compile.sh
```

or if you are on windows, run

```
compile.bat
```

and this should generate a `main.wasm` and `main.js` file in your bot folder. To now test your transpiled bot, run

```
lux-ai-2021 main.js main.js
```

You can also test the untranspiled version of your bot via

```
lux-ai-2021 main.cpp main.cpp
```

which will compile your C++ normally. However, note that your submission bot **must include the transpiled version of the bot.** 

## Developing

Now that you have some code and you checked that your code works by trying to submit something, you are now ready to starting programming your bot and having fun!

If you haven't read it already, take a look at the [design specifications for the competition](https://lux-ai.org/specs-2021). This will go through the rules and objectives of the competition.

All of our kits follow a common API through which you can use to access various functions and properties that will help you develop your strategy and bot. The online version is hosted here: https://lux-ai.org/docs-2021, the markdown version is here: https://github.com/Lux-AI-Challenge/Lux-Design-2021/blob/master/kits/README.md

## FAQ

As questions come up, this will be populated with frequently asked questions regarding the C++ kit.