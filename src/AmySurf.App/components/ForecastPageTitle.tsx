import { isSameMinute } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { useForecastsApi } from '../contexts/useForecasts'
import { Container } from '../core-ui/ui'
import { formatTimeLong, getDateSpotNow } from '../helpers/dt'
import { getNowSpotForecast } from '../helpers/forecastHelper'
import { HourlyForecast } from '../models/modelsApp'
import { Spot } from '../models/modelsForecasts'
import FavoriteStarSpot from './FavoriteStarSpot'
import { WaveSizeHourlyData } from './hourlyForecastFactory'

export default function ForecastPageTitle(props: { spot: Spot }): JSX.Element {
    const forecastsApi = useForecastsApi()

    const [displayedDateSpotNowState, setDisplayedDateSpotNowState] = useState<Date>(getDateSpotNow(props.spot.utcOffset))
    const [forecastNow, setForecastNow] = useState<HourlyForecast | undefined>(undefined)

    const wavesSize = forecastNow ? <WaveSizeHourlyData wavesSizeMin={forecastNow.wavesSizeMin} wavesSizeMax={forecastNow.wavesSizeMax} /> : undefined
    const tideHeight = forecastNow ? forecastNow.tideHeight : undefined
    const period = forecastNow ? forecastNow.primarySwellPeriod : undefined

    // Update ForecastNow when the spot change
    useMemo(() => {
        if (forecastsApi.data?.spotForecasts === undefined)
            setForecastNow(undefined)
        else {
            const forecastNow = getNowSpotForecast(forecastsApi.data.spotForecasts)
            setForecastNow(forecastNow)
        }
    }, [forecastsApi.data?.spotForecasts?.spot])

    // Keep dateSpot and ForecastNow updated when time change
    useEffect(() => {
        const timer = setInterval(() => {
            if (forecastsApi.data?.spotForecasts === undefined) {
                setForecastNow(undefined)
                return
            }

            const dateSpotNow: Date = getDateSpotNow(props.spot.utcOffset)
            if (!isSameMinute(displayedDateSpotNowState, dateSpotNow)) {
                const forecastNow = getNowSpotForecast(forecastsApi.data.spotForecasts)
                setForecastNow(forecastNow)
                setDisplayedDateSpotNowState(dateSpotNow)
            }

        }, 60000);

        return () => clearInterval(timer);

    }, [displayedDateSpotNowState]);

    return (
        <Container fluid className='pt-1 pb-1 h-100 d-flex flex-wrap justify-content-center align-items-center border-bottom'>
            <div className='me-1'>
                {props.spot !== undefined && <FavoriteStarSpot data={props.spot} />}
            </div>

            <div className='text-nowrap fs-6'>
                {props.spot.name}
                {displayedDateSpotNowState != undefined && <> / {formatTimeLong(displayedDateSpotNowState)}&nbsp;</>}
            </div>

            <div className='text-nowrap'>
                {wavesSize != undefined && <> / {wavesSize}ft</>}

                {period != undefined && !isNaN(period) && <> / {period}s</>}

                {tideHeight != undefined && <> / {tideHeight.toFixed(2)}m</>}
            </div>
        </Container>
    )
}