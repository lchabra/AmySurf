import React from 'react'
import { AirIcon, BoltIcon, ClockIcon, CloudyIcon, ExploreIcon, HeightIcon, HourglassIcon, StarIcon, ThermostatIcon, WaterIcon, WavesIcon } from '../core-ui/icons'
import { Stack } from '../core-ui/ui'
import { ForecastType } from '../models/modelsApp'
import { getThemeContrastIconColor } from '../styles/theme'
import { forecastTypeIconHeightRem, useAppStyle } from '../contexts/useStyle'

export default function ForecastTypeIcon(props: { data: ForecastType }): JSX.Element {
    const appStyle = useAppStyle()
    const iconColor = getThemeContrastIconColor(appStyle.theme)
    const forecastTypeIcon = getIcon(props.data, iconColor)

    return (
        <>
            {forecastTypeIcon}
        </>
    )
}

function getIcon(forecastType: ForecastType, fillColor?: string): JSX.Element {

    switch (forecastType) {
        case ForecastType.Hours:
            return <ClockIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={fillColor} />
        case ForecastType.WaveSize:
            return <WavesIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={fillColor} />

        case ForecastType.SwellEnergy:
            return <BoltIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={fillColor} />

        case ForecastType.SwellPeriodDirectionPrimary:
            return <SwellDetailsIcons height={forecastTypeIconHeightRem} fillColor={fillColor} />

        case ForecastType.SwellPeriodDirectionSecondary:
            return <SwellDetailsIcons height={forecastTypeIconHeightRem} fillColor={fillColor} />

        case ForecastType.TideChart:
            return <HeightIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={fillColor} />

        case ForecastType.WindSpeedDirection:
            return <AirIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={fillColor} />

        case ForecastType.WeatherConditionTemperature:
            return <ThermostatIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={fillColor} />

        case ForecastType.RainMm:
            return <WaterIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={fillColor} />

        case ForecastType.CloudCoverage:
            return <CloudyIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={fillColor} />

        case ForecastType.Ratings:
            return <StarIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={fillColor} />

            default:
            return <></>
    }
}

function SwellDetailsIcons(props: { height: number | undefined, fillColor: string | undefined }): JSX.Element {
    return (
        <Stack direction='vertical' className='d-flex justify-content-center align-items-center'>
            <HourglassIcon height={props.height + 'rem'} width={props.height + 'rem'} fill={props.fillColor} />
            <ExploreIcon height={props.height + 'rem'} width={props.height + 'rem'} fill={props.fillColor} />
        </Stack>
    )
}
