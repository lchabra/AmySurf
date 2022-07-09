import React, { CSSProperties } from "react"
import Badge from "react-bootstrap/esm/Badge"
import { cellDataCN } from "../contexts/useStyle"
import { ThunderstormIcon, ShowerRainIcon, RainIcon, SnowIcon, SunriseIcon, MistIcon, ClearSkyIcon, FewCloudsIcon, ScatteredCloudsIcon, BrokenCloudsIcon, ArrowSkinnyIconDown } from "../core-ui/icons"
import { Stack } from "../core-ui/ui"
import { IconOrientated, IconOrientatedData } from "./ArrowOrientated"

export function SmallNumberOrDot(props: { data: number }): React.JSX.Element {
    return <span className={`${cellDataCN}`}>{isNaN(props.data) ? '...' : props.data}</span>
}

export function DateHoursData(props: { dateHours: Date, isNow: boolean }): React.JSX.Element {

    if (props.isNow) {
        return <Badge className='' bg="secondary">Now</Badge>
    } else {
        return (
            <span className={`fw-semibold ${cellDataCN}`}>
                {props.dateHours.getHours()}
            </span>
        )
    }
}

export function WaveSizeHourlyData(props: { wavesSizeMin: number, wavesSizeMax: number, className?: string }): React.JSX.Element {
    const min = Math.round(props.wavesSizeMin)
    const max = Math.round(props.wavesSizeMax)
    const safeMin = isNaN(min) ? '...' : min
    const safeMax = isNaN(max) ? '...' : max
    const waveSize = safeMax === safeMin ? safeMin : `${safeMin} - ${safeMax}`

    return <span className={`text-nowrap ${props.className}`}>{waveSize}</span>
}


export function SwellPeriodHourlyData(props: { swellPeriod: number }): React.JSX.Element {
    return (
        <SmallNumberOrDot data={props.swellPeriod} />
    )
}

export function SwellPeriodDirectionDataV1(props: { swellPeriod: number, swellDirection: number }): React.JSX.Element {
    return (
        <Stack className="d-flex justify-content-center">
            <SmallNumberOrDot data={props.swellPeriod} />
            <SmallNumberOrDot data={props.swellDirection} />
        </Stack>
    )
}

export function SwellPeriodDirectionDataV2(props: { swellPeriod: number, swellDirection: number, iconColor: string }): React.JSX.Element {
    const iconOrientatedData: IconOrientatedData = {
        label: '',
        orientation: props.swellDirection,
        icon: <ArrowSkinnyIconDown height={1.5 + 'em'} color={props.iconColor} />
    }

    return (
        <Stack className="d-flex justify-content-center">
            <SmallNumberOrDot data={props.swellPeriod} />
            {props.swellDirection && <IconOrientated data={iconOrientatedData} />}
            <SmallNumberOrDot data={props.swellDirection} />
        </Stack>
    )
}

export function TideChartHourly(props: { tideHeight: number, tideHeightPerOne: number, isTideRising: boolean | undefined }): React.JSX.Element {
    const heightPerCentEmpty = isNaN(props.tideHeightPerOne) ? 0 : (100 - props.tideHeightPerOne * 100)
    const heightPerCentTide = isNaN(props.tideHeightPerOne) ? 0 : props.tideHeightPerOne * 100

    const styleTideNumberWrapper = getStyleTideNumberWrapper(heightPerCentTide)

    const tideIndicatorClassName = props.isTideRising ? 'bg-primary' : 'bg-info'

    return (
        <div className='h-100 w-100 position-relative'>
            <div style={styleTideNumberWrapper} className='w-100'>
                <SmallNumberOrDot data={props.tideHeight} />
            </div>

            <div style={{ height: heightPerCentEmpty + '%' }} />
            <div style={{ height: heightPerCentTide + '%', opacity: 0.4 }} className={`border-end border-start ${tideIndicatorClassName}`} />
        </div >
    )
}

function getStyleTideNumberWrapper(tideSize: number): CSSProperties {
    let topValue: number | undefined
    let bottomValue: number | undefined

    if (tideSize <= 80) {
        bottomValue = tideSize
    } else {
        topValue = 0
    }

    return {
        position: 'absolute',
        top: topValue + '%',
        bottom: bottomValue + '%',
    }
}

export function WindSpeedDirectionData(props: { windSpeed: number, windCardinal: string }): React.JSX.Element {
    return (
        <Stack className="d-flex justify-content-center">
            <SmallNumberOrDot data={props.windSpeed} />
            <small>
                {props.windCardinal}
            </small>
        </Stack>
    )
}

export function WeatherConditionTemperatureData(props: { temperature: number, weatherIconId: number }): React.JSX.Element {
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

function WeatherIcon(props: { idIcon: number, height: number }): React.JSX.Element {
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