#!/bin/sh

# pull all relevant images
docker pull node:12.18.4

# start server (use pm2 later)
node lib/server.js