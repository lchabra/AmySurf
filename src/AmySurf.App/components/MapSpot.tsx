import React, { useEffect, useState } from 'react'
import { useForecastsApi } from '../contexts/useForecasts'
import { useForecastSummary } from '../contexts/useForecastSummary'
import { orangeColor, useAppStyle } from '../contexts/useStyle'
import { useUser } from '../contexts/useUser'
import { Button, ButtonGroup, Container, Dropdown, DropdownButton, PigeonMap, PigeonMapMarker } from '../core-ui/ui'
import { MapSize } from '../models/modelsApp'
import { getGradiantBackgroundClassName, getTextColorClassName } from '../styles/theme'
import { WindSwellCompas } from './WindSwellCompas'

const defaultMapZoomOut = 2
const defaultMapZoomIn = 14

const defaultMapPosition = [0, 0]

export type SpotCoordinate = {
    latitude: number,
    longitude: number
}

export function MapSpot(): JSX.Element {
    const user = useUser()
    const forecastsApi = useForecastsApi()
    const forecastSummary = useForecastSummary()

    const spots = forecastsApi.data?.spots ?? []
    const selectedSpot = spots.find(s => s.name === user.userSettings.spotName)
    const mapPosition: [number, number] = [selectedSpot?.gpsCoordinate.latitude ?? defaultMapPosition[0], selectedSpot?.gpsCoordinate.longitude ?? defaultMapPosition[1]]

    const [center, setCenter] = useState(mapPosition)
    const [zoom, setZoom] = useState(selectedSpot === undefined ? defaultMapZoomOut : defaultMapZoomIn)

    useEffect(() => {
        setCenter(mapPosition)
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
                                onClick={() => { user.saveAppSettings({ ...user.userSettings, spotName: spot.name }) }}
                                key={'map-marker-' + spot.name}
                                color={selectedSpot?.name === spot.name ? 'green' : isFavorite ? orangeColor : 'black'}
                                width={40}
                                anchor={[spot.gpsCoordinate.latitude, spot.gpsCoordinate.longitude]}
                            />
                        )
                    })}

            </PigeonMap>

            <MapButtonGroup onGoToGmapClicked={() => goToGmapClicked(mapPosition[0], mapPosition[1])} />
            <MapSizeDropdown onCenterMapClicked={() => setCenter(mapPosition)} />

            {
                forecastSummary.selectedForecast &&
                user.userSettings.mapSize !== MapSize.Fullscreen &&
                <div style={{ opacity: '80%' }} className='pe-none position-absolute top-50 start-50 translate-middle'>
                    <WindSwellCompas data={forecastSummary.selectedForecast} />
                </div>
            }

        </Container >

    )
}

function MapButtonGroup(props: { onGoToGmapClicked: () => void }): JSX.Element {
    const appStyle = useAppStyle()

    return (
        <Button
            variant={`theme-${appStyle.theme}-secondary`}
            className='position-absolute top-0 start-0'
            size='sm'
            onClick={props.onGoToGmapClicked}
        >
            G.Map
        </Button>
    )
}

function MapSizeDropdown(props: { onCenterMapClicked: () => void }): JSX.Element {
    const user = useUser()
    const appStyle = useAppStyle()
    const bgColor = getGradiantBackgroundClassName(appStyle.theme)

    return (
        <ButtonGroup vertical className='position-absolute top-0 end-0'>
            <Button
                variant={`theme-${appStyle.theme}-secondary`}
                className=''
                size='sm'
                onClick={props.onCenterMapClicked}
            >
                Re-Center
            </Button>

            <DropdownButton
                variant={`theme-${appStyle.theme}-secondary`}
                size='sm' as={ButtonGroup}
                title="Size"
                className='border-top '
                onSelect={(eventKey: any) => user.saveAppSettings({ ...user.userSettings, mapSize: eventKey as MapSize })}
            >

                <div className={`${bgColor}`}>
                    <MapSizeDropdownItem mapSize={MapSize.Disable} />
                    <MapSizeDropdownItem mapSize={MapSize.Small} />
                    <MapSizeDropdownItem mapSize={MapSize.Medium} />
                    <MapSizeDropdownItem mapSize={MapSize.Fullscreen} />
                </div>

            </DropdownButton>
        </ButtonGroup>

    )
}

function MapSizeDropdownItem(props: { mapSize: MapSize }) {
    const user = useUser()
    const appStyle = useAppStyle()
    const isActive = user.userSettings.mapSize === props.mapSize
    const textColor = isActive ? 'text-dark' : getTextColorClassName(appStyle.theme)

    return (
        <Dropdown.Item
            active={isActive}
            eventKey={props.mapSize}
        >
            <span className={`${textColor}`}>
                {props.mapSize}
            </span>
        </Dropdown.Item>
    )
}

function goToGmapClicked(lat: number, long: number) { window.open("https://maps.google.com?q=" + lat + "," + long) }