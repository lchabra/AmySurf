import React, { CSSProperties } from 'react';
import { useForecastsApi } from '../contexts/useForecasts';
import { forecastDaySummaryHeightEm, sunSetRiseIconHeightRem, useAppStyle } from '../contexts/useStyle';
import { ReportProblemIcon } from '../core-ui/icons';
import { Spinner } from '../core-ui/ui';

// Not used yet.
export function ForecastStatusIcons(props: { handleShowErrors: () => void; }) {
    const forecastsApi = useForecastsApi()
    const appStyle = useAppStyle()
    const hasError = forecastsApi.data?.errors !== undefined && forecastsApi.data.errors.length > 0
    const styles = getForecastStatusIconsStyles()

    return (

        <div
            className={`d-flex justify-content-center align-items-center border-end border-start border-bottom border-${appStyle.classNames.fadedColor}`}
            style={styles.statusIcon}
        >
            {forecastsApi.isSurfLoading && <Spinner size='sm' animation={'border'} />}
            {!forecastsApi.isSurfLoading && hasError && <ProblemIcon handleShowErrorsClick={props.handleShowErrors} />}
        </div>
    )
}

function ProblemIcon(props: { handleShowErrorsClick: () => void }): React.JSX.Element | null {
    const forecastsApi = useForecastsApi()
    const hasError = forecastsApi.data?.errors !== undefined && forecastsApi.data.errors.length > 0

    return (
        <>
            {
                hasError &&
                <div onClick={props.handleShowErrorsClick} >
                    <ReportProblemIcon height={sunSetRiseIconHeightRem + 'rem'} width={sunSetRiseIconHeightRem + 'rem'} fill={'red'} />
                </div>
            }
        </>
    )
}

function getForecastStatusIconsStyles(): Record<string, CSSProperties> {
    return {
        statusIcon: {
            minHeight: forecastDaySummaryHeightEm + 'rem',
            height: forecastDaySummaryHeightEm + 'rem'
        }
    }
}