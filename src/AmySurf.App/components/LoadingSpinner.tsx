import React from 'react';
import { Spinner, Stack } from '../core-ui/ui';


export function LoadingSpinner(props: { text: string; }): React.JSX.Element {
    return (
        <Stack className='d-flex align-items-center justify-content-center'>
            <Spinner animation="border" />
            <small>{props.text}</small>
        </Stack>
    );
}