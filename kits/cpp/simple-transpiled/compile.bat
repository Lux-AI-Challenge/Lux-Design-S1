emcc -s FORCE_FILESYSTEM=1 -s INITIAL_MEMORY=134217728 --pre-js internals/init_fs.js main.cpp -o main.js
