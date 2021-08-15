#!/bin/bash

rm -fv $(find "./kits"  -name "*.class")
rm -fv $(find "./kits"  -name "*.out")
rm -fv $(find "./kits/ts"  -name "*.js")
rm -rfv $(find "./kits/python"  -name "__pycache__")
rm -fv $(find "./kits"  -name ".DS_Store")
rm -rf ./.nyc_output
rm -rf ./coverage