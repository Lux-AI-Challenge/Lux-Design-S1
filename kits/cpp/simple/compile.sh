#!/bin/sh

# create image if necessary
docker build -t luxaicpp

# start container
docker start 

# run something instead
docker run -it --name test --rm luxaicpp bash


# copy bot to docker container
docker cp . luxaicpp:/root                 

docker cp luxaicpp:/root/main.out main.out



# test bot
kaggle-environments run --environment lux_ai_2021 --agents bot/main.py bot/main.py --render '{"mode": "json"}' --out out.json --debug=True