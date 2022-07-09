import React from 'react'
import Stack from 'react-bootstrap/esm/Stack'
import { ForecastType, HourlyForecast } from '../models/modelsApp'
import { getHourlyView } from './hourlyForecastFactory'
import { getBorderFaded, getSelectedColorClassName } from '../styles/theme'
import { changeSelectedForecast, useForecastSummary } from '../contexts/useForecastSummary'
import { useUser } from '../contexts/useUser'
import { hourlyCollectionWidth, useAppStyle } from '../contexts/useStyle'
import { isSameHour } from '../helpers/dt'

// One Hourly Row, Contains Hourly Forecast Data, like : 6am/3ft/300kj
export function HourlyCollection(props: { data: HourlyForecast }): JSX.Element {
    const user = useUser()
    const appStyle = useAppStyle()
    const forecastSummary = useForecastSummary()

    let backgroundColor = ''
    if (forecastSummary.selectedForecast?.dateTime !== undefined) {
        backgroundColor = isSameHour(forecastSummary.selectedForecast?.dateTime, props.data.dateTime) ? getSelectedColorClassName(appStyle.theme) : ''
    }

    return (
        <Stack
            className={`h-100 d-flex justify-content-center ${backgroundColor}`}
            style={{ backgroundColor: backgroundColor, width: hourlyCollectionWidth + 'rem' }}
            direction='vertical'
            onClick={() => changeSelectedForecast(forecastSummary, props.data)}
        >
            {
                user.userSettings.visiblesForecastsTypes.map((forecastType: ForecastType, index) => {
                    const borderTop = index === 0 ? 'border-top' : ''
                    return (
                        <div
                            key={'hourlyForecast-' + forecastType + '-' + index}
                            className={`h-100 ${borderTop} border-bottom ${getBorderFaded(appStyle.theme)} d-flex text-center align-items-center justify-content-center `}
                            style={appStyle.getForecastTypeWrapperStyle(forecastType)}
                        >
                            {getHourlyView(forecastType, props.data)}
                        </div>
                    )
                })
            }
        </Stack>
    )
}
