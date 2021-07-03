#!/bin/bash

emcc -s FORCE_FILESYSTEM=1 --pre-js internals/init_fs.js main.cpp -o main.js
