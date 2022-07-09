import React from "react";
import { GridCellFactoryContext, GridRowDefinition } from "../components/Grid";
import { DateHoursData, SmallNumberOrDot, SwellPeriodDirectionDataV1, SwellPeriodDirectionDataV2, SwellPeriodHourlyData, TideChartHourly, WaveSizeHourlyData, WeatherConditionTemperatureData, WindSpeedDirectionData } from "../components/hourlyForecastFactory";
import { Ratings, Report } from "../contexts/useNostr";
import { cellDataCN, getRowColorRatingContentStyle, getRowHoursContentStyle } from "../contexts/useStyle";
import { AirIcon, BoltIcon, ClockIcon, CloudyIcon, ExploreIcon, HeightIcon, HourglassIcon, StarIcon, ThermostatIcon, WaterIcon, WavesIcon } from "../core-ui/icons";
import { Stack } from "../core-ui/ui";
import { formatToIsoLocalTime } from "../helpers/dt";
import { isTideRising } from "../helpers/forecastHelper";
import { rowRatingColorGray, rowRatingColorRainbowTransparent, rowRatingRainbowColor } from "../styles/mapingRatingColors";
import { cloudRowValueRating, defaultWavesSizePrefered, energyRowValueRating, swellRowValueRating, wavesRowValueRating, weatherRowValueRating, windRowValueRating } from "../styles/mapingValueColors";
import { ForecastData } from "./forecast-grid";
import { HourlyForecast, SpotForecast } from "./modelsApp";

//
// Hours
//
export const hoursRowDefinition: GridRowDefinition<ForecastData> =
{
    name: 'Hours',
    id: 'hours',
    height: () => 2,
    label: () => <LabelComp label={'Hours'} unit={'(h)'} />,
    icon: ({ style }) => <ClockIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} fill={style.contrastedColor} />,
    content: ({ data }) => <DateHoursData dateHours={data.hourlyForecast.dateTime} isNow={false} />,
    // contentStyle: ({ data, style }) => getRowHoursContentStyle(data, style),
    contentClassName: ({ data, style }) => getRowHoursContentStyle(data, style),
}

//
// Waves Size
//
export const wavesSizeRowDefinition: GridRowDefinition<ForecastData> =
{
    name: 'Waves size',
    id: 'waveSize',
    height: () => 2,
    label: () => <LabelComp label={'Waves'} unit={'(ft)'} />,
    icon: ({ style }) => <WavesIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} fill={style.contrastedColor} />,
    content: ({ data }) => <WaveSizeHourlyData wavesSizeMin={data.hourlyForecast.wavesSizeMin} wavesSizeMax={data.hourlyForecast.wavesSizeMax} className={cellDataCN} />,
    // contentClassName: getContentClassName,
    contentStyle: ({ data }) => getRowColorRatingContentStyle(data, data => getCustomUserValue(data.hourlyForecast.wavesSizeMax, data), wavesRowValueRating, rowRatingColorRainbowTransparent),
}

//
// Swell
//
export const swellRowDefinition: GridRowDefinition<ForecastData> =
{
    name: 'Swell',
    id: 'longestSwell',
    height: () => 6,
    label: () => <LabelComp label={'Swell'} unit={'(s/Deg)'} />,
    icon: ({ style }) => <SwellDetailsIcons height={style.iconHeight} fillColor={style.contrastedColor} />,
    content: ({ data, style }) => <SwellPeriodDirectionDataV2 iconColor={style.contrastedColor ?? ''} swellDirection={data.hourlyForecast.longestSwellDirection} swellPeriod={data.hourlyForecast.longestSwellPeriod} />,
    contentClassName: getContentSwellClassName,
    // contentStyle: ({ data, style }) => getRowContentStyle(data, data => data.hourlyForecast.longestSwellPeriod, swellRowValueRating, rowRatingColorRainbowTransparent),
}

