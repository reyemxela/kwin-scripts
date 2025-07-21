#!/usr/bin/env bash

folder="$1"

if [ ! -d "$folder" ]; then
  echo "$folder not found"
  exit 1
fi

kpackagetool6 -t KWin/Script -i "$folder"
