# AmySurf

A weather forecast application specifically designed for surfers, providing wave, weather, and swell energy forecasts for various surf spots around the world.

## Project Overview

AmySurf is a web application that provides surf forecasts by combining weather data with surf spot information. It was developed as a learning project and features:

- Real-time weather and surf conditions for various locations
- User-friendly interface optimized for both desktop and mobile devices
- Favorite spots management

The project consists of two main components:

- **AmySurf.Service**: A .NET backend API service that fetches and processes weather data
- **AmySurf.App**: A TypeScript/React frontend application that displays the forecasts

## Prerequisites

Before starting, ensure you have the following installed:

- [Git](https://git-scm.com/downloads)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v14 or later) and npm
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose V2](https://docs.docker.com/compose/cli-command/) (for production deployment)

You'll also need:

- A free OpenWeatherMap API key (register at [OpenWeatherMap](https://openweathermap.org/api))

## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/lchabra/AmySurf.git
cd AmySurf
```

### Development Environment

#### Setting up AmySurf.Service (Backend)

1. Open the AmySurf project in Visual Studio Code:
2. Create a `.env` file in the AmySurf root directory and configure your API key and other environment variables as needed.

```bash
cp .env-sample .env
```

3. Restore the .NET packages and build the solution:

```bash
dotnet restore && dotnet build
```

#### Setting up AmySurf.App (Frontend)

1. Navigate to the App directory:

```bash
cd src/AmySurf.App/
```

2. Create a `.env` file and configure the environment variables:

```bash
cp .env-sample .env
```

3. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

#### Running AmySurf.Service

1. Open the project in Visual Studio Code.
2. Select the "Run and Debug" tab.
3. If needed, create a `.vscode/launch.json`:

   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "AmySurf.Service",
         "type": "coreclr",
         "request": "launch",
         "program": "${workspaceFolder}/src/AmySurf.Service/bin/Debug/net8.0/AmySurf.Service.dll",
         "envFile": "${workspaceFolder}/.env",
         "preLaunchTask": "build"
       }
     ]
   }
   ```

4. If needed, create a `.vscode/tasks.json`:

   ```json
   {
     "version": "2.0.0",
     "tasks": [
       {
         "label": "build",
         "command": "dotnet",
         "type": "process",
         "args": ["build", "${workspaceFolder}/AmySurf.sln"],
         "problemMatcher": "$msCompile"
       }
     ]
   }
   ```

5. Choose the "AmySurf.Service" configuration and click the play button.
6. Verify the service is running by testing an API endpoint:

   - Open your browser and navigate to: `http://localhost:5009/api/forecast/spots`
   - You should see a JSON response with all available surf spots.

#### Running AmySurf.App

1. Navigate to the App directory:

```bash
cd src/AmySurf.App/
```

2. Start the development server:

```bash
npm run dev
```

3. Access the application:

   - Open your browser and go to: `http://localhost:1234`
   - Go to **Settings > Advanced** and set the server address to your local AmySurf Service (e.g., `http://localhost:5009`).

---

### API Examples

The following API endpoints are available for testing:

- **Get all surf spots**:  
  http://localhost:5009/api/forecast/spots

- **Get surf forecast**:  
  http://localhost:5009/api/forecast/surf?spotid=Bali_Canggu_Batu_Bolong&StartTime=2025-02-17T04:00:00Z&EndTime=2028-02-18T22:00:00Z

- **Get energy forecast**:  
  http://localhost:5009/api/forecast/energy?spotid=Bali_Canggu_Batu_Bolong&StartTime=2025-02-17T04:00:00Z&EndTime=2028-02-18T22:00:00Z

- **Get weather forecast**:  
  http://localhost:5009/api/forecast/weather?spotid=Bali_Canggu_Batu_Bolong&StartTime=2025-02-17T04:00:00Z&EndTime=2028-02-18T22:00:00Z

## Production Deployment

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

### Configuration

1. From AmySurf Root folder, create a Docker environment file:

```bash
cp docker/.env-sample docker/.env
```

2. Edit the `.env` file and configure all required variables, especially:

   - `OPENWEATHERMAP_API_KEY`: Your OpenWeatherMap API key

3. Load the helper scripts:

```bash
source scripts/profile.sh
```

This makes the `amysurf` command available with various options.

### Building and Running with Docker

1. Navigate to the project folder:

```bash
cd ~/Code/AmySurf
```

2. Open [scripts/amysurf.sh](scripts/amysurf.sh) and edit the Configurable Environment Variables section.

3. Build the desired Docker image (e.g., `amd64` , `armv7`, or `arm64`):
   Active Git branch will be used as the version (e.g., `main` , `develop`).

```bash
amysurf build amd64
```

4. Set up the user and permissions for the service.

```bash
amysurf setup
```

It will execute the folowing command (see amysurf.sh):

```bash
user_exists "$service" || sudo useradd --user-group --system --home-dir "$home_dir" --create-home --shell /bin/false "$service"

sudo chown -R "$service" "$home_dir"
```

5. Start/Stop the application using Docker Compose (you will be prompt for version choice):

```bash
amysurf up
```

```bash
amysurf down
```

Options to run in detached mode without being prompted for confirmation:

```bash
AMYSURF_VERSION=develop amysurf up -d
```

### Available Helper Commands

After sourcing `scripts/profile.sh`, the following commands become available:

- `amysurf help` - Show help message
- `amysurf setup` - Set up user and permissions
- `amysurf sh` - Open a shell inside the container
  - `AMYSURF_VERSION=develop amysurf sh`
- `amysurf log` - Stream container logs
  - `AMYSURF_VERSION=develop amysurf log -f`
- `amysurf up` - Start the service
  - `AMYSURF_VERSION=develop amysurf up -d`
- `amysurf down` - Stop and remove the service
  - `AMYSURF_VERSION=develop amysurf down`
- `amysurf build` - Build Docker images
  - `amysurf build amd64`
  - `amysurf build armv7`
  - `amysurf build arm64`
- `amysurf push` - Push Docker images to registry
  - `amysurf push amd64`
  - `amysurf push armv7`
  - `amysurf push arm64`
- `amysurf clean` - Clean up Docker resources

## Project Structure

```
AmySurf/
├── docker/                 # Docker configuration files
├── scripts/                # Helper scripts
├── src/
│   ├── AmySurf.App/        # Frontend React/TypeScript application
│   ├── AmySurf.Service/    # Backend .NET service
│   └── AmySurf.Tests/      # Test project
└── README.md               # This documentation
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is a permissive open-source license that allows anyone to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, with minimal restrictions.
