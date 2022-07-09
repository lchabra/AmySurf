import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import FavoriteStarSpot from './FavoriteStarSpot';
import { useForecastSummary } from '../contexts/useForecastSummary';
import { useUser } from '../contexts/useUser';
import { ExploreIcon, RemoveIcon } from '../core-ui/icons';
import { Button, Stack } from '../core-ui/ui';
import { RoutePath } from '../models/modelsApp';
import { Spot } from '../models/modelsForecasts';
import { spotContainerCloseIconHeightRem, useAppStyle } from '../contexts/useStyle';

export function SpotContainer(props: { data: Spot; hideRemoveIcon?: boolean }) {
    const user = useUser()
    const appStyle = useAppStyle()
    const navigate = useNavigate()
    const forecastSummary = useForecastSummary()

    const [textColorState, setTextColorState] = useState(`text-${appStyle.classNames.mainContrastColor}`)

    const isSelectedSpot = user.userSettings.spotName === props.data.name;
    return (
        <Stack className={`d-flex justify-content-between p-2 rounded bg-gradient bg-${appStyle.classNames.fadedColor}`} direction='horizontal'>
            <Button
                size='sm'
                variant={`outline-${appStyle.classNames.mainColor} border-0`}
                onClick={() => {
                    user.saveAppSettings({ ...user.userSettings, spotName: props.data.name });
                    navigate(RoutePath.Forecasts)
                }}
            >
                <ExploreIcon
                    height={spotContainerCloseIconHeightRem + 'rem'}
                    width={spotContainerCloseIconHeightRem + 'rem'}
                    fill={appStyle.colorValues.themeTone}
                />
            </Button>

            <Stack direction='horizontal' className='d-flex align-self-center h-100'>
                <FavoriteStarSpot data={props.data} />
                <span
                    onPointerEnter={() => setTextColorState(`text-${appStyle.classNames.toneColor}`)}
                    onPointerLeave={() => setTextColorState(`text-${appStyle.classNames.mainContrastColor}`)}
                    onClick={() => {
                        user.saveAppSettings({ ...user.userSettings, spotName: props.data.name });
                        navigate(RoutePath.Forecasts)
                    }}
                    className={`ps-2 fs-5 ${textColorState}`}
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
                    fill={appStyle.colorValues.themeTone}
                    height={spotContainerCloseIconHeightRem + 'rem'}
                    width={spotContainerCloseIconHeightRem + 'rem'}
                    opacity={isSelectedSpot || props.hideRemoveIcon ? 0 : 1}
                />
            </Button>

        </Stack >
    )
}