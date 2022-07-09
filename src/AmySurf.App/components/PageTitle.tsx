import React from 'react'
import { pageTitleCN } from '../contexts/useStyle'

export default function PageTitle(props: { title: string }): React.JSX.Element {
    return (
        <span className={`${pageTitleCN} mt-2 fs-4 d-flex justify-content-center`} > {props.title}</span >
    )
}