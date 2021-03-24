SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

deno cache $SCRIPTPATH/deps.ts --lock=$SCRIPTPATH/lock.json --lock-write
