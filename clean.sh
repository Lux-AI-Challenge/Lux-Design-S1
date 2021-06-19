#!/bin/bash

rm -fv $(find "./kits"  -name "*.class")
rm -fv $(find "./kits"  -name "*.out")
rm -fv $(find "./kits/ts"  -name "*.js")

rm -rf ./.nyc_output
rm -rf ./coverage