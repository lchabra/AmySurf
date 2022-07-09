import React, { CSSProperties, useState } from 'react'
import { Stack } from '../core-ui/ui'
import LabelCollection from './LabelCollections'
import { ForecastsPagesCollection } from './ForecastPagesCollections'
import { useUser } from '../contexts/useUser'
import { useForecastsApi } from '../contexts/useForecasts'
import { ErrorsModal } from './ErrorsComponents'
import { formatTimeLong, formatToPattern, isToday } from '../helpers/dt'
import { ForecastStatusIcons } from './ForecastStatusIcons'
import { forecastLabelDenseWitdhEm, forecastLabelWitdhEm } from '../contexts/useStyle'
import { LabelsStyleChanger } from './LabelStyleChanger'

export function ForecastsDetails(): JSX.Element {
    const [showErrors, setShowErrors] = useState(false)

    const handleCloseErrors = () => setShowErrors(false);
    const handleShowErrors = () => setShowErrors(true);

    const user = useUser()
    const forecastsApi = useForecastsApi()

    const styles = getForecastsDetailsStyles(user.userSettings.denseLabel)
    const hasError = forecastsApi.data?.errors !== undefined && forecastsApi.data.errors.length > 0

    return (
        <Stack direction='horizontal' className="h-100 d-flex justify-content-center">

            <Stack style={styles.verticalInfo} className='h-100'>
                {hasError && <ForecastStatusIcons handleShowErrors={handleShowErrors} />}
                {!hasError && <LabelsStyleChanger />}
                <LabelCollection />
            </Stack>

            <div className='h-100' style={{ overflowX: 'scroll' }}>
                <ForecastsPagesCollection />
            </div>

            {showErrors && <ErrorsModal title={<ForecastErrorModalTitle />} handleCloseModal={handleCloseErrors} />}
        </Stack>
    )
}

function ForecastErrorModalTitle(): JSX.Element {
    return (
        <Stack direction='vertical'>
            <h3>
                Oops !
            </h3>
            <span className='fs-6'>
                {GetLastUpdateTimeString()}
            </span>
        </Stack>
    )
}

function GetLastUpdateTimeString(): string {
    const forecastApi = useForecastsApi()
    const updateTime = forecastApi.data?.date
    if (updateTime === undefined) return ''
    return isToday(updateTime) ? `Last forecasts update: today ${formatTimeLong(updateTime)}` : `Last forecasts update: ${formatToPattern(updateTime, 'Pp')}`
}

function getForecastsDetailsStyles(isDenseLabel: boolean): Record<string, CSSProperties> {
    return {
        verticalInfo: {
            minWidth: isDenseLabel ? forecastLabelDenseWitdhEm + 'rem' : forecastLabelWitdhEm + 'rem',
            maxWidth: isDenseLabel ? forecastLabelDenseWitdhEm + 'rem' : forecastLabelWitdhEm + 'rem',
            overflowX: 'scroll',
            overflowY: 'hidden'
        },
    }
}