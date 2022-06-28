import React from 'react'

export default function PageTitle(props: { title: string }): JSX.Element {
    return (
        <h2 className="mt-2 d-flex justify-content-center">{props.title}</h2>
    )
}