import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForecastsApi } from '../contexts/useForecasts'
import { useUser } from '../contexts/useUser'
import { Container, Stack } from '../core-ui/ui'
import { RoutePath } from '../models/modelsApp'
import ErrorsPage from './ErrorsComponents'
import { ForecastsDetails } from './ForecastsDetails'
import { LimitedWidthContainer } from './LimitedWidthContainer'
import { LoadingSpinner } from './LoadingSpinner'
import { SpotSelectContainer } from './SpotSelectContainer'

export default function ForecastDetailAdaptiveView(): JSX.Element {
    const user = useUser()
    const forecastsApi = useForecastsApi()

    const spotsAvailables = forecastsApi.data?.spots !== undefined
    const hasErrors = forecastsApi.data?.errors !== undefined && forecastsApi.data.errors.length > 0
    const hasForecastData = forecastsApi.data?.spotForecasts !== undefined && forecastsApi.data?.spotForecasts?.data?.length > 0

    const hasForecasts = hasForecastData
    const mustSelectSpot = spotsAvailables && user.userSettings.spotName === ''
    const isSpotsLoading = !hasErrors && !hasForecasts || forecastsApi.isSpotsLoading

    // Forecast Details
    if (hasForecasts) {
        if (user.userSettings.visiblesForecastsTypes.length > 1)
            return <ForecastsDetails />
        else
            return <VisibilityOptionsIncorrect className='h-100 d-flex justify-content-center' />
    }

    // Spot Select
    if (mustSelectSpot) {
        return (
            <LimitedWidthContainer className='pt-3'>
                <Container>
                    <SpotSelectContainer />
                </Container>
            </LimitedWidthContainer  >
        )
    }

    // Loading Spinner
    if (isSpotsLoading) {
        return (
            <LimitedWidthContainer className='pt-3'>
                <LoadingSpinner text='Loading' />
            </LimitedWidthContainer>
        )
    }

    // Error Page
    return (
        <LimitedWidthContainer >
            < ErrorsPage title={'Oops !'} subTitle={'Something went wrong.'} className='h-100 d-flex justify-content-center' />
        </LimitedWidthContainer>
    )
}

function VisibilityOptionsIncorrect(props: { className?: string }): JSX.Element {
    const navigate = useNavigate();

    return (
        <Stack className={`${props.className} text-center`}>
            <h2 className='mt-2'>
                Oops !
            </h2>
            <h4 className='mt-2'>
                Settings incorrect
            </h4>
            <Stack direction='horizontal' className='d-flex justify-content-center'>
                <small>Select at least one option in :&nbsp;</small>
                <small className='text-decoration-underline' onClick={() => navigate(RoutePath.Settings)}> "Settings/Visibility"</small>
            </Stack>
        </Stack>
    )
}