#!/bin/sh
AMYSURF_HOME=$(readlink -fn $(dirname $BASH_SOURCE)/..)
# HOST_NAME='freejungle.net'
HOST_NAME='localhost'

# TODO: Test all the scripts
# TODO: dotnet test ... --filter "Category=ThisIsCategory"

# Tested OK
alias amysurf-debug='docker run --rm -it --network=host --entrypoint /bin/bash louchano/amysurf:develop-linux-amd64'

# Tested OK
alias amysurf-app='(cd $AMYSURF_HOME/src/AmySurf.App; npm run dev)'

# Tested OK
alias amysurf-run='(cd $AMYSURF_HOME/src/AmySurf.Service; set -o allexport; source $AMYSURF_HOME/.env; set +o allexport; 
  dotnet publish -c Release --runtime linux-x64 && \
  $AMYSURF_HOME/src/AmySurf.Service/bin/Release/net8.0/linux-x64/publish/AmySurf.Service)'

# Tested NOT OK
alias amysurf-test='(cd $AMYSURF_HOME/src/AmySurf.Tests; set -o allexport; source $AMYSURF_HOME/.env; \
  dotnet test -c Release -l "console;verbosity=detailed")'

# Tested OK
alias amysurf-packages-outdated='(cd $AMYSURF_HOME/src/AmySurf.Service; dotnet list package --outdated)'

# Tested OK
alias amysurf-build-amd64='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME_IMAGE="mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME="linux-x64" \
  AMYSURF_IMAGE="louchano/amysurf:develop-linux-amd64" \
  docker compose -f docker-compose.yml build)'
alias amysurf-push-amd64='(cd $AMYSURF_HOME; docker push "louchano/amysurf:develop-linux-amd64")'

# Tested OK
alias amysurf-build-armv7='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME_IMAGE="mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim-arm32v7" \
  AMYSURF_RUNTIME="linux-arm" \
  AMYSURF_IMAGE="louchano/amysurf:develop-linux-arm32v7" \
  docker compose -f docker-compose.yml build)'

alias amysurf-push-armv7='(cd $AMYSURF_HOME; docker push "louchano/amysurf:linux-arm32v7")'

alias amysurf-build-arm64='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME_IMAGE="mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim-arm64v8" \
  AMYSURF_RUNTIME="linux-arm64 " \
  AMYSURF_IMAGE="louchano/amysurf:linux-arm64v8" \
  docker compose -f docker-compose.yml build)'

alias amysurf-push-arm64='(cd $AMYSURF_HOME; docker push "louchano/amysurf:linux-arm64v8")'

alias amysurf-test-run='(cd $AMYSURF_HOME; \
  AMYSURF_IMAGE="louchano/amysurf:test-linux-amd64" \
  docker compose -f docker-compose.test.yml up)'

alias amysurf-test-build-amd64='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME="linux-x64" \
  AMYSURF_IMAGE="louchano/amysurf:test-linux-amd64" \
  docker compose -f docker-compose.test.yml build)'
alias amysurf-test-push-amd64='(cd $AMYSURF_HOME; docker push "louchano/amysurf:test-linux-amd64")'

alias amysurf-test-build-armv7='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME="linux-arm" \
  AMYSURF_IMAGE="louchano/amysurf:test-linux-arm32v7" \
  docker compose -f docker-compose.test.yml build)'

alias amysurf-test-push-armv7='(cd $AMYSURF_HOME; docker push "louchano/amysurf:test-linux-arm32v7")'

alias amysurf-test-build-arm64='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME="linux-arm64" \
  AMYSURF_IMAGE="louchano/amysurf:test-linux-arm64v8" \
  docker compose -f docker-compose.test.yml build)'

alias amysurf-test-push-arm64='(cd $AMYSURF_HOME; docker push "louchano/amysurf:test-linux-arm64v8")'

# Run AmySurf with Docker
alias amysurf-run-docker-amd64='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME_IMAGE="mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME="linux-x64" \
  AMYSURF_IMAGE="louchano/amysurf:develop-linux-amd64" \
  AMYSURF_DOCKER_NAME="amysurf" \
  AMYSURF_PORT="5009" \
  AMYSURF_TRAEFIK_RULE="Host(\`amysurf.${HOST_NAME}\`)" \
  docker compose -f docker-compose.yml -f docker-compose.traefik.yml up)'

alias amysurf-run-docker-armv7='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME_IMAGE="mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim-arm32v7" \
  AMYSURF_RUNTIME="linux-arm" \
  AMYSURF_IMAGE="louchano/amysurf:linux-arm32v7" \
  AMYSURF_DOCKER_NAME="amysurf" \
  AMYSURF_PORT="5009" \
  AMYSURF_TRAEFIK_RULE="Host(\`amysurf.${HOST_NAME}\`)" \
  docker compose -f docker-compose.yml -f docker-compose.traefik.yml up)'

alias amysurf-run-docker-armv7-d='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME_IMAGE="mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim-arm32v7" \
  AMYSURF_RUNTIME="linux-arm" \
  AMYSURF_IMAGE="louchano/amysurf:linux-arm32v7" \
  AMYSURF_DOCKER_NAME="amysurf" \
  AMYSURF_PORT="5009" \
  AMYSURF_TRAEFIK_RULE="Host(\`amysurf.${HOST_NAME}\`)" \
  docker compose -f docker-compose.yml -f docker-compose.traefik.yml up -d)'

alias amysurf-run-docker-arm64='(cd $AMYSURF_HOME; \
  DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:8.0-bookworm-slim-amd64" \
  AMYSURF_RUNTIME_IMAGE="mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim-arm64v8" \
  AMYSURF_RUNTIME="linux-arm64" \
  AMYSURF_IMAGE="louchano/amysurf:linux-arm64v8" \
  AMYSURF_DOCKER_NAME="amysurf" \
  AMYSURF_PORT="5009" \
  AMYSURF_TRAEFIK_RULE="Host(\`amysurf.${HOST_NAME}\`)" \
  docker compose -f docker-compose.yml -f docker-compose.traefik.yml up)'

echo "AmySurf profile loaded"
