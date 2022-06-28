import React, { ReactNode } from 'react';
import { containerWidthLimitEm } from '../contexts/useStyle';
import { Container } from '../core-ui/ui';

export function LimitedWidthContainer(props: { children: React.PropsWithChildren<ReactNode>, className?: string }): JSX.Element {

    return (
        <Container
            fluid
            className={`${props.className} p-0 h-100 d-flex align-items-center justify-content-center`}
            style={{ maxWidth: containerWidthLimitEm + 'rem' }}
        >
            {props.children}
        </Container>
    );
}
