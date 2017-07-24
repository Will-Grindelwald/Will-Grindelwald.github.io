#!/bin/bash

function usage(){
  echo "usage: ./formatAll.sh path"
  exit 1
}

# init
if [ $# != 1 ]; then usage; fi

find $1 -name *.md -exec ./format.sh {} \;
