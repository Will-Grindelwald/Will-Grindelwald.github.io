#!/bin/bash

function usage(){
  echo "usage: ./setup.sh path/filename"
  exit 1
}

# init
if [ $# != 1 ]; then usage; fi

_tmp_convert_file_=$1_tmp

cp $1 $_tmp_convert_file_

sed -i "s/，/, /g" $_tmp_convert_file_
sed -i "s/；/; /g" $_tmp_convert_file_
sed -i "s/：/: /g" $_tmp_convert_file_
sed -i 's/“/"/g' $_tmp_convert_file_
sed -i 's/”/"/g' $_tmp_convert_file_
sed -i "s/‘/'/g" $_tmp_convert_file_
sed -i "s/’/'/g" $_tmp_convert_file_
sed -i "s/（/(/g" $_tmp_convert_file_
sed -i "s/）/)/g" $_tmp_convert_file_
sed -i "s/     $//g" $_tmp_convert_file_
sed -i "s/    $//g" $_tmp_convert_file_
sed -i "s/   $//g" $_tmp_convert_file_
sed -i "s/  $//g" $_tmp_convert_file_
sed -i "s/ $//g" $_tmp_convert_file_
./addSpace.js $_tmp_convert_file_
