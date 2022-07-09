#!/bin/bash
set -eu
readonly root=$(readlink $(dirname $0) -f)
readonly script=$(basename $0)
readonly service="amysurf"
readonly home_dir="/home/$service"

# ===========================
# Configurable Environment Variables
# ===========================
export AMYSURF_VERSIONS=("main" "develop") # List of available versions
# export HOST_NAME=$HOSTNAME
export HOST_NAME='localhost'
export AMYSURF_HOST="amysurf.$HOST_NAME"    # Hostname for the service (amysurf.localhost)
export AMYSURF_ASPNETCORE_PORTS="5009"      # Port for the application
export AMYSURF_DETACH_MODE="false"          # Run in detached mode
export WEB_PROXY_ADDRESS=""                 # Optional Proxy address for for the backend
export AMYSURF_SHOW_SERVER_SETTING="false"  # Show server settings in the UI
export AMYSURF_SHOW_ERRORS_DETAILS="false"  # Show error details in the UI
export POOLING_INTERVAL="00:00:10"          # Polling interval for the service
export HTTPCLIENT_TIMEOUT="00:00:30"        # Timeout for HTTP client requests
export HTTPCLIENT_RETRY_INTERVAL="00:00:10" # Retry interval for HTTP client requests

# Docker Related
export AMYSURF_DOCKER_REPO="louchano/amysurf"
export AMYSURF_RUNTIME_IMAGE_BASE="mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim" # .NET runtime image (base)
export DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64"        # .NET SDK image
# ===========================
# Enf Of Configurable Environment Variables
# ===========================

main() {
    if [ $# -eq 0 ]; then
        cmd="help"
    else
        cmd="$1"
        shift
    fi

    case "$cmd" in
    setup) setup "$@" ;;
    sh)
        set_compose_variables
        docker exec -it "${AMYSURF_DOCKER_NAME}" /bin/sh
        ;;
    log)
        set_compose_variables
        docker logs "$@" "${AMYSURF_DOCKER_NAME}"
        ;;
    up | down)
        cd $root
        # Skip select_version if AMYSURF_VERSION is already set
        if [ -z "${AMYSURF_VERSION:-}" ]; then
            select_version "$cmd"
        else
            echo "Using pre-set AMYSURF_VERSION: $AMYSURF_VERSION"
        fi
        set_compose_variables
        local files="$(docker_get_compose_files "$root")"
        local detach_flag=""
        if [ "$cmd" == "up" ] && [ "${AMYSURF_DETACH_MODE:-false}" == "true" ]; then
            detach_flag="-d"
        fi
        docker compose -p ${AMYSURF_DOCKER_NAME} $files $cmd $detach_flag "$@"
        ;;
    build)
        set_compose_variables
        build "$@"
        ;;
    push)
        push "$@"
        ;;
    clean)
        set_compose_variables
        clean "$@"
        ;;
    test-sh)
        # Confirmation before running the tests
        if ! confirm_with_timer "Are you sure? This will execute multiple commands. See test_amysurf.sh" 10; then
            echo "Test execution canceled."
            exit 0
        fi
        # Execute the test_amysurf.sh script
        local script_dir=$(dirname "$0")
        bash "$script_dir/test_amysurf.sh" "$@"
        ;;
    *)
        help
        ;;
    esac
}

help() {
    cat <<EOF
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
  amysurf build amd64
  amysurf up
EOF
}

