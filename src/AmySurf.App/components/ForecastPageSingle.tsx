import React, { CSSProperties } from 'react'
import Stack from 'react-bootstrap/esm/Stack'
import { useHourlyRatingGroupMap } from '../contexts/useNostr'
import { forecastDaySummaryHeightEm, useAppStyle } from '../contexts/useStyle'
import { SpotForecasts, HourlyForecast } from '../models/modelsApp'
import { getBorderFaded } from '../styles/theme'
import { HourlyCollection } from './HourlyCollection'
import SummaryForecastPage, { SummaryForecastPageData } from './SummaryForecastPage'

export default function ForecastsPageSingle(props: { forecasts: SpotForecasts }) {
    const appStyle = useAppStyle()
    const styles = getStyles()
    const ratings = useHourlyRatingGroupMap()

    const data = React.useMemo(() => {
        return props.forecasts.data.map(d => ({ ...d, ratings: ratings.get(d.dateTime.valueOf()) }))
    }, [props.forecasts, ratings])
    return (
        <Stack direction='vertical' className={`border-end border-3 ${getBorderFaded(appStyle.theme)}`}>
            <div style={styles.summary}>
                <SummaryForecastPage data={getPageSummaryData(props.forecasts)} />
            </div>

            <Stack style={styles.data} direction='horizontal' className='h-100'>
                {data.map((hourlyForecast: HourlyForecast, _) =>
                    <HourlyCollection key={`HourlyForecast-${hourlyForecast.dateTime}`} data={hourlyForecast} spotForecast={props.forecasts} />
                )}
            </Stack>
        </Stack >
    )

    function getPageSummaryData(forecasts: SpotForecasts): SummaryForecastPageData {
        return {
            dates: forecasts.data.map(hf => hf.dateTime),
            sunriseTimes: forecasts.sunriseTimes,
            sunsetTimes: forecasts.sunsetTimes
        }
    }
}

function getStyles(): Record<string, CSSProperties> {
    return {
        summary: {
            minHeight: forecastDaySummaryHeightEm + 'rem',
            height: forecastDaySummaryHeightEm + 'rem'
        },
        data: {
            // height: `${pageDataHeightPercent}%`
        },
    }
}
