import React from 'react'
import { Container, Form } from '../core-ui/ui'
import { useUser } from '../contexts/useUser'
import { ForecastType } from '../models/modelsApp'

export default function ForecastVisibilityCheck() {
    return (
        <Container>
            {Object.values(ForecastType).map(forecastType => {
                if (forecastType === ForecastType.Hours) return null
                return (<VisibilityCheck key={forecastType + "-visibility-toggle"} forecastType={forecastType} />)
            })}
        </Container>
    )
}

function VisibilityCheck(props: { forecastType: ForecastType }): JSX.Element {
    const user = useUser()

    return (
        <Form.Check
            type='checkbox'
            id={"visibility-check-" + props.forecastType}
            label={getForecastTypeLabel(props.forecastType)}
            checked={user.userSettings.visiblesForecastsTypes.includes(props.forecastType)}
            onChange={(e) =>
                user.saveAppSettings(
                    {
                        ...user.userSettings,
                        visiblesForecastsTypes:
                            getUpdatedForecastTypeVisibility(user.userSettings.visiblesForecastsTypes, props.forecastType, (e.target as HTMLInputElement).checked)
                    })
            }
        />
    )
}

function getForecastTypeLabel(forecastType: ForecastType): string {
    switch (forecastType) {
        case ForecastType.Hours:
            return "Hours"
        case ForecastType.WaveSize:
            return "Waves size"
        case ForecastType.SwellEnergy:
            return "Waves Energy"
        case ForecastType.SwellPeriodDirectionPrimary:
            return "Primary Swell Details"
        case ForecastType.SwellPeriodDirectionSecondary:
            return "Secondary Swell Details"
        case ForecastType.TideChart:
            return "Tide"
        case ForecastType.WindSpeedDirection:
            return "Wind"
        case ForecastType.WeatherConditionTemperature:
            return "Weather Temperature"
        case ForecastType.RainMm:
            return "Rain"
        case ForecastType.CloudCoverage:
            return "Cloud Coverage"
        default:
            return "Unknown"
    }
}

function getUpdatedForecastTypeVisibility(actualForecastTypes: ForecastType[], forecastType: ForecastType, forecastTypeRequested: boolean): ForecastType[] {
    let newForecastsTypes = [...actualForecastTypes]

    if (forecastTypeRequested) {
        if (actualForecastTypes.includes(forecastType))
            return [...actualForecastTypes]
        else {
            return newForecastsTypes.concat(forecastType).sort((a: any, b: any) => a - b)
        }

    } else {
        if (actualForecastTypes.includes(forecastType))
            return newForecastsTypes.filter(ft => ft !== forecastType).sort((a: any, b: any) => a - b)
        else
            return newForecastsTypes
    }
}