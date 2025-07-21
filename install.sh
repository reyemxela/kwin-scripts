#!/usr/bin/env bash

if [[ $1 == "-g" ]]; then
  global="-g"
  shift
fi

if [ $# -lt 1 ]; then
  echo "Usage: $0 [-g] <foldername>"
  echo "  -g | Install globally (/usr/share)"

  exit 0
fi

folder="$1"

if [ ! -d "$folder" ]; then
  echo "$folder not found"
  exit 1
fi

kpackagetool6 -t KWin/Script $global -i "$folder"
