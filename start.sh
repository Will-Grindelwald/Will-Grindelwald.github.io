#!/bin/bash

_THEME_=huno
_THEME_ADDRESS_=git://github.com/someus/huno.git

function diff(){
  if [ -d $1/source ]; then
    mv $1/source $1/source_$(date +%Y%m%d%H%M%S)
  fi
  cp -r source $1

  cp diff/layout.ejs $1/themes/huno/layout/
  cp diff/footer.ejs $1/themes/huno/layout/_partials/
  cp diff/social.ejs $1/themes/huno/layout/_partials/
  cp diff/side-panel.ejs $1/themes/huno/layout/_partials/
  cp diff/uno.css $1/themes/huno/source/css/
  cp diff/zh-CN.yml $1/themes/huno/languages/
  cp diff/github-repo-widget.ejs $1/themes/huno/layout/_scripts/
  cp diff/GitHubWidgets/js/github*.js $1/themes/huno/source/js/
  cp diff/GitHubWidgets/css/github*.css $1/themes/huno/source/css/
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

if [ ! -d diff/GitHubWidgets ]; then
  git clone https://github.com/smuyyh/GitHubWidgets.git diff/GitHubWidgets
  sed -i 's/strong>branch</strong> branch</g' diff/GitHubWidgets/js/github_repo_widget_en.js
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
    npm install gulp gulp-cache gulp-clean-css gulp-concat gulp-csscomb gulp-htmlclean gulp-htmlmin gulp-imagemin gulp-load-plugins gulp-uglify hexo-deployer-git hexo-generator-searchdb hexo-generator-sitemap imagemin-pngquant pangu pump --save
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
