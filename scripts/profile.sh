#!/bin/sh

AMYSURF_HOME=$(readlink -fn $(dirname $BASH_SOURCE)/..) # Base directory of the project
alias amysurf="$AMYSURF_HOME/scripts/amysurf.sh"

cat <<EOF
The 'amysurf' alias is now available.

Usage: amysurf <command> [options]

Commands:
  help        Show this help message and exit.
  setup       Set up the user and permissions for the service.
  sh          Open a shell inside the Docker container.
  log         Stream logs from the Docker container.
  up          Start the service using Docker Compose.
  down        Stop and remove the service.
  build       Build Docker images for specified platforms.
  push        Push Docker images to the registry.
  clean       Clean up Docker resources and images.
  test-sh     Will run most of the commands to test the amysurf.sh script (see test_amysurf.sh).

Examples:
  amysurf setup
  amysurf up
  amysurf build amd64
EOF
