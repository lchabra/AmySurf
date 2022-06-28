import React from 'react';
import { Stack } from '../core-ui/ui';
import { Spot } from '../models/modelsForecasts';
import { SpotContainer } from './SpotContainer';

export function SpotsListStack(props: { data: Spot[]; keyTitle: string; hideRemoveIcon?: boolean }) {
    return (
        <Stack>
            {props.data.map(spot => <div className='mt-2' key={`${props.keyTitle}-${spot.id}`}>
                <SpotContainer data={spot} hideRemoveIcon={props.hideRemoveIcon} />
            </div>
            )}
        </Stack>
    );
}