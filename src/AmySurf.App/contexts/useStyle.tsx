import React, { CSSProperties, useMemo, useState } from "react";
import { GridStyle } from "../components/Grid";
import { ForecastData } from "../models/forecast-grid";
import { AppStyle, ThemeColor } from "../models/modelsApp";
import { RowRatingColor } from "../styles/mapingRatingColors";
import { RowValueRating } from "../styles/mapingValueColors";
import { useUser } from "./useUser";


export const containerWidthLimitEm = 50
export const FtPageTitleHeightEm = 2
export const forecastDaySummaryHeightEm = 2.5
export const heightEmPerForecastUnit = 1.5
export const rowWidthEm = 4
export const labelDenseWitdhEm = 2
export const labelWitdhEm = 3.5
export const minMapSizeEm = 8
export const navBarHeightEm = 4

// Icons
export const windSwellIconHeightRem = 4
export const navBarIconHeightRem = 1.8
export const labelExpandHeightRem = 1.3
export const bookmarkIconHeightRem = 1.5
export const spotContainerCloseIconHeightRem = 2
export const sunSetRiseIconHeightRem = 1.5

// CN = ClassName
export const pageTitleCN = 'fw-semibold fs-4'
export const summaryForecastCN = 'fw-semibold fs-6'
export const cellDataCN = 'fs-6'
export const labelCN = 'fs-6'

const AppStyleContext = React.createContext<AppStyle | null>(null);

// Context Provider
export function AppStyleProvider(props: { children: React.ReactNode }) {
    const appStyle = _useAppStyle()
    return (<AppStyleContext.Provider value={appStyle}>{props.children}</AppStyleContext.Provider>)
}

// Global function used to get the AppStyle
export function useAppStyle(): AppStyle {
    const value = React.useContext(AppStyleContext)
    if (!value) throw new Error('AppStyle is not initialized')
    return value
}

function _useAppStyle(): AppStyle {
    const user = useUser()
    const [appStyleState, setAppStyleState] = useState<AppStyle>(getAppStyle(user.userSettings.themeColor))

    useMemo(() => (
        setAppStyleState(getAppStyle(user.userSettings.themeColor))
    ), [user.userSettings.themeColor]) // TODO: Add more conditions


    return appStyleState
}

export function getNextTheme(themeColor: ThemeColor): ThemeColor {
    switch (themeColor) {
        case ThemeColor.dark:
            return ThemeColor.light
        case ThemeColor.light:
            return ThemeColor.dark
        default:
            return ThemeColor.dark;
    }
}

function getAppStyle(themeColor: ThemeColor): AppStyle {
    switch (themeColor) {
        case ThemeColor.dark:
            return darkAppStyle
        case ThemeColor.light:
            return lightAppStyle
        default:
            return darkAppStyle
    }
}

// Tone colors
const toneOrangeColor = "#f2a900"
const toneDarkOrangeColor = "#C18700"

const darkAppStyle: AppStyle = {
    classNames: {
        mainColor: 'theme-dark-gray',
        mainContrastColor: 'light',
        toneColor: 'tone-orange',
        toneContrastColor: 'black',
        fadedColor: 'theme-dark-gray-faded',
        selectedColor: 'theme-dark-gray-selected',

    },
    colorValues: {
        themeConstrast: 'white',
        themeTone: toneOrangeColor,
        // mapPin: 'black',
        // mapPinSelected: 'green',
        // mapPinFavorite: toneOrangeColor
    }
}

const lightAppStyle: AppStyle = {
    classNames: {
        mainColor: 'theme-light-gray',
        mainContrastColor: 'dark',
        toneColor: 'tone-orange-dark',
        toneContrastColor: 'black',
        fadedColor: 'theme-light-gray-faded',
        selectedColor: 'theme-light-gray-selected',
    },
    colorValues: {
        themeConstrast: 'black',
        themeTone: toneDarkOrangeColor,
        // mapPin: 'black',
        // mapPinSelected: 'green',
        // mapPinFavorite: toneOrangeColor
    }
}

