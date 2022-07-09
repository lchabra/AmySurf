import React, { useEffect, useState } from 'react'
import getSurfForecastResponse from "../mock/getSurfForecastResponse.json";
import getEnergyForecastResponse from "../mock/getEnergyForecastResponse.json";
import getWeatherForecastResponse from "../mock/getWeatherForecastResponse.json";
import getSpotsResponse from "../mock/getSpotsResponse.json";
import { AppForecastsData, IForecastApi, User } from "../models/modelsApp"
import { GetEnergyForecastResponse, GetSurfForecastResponse, GetWeatherForecastResponse, Spot } from '../models/modelsForecasts';
import { useUser } from './useUser';
import useLocalStorage from '../hooks/useLocalStorage';
import { getUrls } from '../helpers/apiUrls';
import { getAppForecastsData, isForecastFresh } from '../helpers/forecastHelper';
import { FetchResponse, fetchTimerTimeoutMsBase, tryFetchUrl } from '../helpers/fetchHelper';
const ForecastContext = React.createContext<IForecastApi | null>(null);

// Context Provider
export function ForecastApiProvider(props: { children: React.ReactNode }) {
    const IForecastApi = _useForecastApi()
    return (<ForecastContext.Provider value={IForecastApi}>{props.children}</ForecastContext.Provider>)
}
// // Date Refresh
// useEffect(() => {
//     const timer = setInterval(() => {
//         const dateSpotNow: Date | undefined = spot ? getSpotNow(spot) : undefined
//         setDateState(dateSpotNow)
//     }, 60000);
//     return () => clearInterval(timer);
// }, []);

// Global function used to get the ForecastApi
export function useForecastsApi(): IForecastApi {
    const value = React.useContext(ForecastContext)
    if (!value) throw new Error('IForecastApi is not initialized')
    return value
}