export const primarySwellRowDefinition: GridRowDefinition<ForecastData> = {
    name: 'Primary Swell Details',
    id: 'primarySwell',
    height: () => 4,
    label: () => <LabelComp label={'S1'} unit={'(s/Deg)'} />,
    icon: ({ style }) => <SwellDetailsIcons height={style.iconHeight} fillColor={style.contrastedColor} />,
    content: ({ data }) => <SwellPeriodDirectionDataV1 swellDirection={data.hourlyForecast.primarySwellDirection} swellPeriod={data.hourlyForecast.primarySwellPeriod} />,
    contentStyle: ({ data }) => getRowColorRatingContentStyle(data, data => data.hourlyForecast.primarySwellPeriod, swellRowValueRating, rowRatingColorRainbowTransparent),
}

export const secondarySwellRowDefinition: GridRowDefinition<ForecastData> = {
    name: 'Secondary Swell Details',
    id: 'secondarySwell',
    height: () => 4,
    label: () => <LabelComp label={'S2'} unit={'(s/Deg)'} />,
    icon: ({ style }) => <SwellDetailsIcons height={style.iconHeight} fillColor={style.contrastedColor} />,
    content: ({ data }) => <SwellPeriodDirectionDataV1 swellDirection={data.hourlyForecast.secondarySwellDirection} swellPeriod={data.hourlyForecast.secondarySwellPeriod} />,
    contentStyle: ({ data }) => getRowColorRatingContentStyle(data, data => data.hourlyForecast.secondarySwellPeriod, swellRowValueRating, rowRatingColorRainbowTransparent),
}

export const swellPeriodRowDefinition: GridRowDefinition<ForecastData> =
{
    name: 'Swell Period',
    id: 'swellPeriod',
    height: () => 2,
    label: () => <LabelComp label={'Swell'} unit={'(s)'} />,
    icon: ({ style }) => <HourglassIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} fill={style.contrastedColor} />,
    content: ({ data }) => <SwellPeriodHourlyData swellPeriod={data.hourlyForecast.longestSwellPeriod} />,
}

function getContentSwellClassName(context: GridCellFactoryContext<ForecastData>): string | undefined {
    const colorBorder = context.style.selectedColorClassName
    return `border-bottom border-opacity-25 border-${colorBorder}`
    // border-bottom border-${appStyle.classNames.fadedColor} border-opacity-25
}

function SwellDetailsIcons(props: { height: number | undefined, fillColor: string | undefined }): React.JSX.Element {
    return (
        <Stack direction='vertical' className='d-flex justify-content-center align-items-center'>
            <HourglassIcon height={props.height + 'rem'} width={props.height + 'rem'} fill={props.fillColor} />
            <ExploreIcon height={props.height + 'rem'} width={props.height + 'rem'} fill={props.fillColor} />
        </Stack>
    )
}

//
// Energy
//
export const energyRowDefinition: GridRowDefinition<ForecastData> = {
    name: 'Waves Energy',
    id: 'swellEnergy',
    height: () => 2,
    label: () => <LabelComp label={'Energy'} unit={'(Kj)'} />,
    icon: ({ style }) => <BoltIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} fill={style.contrastedColor} />,
    content: ({ data }) => <SmallNumberOrDot data={data.hourlyForecast.energy} />,
    contentStyle: ({ data }) => getRowColorRatingContentStyle(data, data => getCustomUserValue(data.hourlyForecast.energy, data), energyRowValueRating, rowRatingColorRainbowTransparent),
}

//
// Tide
//
export const tideRowDefinition: GridRowDefinition<ForecastData> = {
    name: 'Tide',
    id: 'tide',
    height: () => 8,
    label: () => <LabelComp label={'Tide'} unit={'(m)'} />,
    icon: ({ style }) => <HeightIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} fill={style.contrastedColor} />,
    content: ({ data }) => <TideChartHourly tideHeight={data.hourlyForecast.tideHeight} tideHeightPerOne={data.hourlyForecast.tideHeightPerOne} isTideRising={isTideRising(data, data => data.hourlyForecast.tideHeight)} />,
    // contentStyle: ({ data }) => isForecastRising(data, data => data.hourlyForecast.tideHeight),
}

