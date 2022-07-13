import React from "react"
import Badge from "react-bootstrap/esm/Badge"
import { AnyHourly } from "./AnyHourly"
import { ForecastType, HourlyForecast, SpotForecasts } from "../models/modelsApp"
import { ThunderstormIcon, ShowerRainIcon, RainIcon, SnowIcon, SunriseIcon, MistIcon, ClearSkyIcon, FewCloudsIcon, ScatteredCloudsIcon, BrokenCloudsIcon } from "../core-ui/icons"
import { Stack } from "../core-ui/ui"
import { Ratings, Report } from "../contexts/useNostr"
import { formatToIsoLocalTime } from "../helpers/dt"


export function getHourlyView(forecastType: ForecastType, hourlyForecast: HourlyForecast, spotForecast: SpotForecasts): JSX.Element {

    switch (forecastType) {
        case ForecastType.Hours:
            // return <DateHoursData dateHours={hourlyForecast.dateTime} isNow={forecastSummary.nowForecast === hourlyForecast} />
            return <DateHoursData dateHours={hourlyForecast.dateTime} isNow={false} />
        case ForecastType.WaveSize:
            return <WaveSizeHourlyData wavesSizeMin={hourlyForecast.wavesSizeMin} wavesSizeMax={hourlyForecast.wavesSizeMax} />
        case ForecastType.SwellEnergy:
            return <SmallNumberOrDot data={hourlyForecast.energy} />
        case ForecastType.SwellPeriodDirectionPrimary:
            return <SwellPeriodDirectionData swellDirection={hourlyForecast.primarySwellDirection} swellPeriod={hourlyForecast.primarySwellPeriod} />
        case ForecastType.SwellPeriodDirectionSecondary:
            return <SwellPeriodDirectionData swellDirection={hourlyForecast.secondarySwellDirection} swellPeriod={hourlyForecast.secondarySwellPeriod} />
        case ForecastType.TideChart:
            return <TideChartHourly tideHeight={hourlyForecast.tideHeight} tideHeightPerOne={hourlyForecast.tideHeightPerOne} />
        case ForecastType.WindSpeedDirection:
            return <WindSpeedDirectionData windSpeed={hourlyForecast.windSpeed} windCardinal={hourlyForecast.windDirectionCardinal} />
        case ForecastType.WeatherConditionTemperature:
            return <WeatherConditionTemperatureData temperature={hourlyForecast.temperature} weatherIconId={hourlyForecast.weatherDescriptionId} />
        case ForecastType.RainMm:
            return <SmallNumberOrDot data={hourlyForecast.rainMm} />
        case ForecastType.CloudCoverage:
            return <SmallNumberOrDot data={hourlyForecast.cloudCoverage} />
        case ForecastType.Ratings:
            return <Ratings ratings={hourlyForecast.ratings ?? []} reportFactory={createDefaultReport(spotForecast, hourlyForecast)} />
        default:
            return <></>
    }
}

function createDefaultReport(spotForecast: SpotForecasts, hourlyForecast: HourlyForecast): () => Report {
    return () => ({ time: formatToIsoLocalTime(hourlyForecast.dateTime), comment: '', rating: 0, spotId: spotForecast.spot.id })
}

function SmallNumberOrDot(props: { data: number }): JSX.Element {
    return <small>{isNaN(props.data) ? '...' : props.data}</small>
}

function DateHoursData(props: { dateHours: Date, isNow: boolean }): JSX.Element {
    if (props.isNow) {
        return <Badge className='' bg="secondary">Now</Badge>
    } else {
        return <AnyHourly data={<SmallNumberOrDot data={props.dateHours.getHours()} />} />
    }
}

export function WaveSizeHourlyData(props: { wavesSizeMin: number, wavesSizeMax: number }): JSX.Element {
    const min = Math.round(props.wavesSizeMin)
    const max = Math.round(props.wavesSizeMax)
    const safeMin = isNaN(min) ? '...' : min
    const safeMax = isNaN(max) ? '...' : max

    return safeMax === safeMin ? <small>{safeMin}</small> : <small>{`${safeMin} - ${safeMax}`}</small>
}

function SwellPeriodDirectionData(props: { swellPeriod: number, swellDirection: number }): JSX.Element {
    return (
        <Stack className="d-flex justify-content-center">
            <SmallNumberOrDot data={props.swellPeriod} />
            <SmallNumberOrDot data={props.swellDirection} />
        </Stack>
    )
}

function TideChartHourly(props: { tideHeight: number, tideHeightPerOne: number }): JSX.Element {
    const heightPerCent = isNaN(props.tideHeightPerOne) ? '0%' : (100 - props.tideHeightPerOne * 100) + '%'
    const heightPerCentTide = isNaN(props.tideHeightPerOne) ? '0%' : props.tideHeightPerOne * 100 + '%'

    return (
        <div className='h-100 w-100'>
            <div className="d-flex align-items-center justify-content-center" style={{ height: heightPerCent }}>
                <SmallNumberOrDot data={props.tideHeight} />
            </div>
            <div style={{ height: heightPerCentTide, opacity: 0.5 }} className='bg-info border-end border-start' />
        </div >
    )
}

export function WindSpeedDirectionData(props: { windSpeed: number, windCardinal: string }): JSX.Element {
    return (
        <Stack className="d-flex justify-content-center">
            <SmallNumberOrDot data={props.windSpeed} />
            <small>
                {props.windCardinal}
            </small>
        </Stack>
    )
}

function WeatherConditionTemperatureData(props: { temperature: number, weatherIconId: number }): JSX.Element {
    return (
        <Stack className="d-flex justify-content-center">
            <div>
                <SmallNumberOrDot data={props.temperature} />
            </div>
            <div >
                {isNaN(props.weatherIconId) ? '...' : <WeatherIcon idIcon={props.weatherIconId} height={24} />}
            </div>
        </Stack>
    )
}

function WeatherIcon(props: { idIcon: number, height: number }): JSX.Element {
    if (props.idIcon >= 200 && props.idIcon <= 232) return <ThunderstormIcon height={props.height} />
    else if (props.idIcon >= 300 && props.idIcon <= 321) return <ShowerRainIcon height={props.height} />
    else if (props.idIcon >= 500 && props.idIcon <= 504) return <RainIcon height={props.height} />
    else if (props.idIcon == 511) return <SnowIcon height={props.height} />
    else if (props.idIcon >= 520 && props.idIcon <= 531) return <ShowerRainIcon height={props.height} />
    else if (props.idIcon >= 600 && props.idIcon <= 622) return <SunriseIcon height={props.height} />
    else if (props.idIcon >= 700 && props.idIcon <= 781) return <MistIcon height={props.height} />
    else if (props.idIcon == 800) return <ClearSkyIcon height={props.height} />
    else if (props.idIcon == 801) return <FewCloudsIcon height={props.height} />
    else if (props.idIcon == 802) return <ScatteredCloudsIcon height={props.height} />
    else if (props.idIcon == 803) return <BrokenCloudsIcon height={props.height} />
    else if (props.idIcon == 804) return <BrokenCloudsIcon height={props.height} />
    else return <small>...</small>
}