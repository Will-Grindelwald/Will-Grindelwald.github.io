#!/bin/bash

_THEME_=next
_THEME_ADDRESS_=https://github.com/iissnan/hexo-theme-next

function diff(){
  if [ -d $1/source ]; then
    mv $1/source $1/source_$(date +%Y%m%d%H%M%S)
  fi
  cp -r source $1

  cp draft/post.md $1/scaffolds/
  cp diff/zh-Hans.yml $1/themes/next/languages/
  cp diff/sidebar-author.styl $1/themes/next/source/css/_common/components/sidebar/
  cp diff/busuanzi-counter.styl $1/themes/next/source/css/_common/components/third-party/
  cp diff/custom.styl $1/themes/next/source/css/_variables/
  if [ $1 = coding-pages ]; then
    cp diff/footer.swig $1/themes/next/layout/_partials/
  fi
}

function usage(){
  echo "usage: ./start.sh"
  echo "usage: ./start.sh gh-pages"
  echo "usage: ./start.sh coding-pages"
  exit 1
}

if [ $# -gt 1 ]; then usage; fi

if [ ! -d $_THEME_ ]; then
  npm install hexo-cli -g
  git clone $_THEME_ADDRESS_ $_THEME_
fi

if [ $# = 0 ]; then
  ./start.sh gh-pages &
  ./start.sh coding-pages &
  wait;
elif [ $1 = gh-pages -o $1 = coding-pages ]; then
  if [ ! -d $1 ]; then
    hexo init $1
    cp -r $_THEME_ $1/themes
    cd $1
    npm install
    npm install gulp gulp-cache gulp-clean-css gulp-concat gulp-csscomb gulp-htmlclean gulp-htmlmin gulp-imagemin gulp-load-plugins gulp-uglify hexo-deployer-git hexo-generator-feed hexo-generator-searchdb hexo-generator-sitemap hexo-wordcount imagemin-pngquant pangu pump --save
    cd -
  fi

  # config
  cp config/gulpfile.js $1
  if [ $1 = gh-pages ]; then
    cp config/_config_gh.yml $1/_config.yml
  else
    cp config/_config_coding.yml $1/_config.yml
  fi
  cp config/_config_$_THEME_.yml $1/themes/$_THEME_/_config.yml

  # diff
  diff $1
else usage;
fi
