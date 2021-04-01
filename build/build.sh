SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

cd $SCRIPTPATH/..
deno run --unstable --allow-read --allow-write build/builder.ts

