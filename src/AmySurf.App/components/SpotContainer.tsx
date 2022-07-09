import React from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteStarSpot from './FavoriteStarSpot';
import { useForecastSummary } from '../contexts/useForecastSummary';
import { useUser } from '../contexts/useUser';
import { ExploreIcon, RemoveIcon } from '../core-ui/icons';
import { Button, Stack } from '../core-ui/ui';
import { RoutePath } from '../models/modelsApp';
import { Spot } from '../models/modelsForecasts';
import { getBackgroundSecondary, ThemeColor } from '../styles/theme';
import { darkOrangeColor, orangeColor, spotContainerCloseIconHeightRem, useAppStyle } from '../contexts/useStyle';

export function SpotContainer(props: { data: Spot; hideRemoveIcon?: boolean }) {
    const user = useUser()
    const appStyle = useAppStyle()
    const navigate = useNavigate()
    const forecastSummary = useForecastSummary()

    const isSelectedSpot = user.userSettings.spotName === props.data.name;
    return (
        <Stack className={`d-flex justify-content-between p-2 rounded ${getBackgroundSecondary(appStyle.theme)}`} direction='horizontal'>
            <Button
                className=''
                size='sm'
                variant="outline-warning border-0"
                onClick={() => {
                    user.saveAppSettings({ ...user.userSettings, spotName: props.data.name });
                    navigate(RoutePath.Forecasts)
                }}
            >
                <ExploreIcon
                    height={spotContainerCloseIconHeightRem + 'rem'}
                    width={spotContainerCloseIconHeightRem + 'rem'}
                    fill={appStyle.theme === ThemeColor.light ? darkOrangeColor : orangeColor}
                />
            </Button>

            <Stack direction='horizontal' className='d-flex align-self-center h-100'>
                <FavoriteStarSpot data={props.data} />
                <span
                    onClick={() => {
                        user.saveAppSettings({ ...user.userSettings, spotName: props.data.name });
                        navigate(RoutePath.Forecasts)
                    }}
                    className='ps-2 fs-5'
                >
                    {props.data.name}
                </span>
            </Stack>

            <Button
                disabled={isSelectedSpot || props.hideRemoveIcon}
                size='sm'
                variant="outline-warning border-0"
                className=''
                onClick={() => {
                    if (!isSelectedSpot)
                        forecastSummary.setVisitedSpots(forecastSummary.visitedSpots.filter(s => s !== props.data));
                }}
            >
                <RemoveIcon
                    fill={appStyle.theme === ThemeColor.light ? darkOrangeColor : orangeColor}
                    height={spotContainerCloseIconHeightRem + 'rem'}
                    width={spotContainerCloseIconHeightRem + 'rem'}
                    opacity={isSelectedSpot || props.hideRemoveIcon ? 0 : 1}
                />
            </Button>

        </Stack>
    )
}