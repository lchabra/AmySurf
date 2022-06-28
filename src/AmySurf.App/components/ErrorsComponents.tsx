import React from 'react'
import { useForecastsApi } from '../contexts/useForecasts'
import { useAppStyle } from '../contexts/useStyle'
import { useUser } from '../contexts/useUser'
import { Container, Modal, Stack } from '../core-ui/ui'
import { getBorderFaded, getGradiantBackgroundClassName, getTextColorClassName } from '../styles/theme'

// TODO: Make Errors better
export default function ErrorsPage(props: { title: string, subTitle: string, className?: string }): JSX.Element {
    const forecastsApi = useForecastsApi()
    const errors = forecastsApi.data?.errors ?? []

    return (
        <Container fluid className='p-0'>
            <Stack className={`${props.className} text-center`}>
                <h2 className='mt-2'>
                    {props.title}
                </h2>
                <h4 className='mt-2'>
                    {props.subTitle}
                </h4>
                <div className='mt-3'>
                    {errors.map((e, i) => <div key={'error-details-' + i}>{e}</div>)}
                </div>
            </Stack>
        </Container>
    )

    return (
        <Stack className={`${props.className} bg-dark text-center`}>
            <h2 className='mt-2'>
                {props.title}
            </h2>
            <h4 className='mt-2'>
                {props.subTitle}
            </h4>
            <div className='mt-3'>
                {errors.map((e, i) => <div key={'error-details-' + i}>{e}</div>)}
            </div>
        </Stack>
    )
}

export function ErrorsModal(props: { title: JSX.Element, handleCloseModal: () => void }): JSX.Element {
    const appStyle = useAppStyle()

    const forecastsApi = useForecastsApi()
    const backgroundColor = getGradiantBackgroundClassName(appStyle.theme)
    const textColor = getTextColorClassName(appStyle.theme)
    const colorClassName = `${backgroundColor} ${textColor}`
    const errors = forecastsApi.data?.errors ?? []

    return (
        <Modal
            centered
            show={true}
            onHide={props.handleCloseModal}
            animation={false}
        >
            <div className={`${colorClassName}`} >
                <Modal.Header className={`${getBorderFaded(appStyle.theme)}`}>
                    <Modal.Title className='w-100 text-center'>
                        {props.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body >
                    {errors.map((e, i) => <div key={'error-modal-text' + i}>{e}</div>)}
                </Modal.Body>

                <Modal.Footer onClick={props.handleCloseModal} className={`${getBorderFaded(appStyle.theme)} d-flex justify-content-center`}>
                    <h4 >
                        Close
                    </h4>
                    {/* 
                    <Button
                        size='lg'
                        variant='secondary'
                        onClick={props.handleCloseModal} >
                        Close
                    </Button> */}
                </Modal.Footer>
            </div>
        </Modal>
    )
}