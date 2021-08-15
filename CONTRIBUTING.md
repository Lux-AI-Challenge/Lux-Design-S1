# Lux AI Challenge Season 1 Contributing Guide

If you find a bug or have a feature request, please open an issue [here](https://github.com/Lux-AI-Challenge/Lux-Design-2021/issues) or let us know on our discord, the forums etc.

Want to make an contribution? Create an issue to this repository detailing what you want to change and if approved, make a pull request to this repository with your contribution! If you aren't sure about what to contribute on, check out our [open issues](https://github.com/Lux-AI-Challenge/Lux-Design-2021/issues). Make sure before you start contributing that you fork the repository and use the latest version branch (they are labeled as vx.y.z where e.g v4.2.x would be considered above v4.1.x)

And of course, please be aware of and read the [Code Of Conduct](https://github.com/Lux-AI-Challenge/Lux-Design-2021/blob/master/CODE_OF_CONDUCT.md)

## Development Setup

First clone this repository. Navigate to the cloned repository and run

```
npm install
```

to install all necessary dependencies for development on the Lux AI Challenge design and engine.

This repository is organized as follows

- src/ - all code related to the Season 1 design and the game logic
- kits/ - all code for the starter kits that allow competitors to develop strategies and compete
- tests/ - various tests

## Contributing Starter Kits

If you are interested in contributing a starter kit for a language that is not currently supported, please post an issue about it on our [issue tracker](https://github.com/Lux-AI-Challenge/Lux-Design-2021/issues) so that people do not accidentally do the same things.

Here are a few things to be aware of. The competition servers currently run on Ubuntu 18.04, and has Python, NodeJS, and Java installed on the system, along with a whole ton of other Python packages. Hence, any language that can compile to machine code / binaries can be easily added to the competition. 

If you want to get started, we recommend copying the structure of the folder `src/kits/cpp`. We require you to provide a README similar to the other kit readme's, along with documentation on how to get started compiling code, then running a match using the compiled code. 

Moreover, for compiled languages, we recommend also copying over the `compile.sh` script and `Dockerfile` in `src/kits/cpp/simple/` if the language's compiled binaries are OS dependent. For example, for the C++ kit, the dockerfile is used to compile the C++ agent code on Ubuntu 18.04 so then that code can be submitted to the competition servers.

If you have any questions or need help adding a starter kit, the Lux AI team is more than happy to help! Message us anywhere (preferably Github).

