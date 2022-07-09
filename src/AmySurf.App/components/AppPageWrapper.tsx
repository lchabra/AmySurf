import React, { CSSProperties, ReactNode } from 'react'
import { navBarHeightEm, useAppStyle } from '../contexts/useStyle'
import { Container } from '../core-ui/ui'

export function PageData(props: { className?: string, children: React.PropsWithChildren<ReactNode> }): React.JSX.Element {
    const appStyle = useAppStyle()
    const style = getPageDataStyles()

    return (
        <Container
            fluid
            className={`${props.className} text-bg-${appStyle.classNames.mainColor} bg-gradient`}
            style={style}
        >
            <>
                {props.children}
            </>
        </Container>
    )
}

function getPageDataStyles(): CSSProperties {
    return {
        overflow: 'auto',
        padding: 0,
        paddingBottom: navBarHeightEm + 'rem',
        display: 'flex',
        minHeight: '100vh',
    }
}