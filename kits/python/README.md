# Python Kit

This is the folder for the Python kit. Please make sure to read the instructions as they are important regarding how you will write a bot and submit it to our servers.

Make sure to check our [Discord](https://discord.gg/aWJt3UAcgn) or the [Kaggle forums](https://www.kaggle.com/c/lux-ai-2021/discussion) for announcements if there are any breaking changes.

## Getting Started

To get started, download the `simple` folder from this repository or via this URL: https://github.com/Lux-AI-Challenge/Lux-Design-2021/raw/master/kits/python/simple/simple.tar.gz

Then navigate to that folder via command line e.g. `cd simple` or for windows `chdir simple`.

Your main code will go into `agent.py` and you can create and use files to help you as well. You should leave `main.py` and the entire `lux` subfolder alone. Read the `agent.py` file to get an idea of how a bot is programmed and a feel for the Python API.

Make sure your default python is python 3.7 or above. To check, run `python -version`. To then test run your bot, run 

```
lux-ai-2021 main.py main.py --out=replay.json
```

which should produce no errors. If your default python is not 3.7 or above, please install it and set it as your default python. If you can't set it as the default python (so `python -version` gives 3.7 or above), then you provide the command that is version 3.7 or above e.g.

```
lux-ai-2021 main.py main.py --python=python3 --out=replay.json
```

If you find some bugs or unfixable errors, please let an admin know via Discord, the forums, or email us.

## Developing

Now that you have some code and you checked that your code works by trying to submit something, you are now ready to start programming your bot and having fun!

If you haven't read it already, take a look at the [design specifications for the competition](https://lux-ai.org/specs-2021). This will go through the rules and objectives of the competition.

All of our kits follow a common API through which you can use to access various functions and properties that will help you develop your strategy and bot. The markdown version is here: https://github.com/Lux-AI-Challenge/Lux-Design-2021/blob/master/kits/README.md

## Submitting to Kaggle

Submissions need to be a .tar.gz bundle with main.py at the top level directory
(not nested). To create a submission, `cd simple` then create the .tar.gz with
`tar -czvf submission.tar.gz *`. Upload this under the [My Submissions tab](https://www.kaggle.com/c/lux-ai-2021/submissions) and
you should be good to go! Your submission will start with a scheduled game vs
itself to ensure everything is working.

## FAQ

As questions come up, this will be populated with frequently asked questions regarding the Python kit.

**I just downloaded the kit and tried to run a match but I get SyntaxError: invalid syntax**

You most likely have your default python set to python version 2. Make sure to set your default python to python 3.7 or above, or run matches as so

```
lux-ai-2021 main.py main.py --python=python3 --out=replay.json
```

or replace the `python3` part with a suitable python interpreter that is callable from the CLI