function _useForecastApi(): IForecastApi {
    const user = useUser()
    const [dateLastRefresh, setDateLastRefresh] = useState<Date | undefined>(new Date())
    const [errors, setErrors] = useState<string[]>([]);
    const [isSurfLoading, setIsSurfLoading] = useState(false);
    const [isSpotsLoading, setIsSpotsLoading] = useState(false);

    const [spotForecasted, setForecastSpot] = useLocalStorage<string>('forecastSpot', '');

    const [spots, setSpots] = useLocalStorage<Spot[] | undefined>('spots', undefined);
    const [surfForecast, setSurfForecast] = useLocalStorage<GetSurfForecastResponse | undefined>('surfForecasts', undefined)
    const [weatherForecast, setWeatherForecast] = useLocalStorage<GetWeatherForecastResponse | undefined>('weatherForecasts', undefined)
    const [energyForecast, setEnergyForecast] = useLocalStorage<GetEnergyForecastResponse | undefined>('energyForecasts', undefined)

    const [appForecastData, setAppForecastData] = useState<AppForecastsData | undefined>(undefined)
    // const [nowForecast, setNowForecast] = useState<SpotForecasts | undefined>(undefined);

    // Fetch the Data
    useEffect(() => {

        const isSameSpot = spotForecasted === user.userSettings.spotName
        if (!isSameSpot) {
            setSurfForecast(undefined)
            setWeatherForecast(undefined)
            setEnergyForecast(undefined)
            setForecastSpot(user.userSettings.spotName)
        }

        function setErrorHelper(errorLabel: string, error: Error | undefined): void {
            errorsLocal = errorsLocal.concat(errorLabel + ': ' + getErrorMessage(error))
            setErrors(errorsLocal);
        }

        const fetchSpots = async () => {
            setIsSpotsLoading(true)
            if (urlSpots === '') { setErrorHelper('No spot selected', new Error('Spots URL is empty')) }
            else {
                const response: FetchResponse<Spot[]> = await tryFetchUrl<Spot[]>(urlSpots, fetchTimerTimeoutMsBase)
                response.data ? setSpots(response.data) : setErrorHelper('Fetch Spots', response.error)
            }
            setIsSpotsLoading(false)
        }

        const fetchData = async () => {
            const fetchSurf = async () => {
                if (urlSurf === '') { setErrorHelper('Fetch Surf', new Error('URL is empty')) }
                else {
                    setIsSurfLoading(true)
                    const response: FetchResponse<GetSurfForecastResponse> = await tryFetchUrl<GetSurfForecastResponse>(urlSurf, fetchTimerTimeoutMsBase);

                    // TODO:
                    if (response.data) {
                        // console.log(response.data)
                        setSurfForecast(response.data)
                        if (!isForecastFresh(new Date(response.data.timestamp), user.userSettings.refreshIntervalMinutes)) {
                            setErrorHelper('Forecasts', new Error('old forecasts'))
                        }
                    } else {
                        setErrorHelper('Fetch surf forecast', response.error)
                    }
                    setIsSurfLoading(false)
                }
            }
            const fetchWeather = async () => {
                if (urlWeather === '') { setErrorHelper('Fetch Weather', new Error('URL is empty')) }
                else {
                    const response: FetchResponse<GetWeatherForecastResponse> = await tryFetchUrl<GetWeatherForecastResponse>(urlWeather, fetchTimerTimeoutMsBase);
                    response.data ? setWeatherForecast(response.data) : setErrorHelper('Fetch Weather forecast', response.error)
                }
            }
            const fetchEnergy = async () => {
                if (urlEnergy === '') { setErrorHelper('Fetch Energy', new Error('URL is empty')) }
                else {
                    const response: FetchResponse<GetEnergyForecastResponse> = await tryFetchUrl<GetEnergyForecastResponse>(urlEnergy, fetchTimerTimeoutMsBase);
                    response.data ? setEnergyForecast(response.data) : setErrorHelper('Fetch Energy forecast', response.error)
                }
            }

            fetchSurf()
            fetchWeather()
            fetchEnergy()
        }

        let errorsLocal: string[] = []
        setErrors(errorsLocal)

        const selectedSpot = spots?.find(spot => spot.name === user.userSettings.spotName)
        let { urlSpots, urlSurf, urlWeather, urlEnergy } = getUrls(user.userSettings.serverUrl, selectedSpot?.id);

        fetchSpots();
        fetchData()

    }, [dateLastRefresh, user.userSettings.spotName, user.userSettings.serverUrl]);

    // Refresh the appForecastData
    useEffect(() => {
        const selectedSpot = spots?.find(spot => spot.name === user.userSettings.spotName)
        const appForecastData = getAppForecastsData(user.userSettings, errors ?? [], selectedSpot, spots, surfForecast, weatherForecast, energyForecast)
        setAppForecastData(appForecastData)
        //TODO: Fix: some settings triger change for nothing (theme...)
    }, [user.userSettings, errors, spots, surfForecast, weatherForecast, energyForecast]);

    // // Refresh the nowForecast (this is not correct if app stay open for hours...)
    // useEffect(() => {
    //     console.log('useEffect nowForecast')

    //     if (appForecastData?.spotForecasts === undefined) {
    //         setNowForecast(undefined)
    //     }
    //     else {
    //         const dateSpot = getDateSpotNow(appForecastData.spotForecasts.spot.utcOffset);
    //         const forecastNow: HourlyForecast | undefined = appForecastData.spotForecasts?.data.find(f => isSameHour(f.dateTime, dateSpot))

    //         if (forecastNow !== undefined)
    //             // filter sunset/sunrise
    //             setNowForecast({ ...appForecastData.spotForecasts, data: [forecastNow] })
    //         else
    //             setNowForecast(undefined)
    //     }
    // }, [appForecastData])

    return {
        refreshData: () => {
            if (dateLastRefresh) {
                const forecastsAgeMinutes = (new Date().getTime() - dateLastRefresh?.getTime()) / 60000
                if (forecastsAgeMinutes > user.userSettings.refreshIntervalMinutes) { setDateLastRefresh(new Date()) }
            }
            else { setDateLastRefresh(new Date()) }
        },
        data: appForecastData,
        // data: getMockData(user),
        mockData: getMockData(user),
        isSurfLoading: isSurfLoading,
        isSpotsLoading: isSpotsLoading
    }
}

// function ensureItSameTime(): boolean {
//     return false
// }

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    return String(error)
}

function getMockData(user: User): AppForecastsData | undefined {
    let surfForecastResponse: GetSurfForecastResponse = getSurfForecastResponse
    let energyForecastResponse: GetEnergyForecastResponse = getEnergyForecastResponse
    let weatherForecastResponse: GetWeatherForecastResponse = getWeatherForecastResponse
    let spots: Spot[] = getSpotsResponse

    const selectedSpot = spots[0]

    const appForecastData = getAppForecastsData(user.userSettings, [], selectedSpot, spots, surfForecastResponse, weatherForecastResponse, energyForecastResponse)

    return appForecastData
}
