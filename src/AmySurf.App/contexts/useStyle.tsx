import React, { useState } from "react"
import { AppStyle, DefaultAppStyle, ForecastType, IAppStyle } from "../models/modelsApp";
import { ThemeColor } from "../styles/theme";

export const orangeColor = "#f2a900"; // rename Theme Color?
export const darkOrangeColor = "#C18700"; // rename Theme Color?

export const navBarHeightEm = 4
export const FtPageTitleHeightEm = 2
export const minMapSizeEm = 8
export const forecastDaySummaryHeightEm = 2.5
export const heightEmPerForecastUnit = 1.5
export const hourlyCollectionWidth = 3
export const forecastLabelDenseWitdhEm = 2
export const forecastLabelWitdhEm = 4
export const containerWidthLimitEm = 50

// Icons
export const windSwellIconHeight = 5
export const navBarIconHeightRem = 1.8
export const forecastTypeIconHeightRem = 1.3
export const bookmarkIconHeightRem = 1.5
export const spotContainerCloseIconHeightRem = 2
export const sunSetRiseIconHeightRem = 1.5

const AppStyleContext = React.createContext<IAppStyle | null>(null);

// Context Provider
export function AppStyleProvider(props: { children: React.ReactNode }) {
    const appStyle = _useAppStyle()
    return (<AppStyleContext.Provider value={appStyle}>{props.children}</AppStyleContext.Provider>)
}

// Global function used to get the AppStyle
export function useAppStyle(): IAppStyle {
    const value = React.useContext(AppStyleContext)
    if (!value) throw new Error('AppStyle is not initialized')
    return value
}

function _useAppStyle(): IAppStyle {
    const [appStyle, setAppStyle] = useState<AppStyle>(DefaultAppStyle)
    return {
        ...appStyle,
        getForecastTypeWrapperStyle: (forecastType: ForecastType) => getForecastTypeStyle(forecastType, appStyle.forecastTypeStyles),
        saveAppStyle: (value: AppStyle) => {
            setAppStyle(s => ({ ...s, ...value }))
            return value
        }
    }
}

function getForecastTypeStyle(forecastType: ForecastType, styles: [ForecastType, React.CSSProperties][]): React.CSSProperties {
    const index: number = parseInt(forecastType.valueOf()) - 1;
    const lastIndex = styles.length - 1;
    return lastIndex >= index ? styles[index][1] : {};
}

export function getForecastsTypeStyle(): [ForecastType, React.CSSProperties][] {
    let styles: [ForecastType, React.CSSProperties][] = []
    const maxFactor = 2.5

    Object.values(ForecastType).map(ft => {
        const minEm = getMinEmHeight(ft)

        const style: React.CSSProperties = {
            minHeight: minEm + 'rem',
            // height: minEm + 'rem',
            maxHeight: `${minEm * maxFactor}em`,
        }

        styles.push([ft, style])
    })

    return styles
}

function getMinEmHeight(forecastType: ForecastType): number {

    switch (forecastType) {
        case ForecastType.Hours:
            return HeightUnitForecastType.Hours * heightEmPerForecastUnit
        case ForecastType.WaveSize:
            return HeightUnitForecastType.WaveSize * heightEmPerForecastUnit
        case ForecastType.SwellEnergy:
            return HeightUnitForecastType.SwellEnergy * heightEmPerForecastUnit
        case ForecastType.SwellPeriodDirectionPrimary:
            return HeightUnitForecastType.SwellPeriodDirectionPrimary * heightEmPerForecastUnit
        case ForecastType.SwellPeriodDirectionSecondary:
            return HeightUnitForecastType.SwellPeriodDirectionSecondary * heightEmPerForecastUnit
        case ForecastType.TideChart:
            return HeightUnitForecastType.TideChart * heightEmPerForecastUnit
        case ForecastType.WindSpeedDirection:
            return HeightUnitForecastType.WindSpeedDirection * heightEmPerForecastUnit
        case ForecastType.WeatherConditionTemperature:
            return HeightUnitForecastType.WeatherConditionTemperature * heightEmPerForecastUnit
        case ForecastType.RainMm:
            return HeightUnitForecastType.RainMm * heightEmPerForecastUnit
        case ForecastType.CloudCoverage:
            return HeightUnitForecastType.CloudCoverage * heightEmPerForecastUnit
        default:
            return 0
    }
}

enum HeightUnitForecastType {
    Hours = 1,
    WaveSize = 1,
    SwellEnergy = 1,
    SwellPeriodDirectionPrimary = 2,
    SwellPeriodDirectionSecondary = 2,
    TideChart = 4,
    WindSpeedDirection = 2,
    WeatherConditionTemperature = 2,
    RainMm = 1,
    CloudCoverage = 1,
}


export function getIconStrokeColor(appThemeColor: ThemeColor): string {
    switch (appThemeColor) {
        case ThemeColor.light:
            return '#000000'
        case ThemeColor.dark:
            return ''
        default:
            return '#000000'
    }
}