set_compose_variables() {
    export readonly AMYSURF_VERSION="${AMYSURF_VERSION:-}"
    if [ "$AMYSURF_VERSION" == "" ]; then
        export readonly AMYSURF_VERSION="main"
    fi

    export readonly AMYSURF_UID=$(id -u $service)
    export readonly AMYSURF_GID=$(id -g $service)
    export readonly AMYSURF_HOME="$home_dir"
    # export readonly AMYSURF_HOST="${AMYSURF_HOST:-amysurf.$HOST_NAME}"

    if [ "$AMYSURF_VERSION" == "main" ]; then
        export readonly AMYSURF_DOCKER_NAME="$service"
        export readonly AMYSURF_DATA_SUB_DIR="main"
        export readonly AMYSURF_ASPNETCORE_PORTS=${AMYSURF_ASPNETCORE_PORTS:-5009}
        export readonly AMYSURF_TRAEFIK_RULE="Host(\`${AMYSURF_HOST}\`)"
        export readonly AMYSURF_SERVICE_URL="https://${AMYSURF_HOST}"
    else
        local random_port=$(shuf -i 2000-65000 -n 1)
        export readonly AMYSURF_DOCKER_NAME="${AMYSURF_VERSION}-$service"
        export readonly AMYSURF_DATA_SUB_DIR="${AMYSURF_VERSION}"
        export readonly AMYSURF_ASPNETCORE_PORTS=${AMYSURF_ASPNETCORE_PORTS:-${random_port}}
        export readonly AMYSURF_TRAEFIK_RULE="Host(\`${AMYSURF_VERSION}.${AMYSURF_HOST}\`)"
        export readonly AMYSURF_SERVICE_URL="https://${AMYSURF_VERSION}.${AMYSURF_HOST}"
    fi

    platform=$(uname -i)
    if [ "$platform" == "x86_64" ]; then
        export readonly AMYSURF_PLATFORM="amd64"
    elif [ "$platform" == "armv7l" ]; then
        export readonly AMYSURF_PLATFORM="arm32v7"
    elif [ "$platform" == "aarch64" ]; then
        export readonly AMYSURF_PLATFORM="arm64v8"
    else
        echo "Unsupported platform: $platform"
        exit 1
    fi
    export AMYSURF_IMAGE=${AMYSURF_IMAGE:-"$AMYSURF_DOCKER_REPO:${AMYSURF_VERSION:-main}-linux-$AMYSURF_PLATFORM"}

    env | grep AMYSURF_ | grep -v _=
}

setup() {
    user_exists "$service" || sudo useradd --user-group --system --home-dir "$home_dir" --create-home --shell /bin/false "$service"
    sudo chown -R "$service" "$home_dir"
}

# Checks if a user exists on the system.
user_exists() {
    id -u $1 &>/dev/null
    return $?
}

build() {
    local platform="${1:-}"
    case "$platform" in
    amd64)
        echo "Building for amd64..."
        build_platform "amd64" "linux-x64" "amd64"
        ;;
    armv7)
        echo "Building for armv7..."
        build_platform "armv7" "linux-arm" "arm32v7"
        ;;
    arm64)
        echo "Building for arm64..."
        build_platform "arm64" "linux-arm64" "arm64v8"
        ;;
    all)
        echo "Building for all platforms..."
        build_platform "amd64" "linux-x64" "amd64"
        build_platform "armv7" "linux-arm" "arm32v7"
        build_platform "arm64" "linux-arm64" "arm64v8"
        ;;
    *)
        echo "Usage: $script build <amd64|armv7|arm64|all>"
        exit 1
        ;;
    esac
}

build_platform() {
    local arch="$1"
    local runtime="$2"
    local image_suffix="$3"
    local base_dir=$(readlink -fn $(dirname $BASH_SOURCE)/..)
    local GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

    echo "Building platform: $arch"
    (cd $base_dir/docker &&
        DOTNET_SDK_IMAGE="$DOTNET_SDK_IMAGE" \
            AMYSURF_RUNTIME_IMAGE="${AMYSURF_RUNTIME_IMAGE_BASE}-$image_suffix" \
            AMYSURF_RUNTIME="$runtime" \
            AMYSURF_IMAGE="$AMYSURF_DOCKER_REPO:${GIT_BRANCH}-linux-$image_suffix" \
            docker compose -f docker-compose.yml build)
}

push() {
    local GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    local platform="${1:-}"
    case "$platform" in
    amd64)
        echo "Pushing amd64 image..."
        docker push "$AMYSURF_DOCKER_REPO:${GIT_BRANCH}-linux-amd64"
        ;;
    armv7)
        echo "Pushing armv7 image..."
        docker push "$AMYSURF_DOCKER_REPO:${GIT_BRANCH}-linux-arm32v7"
        ;;
    arm64)
        echo "Pushing arm64 image..."
        docker push "$AMYSURF_DOCKER_REPO:${GIT_BRANCH}-linux-arm64v8"
        ;;
    all)
        echo "Pushing all images..."
        docker push "$AMYSURF_DOCKER_REPO:${GIT_BRANCH}-linux-amd64"
        docker push "$AMYSURF_DOCKER_REPO:${GIT_BRANCH}-linux-arm32v7"
        docker push "$AMYSURF_DOCKER_REPO:${GIT_BRANCH}-linux-arm64v8"
        ;;
    *)
        echo "Usage: $script push <amd64|armv7|arm64|all>"
        exit 1
        ;;
    esac
}

