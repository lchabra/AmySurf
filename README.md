# AmySurf

## TODO

- Check all date equal comparaison and remplace by isSameHour...
- Check all script from package.json
- Ensure all Size (width, height) are in em
- in profile.sh -> try to have only alpine
- Ensure test are working
- // },

## Examples of api urls:

http://localhost:5001/api/forecast/surf?spotid=Canggu_Batu_Bolong&StartTime=2012-02-17T04:00:00Z&EndTime=2022-02-18T22:00:00Z
http://localhost:5001/api/forecast/energy?spotid=Canggu_Batu_Bolong&StartTime=2012-02-17T04:00:00Z&EndTime=2022-02-18T22:00:00Z
http://localhost:5001/api/forecast/weather?spotid=Canggu_Batu_Bolong&StartTime=2012-02-17T04:00:00Z&EndTime=2022-02-18T22:00:00Z
http://localhost:5001/api/forecast/spots

## Run AmySurf.App and AmySurf.Service

-clone the project

### Development mode

#### Run the Amysurf.Service

- run and debug the Amysurf.Service in vs code.
- test the api: http://localhost:5001/api/forecast/spots
- it should give you a json with all the spots available in the database.

#### Run the Amysurf.App

- open a shell in Amysurf.App

```shell
   cd src/AmySurf.App/
```

-install the dependencies

```shell
   npm install
```

- run the app

```shell
   npm run dev
```

- Open your browser and go to : http://localhost:1234
- Go to Settings / Advanced and set server address to your local AmySurf Service (http://localhost:5001)

### Production Docker container

- Requires [docker](https://docs.docker.com/get-docker/)
- Requires [docker compose V2](https://docs.docker.com/compose/cli-command/)

1. Navigate to the folder of the project

   ```shell
   cd ~/Code/AmySurf
   ```

2. Source some environment variables in scripts/profile.sh file

   - the one concerning aliases amysurf...

3. Source some environment variables in docker-compose.yml file

   - check them all

4. Load some helper scripts

   ```shell
   source scripts/profile.sh
   ```

5. Build amysurf docker image
   (see scripts/profile.sh for availables plateforms)

   ```shell
   amysurf-build-amd64
   ```

6. Start App and Service docker compose
   (see scripts/profile.sh for availables plateforms)
   ```shell
   amysurf-run-docker-amd64
   ```

```

```
