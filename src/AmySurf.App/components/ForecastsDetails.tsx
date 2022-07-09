import React from 'react'
import { useForecastsApi } from '../contexts/useForecasts'
import { Grid } from './Grid'
import { useHourlyRatingGroupMap } from '../contexts/useNostr'
import { useForecastSummary } from '../contexts/useForecastSummary'
import { useForecastGridOptions } from '../models/forecast-grid'

export function ForecastsDetails(): React.JSX.Element {
    const forecastsApi = useForecastsApi()
    const forecast = forecastsApi.data?.spotForecast!

    // Dirty hack to append ratings information to forecast
    const ratings = useHourlyRatingGroupMap()
    const data = React.useMemo(() => {
        return {
            ...forecast,
            data: forecast.data.map(d => ({ ...d, ratings: ratings.get(d.dateTime.valueOf()) }))
        }
    }, [forecast, ratings])

    const selectionService = useForecastSummary();
    const options = useForecastGridOptions();
    const selectedKey = selectionService.selectedForecast && selectionService.selectedForecast.dateTime.valueOf()

    return <Grid data={data} options={options} selectedKey={selectedKey} />
}