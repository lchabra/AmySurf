# AmySurf

## TODO
- Check all date equal comparaison and remplace by isSameHour...
- Check all script from package.json
- Ensure all Size (width, height) are in em
- in profile.sh -> try to have only alpine

  // },
## Examples of api urls: 
http://localhost:5001/api/forecast/surf?spotid=Canggu_Batu_Bolong&StartTime=2012-02-17T04:00:00Z&EndTime=2022-02-18T22:00:00Z
http://localhost:5001/api/forecast/energy?spotid=Canggu_Batu_Bolong&StartTime=2012-02-17T04:00:00Z&EndTime=2022-02-18T22:00:00Z
http://localhost:5001/api/forecast/weather?spotid=Canggu_Batu_Bolong&StartTime=2012-02-17T04:00:00Z&EndTime=2022-02-18T22:00:00Z
http://localhost:5001/api/forecast/spots

### Run AmySurf.App and AmySurf.Service in docker container

-   Requires [docker](https://docs.docker.com/get-docker/)
-   Requires [docker compose V2](https://docs.docker.com/compose/cli-command/)

1. Navigate to the folder of the project
    ```` shell
    cd ~/Code/AmySurf
    ````

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
