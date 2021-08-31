#!/bin/bash

java -agentlib:jdwp=transport=dt_socket,server=y,quiet=y,suspend=y,address=*:5005 -jar bot/build/libs/bot-all.jar
