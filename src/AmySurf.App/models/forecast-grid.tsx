import React from "react"
import { GridOptions, GridRowDefinition, GridStyle } from "../components/Grid"
import SummaryForecastPage, { SummaryForecastPageData } from "../components/SummaryForecastPage"
import { useForecastSummary } from "../contexts/useForecastSummary"
import { rowWidthEm, useAppStyle } from "../contexts/useStyle"
import { useUser } from "../contexts/useUser"
import { formatPPP, isSameDay } from "../helpers/dt"
import { HourlyForecast, SpotForecast, UserSettings } from "./modelsApp"
import { cloudRowDefinition, energyRowDefinition, hoursRowDefinition, primarySwellRowDefinition, rainRowDefinition, ratingRowDefinition, secondarySwellRowDefinition, swellPeriodRowDefinition, tideRowDefinition, wavesSizeRowDefinition, weatherRowDefinition, windRowDefinition } from "./rows"

/** 
 * Data model for each grid element 
 * */
export type ForecastData = {
  spotForecast: SpotForecast
  hourlyForecast: HourlyForecast
  userSettings: UserSettings
}

/**
 * Get a cache version of the Grid schema.
 * This schema contains list of rows to diplay, styles, element factories, etc...
 * @returns configured schema which can be passed to Grid Component
 */
export function useForecastGridOptions(): GridOptions<SpotForecast, ForecastData> {
  const user = useUser();
  const appStyle = useAppStyle()
  const selectionService = useForecastSummary();

  return React.useMemo<GridOptions<SpotForecast, ForecastData>>(() => {
    // Create row definitions from settings (visible types)
    const rows: GridRowDefinition<ForecastData>[] = []

    user.userSettings.rowVisibility.forEach(visibleRow => {
      if (visibleRow.isVisible) {
        const row = allRows.find(r => r.id === visibleRow.id)
        if (!row)
          throw new Error(`Cannot find row ${visibleRow.id}`)
        else
          rows.push(row)
      }
    });

    const style: GridStyle = {
      themeColor: user.userSettings.themeColor,
      selectedColorClassName: appStyle.classNames.selectedColor,
      toneColorClassName: appStyle.classNames.toneColor,
      baseWidth: rowWidthEm,
      iconHeight: 1.5,
      baseHeight: 0.8,
      contrastedColor: appStyle.colorValues.themeConstrast,
      customAppStyle: appStyle
    }

    return {
      dense: user.userSettings.denseLabel,
      rows,
      style,
      groupProvider: getForecastsGroups,
      cellDataProvider: spotForecast => spotForecast.data.map(x => ({ spotForecast: spotForecast, hourlyForecast: x, userSettings: user.userSettings })),
      groupElementFactory: spotForecast => <SummaryForecastPage data={getPageSummaryData(spotForecast)} />,
      keyProvider: forecastData => forecastData.hourlyForecast.dateTime.valueOf(),
      onClick: forecastData => selectionService.setSelectedForecast(forecastData.hourlyForecast),
      columnClassNameProvider: () => '',
      // columnClassNameProvider: getColumnClassNameDayNight,
      onHeaderClick: () => user.saveAppSettings({ ...user.userSettings, denseLabel: !user.userSettings.denseLabel }),
    }
  }, [appStyle, user.userSettings.rowVisibility, user.userSettings.denseLabel]); // TODO: Add more?
}

export const allRows: GridRowDefinition<ForecastData>[] = [
  hoursRowDefinition,
  wavesSizeRowDefinition,
  swellPeriodRowDefinition,
  // swellRowDefinition,
  primarySwellRowDefinition,
  secondarySwellRowDefinition,
  energyRowDefinition,
  tideRowDefinition,
  windRowDefinition,
  weatherRowDefinition,
  rainRowDefinition,
  cloudRowDefinition,
  ratingRowDefinition
]

function getForecastsGroups(spotForecast: SpotForecast): SpotForecast[] {
  const groups: { [key: string]: any } = {};

  spotForecast.data.forEach((refHourlyForecast) => {
    const groupKey = formatPPP(new Date(refHourlyForecast.dateTime))

    if (groupKey in groups) {
      groups[groupKey].qtyHoursForecasted += 1
    } else {
      const hourlyForecasts: HourlyForecast[] = spotForecast.data.filter(forecast => isSameDay(new Date(forecast.dateTime), new Date(refHourlyForecast.dateTime)))
      const sunriseTimes: Date[] = spotForecast.sunriseTimes.filter(sunriseTime => isSameDay(new Date(sunriseTime), new Date(refHourlyForecast.dateTime)))
      const sunsetTimes: Date[] = spotForecast.sunsetTimes.filter(sunsetTime => isSameDay(new Date(sunsetTime), new Date(refHourlyForecast.dateTime)))

      const appForecastPage: SpotForecast =
      {
        updateTime: spotForecast.updateTime,
        spot: spotForecast.spot,
        // sunriseTimes: [],
        // sunsetTimes: [],
        sunriseTimes: sunriseTimes,
        sunsetTimes: sunsetTimes,
        data: hourlyForecasts,
        allData: spotForecast.data
      }

      groups[groupKey] = appForecastPage
    }
  })

  return Object.entries(groups).map(([_, value]) => value) as SpotForecast[]
}

function getPageSummaryData(forecasts: SpotForecast): SummaryForecastPageData {
  return {
    dates: forecasts.data.map(hf => hf.dateTime),
    sunriseTimes: forecasts.sunriseTimes,
    sunsetTimes: forecasts.sunsetTimes
  }
}

// Day-Night on Grid
// function getColumnClassNameDayNight(context: GridCellFactoryContext<ForecastData>): string | undefined {
//   const { hourlyForecast, spotForecast } = context.data
//   const appStyle: AppStyle = context.style.customAppStyle
//   const hours = roundToNearestMinutes(hourlyForecast.dateTime, 30).getHours()
//   const sunrise = roundToNearestMinutes(spotForecast.sunriseTimes[0], 30).getHours()
//   const sunset = roundToNearestMinutes(spotForecast.sunsetTimes[0], 30).getHours()

//   const isNightTime = hours < sunrise || hours > sunset
//   if (isNightTime) {
//     return `bg-${appStyle.classNames.fadedColor}`
//   }
//   return ''
// }