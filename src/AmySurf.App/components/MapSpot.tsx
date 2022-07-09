import React, { useEffect, useState } from 'react'
import { useForecastsApi } from '../contexts/useForecasts'
import { useForecastSummary } from '../contexts/useForecastSummary'
import { useAppStyle } from '../contexts/useStyle'
import { useUser } from '../contexts/useUser'
import { Button, ButtonGroup, Container, Dropdown, DropdownButton, PigeonMap, PigeonMapMarker } from '../core-ui/ui'
import { MapSize } from '../models/modelsApp'
import { SwellArrows } from './Compass'

const defaultMapZoomOut = 2
const defaultMapZoomIn = 14

const defaultMapPosition = [0, 0]

export type SpotCoordinate = {
    latitude: number,
    longitude: number
}

export function MapSpot(): React.JSX.Element {
    const user = useUser()
    const appStyle = useAppStyle()
    const forecastsApi = useForecastsApi()
    const forecastSummary = useForecastSummary()

    const spots = forecastsApi.data?.spots ?? []
    const selectedSpot = spots.find(s => s.name === user.userSettings.spotName)
    const spotGpsCoordinate: [number, number] = [selectedSpot?.gpsCoordinate.latitude ?? defaultMapPosition[0], selectedSpot?.gpsCoordinate.longitude ?? defaultMapPosition[1]]

    const [center, setCenter] = useState(spotGpsCoordinate)
    const [zoom, setZoom] = useState(selectedSpot === undefined ? defaultMapZoomOut : defaultMapZoomIn)
    const [swellVisible, setSwellVisible] = useState(true)

    useEffect(() => {
        setCenter(spotGpsCoordinate)
        setZoom(selectedSpot !== undefined ? defaultMapZoomIn : defaultMapZoomOut)
    }, [selectedSpot])

    return (

        <Container fluid className='p-0 position-relative h-100 w-100'>
            <PigeonMap
                center={center}
                zoom={zoom}
                onBoundsChanged={({ center, zoom }) => {
                    setCenter(center)
                    setZoom(zoom)
                }}
            >
                {
                    spots.length > 0 &&
                    // zoom > 5 &&
                    spots.map(spot => {
                        const isFavorite = user.userSettings.favoriteSpots.filter(s => s.id === spot.id).length > 0

                        return (
                            <PigeonMapMarker
                                onClick={() => {
                                    spot.name === user.userSettings.spotName ?
                                        setCenter(spotGpsCoordinate) :
                                        user.saveAppSettings({ ...user.userSettings, spotName: spot.name })
                                }}
                                key={'map-marker-' + spot.name}
                                color={selectedSpot?.name === spot.name ? 'green' : isFavorite ? appStyle.colorValues.themeTone : 'black'}
                                width={40}
                                anchor={[spot.gpsCoordinate.latitude, spot.gpsCoordinate.longitude]}
                            />
                        )
                    })}

            </PigeonMap>

            <MapButtonGroup onGoToGmapClicked={() => goToGmapClicked(spotGpsCoordinate[0], spotGpsCoordinate[1])} />
            <MapActionsButtons
                swellVisible={swellVisible}
                onCenterMapClicked={() => {
                    setZoom(defaultMapZoomIn)
                    setCenter(spotGpsCoordinate)
                }}
                onSwellVisibilityClicked={() => { setSwellVisible(!swellVisible) }}
            />

            {
                swellVisible &&
                forecastSummary.selectedForecast &&
                <div style={{ opacity: '80%' }} className='pe-none position-absolute top-50 start-50 translate-middle'>
                    <SwellArrows data={forecastSummary.selectedForecast} />
                </div>
            }

        </Container >
    )
}

function MapButtonGroup(props: { onGoToGmapClicked: () => void }): React.JSX.Element {
    const appStyle = useAppStyle()

    return (
        <Button
            variant={`${appStyle.classNames.fadedColor}`}
            className={`border-${appStyle.classNames.toneColor} position-absolute top-0 start-0`}
            size='sm'
            onClick={props.onGoToGmapClicked}
        >
            G.Map
        </Button>
    )
}

function MapActionsButtons(props: { swellVisible: boolean, onCenterMapClicked: () => void, onSwellVisibilityClicked: () => void }): React.JSX.Element {
    const user = useUser()
    const appStyle = useAppStyle()

    return (
        <ButtonGroup vertical className={`border-${appStyle.classNames.toneColor} position-absolute top-0 end-0`}>
            <Button
                className={`border border-${appStyle.classNames.toneColor}`}
                variant={`${appStyle.classNames.fadedColor}`}
                size='sm'
                onClick={props.onCenterMapClicked}
            >
                Re-Center
            </Button>

            <DropdownButton
                className={`border border-${appStyle.classNames.toneColor}`}
                variant={`${appStyle.classNames.fadedColor}`}
                size='sm'
                as={ButtonGroup}
                title="Size"
                onSelect={(eventKey: any) => user.saveAppSettings({ ...user.userSettings, mapSize: eventKey as MapSize })}
            >
                <div className={`border border-${appStyle.classNames.toneColor} bg-${appStyle.classNames.mainColor} bg-gradient`}>
                    <MapSizeDropdownItem mapSize={MapSize.Disable} />
                    <MapSizeDropdownItem mapSize={MapSize.Small} />
                    <MapSizeDropdownItem mapSize={MapSize.Medium} />
                    <MapSizeDropdownItem mapSize={MapSize.Fullscreen} />
                </div>
            </DropdownButton>

            <Button
                className={`border border-${appStyle.classNames.toneColor}`}
                variant={`${appStyle.classNames.fadedColor}`}
                size='sm'
                onClick={() => props.onSwellVisibilityClicked()}
            >
                {props.swellVisible ? 'Hide Swell' : 'Show Swell'}
            </Button>

        </ButtonGroup>
    )
}


function MapSizeDropdownItem(props: { mapSize: MapSize }) {
    const user = useUser()
    const appStyle = useAppStyle()

    const [textHoverState, setTextHoverState] = useState(false)

    const isActive = user.userSettings.mapSize === props.mapSize

    const classNameText = isActive
        ? `text-${appStyle.classNames.toneContrastColor}`
        : textHoverState
            ? `text-${appStyle.classNames.toneContrastColor}`
            : `text-${appStyle.classNames.mainContrastColor}`

    const styleBackgroundColor = (isActive || textHoverState) ? appStyle.colorValues.themeTone : ''

    return (
        <Dropdown.Item
            onPointerEnter={() => setTextHoverState(true)}
            onPointerLeave={() => setTextHoverState(false)}
            style={{ backgroundColor: styleBackgroundColor }}
            active={isActive}
            eventKey={props.mapSize}
        >
            <span className={classNameText}>
                {props.mapSize}
            </span>
        </Dropdown.Item>
    )
}

function goToGmapClicked(lat: number, long: number) { window.open("https://maps.google.com?q=" + lat + "," + long) }