import React from 'react'
import { useForecastsApi } from '../contexts/useForecasts'
import { useUser } from '../contexts/useUser'
import { Button, Form, Stack } from '../core-ui/ui'

export default function DevPage(): JSX.Element {
    const user = useUser()
    const forecastsApi = useForecastsApi()
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    return (
        <>
            <Stack gap={3}>
                <Button onClick={() => { forecastsApi.refreshData() }}>
                    Refresh Forecasts
                </Button>

                <Button onClick={() => { console.log("Forecasts Api Data: ", forecastsApi.data) }}>
                    Console Data
                </Button>

                <Button onClick={() => { localStorage.clear() }}>
                    Clear Local storage
                </Button>

                <Form.Select
                    onChange={(e) => {
                        user.saveAppSettings({ ...user.userSettings, spotName: e.target.value })
                    }}
                    value={user.userSettings.spotName}
                >
                    <option key={'option-select-spot-none'}>{''}</option>
                    {forecastsApi.data?.spots?.map(spot => <option key={'option-select-spot-' + spot.id}>{spot.name}</option>)}
                </Form.Select>

            </Stack>
            {array.map(i =>
                <div key={i}>
                    <Button>
                        {i}
                    </Button>
                </div>
            )}

        </>
    )
}