# C++ Kit

This is the folder for the C++ kit. Please make sure to read the instructions as they are important regarding how you will write a bot and submit it to our servers.

Make sure to check our [Discord](https://discord.gg/aWJt3UAcgn) or the [Kaggle forums](https://www.kaggle.com/c/lux-ai-2021/discussion) for announcements if there are any breaking changes.

## Getting Started

To get started, download the `simple` or `simple-transpiled` folder from this repository or via these URLs: 
- https://github.com/Lux-AI-Challenge/Lux-Design-2021/raw/master/kits/cpp/simple/simple.tar.gz

- https://github.com/Lux-AI-Challenge/Lux-Design-2021/raw/master/kits/cpp/simple-transpiled/simple-transpiled.tar.gz

`simple` uses Docker to prepare bots for submission to the competition whereas `simple-transpiled` uses emscripten to transpile the bot to JS code to prepare for submission. `simple` is highly recommended. You will only need to use these tools just for submission, local development does not require these.

Now navigate to that folder via command line e.g. `cd simple` or for windows `chdir simple`.

Your main code will go into `main.cpp` and you can use create other files to help you as well. You should leave `main.py, compile.sh, package-lock.json, package.json` and the entire `lux` and `internals` subfolders alone. Read the `main.cpp` file to get an idea of how a bot is programmed and a feel for the C++ API.

To be able to run on competition servers, we provide two options, either compile code on Ubuntu 18.04 into a binary via Docker, or transpile the code. Instructions for compilation are [here](#Compiling-Bot-for-submission), for transpilation are [here](#Transpiling-Bot-for-submission)

For transpiled bots you may test as so

```
lux-ai-2021 main.js main.js --out=replay.json
```

For bots you wish to compile normally, compile them first into a single binary. We recommend running
```
g++ main.cpp -O3 -std=c++11 -o main.out
```

and then run a match as so

```
lux-ai-2021 main.out main.out --out=replay.json
```

## Developing

Now that you have some code and you checked that your code works by trying to submit something, you are now ready to start programming your bot and having fun!

If you haven't read it already, take a look at the [design specifications for the competition](https://lux-ai.org/specs-2021). This will go through the rules and objectives of the competition.

All of our kits follow a common API through which you can use to access various functions and properties that will help you develop your strategy and bot. The markdown version is here: https://github.com/Lux-AI-Challenge/Lux-Design-2021/blob/master/kits/README.md

## Submitting to Kaggle

Before submitting, you must first compile your bot or transpile it. To compile your bot, you must compile on Ubuntu 18.04 and there are simple instructions [in the next section](#Compiling-Bot-for-submission). If you do not want to use Docker, you may also [transpile your bot to JS for submission](#Transpiling-Bot-for-submission)

Submissions need to be a .tar.gz bundle with main.py at the top level directory
(not nested). To create a submission, `cd simple` then create the .tar.gz with
`tar -czvf submission.tar.gz *`. Upload this under the [My Submissions tab](https://www.kaggle.com/c/lux-ai-2021/submissions) and
you should be good to go! Your submission will start with a scheduled game vs
itself to ensure everything is working.

### Compiling Bot for submission

This method requires Docker, installation instructions are [here](https://docs.docker.com/get-docker/). If you want to avoid using Docker, we may provide a online compilation service that does this for you but this is TBD, please be alert to announcements for whether this happens.

Once Docker is installed, make sure it is running and now in the bot folder there is a compile.sh which is a wrapped around the `g++` compiler but running on Ubuntu 18.04 (the system that competition servers run on).

You can compile a bot normally and treat the tool as `g++` itself like so

```
sh compile.sh main.cpp -O3 -std=c++11 -o main.out
```

Which will use the `main.cpp` file in your current directory and produce the `main.out` binary. Then run `tar -czvf submission.tar.gz *` and submit that to the competition!


### Transpiling Bot for submission

This is the least recommended method of submission as transpilation may have errors.

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
lux-ai-2021 main.js main.js --out=replay.json
```

Note that your submission **must include the transpiled version of the bot.** 

## FAQ

As questions come up, this will be populated with frequently asked questions regarding the C++ kit.

**I get Error: spawn ETXTBSY when running a match**

This is a known issue. See https://github.com/Lux-AI-Challenge/Lux-Design-2021/issues/71 for current resolution.

