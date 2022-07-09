import React from 'react'
import { useUser } from '../contexts/useUser'
import ForecastTypeIcon from './ForecastTypeIcon'
import { ForecastType } from '../models/modelsApp'
import ForecastTypeLabel from './ForecastTypeLabel'
import { getBorderFaded } from '../styles/theme'
import { Stack } from '../core-ui/ui'
import { useAppStyle } from '../contexts/useStyle'

export default function LabelCollection() {
    const user = useUser()
    const appStyle = useAppStyle()

    return (
        <Stack
            className={`h-100 border-end border-start border-1 d-flex justify-content-center ${getBorderFaded(appStyle.theme)}`}
            onClick={() => { user.saveAppSettings({ ...user.userSettings, denseLabel: !user.userSettings.denseLabel }) }}
        >

            {user.userSettings.visiblesForecastsTypes.map((forecastType, index) => {
                const borderTop = index === 0 ? 'border-top' : ''

                return (
                    <div
                        key={forecastType + "-collection-label"}
                        className={`h-100 ${borderTop} border-bottom d-flex align-items-center justify-content-center ${getBorderFaded(appStyle.theme)}`}
                        style={appStyle.getForecastTypeWrapperStyle(forecastType)}
                    >
                        <ForecastTypeInfos forecastType={forecastType} isDense={user.userSettings.denseLabel} />
                    </div>
                )
            })}
        </Stack>
    )
}

function ForecastTypeInfos(props: { forecastType: ForecastType, isDense: boolean }): JSX.Element {
    return (
        <div className='d-flex justify-content-center align-items-center'>
            {props.isDense && <ForecastTypeIcon data={props.forecastType} />}
            {!props.isDense && <ForecastTypeLabel data={props.forecastType} />}
        </div>
    )
}