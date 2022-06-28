import React, { CSSProperties } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { Stack } from '../core-ui/ui'
import { WaveSizeHourlyData } from './hourlyForecastFactory'


export function OverFlowComp(): JSX.Element {

    let myArray: number[] = []
    for (let i = 0; i < 4; i++) { myArray.push(i) }
    const styles = getStyle(Array.length)

    return (
        <Stack className='h-100'>
            {myArray.map(i => {
                return (
                    <div key={i} style={styles.hourly} className='h-100 border-bottom d-flex justify-content-center align-items-center'>
                        <WaveSizeHourlyData wavesSizeMin={i} wavesSizeMax={i + i} />
                    </div>
                )
            })}
        </Stack>
    )
}

function getStyle(totalElement: number): Record<string, CSSProperties> {
    const totalHeight = totalElement * 6

    return {
        hourly: {
            maxHeight: '6em',
            height: "4em",
            minHeight: "2em",
        }
    }
}