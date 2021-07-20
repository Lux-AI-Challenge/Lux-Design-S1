# Python Kit

This is the folder for the Python kit. Please make sure to read the instructions as they are important regarding how you will write a bot and submit it to our servers.

Make sure to check our discord or the Kaggle forum for announcements if there are any breaking changes.

## Getting Started

To get started, download the `simple` folder from this repository or via this URL: https://github.com/Lux-AI-Challenge/Lux-Design-2021/raw/master/kits/python/simple.zip

Then navigate to that folder via command line e.g. `cd simple` or for windows `chdir simple`.

Your main code will go into `agent.py` and you can create and use files to help you as well. You should leave `main.py` and the entire `lux` subfolder alone. Read the `agent.py` file to get an idea of how a bot is programmed and a feel for the Python API.

Make sure your default python is python 3.7 or above. To check, run `python -version`. To then test run your bot, run 

```
lux-ai-2021 main.py main.py
```

which should produce no errors. If you find some bugs or unfixable errors, please let an admin know via Discord, the forums, or email us.

## Developing

Now that you have some code and you checked that your code works by trying to submit something, you are now ready to starting programming your bot and having fun!

If you haven't read it already, take a look at the [design specifications for the competition](https://lux-ai.org/specs-2021). This will go through the rules and objectives of the competition.

All of our kits follow a common API through which you can use to access various functions and properties that will help you develop your strategy and bot. The markdown version is here: https://github.com/Lux-AI-Challenge/Lux-Design-2021/blob/master/kits/README.md

## Submitting to Kaggle

Submissions need to be a .tar.gz bundle with main.py at the top level directory
(not nested). To create a submission, `cd simple` then create the .tar.gz with
`tar -czvf submission.tar.gz *`. Upload this under the My Submissions tab and
you should be good to go! Your submission will start with a scheduled game vs
itself to ensure everything is working.

## FAQ

As questions come up, this will be populated with frequently asked questions regarding the Python kit.