//
// Wind
//
export const windRowDefinition: GridRowDefinition<ForecastData> = {
    name: 'Wind',
    id: 'wind',
    height: () => 3,
    label: () => <LabelComp label={'Wind'} unit={'(kts/...)'} />,
    icon: ({ style }) => <AirIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} fill={style.contrastedColor} />,
    content: ({ data }) => <WindSpeedDirectionData windSpeed={data.hourlyForecast.windSpeed} windCardinal={data.hourlyForecast.windDirectionCardinal} />,
    contentStyle: ({ data }) => getRowColorRatingContentStyle(data, data => data.hourlyForecast.windSpeed, windRowValueRating, rowRatingColorRainbowTransparent),
}

//
// Weather
//
export const weatherRowDefinition: GridRowDefinition<ForecastData> = {
    name: 'Weather Temperature',
    id: 'weatherTemperature',
    height: () => 3,
    label: () => <LabelComp label={'Weather'} unit={'(°C)'} />,
    icon: ({ style }) => <ThermostatIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} fill={style.contrastedColor} />,
    content: ({ data }) => <WeatherConditionTemperatureData temperature={data.hourlyForecast.temperature} weatherIconId={data.hourlyForecast.weatherDescriptionId} />,
    contentStyle: ({ data }) => getRowColorRatingContentStyle(data, data => data.hourlyForecast.temperature, weatherRowValueRating, rowRatingRainbowColor),
}

//
// Rain
//
export const rainRowDefinition: GridRowDefinition<ForecastData> = {
    name: 'Rain',
    id: 'rainMm',
    height: () => 2,
    label: () => <LabelComp label={'Rain'} unit={'(mm)'} />,
    icon: ({ style }) => <WaterIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} fill={style.contrastedColor} />,
    content: ({ data }) => <SmallNumberOrDot data={data.hourlyForecast.rainMm} />,
}

//
// Cloud
//
export const cloudRowDefinition: GridRowDefinition<ForecastData> = {
    name: 'Cloud Coverage',
    id: 'cloudCoverage',
    height: () => 2,
    label: () => <LabelComp label={'Cloud'} unit={'(%)'} />,
    icon: ({ style }) => <CloudyIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} fill={style.contrastedColor} />,
    content: ({ data }) => <SmallNumberOrDot data={data.hourlyForecast.cloudCoverage} />,
    contentStyle: ({ data }) => getRowColorRatingContentStyle(data, data => data.hourlyForecast.cloudCoverage, cloudRowValueRating, rowRatingColorGray),
}

//
// Rating
//
export const ratingRowDefinition: GridRowDefinition<ForecastData> = {
    name: 'Ratings',
    id: 'ratings',
    height: () => 3,
    label: () => <LabelComp label={'Ratings'} unit={''} />,
    // icon: ({ style }) => <>⭐</>,
    icon: ({ style }) => <StarIcon height={style.iconHeight + 'rem'} width={style.iconHeight + 'rem'} />,
    content: ({ data }) => <Ratings ratings={data.hourlyForecast.ratings ?? []} reportFactory={createDefaultReport(data.spotForecast, data.hourlyForecast)} />,
}

function createDefaultReport(spotForecast: SpotForecast, hourlyForecast: HourlyForecast): () => Report {
    return () => ({ time: formatToIsoLocalTime(hourlyForecast.dateTime), comment: '', rating: 0, spotId: spotForecast.spot.id })
}

// Helper functions
function getCustomUserValue(value: number, forecastData: ForecastData): number {
    return value / ((forecastData.userSettings.wavesSizePrefered + 1) / defaultWavesSizePrefered)
}

// TODO: Rename
function LabelComp(props: { label: string, unit: string }): React.JSX.Element {
    return (
        <small className={`text-wrap text-center`}>
            {props.label} {props.unit}
        </small>
    )
}

export function isBasicForecastRow(id: string): boolean {
    if (id === "primarySwell" || id === "secondarySwell" || id === "weatherTemperature" || id === "rain" || id === "cloudCoverage" || id === "rainMm")
        return false
    else
        return true
}