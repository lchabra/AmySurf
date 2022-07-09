import React, { CSSProperties } from "react"
import { useUser } from "../contexts/useUser"
import { MapSize } from "../models/modelsApp"
import { Container, Stack } from "../core-ui/ui"
import ForecastPageTitle from "../components/ForecastPageTitle"
import { MapSpot } from "../components/MapSpot"
import { FtPageTitleHeightEm, minMapSizeEm } from "../contexts/useStyle"
import ForecastDetailAdaptiveView from "../components/ForecastDetailAdaptiveView"

export default function ForecastPage(): React.JSX.Element {
    const user = useUser()
    const styles = getForecastPageStyles(user.userSettings.mapSize)

    return (
        <Stack className={`w-100`}>
            <Container fluid className='p-0 '>
                <ForecastPageTitle />
            </Container>

            {user.userSettings.mapSize !== MapSize.Disable &&
                <Container fluid className='p-0' style={styles.map}>
                    <MapSpot />
                </Container>
            }

            {user.userSettings.mapSize !== MapSize.Fullscreen &&
                <Container fluid className="p-0 h-100" >
                    <ForecastDetailAdaptiveView />
                </Container>
            }
        </Stack>
    )
}

function getForecastPageStyles(mapSize: MapSize): Record<string, CSSProperties> {
    const mapHeight = getMapHeightPercent(mapSize)

    return {
        title: {
            minHeight: FtPageTitleHeightEm + 'rem',
            maxHeight: FtPageTitleHeightEm + 'rem',
        },
        map: {
            height: mapHeight + '%',
            minHeight: minMapSizeEm + 'rem'
        },
    }
}

export function getMapHeightPercent(mapSize: MapSize): number {
    const availableSpace = 100
    const small = availableSpace / 4

    switch (mapSize) {
        case MapSize.Disable:
            return 0
        case MapSize.Small:
            return small
        case MapSize.Medium:
            return small * 3
        case MapSize.Fullscreen:
            return availableSpace
        default:
            return small
    }
}