#!/bin/bash

need_build=false
need_container=false

if [[ "$(docker images -q "luxairust_compiler" 2> /dev/null)" == "" ]]; then
  need_build=true
fi

if [[ "$(docker ps | grep -w "luxairust_compiler")" == "" ]]; then
  need_container=true
fi

setup () {
  if [ $need_build = true ]; then
    docker build \
      -t "luxairust_compiler" \
      -f "./Dockerfile" \
      .
  fi

  if [ $need_container = true ]; then
    mkdir -p "$(pwd)/build/target/"
    container_id=$(docker run -it -d \
      -u $$(shell id -u):$$(shell id -g) \
		  --name "luxairust_compiler" \
      -v $(pwd)/build/target/:/root/target/ \
      -v $(pwd):/root \
      -w /root \
      --rm "luxairust_compiler" bash)
    echo Started compile container $container_id
  fi
}

compile () {
  # example: cargo build --release --bin solution
  docker exec -w "/root" "luxairust_compiler" $@
}

setup
if [ $# -eq 0 ]; then
  compile cargo build --release --bin solution
else
  compile $@
fi

cp $(pwd)/target/release/solution $(pwd)
