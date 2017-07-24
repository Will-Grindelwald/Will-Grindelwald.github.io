#!/bin/bash

function usage(){
  echo "usage: ./deploy.sh"
  echo "usage: ./deploy.sh gh-pages"
  echo "usage: ./deploy.sh coding-pages"
  exit 1
}

if [ $# -gt 1 ]; then usage; fi

if [ $# = 0 ]; then
  ./deploy.sh gh-pages &
  ./deploy.sh coding-pages &
  wait;
elif [ $1 = gh-pages -o $1 = coding-pages ]; then
  cd $1
  hexo d
else usage;
fi
