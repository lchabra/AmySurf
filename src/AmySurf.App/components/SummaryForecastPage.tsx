import { isSameDay } from 'date-fns'
import React from 'react'
import { rowWidthEm, summaryForecastCN, sunSetRiseIconHeightRem } from '../contexts/useStyle'
import { SunriseIcon, SunsetIcon } from '../core-ui/icons'
import { Container, OverlayTrigger, Tooltip } from '../core-ui/ui'
import { formatEEEEd, formatTimeLong } from '../helpers/dt'

export type SummaryForecastPageData = {
    dates: Date[],
    sunriseTimes: Date[]
    sunsetTimes: Date[]
}

export default function SummaryForecastPage(props: { data: SummaryForecastPageData }) {
    const styles = getStyles(props.data.dates.length)

    const wrapperClassName = `h-100 d-flex align-items-center ${summaryForecastCN}`

    return (
        <div style={styles.wrapper} className={wrapperClassName}>
            {
                props.data.dates.length <= 2 &&
                <SummaryShort data={props.data} />
            }
            {
                props.data.dates.length <= 7 &&
                props.data.dates.length >= 3 &&
                <SummaryMedium data={props.data} />
            }
            {
                props.data.dates.length > 7 &&
                <SummaryLong data={props.data} />
            }
        </div>
    )
}

function SummaryLong(props: { data: SummaryForecastPageData }): React.JSX.Element {
    return (
        <Container fluid className=''>
            <span>
                {getDatesTitleLong(props.data.dates)}
            </span>
            <SunriseIcon height={sunSetRiseIconHeightRem + 'rem'} width={sunSetRiseIconHeightRem + 'rem'} marginLeft='1rem' />
            <span>
                {getSunSetRiseTime(props.data.sunriseTimes)}
            </span>
            <SunsetIcon height={sunSetRiseIconHeightRem + 'rem'} width={sunSetRiseIconHeightRem + 'rem'} marginLeft='1rem' />
            <span>
                {getSunSetRiseTime(props.data.sunsetTimes)}
            </span>
        </Container>
    )
}

function SummaryMedium(props: { data: SummaryForecastPageData }): React.JSX.Element {
    return <span className=''>
        {getDatesTitleLong(props.data.dates)}
    </span>
}

function SummaryShort(props: { data: SummaryForecastPageData }): React.JSX.Element {
    return (
        <OverlayTrigger
            // trigger={['click']}
            delay={{ show: 0, hide: 10 }}
            placement='bottom'
            overlay={
                <Tooltip id="button-tooltip">
                    <SummaryMedium data={props.data} />
                </Tooltip>
            }>
            <span className="d-inline-block">
                ...
            </span>
        </OverlayTrigger>
    )
}

function getStyles(amountHourlyForecast: number) {
    return {
        wrapper: {
            minWidth: (amountHourlyForecast * rowWidthEm) + 'rem',
            width: (amountHourlyForecast * rowWidthEm) + 'rem',
        }
    }
}

function getDatesTitleLong(dates: Date[]): string {

    const uniqueDays = dates.filter((date, index, dates) => {
        return dates.findIndex(x => isSameDay(x, date)) === index
    })

    if (uniqueDays.length == 0) {
        return ''
    } else if (uniqueDays.length == 1) {
        return formatEEEEd(uniqueDays[0])
    } else {
        return `${uniqueDays[0].getDay()}/${uniqueDays[0].getMonth()} - ${uniqueDays[uniqueDays.length - 1].getDay()}/${uniqueDays[uniqueDays.length - 1].getMonth()}`
    }
}

function getSunSetRiseTime(sunSetRiseTime: Date[]): string {
    if (sunSetRiseTime.length == 0) {
        return ''
    } else if (sunSetRiseTime.length == 1) {
        return formatTimeLong(new Date(sunSetRiseTime[0]))
    } else {
        return `${formatTimeLong(new Date(sunSetRiseTime[0]))} / ${formatTimeLong(new Date(sunSetRiseTime[sunSetRiseTime.length - 1]))}`
    }
}
