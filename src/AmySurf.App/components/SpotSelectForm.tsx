import React from 'react';
import { useForecastsApi } from '../contexts/useForecasts';
import { useUser } from '../contexts/useUser';
import { Form } from '../core-ui/ui';
import { getTextColorClassName } from '../styles/theme';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../models/modelsApp';
import { useAppStyle } from '../contexts/useStyle';


export function SpotSelectForm() {
    const user = useUser()
    const appStyle = useAppStyle()
    const forecastsApi = useForecastsApi();
    const noSpotSelected = user.userSettings.spotName === '';
    const spotsAvailables = forecastsApi.data?.spots !== undefined;
    const navigate = useNavigate();

    return (
        <>
            <Form.Select
                style={{ opacity: spotsAvailables ? '' : '50%' }}
                placeholder="Select a spot"
                disabled={forecastsApi.data?.spots === undefined || forecastsApi.data.spots.length === 0}
                onChange={(e) => {
                    user.saveAppSettings({ ...user.userSettings, spotName: e.target.value });
                    if (e.target.value !== '') navigate(RoutePath.Forecasts);
                }}
                value={user.userSettings.spotName}
            >
                <option key={'option-select-spot-none'}>{''}</option>
                {forecastsApi.data?.spots?.map(spot => <option key={'option-select-spot-' + spot.name}>{spot.name}</option>)}
            </Form.Select>

            {noSpotSelected &&
                <Form.Text>
                    {spotsAvailables &&
                        <span className={`${getTextColorClassName(appStyle.theme)}`}>
                            Please select a spot.
                        </span>}
                </Form.Text>}

            {!spotsAvailables &&
                <span className={`${getTextColorClassName(appStyle.theme)}`}>
                    Spots not available.
                </span>}
        </>
    );
}