#!/bin/sh

need_build=false
need_container=false
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if [[ "$(docker images -q luxai 2> /dev/null)" == "" ]]; then
  need_build=true
fi

if [[ "$(docker ps | grep -w "luxai_runner")" == "" ]]; then
  need_container=true
fi

setup () {
  if [ $need_build = true ]; then
    docker build -t luxai https://github.com/Lux-AI-Challenge/Lux-Design-2021/raw/master/Dockerfile
  fi

  if [ $need_container = true ]; then
    container_id=$(docker run -it -d --name luxai_runner -v $(pwd)/:/root --rm luxai bash)
    echo Started runner container $container_id
  fi
}

run () {
  
  # example main.py main.py --out=replays/out.json
  # NOTE, to use --out, you must pick replays as the folder or else it won't be copied over.

  docker exec -w /root luxai_runner lux-ai-2021 $@
}

setup
run $@