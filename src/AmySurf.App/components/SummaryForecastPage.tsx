import { isSameDay } from 'date-fns'
import React from 'react'
import { hourlyCollectionWidth, sunSetRiseIconHeightRem } from '../contexts/useStyle'
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

    return (
        <div style={styles.wrapper} className='h-100 d-flex border-bottom text-center align-items-center justify-content-center'>
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

function SummaryLong(props: { data: SummaryForecastPageData }): JSX.Element {
    return (
        <Container fluid className='p-0 d-flex justify-content-center'>
            {getDatesTitleLong(props.data.dates)}

            <SunsetIcon height={sunSetRiseIconHeightRem + 'rem'} width={sunSetRiseIconHeightRem + 'rem'} marginLeft='1rem' />
            {getSunSetRiseTime(props.data.sunriseTimes)}

            <SunriseIcon height={sunSetRiseIconHeightRem + 'rem'} width={sunSetRiseIconHeightRem + 'rem'} marginLeft='1rem' />
            {getSunSetRiseTime(props.data.sunsetTimes)}
        </Container>
    )
}

function SummaryMedium(props: { data: SummaryForecastPageData }): JSX.Element {
    return <h6 className='m-0'>
        {getDatesTitleLong(props.data.dates)}
    </h6>
}

function SummaryShort(props: { data: SummaryForecastPageData }): JSX.Element {
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
            minWidth: (amountHourlyForecast * hourlyCollectionWidth) + 'rem',
            width: (amountHourlyForecast * hourlyCollectionWidth) + 'rem',
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
