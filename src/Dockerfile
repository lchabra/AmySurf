# TODO: dotnet publish ... --self-contained -p:PublishTrimmed=true ??

# https://hub.docker.com/_/microsoft-dotnet-sdk
ARG DOTNET_SDK_IMAGE="mcr.microsoft.com/dotnet/sdk:6.0"

# https://hub.docker.com/_/microsoft-dotnet-aspnet/
ARG RUNTIME_IMAGE="mcr.microsoft.com/dotnet/aspnet:6.0"

# https://hub.docker.com/_/node
# TODO: use slim? try alpine?
ARG NODE_IMAGE="node:current-bullseye"

#
# Build dotnet service
#
FROM $DOTNET_SDK_IMAGE AS build_dotnet
# Runtime to build: linux-x64, linux-arm
# https://docs.microsoft.com/en-us/dotnet/core/rid-catalog
# ARG RUNTIME="linux-x64"
# ARG RUNTIME="linux-arm64"
ARG RUNTIME="linux-arm"

COPY Directory.Build.props /build/
COPY AmySurf.Service/AmySurf.Service.csproj /build/AmySurf.Service/
COPY AmySurf.Providers/ /build/AmySurf.Providers/
COPY AmySurf.Models/ /build/AmySurf.Models/

WORKDIR /build/AmySurf.Service
RUN dotnet restore AmySurf.Service.csproj --runtime $RUNTIME
COPY AmySurf.Service/ ./

RUN dotnet publish --runtime $RUNTIME --self-contained --no-restore -c Release -o out

# TODO:Enable
# Tests
# WORKDIR /build/AmySurf.Tests
# COPY AmySurf.Tests/AmySurf.Tests.csproj ./
# RUN dotnet restore --runtime $RUNTIME
# COPY AmySurf.Tests/ ./
# RUN dotnet test -c Release --filter "Category!=PWA&Category!=BitcoinStack" -l "console;verbosity=detailed"


# Build web app
FROM $NODE_IMAGE AS build_node
WORKDIR /build/AmySurf.App
RUN npm install -g npm@latest
COPY AmySurf.App/package.json .
COPY AmySurf.App/package-lock.json .
RUN npm ci
ARG BUST_CACHE=1
COPY AmySurf.App/ ./
RUN npm run build

#
# Final image
#
FROM $RUNTIME_IMAGE
WORKDIR /app
COPY --from=build_dotnet /build/AmySurf.Service/out/ ./
COPY --from=build_node /build/AmySurf.App/dist/ wwwroot/
ENV DOTNET_gcServer=0 
ENTRYPOINT ["./AmySurf.Service"]
