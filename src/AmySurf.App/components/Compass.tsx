import React from 'react'
import { windSwellIconHeightRem } from '../contexts/useStyle'
import { useUser } from '../contexts/useUser'
import { SwellDirectionArrow, WindDirectionArrow } from '../core-ui/icons'
import { Stack } from '../core-ui/ui'
import { HourlyForecast } from '../models/modelsApp'
import { IconOrientated, IconOrientatedData } from './ArrowOrientated'

export function SwellArrows(props: { data: HourlyForecast }): React.JSX.Element {
    const user = useUser()
    const isLongestSwellVisible = user.userSettings.rowVisibility.find(r => r.id === 'longestSwell' || 'swellPeriod')?.isVisible ?? false
    const isS1Visible = user.userSettings.rowVisibility.find(r => r.id === 'primarySwell')?.isVisible ?? false
    const isS2Visible = user.userSettings.rowVisibility.find(r => r.id === 'secondarySwell')?.isVisible ?? false

    return (
        <Stack direction='horizontal'>
            {
                isS1Visible &&
                !isNaN(props.data.primarySwellPeriod) &&
                !isNaN(props.data.primarySwellDirection) &&
                <IconOrientated
                    data={getSwellDataNew(
                        "S1",
                        props.data.primarySwellPeriod,
                        props.data.primarySwellDirection,
                        windSwellIconHeightRem)
                    }
                />
            }
            {
                isS2Visible &&
                !isNaN(props.data.secondarySwellPeriod) &&
                !isNaN(props.data.secondarySwellDirection) &&
                <IconOrientated
                    data={getSwellDataNew(
                        "S2",
                        props.data.secondarySwellPeriod,
                        props.data.secondarySwellDirection,
                        windSwellIconHeightRem)
                    }
                />
            }
            {
                isLongestSwellVisible &&
                !isNaN(props.data.longestSwellPeriod) &&
                !isNaN(props.data.longestSwellDirection) &&
                <IconOrientated
                    data={getSwellDataNew(
                        "S",
                        props.data.longestSwellPeriod,
                        props.data.longestSwellDirection,
                        windSwellIconHeightRem)
                    }
                />
            }
            {
                !isNaN(props.data.windSpeed) &&
                !isNaN(props.data.windDirection) &&
                <IconOrientated
                    data={getWindDataNew(
                        props.data.windSpeed,
                        props.data.windDirection,
                        windSwellIconHeightRem)
                    }
                />
            }
        </Stack>
    )
}

function getSwellDataNew(label: string, period: number, direction: number, iconHeight: number): IconOrientatedData {
    direction += 90 // Correct the default arrow orientation
    return {
        label: `${label}: ${period}s`,
        orientation: direction,
        icon: <SwellDirectionArrow height={iconHeight + 'rem'} />
    }
}

function getWindDataNew(speed: number, orientation: number, iconHeight: number): IconOrientatedData {
    orientation += 90 // Correct the default arrow orientation
    return {
        label: speed + ' kt(s)',
        orientation: orientation,
        icon: <WindDirectionArrow height={iconHeight + 'rem'} />
    }
}