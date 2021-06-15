# C++ Kit

This is the folder for the C++ kit. Please make sure to read the instructions as they are important regarding how you will write a bot and submit it to our servers.

Make sure to check our discord or the Kaggle forum for announcements if there are any breaking changes.

## Getting Started

The kit uses https://emscripten.org/ to transpile C++ to Web Assembly which can be run on our servers and keeps everyone's code in the same language and makes it fair.

To setup, make sure to follow the instructions here https://emscripten.org/docs/getting_started/downloads.html. This will show you how to setup emscripten for Windows, Linux, or MacOS

After setting up and running the `source ./emsdk_env.sh` (or `emsdk_env.bat` on Windows) command provided in the instructions, you should now have a program called `emcc` that you can run. 

Now copy one of the folders, `organic` or `simple` which are two starting strategies provided by us along with the necessary infrastructure to compete in the competition. You may edit anything you want, but make sure to always have a `main.cpp` file that follows the structure given by us. 

## Submission to Competition

We **highly recommend** you read this section first before starting to code your bot

First navigate to the bot folder you are working in. Run the `compile.sh` or `compile.bat` program. This should automatically generate some transpiled Web Assembly (.wasm) and Javascript (.js) code in your folder. 

Now test your submission on the competition by going to [INSERT KAGGLE COMPETITION SUBMISSION LINK] and click ....

Zip your folder....


## Developing

Now that you have some code and you checked that your code works by trying to submit something, you are now ready to starting programming your bot and having fun!

If you haven't read it already, take a look at the [design specifications for the competition](). This will go through the rules and objectives of the competition. [TODO ADD LINK]

All of our kits follow a common API through which you can use to access various functions and properties that will help you develop your strategy and bot.

The online version is hosted here: [ADD API LINK], the markdown version is here: [ADD HERE]