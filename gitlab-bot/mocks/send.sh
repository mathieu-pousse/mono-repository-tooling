#!/bin/bash -e

[ ! -e $1 ] && echo "Could not find file to send..." && exit 1

file=$(basename $1 | sed "s/-.*.json//")

echo "X-GitHub-Event: $file >> $1"

curl -v -H "Content-Type: application/json" -H "X-GitHub-Event: $file" -d @$1 http://localhost:3000/tracker
