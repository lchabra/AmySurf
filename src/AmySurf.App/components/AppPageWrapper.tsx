import React, { CSSProperties, ReactNode } from 'react'
import { navBarHeightEm, useAppStyle } from '../contexts/useStyle'
import { Container } from '../core-ui/ui'
import { getGradiantBackgroundClassName, getTextColorClassName } from '../styles/theme'

export function PageData(props: { className?: string, children: React.PropsWithChildren<ReactNode> }): JSX.Element {
    const appStyle = useAppStyle()

    const style = getPageDataStyles()
    const textColor = getTextColorClassName(appStyle.theme)
    const dataBgColor = getGradiantBackgroundClassName(appStyle.theme)

    return (
        <Container
            fluid
            className={`${props.className} ${textColor} ${dataBgColor}`}
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