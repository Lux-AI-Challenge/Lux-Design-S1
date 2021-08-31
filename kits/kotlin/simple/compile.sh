#!/bin/bash

gradle clean shadowJar

# test bot
# kaggle-environments run --environment lux_ai_2021 --agents bot/main.py bot/main.py --render '{"mode": "json"}' --configuration '{"seed": 0}' --out out.json --debug=True
# docker cp test:/usr/src/app/kaggle_environments/out.json out.json
