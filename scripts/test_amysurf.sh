#!/bin/bash
set -e

# Define the full path to the amysurf.sh script
AMYSURF_SCRIPT="$(readlink -fn $(dirname $BASH_SOURCE)/amysurf.sh)"

# Define the commands to test
commands=(
    "$AMYSURF_SCRIPT help"
    # "$AMYSURF_SCRIPT setup"
    "$AMYSURF_SCRIPT build amd64"
    "$AMYSURF_SCRIPT build armv7"
    "$AMYSURF_SCRIPT build arm64"
    "$AMYSURF_SCRIPT build all"
    "$AMYSURF_SCRIPT push amd64"
    "$AMYSURF_SCRIPT push armv7"
    "$AMYSURF_SCRIPT push arm64"
    "$AMYSURF_SCRIPT push all"
    "AMYSURF_VERSION=develop $AMYSURF_SCRIPT up -d"
    "AMYSURF_VERSION=develop $AMYSURF_SCRIPT log -n 20"
    "AMYSURF_VERSION=develop $AMYSURF_SCRIPT down"
    "$AMYSURF_SCRIPT clean -n"
)

# Run each command and capture the output
for cmd in "${commands[@]}"; do
    echo "Testing: $cmd"
    eval "$cmd" || {
        echo "Command failed: $cmd"
        exit 1
    }
    echo "Command succeeded: $cmd"
    echo "-----------------------------------"
done

echo "All commands tested successfully!"
