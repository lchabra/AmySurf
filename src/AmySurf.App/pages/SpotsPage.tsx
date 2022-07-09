import React from 'react'
import ErrorsPage from '../components/ErrorsComponents'
import { useForecastsApi } from '../contexts/useForecasts'
import { useUser } from '../contexts/useUser'
import { Container, Stack } from '../core-ui/ui'
import { SpotSelectContainer } from '../components/SpotSelectContainer'
import { useForecastSummary } from '../contexts/useForecastSummary'
import ExpandableStack from '../components/ExpandableStack'
import { SpotsListStack } from '../components/SpotsListStack'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { LimitedWidthContainer } from '../components/LimitedWidthContainer'
import PageTitle from '../components/PageTitle'

export default function SpotsPage(): React.JSX.Element {

    return (
        <Stack>
            <PageTitle title={'Explore'} />
            <LimitedWidthContainer>
                <Container fluid className='h-100'>
                    <SpotPageDetail />
                </Container>
            </LimitedWidthContainer>
        </Stack>
    )
}

export function SpotPageDetail() {
    const forecastsApi = useForecastsApi()
    const isSpotAvailables = forecastsApi.data?.spots !== undefined && forecastsApi.data.spots.length > 0
    const isSpotLoading = forecastsApi.isSpotsLoading

    if (isSpotAvailables) {
        return (
            <SpotPageReady />
        )
    }

    if (isSpotLoading) {
        return (
            <Container fluid className="p-0 h-100 d-flex align-items-center">
                <LoadingSpinner text={'Loading spots...'} />
            </Container>
        )
    }

    else return (
        <Container fluid className="p-0 h-100 d-flex align-items-center">
            <ErrorsPage title={'Oops !'} subTitle={'Something went wrong.'} />
        </Container>
    )
}

export function SpotPageReady() {
    const user = useUser()
    const forecastSummary = useForecastSummary()

    return (
        <Stack >
            <SpotSelectContainer />

            {
                forecastSummary.visitedSpots.length > 0 &&
                <div className='mt-3'>
                    <ExpandableStack title={'Viewed spots'} uniqueLocalStorageKey='Viewed-Spots'>
                        <SpotsListStack keyTitle='Viewed-Spots' data={forecastSummary.visitedSpots} />
                    </ExpandableStack>
                </div>
            }
            {
                user.userSettings.favoriteSpots.length > 0 &&
                <div className='mt-3'>
                    <ExpandableStack title={'Favorite spots'} uniqueLocalStorageKey='Favorite-spots'>
                        <SpotsListStack keyTitle='Favorite-Spots' data={user.userSettings.favoriteSpots} hideRemoveIcon={true} />
                    </ExpandableStack>
                </div>
            }
        </Stack>
    )
}