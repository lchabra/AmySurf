import React from 'react'
import Stack from 'react-bootstrap/esm/Stack'
import { windSwellIconHeight } from '../contexts/useStyle'
import { SwellDirectionArrow, WindDirectionArrow } from '../core-ui/icons'
import { HourlyForecast } from '../models/modelsApp'
import { IconOrientated, IconOrientatedData } from './ArrowOrientated'

export function WindSwellCompas(props: { data: HourlyForecast }): JSX.Element {
    return (
        <Stack direction='horizontal'>
            {
                !isNaN(props.data.primarySwellPeriod) &&
                !isNaN(props.data.primarySwellDirection) &&
                <IconOrientated
                    data={getSwellDataNew(
                        "S1",
                        props.data.primarySwellPeriod,
                        props.data.primarySwellDirection,
                        windSwellIconHeight)
                    }
                />
            }
            {
                !isNaN(props.data.secondarySwellPeriod) &&
                !isNaN(props.data.secondarySwellDirection) &&
                <IconOrientated
                    data={getSwellDataNew(
                        "S2",
                        props.data.secondarySwellPeriod,
                        props.data.secondarySwellDirection,
                        windSwellIconHeight)
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
                        windSwellIconHeight)
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