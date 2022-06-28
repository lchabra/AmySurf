import React from 'react'
import { formatPPP, isSameDay } from '../helpers/dt'
import { SpotForecasts, HourlyForecast } from '../models/modelsApp'
import { Stack } from '../core-ui/ui'
import ForecastsPageSingle from './ForecastPageSingle'
import { useForecastsApi } from '../contexts/useForecasts'

export function ForecastsPagesCollection(): JSX.Element {

    const forecastsApi = useForecastsApi()
    const forecastsGroups: SpotForecasts[] = forecastsApi.data?.spotForecasts ? getForecastsGroups(forecastsApi.data?.spotForecasts) : []

    return (
        <Stack direction='horizontal' className='h-100 '>
            {forecastsGroups.map((forecasts: SpotForecasts, index: number) =>
                <ForecastsPageSingle key={`page-forecast-${index}`} forecasts={forecasts} />
            )}
        </Stack>
    )
}

function getForecastsGroups(forecast: SpotForecasts): SpotForecasts[] {
    var groups = {};

    forecast.data.forEach((refHourlyForecast) => {
        const groupKey = formatPPP(new Date(refHourlyForecast.dateTime))
        if (groupKey in groups) {
            groups[groupKey].qtyHoursForecasted += 1
        } else {

            const forecasts: HourlyForecast[] = forecast.data.filter(forecast => isSameDay(new Date(forecast.dateTime), new Date(refHourlyForecast.dateTime)))
            const sunriseTimes: Date[] = forecast.sunriseTimes.filter(sunriseTime => isSameDay(new Date(sunriseTime), new Date(refHourlyForecast.dateTime)))
            const sunsetTimes: Date[] = forecast.sunsetTimes.filter(sunsetTime => isSameDay(new Date(sunsetTime), new Date(refHourlyForecast.dateTime)))

            const appForecastPage: SpotForecasts =
            {
                updateTime: forecast.updateTime,
                spot: forecast.spot,
                sunriseTimes: sunriseTimes,
                sunsetTimes: sunsetTimes,
                data: forecasts,
            }

            groups[groupKey] = appForecastPage
        }
    })
    return Object.entries(groups).map(([_, value]) => value) as SpotForecasts[]
}