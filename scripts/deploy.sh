#!/bin/sh

mkdir -p ./build

DEPLOY_FOLDER=/Users/kevenleone/Documents/projects/liferay/bundles/deploy
FOLDER_NAME=video-player-fragments-set
FILE="build/$FOLDER_NAME.zip"

zip -r $FILE "./$FOLDER_NAME"

cp -r $FILE $DEPLOY_FOLDER
