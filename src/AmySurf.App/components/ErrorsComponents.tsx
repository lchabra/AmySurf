import React from 'react'
import { useForecastsApi } from '../contexts/useForecasts'
import { useAppStyle } from '../contexts/useStyle'
import { Container, Modal, Stack } from '../core-ui/ui'
import { getBorderFaded, getGradiantBackgroundClassName, getTextColorClassName } from '../styles/theme'

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
                    {process.env.AMYSURF_SHOW_ERRORS_DETAILS && errors.map((e, i) => <div key={'error-details-' + i}>{e}</div>)}
                    {!process.env.AMYSURF_SHOW_ERRORS_DETAILS && <>...</>}
                </div>
            </Stack>
        </Container>
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
                    {process.env.AMYSURF_SHOW_ERRORS_DETAILS && errors.map((e, i) => <div key={'error-modal-text' + i}>{e}</div>)}
                    {!process.env.AMYSURF_SHOW_ERRORS_DETAILS && <>...</>}
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