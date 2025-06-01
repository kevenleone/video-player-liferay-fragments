FOLDER_NAME=video-player-fragments-set

if [ ! -d "./$FOLDER_NAME" ]; then
    echo "Error: Directory ./$FOLDER_NAME does not exist."
    exit 1
fi

mkdir -p build

zip -r "build/$FOLDER_NAME.zip" "./$FOLDER_NAME"
