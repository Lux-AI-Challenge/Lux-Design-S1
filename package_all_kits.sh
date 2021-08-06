#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

(cd $SCRIPT_DIR && sh $SCRIPT_DIR/clean.sh)

(cd $SCRIPT_DIR/kits/cpp/simple && tar -czvf simple.tar.gz *)
(cd $SCRIPT_DIR/kits/cpp/simple-transpiled && tar -czvf simple-transpiled.tar.gz *)
(cd $SCRIPT_DIR/kits/python/simple && tar -czvf simple.tar.gz *)
(cd $SCRIPT_DIR/kits/java/simple && tar -czvf simple.tar.gz *)
(cd $SCRIPT_DIR/kits/js/simple && tar -czvf simple.tar.gz *)
(cd $SCRIPT_DIR/kits/ts/simple && tar -czvf simple.tar.gz *)