export function getGradientColor(startColor: string, endColor: string): string {
    return `linear-gradient(to right, ${startColor} 0%, ${endColor} 100%)`
}

export function getDirectionalGradientColor(startColor: string, endColor: string, direction?: string, percent?: number): string {
    return `linear-gradient(${direction ? direction : 'to right'}, ${startColor} 0%, ${endColor} ${percent ? percent + '%' : '100%'})`
}

//TODO:
export function getRowHoursContentStyle(forecastData: ForecastData, gridStyle: GridStyle): string {

    if (forecastData.spotForecast.sunriseTimes[0] === undefined) {
        // console.log(forecastData.spotForecast)
        return ''
    } else if (forecastData.spotForecast.sunsetTimes[0] === undefined) {
        // console.log(forecastData.spotForecast)
        return ''
    } {
        const hours = forecastData.hourlyForecast.dateTime.getHours()
        const sunrise = forecastData.spotForecast.sunriseTimes[0].getHours()
        const sunset = forecastData.spotForecast.sunsetTimes[0].getHours()
        const isNightTime = hours < sunrise || hours > sunset

        if (isNightTime) {
            return `bg-${gridStyle.selectedColorClassName}`
        }
        else {
            return ''
        }
    }

}

export function getRowColorRatingContentStyle(forecastData: ForecastData, valueProvider: (data: ForecastData) => number, valueRating: RowValueRating, ratingColor: RowRatingColor): CSSProperties {
    // Colors
    const bgTextColors = getBackgroundAndTextColors(forecastData, valueProvider, valueRating, ratingColor);

    return bgTextColors
}

function getBackgroundAndTextColors(forecastData: ForecastData, valueProvider: (data: ForecastData) => number, valueRating: RowValueRating, ratingColor: RowRatingColor): CSSProperties {
    const rowValue = Math.round(valueProvider(forecastData))
    let rowColorClassName = ''

    if (isNaN(rowValue)) {
        rowColorClassName = 'transparent'
    }
    else {
        rowColorClassName = getRowColor(rowValue, valueRating, ratingColor);
    }

    let { color, background: rowBackground } = getStyleFromSelectorText(`.grid-cell-${rowColorClassName}`);

    if (forecastData.spotForecast.allData.length === 1) {
        return { color, background: rowBackground };
    }
    const indexHourlyForecast = forecastData.spotForecast.allData.indexOf(forecastData.hourlyForecast);

    // If not the last row
    if (indexHourlyForecast !== forecastData.spotForecast.allData.length - 1) {

        const indexInAllData = forecastData.spotForecast.allData.indexOf(forecastData.hourlyForecast);
        let nextValue = Math.round(valueProvider({ ...forecastData, hourlyForecast: forecastData.spotForecast.allData[indexInAllData + 1] }))

        let nextRowColorClassName = ''

        if (isNaN(nextValue)) {
            nextRowColorClassName = 'transparent'
        }
        else {
            nextRowColorClassName = getRowColor(nextValue, valueRating, ratingColor);
        }

        let { background: nextRowBackground } = getStyleFromSelectorText(`.grid-cell-${nextRowColorClassName}`);

        if (rowColorClassName !== nextRowColorClassName) {
            rowBackground = getGradientColor(rowBackground as string, nextRowBackground as string);
        }
    }

    // if (rowColorClassName === 'transparent') {
    //     color = ''
    // }
    return { color, background: rowBackground };
}

function getRowColor(value: number, valueRating: RowValueRating, ratingColor: RowRatingColor): string {
    const ratingKey = Object.keys(valueRating).find(key => parseInt(key) >= value)
    if (ratingKey == undefined)
        return 'black-1'

    const rating = valueRating[parseInt(ratingKey)]
    return ratingColor[rating]
}

export function getStyleFromSelectorText(selectorText: string): CSSProperties {
    const cssRules = document.styleSheets[0].cssRules
    for (let i = 0; i < cssRules.length; i++) {
        const cssRule: any = cssRules[i]
        if (cssRule.selectorText === selectorText) {
            return cssRule.style
        }
    }
    throw new Error('selectorText not found ' + selectorText)
}