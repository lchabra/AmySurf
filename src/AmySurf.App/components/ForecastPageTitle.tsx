import { isSameMinute } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'
import { useForecastsApi } from '../contexts/useForecasts'
import { navBarIconHeightRem, useAppStyle } from '../contexts/useStyle'
import { useUser } from '../contexts/useUser'
import { ArrowSkinnyIconDown, ArrowSkinnyIconUp, ExploreIcon } from '../core-ui/icons'
import { Container, Stack } from '../core-ui/ui'
import { getDateSpotNow } from '../helpers/dt'
import { getNowSpotForecast } from '../helpers/forecastHelper'
import { HourlyForecast, MapSize } from '../models/modelsApp'
import { Spot } from '../models/modelsForecasts'
import FavoriteStarSpot from './FavoriteStarSpot'
import { WaveSizeHourlyData } from './hourlyForecastFactory'
import PageTitle from './PageTitle'

export default function ForecastPageTitle(): React.JSX.Element {
    const spot = useForecastsApi().data?.spotForecast?.spot

    if (spot)
        return <SpotForecastPageTitle spot={spot} />
    else
        return <PageTitle title='Forecasts' />
}

export function SpotForecastPageTitle(props: { spot: Spot }): React.JSX.Element {
    const user = useUser()
    const appStyle = useAppStyle()
    const forecastsApi = useForecastsApi()
    const [dateSpotNowState, setDisplayedDateSpotNowState] = useState<Date>(getDateSpotNow(props.spot.utcOffset))
    const [forecastNow, setForecastNow] = useState<HourlyForecast | undefined>(undefined)

    const tideHeight = forecastNow ? forecastNow.tideHeight : undefined
    const period = forecastNow ? forecastNow.longestSwellPeriod : undefined
    const stackClassName = user.userSettings.mapSize === MapSize.Disable ? `border-bottom border-${appStyle.classNames.toneColor}` : ''

    // Update ForecastNow when the spot change
    useMemo(() => {
        if (forecastsApi.data?.spotForecast === undefined)
            setForecastNow(undefined)
        else {
            const forecastNow = getNowSpotForecast(forecastsApi.data.spotForecast)
            setForecastNow(forecastNow)
        }
    }, [forecastsApi.data?.spotForecast?.spot])

    // Keep dateSpot and ForecastNow updated when time change
    useEffect(() => {
        const timer = setInterval(() => {
            if (forecastsApi.data?.spotForecast === undefined) {
                setForecastNow(undefined)
                return
            }

            const dateSpotNow: Date = getDateSpotNow(props.spot.utcOffset)
            if (!isSameMinute(dateSpotNowState, dateSpotNow)) {
                const forecastNow = getNowSpotForecast(forecastsApi.data.spotForecast)
                setForecastNow(forecastNow)
                setDisplayedDateSpotNowState(dateSpotNow)
            }

        }, 60000);

        return () => clearInterval(timer);

    }, [dateSpotNowState]);


    return (
        <Stack direction='horizontal' className={stackClassName}>
            <Container fluid className={`pt-1 pb-1 h-100 d-flex flex-wrap justify-content-center align-items-end`} >
                {props.spot !== undefined && <FavoriteStarSpot data={props.spot} />}

                <div>
                    <span className={`fs-6 text-nowrap fw-bold `}>
                        {props.spot.name} now:&nbsp;&nbsp;
                    </span>

                    <span className='fw-semibold fs-6'>

                        {forecastNow != undefined && <span><WaveSizeHourlyData className='fs-6' wavesSizeMin={forecastNow.wavesSizeMin} wavesSizeMax={forecastNow.wavesSizeMax} />ft</span>}

                        {period != undefined && !isNaN(period) && <> / {period.toFixed(0)}s</>}

                        {tideHeight != undefined && <> / {tideHeight.toFixed(2)}m</>}

                        {forecastNow?.isTideRising && <ArrowSkinnyIconUp height={1.2 + 'em'} color={appStyle.colorValues.themeConstrast} />}
                        {!forecastNow?.isTideRising && <ArrowSkinnyIconDown height={1.2 + 'em'} color={appStyle.colorValues.themeConstrast} />}
                    </span>
                </div>
            </Container>

            {
                <div onClick={() => {
                    user.userSettings.mapSize === MapSize.Disable ?
                        user.saveAppSettings({ ...user.userSettings, mapSize: MapSize.Small }) :
                        user.saveAppSettings({ ...user.userSettings, mapSize: MapSize.Disable })
                }}>
                    <ExploreIcon fill={appStyle.colorValues.themeConstrast} height={navBarIconHeightRem + 'rem'} width={navBarIconHeightRem + 'rem'} />
                </div>
            }
        </Stack>
    )
}