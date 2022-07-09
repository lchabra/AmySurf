import React, { useState } from "react"
import { Button, Container, Form, Modal, Stack } from "../core-ui/ui"
import { useUser } from "../contexts/useUser"
import { DefaultAppStyle, DefaultUserSettings } from "../models/modelsApp"
import { getGradiantBackgroundClassName, getTextColorClassName, getBorderFaded } from "../styles/theme"
import { useAppStyle } from "../contexts/useStyle"

export default function AdvancedSettings(): JSX.Element {
    const [showResetModal, setShowResetModal] = useState(false)

    const handleCloseErrors = () => setShowResetModal(false);
    const handleShowErrors = () => setShowResetModal(true);

    return (
        <Container>
            <Stack direction='vertical'>
                {
                    process.env.AMYSURF_SHOW_SERVER_SETTING &&
                    <ServerAddressForm />
                }

                <Form.Label className="mt-2">Restore all default settings</Form.Label>
                <Button variant="warning" onClick={handleShowErrors}>Restore default</Button>
                <ResetSettingsModal title={'Are you sure ?'} showModal={showResetModal} handleCloseModal={handleCloseErrors} />

            </Stack>
        </Container>
    )
}

function ServerAddressForm(): JSX.Element {
    const user = useUser()
    return (
        <>
            <Form.Label>Server address (blank for default)</Form.Label>
            <Form.Control
                placeholder={DefaultUserSettings.serverUrl}
                value={user.userSettings.serverUrl}
                onChange={(e) => {
                    if (e.target.value === '') return user.saveAppSettings({ ...user.userSettings, serverUrl: DefaultUserSettings.serverUrl })
                    else user.saveAppSettings({ ...user.userSettings, serverUrl: e.target.value })
                }}
            />
        </>
    )
}

function ResetSettingsModal(props: { title: string, showModal: boolean, handleCloseModal: () => void }): JSX.Element {
    const user = useUser()
    const appStyle = useAppStyle()

    const backgroundColor = getGradiantBackgroundClassName(appStyle.theme)
    const textColor = getTextColorClassName(appStyle.theme)
    const colorClassName = `${backgroundColor} ${textColor}`

    return (
        <Modal
            centered
            show={props.showModal}
            onHide={props.handleCloseModal}
            animation={false}
        >
            <div className={`${colorClassName}`} >
                <Modal.Header className={`${getBorderFaded(appStyle.theme)}`}>
                    <Modal.Title className='w-100 text-center'>
                        {props.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="d-flex justify-content-evenly">
                    <Button
                        onClick={props.handleCloseModal}
                        variant="secondary"
                        size="lg"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => {
                            user.saveAppSettings({
                                ...DefaultUserSettings,
                                favoriteSpots: user.userSettings.favoriteSpots,
                                spotName: user.userSettings.spotName
                            })
                            appStyle.saveAppStyle({
                                ...DefaultAppStyle,
                            })
                            props.handleCloseModal()
                        }}
                        variant="warning"
                        size="lg"/*  */
                    >
                        Restore
                    </Button>
                </Modal.Body>
            </div>
        </Modal >
    )
}