#!/bin/sh

need_build=false
need_container=false

if [[ "$(docker images -q luxaicpp_compiler 2> /dev/null)" == "" ]]; then
  need_build=true
fi

if [[ "$(docker ps | grep -w "luxaicpp_compiler")" == "" ]]; then
  need_container=true
fi

setup () {
  if [ $need_build = true ]; then
    docker build -t luxaicpp_compiler .
  fi

  if [ $need_container = true ]; then
    container_id=$(docker run -it -d --name luxaicpp_compiler -v $(pwd)/:/root --rm luxaicpp_compiler bash)
    echo Started compile container $container_id
  fi
}

compile () {
  
  # example main.cpp -O3 -o main.out
  docker exec -w /root luxaicpp_compiler g++ $@
}

setup
if [ $# -eq 0 ]; then
  compile main.cpp -O3 -std=c++11 -o main.out
else
  compile $@
fi



# test bot
# kaggle-environments run --environment lux_ai_2021 --agents bot/main.py bot/main.py --render '{"mode": "json"}' --configuration '{"seed": 0}' --out out.json --debug=True
# docker cp test:/usr/src/app/kaggle_environments/out.json out.json