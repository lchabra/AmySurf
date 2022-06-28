import React from 'react'
import { ForecastType } from '../models/modelsApp'

export default function ForecastTypeLabel(props: { data: ForecastType }): JSX.Element {

    switch (props.data) {
        case ForecastType.Hours:
            return <LabelComp label={'Hours'} unit={'(h)'} />
        case ForecastType.WaveSize:
            return <LabelComp label={'Waves Size'} unit={'(ft)'} />
        case ForecastType.SwellEnergy:
            return <LabelComp label={'Energy'} unit={'(Kj)'} />
        case ForecastType.SwellPeriodDirectionPrimary:
            return <LabelComp label={'Swell 1'} unit={'(s/Deg)'} />
        case ForecastType.SwellPeriodDirectionSecondary:
            return <LabelComp label={'Swell 2'} unit={'(s/Deg)'} />
        case ForecastType.TideChart:
            return <LabelComp label={'Tide'} unit={'(m)'} />
        case ForecastType.WindSpeedDirection:
            return <LabelComp label={'Wind'} unit={'(kts/...)'} />
        case ForecastType.WeatherConditionTemperature:
            return <LabelComp label={'Weather'} unit={'(°C)'} />
        case ForecastType.RainMm:
            return <LabelComp label={'Rain'} unit={'(mm)'} />
        case ForecastType.CloudCoverage:
            return <LabelComp label={'Cloud'} unit={'(%)'} />
        default:
            return <></>
    }
}

function LabelComp(props: { label: string, unit: string }): JSX.Element {
    return (
        <>
            <span className='fs-6'>{props.label}&nbsp;</span>
            <span>{props.unit}</span>
        </>
    )
}