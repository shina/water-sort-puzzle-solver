SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

mkdir -p $SCRIPTPATH/../dist

deno bundle $SCRIPTPATH/../game.ts $SCRIPTPATH/../dist/game.bundle.js