clean() {
    echo "Stopping and removing containers for ${AMYSURF_DOCKER_NAME}..."
    docker compose -p ${AMYSURF_DOCKER_NAME} down --volumes || true

    echo "Removing Docker images for ${AMYSURF_DOCKER_NAME}..."
    docker images | grep "${AMYSURF_DOCKER_REPO}" | awk '{print $3}' | xargs -r docker rmi -f

    local confirm="${1:-}"
    if [[ "$confirm" == "-y" ]]; then
        echo "Pruning unused Docker resources..."
        docker system prune -f --volumes
    elif [[ "$confirm" == "-n" ]]; then
        echo "Prune operation skipped."
    else
        read -p "Are you sure you want to prune unused Docker resources? This will remove unused volumes as well. [y/N]: " confirm
        if [[ "$confirm" =~ ^[Yy]$ ]]; then
            echo "Pruning unused Docker resources..."
            docker system prune -f --volumes
        else
            echo "Prune operation skipped."
        fi
    fi

    echo "Cleanup complete!"
}

# Return the docker-compose files.
docker_get_compose_files() {
    local dir="${1:?err missing arg1:dir}"
    local parent_dir="$(dirname "$dir")"
    local files=""
    files="-f $parent_dir/docker/docker-compose.yml -f $parent_dir/docker/docker-compose.traefik.yml"
    local config_file="$parent_dir/docker/.docker-compose.yml"
    if [ -f "$config_file" ]; then
        files="$files -f $config_file"
    fi
    echo "$files"
}

# select_version() {
#     echo "Select a version to start:"
#     select version in "${AMYSURF_VERSIONS[@]}"; do
#         if [[ -n "$version" ]]; then
#             export AMYSURF_VERSION="$version"
#             echo "Selected version: $AMYSURF_VERSION"
#             break
#         else
#             echo "Invalid selection. Please try again."
#         fi
#     done
# }

select_version() {
    local action="${1:?err missing action (e.g., up or down)}" # Expect "up" or "down" as the first argument
    echo "Select a version to ${action} (default: 1 - ${AMYSURF_VERSIONS[0]}):"

    local versions=("${AMYSURF_VERSIONS[@]}")

    # Display the menu
    for i in "${!versions[@]}"; do
        echo "$((i + 1))) ${versions[i]}"
    done

    # Countdown timer for user input
    local timeout=10
    local choice=""
    while [ $timeout -gt 0 ]; do
        echo -ne "\rEnter your choice (1-${#versions[@]}) [default: 1] (${timeout}s remaining): "
        read -t 1 -n 1 choice || true
        if [[ -n "$choice" ]]; then
            break
        fi
        timeout=$((timeout - 1))
    done
    echo # Move to the next line after the countdown

    # Default to the first version if no input is provided
    choice=${choice:-1}

    # Validate the choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && ((choice >= 1 && choice <= ${#versions[@]})); then
        export AMYSURF_VERSION="${versions[choice - 1]}"
        echo "Selected version: $AMYSURF_VERSION"
    else
        echo "Invalid selection or timeout. Defaulting to version 1: ${versions[0]}"
        export AMYSURF_VERSION="${versions[0]}"
    fi
}

confirm_with_timer() {
    local message="${1:?err missing confirmation message}"
    local timeout="${2:-10}" # Default timeout is 10 seconds
    local confirm=""

    echo "$message"
    while [ $timeout -gt 0 ]; do
        echo -ne "\rPress 'y' to confirm, 'n' to cancel, or wait ${timeout}s to automatically cancel: "
        read -t 1 -n 1 confirm || true
        if [[ "$confirm" =~ ^[Yy]$ ]]; then
            echo     # Move to the next line
            return 0 # User confirmed
        elif [[ "$confirm" =~ ^[Nn]$ ]]; then
            echo     # Move to the next line
            return 1 # User canceled
        fi
        timeout=$((timeout - 1))
    done
    echo # Move to the next line after the countdown
    echo "No input detected. Canceling automatically."
    return 1 # Default to "no" if the timer expires
}

# Ensures that all arguments passed to the script are forwarded to the main function.
main "$@"
