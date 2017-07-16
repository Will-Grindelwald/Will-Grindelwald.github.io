#!/bin/bash

_THEME_=next

function usage(){
  echo "usage: ./generate.sh"
  echo "usage: ./generate.sh gh-pages"
  echo "usage: ./generate.sh coding-pages"
  exit 1
}

if [ $# -gt 1 ]; then usage; fi

if [ $# = 0 ]; then
  ./generate.sh gh-pages &
  ./generate.sh coding-pages &
  wait;
elif [ $1 = gh-pages -o $1 = coding-pages ]; then
  if [ -d $1/source/_posts ]; then
    mv $1/source/_posts $1/source/_posts_$(date +%Y%m%d%H%M%S) > /dev/null
  fi
  mkdir $1/source/_posts
  if [ -d $1/source/images ]; then
    mv $1/source/images $1/source/_images_$(date +%Y%m%d%H%M%S) > /dev/null
  fi
  cp -r article/images $1/source
  find article/ -name "*.md" -exec cp {} $1/source/_posts \;

  cd $1/
  hexo clean
  hexo g
  cp source/*.html public/
  gulp
  cd -

  if [ $1 = gh-pages ]; then
    cp $1/gulpfile.js config/
    cp $1/_config.yml config/_config_gh.yml
    cp $1/themes/$_THEME_/_config.yml config/_config_$_THEME_.yml
  else
    cp $1/_config.yml config/_config_coding.yml
  fi
else usage;
fi
