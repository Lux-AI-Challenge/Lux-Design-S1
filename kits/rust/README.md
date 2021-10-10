# Rust Kit

This is the folder for the Rust kit. Please make sure to read the instructions as they are important regarding how you will write a bot and submit it to our servers.

Make sure to check our [Discord](https://discord.gg/aWJt3UAcgn) or the [Kaggle forums](https://www.kaggle.com/c/lux-ai-2021/discussion) for announcements if there are any breaking changes.

## Getting Started

To get started, download the `simple` folder from this repository.

Then navigate to that folder via command line e.g. `cd simple` or for windows `chdir simple`.

Your main code will go into `src/main.rs` and you can create other files to help you as well. You should leave `main.py, compile.sh, Dockerfile, makefile, Cargo.toml` and the entire `lux` folder alone. Read the `main.rs` file to get an idea of how a bot is programmed and a feel for the Rust API. Also please check documentation for `lux` crate by running `cargo doc --open`.

To be able to run on competition servers, we provide two options, either compile code on Ubuntu 18.04 into a binary via Docker, or transpile the code. Instructions for compilation are [here](#Compiling-Bot-for-submission).

## Developing

Now that you have some code and you checked that your code works by trying to submit something, you are now ready to start programming your bot and having fun!

If you haven't read it already, take a look at the [design specifications for the competition](https://lux-ai.org/specs-2021). This will go through the rules and objectives of the competition.

All of our kits follow a common API through which you can use to access various functions and properties that will help you develop your strategy and bot. The markdown version is here: https://github.com/Lux-AI-Challenge/Lux-Design-2021/blob/master/kits/README.md. However there may be some differences in function naming and signatures.

## Submitting to Kaggle

Before submitting, you must first compile your bot. To compile your bot, you must compile on Ubuntu 18.04 and there are simple instructions [in the next section](#Compiling-Bot-for-submission-using-native-build-tools), or if you want to use Docker, you may also [compile bot using Docker](#Compiling-Bot-for-submission-using-Docker).

Submissions need to be a `.tar.gz` bundle with `main.py` at the top level directory
(not nested). To create a submission first build solution using one of methods, then run following commands:
```shell
cd simple
mkdir -p build
cp main.py build/main.py
tar -czvf build/solution.tar.gz -C build/ build/main.py build/solution
```

Then upload file `build/solution.tar.gz` under the [My Submissions tab](https://www.kaggle.com/c/lux-ai-2021/submissions) and
you should be good to go! Your submission will start with a scheduled game vs
itself to ensure everything is working.

### Compiling Bot for submission using native build tools

To compile natively you need [nightly Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) local installation, follow instructions there to set up it.

To build solution you can either use `cargo` directly by running following command from `simple` folder:
```shell
cargo build --release --bin solution
```

Or you can use `Make` tool by running following command from `simple` folder:
```shell
USE_DOCKER=0 make solution-build
```

You can also use `Make` to create submission package, it will store submission in folder `simple/build/solution.tar.gz`:
```shell
USE_DOCKER=0 make submission-build
```
And you may submit this file to Kaggle competition!

### Compiling Bot for submission using Docker

This method requires Docker, installation instructions are [here](https://docs.docker.com/get-docker/). Once Docker is installed, make sure it is running.

Now you have two options.
Fist one is to use `compile.sh` script to compile whole solution by running:
```shell
sh compile.sh cargo build --release --bin solution
```

Or you can use `Make` rule by running:
```shell
USE_DOCKER=1 make solution-build
```

Which will use the `src/main.rs` file in your current directory and produce the `build/solution` binary. Then use packaging instructions [here](#Submitting-to-Kaggle) and submit produced archive to Kaggle!

Alternative path will be create submission package using `Make`:
```shell
USE_DOCKER=1 make submission-build
```
And now you may submit created package `build/submission.tar.gz` to Kaggle competition!

## FAQ

As questions come up, this will be populated with frequently asked questions regarding the Rust kit.

