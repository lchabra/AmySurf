import React, { useState } from "react"
import { useAppStyle } from "../contexts/useStyle"
import { useUser } from "../contexts/useUser"
import { Button, Container, Form, Modal, Stack } from "../core-ui/ui"
import { DefaultUserSettings } from "../models/modelsApp"

export default function AdvancedSettings(): React.JSX.Element {
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

function ServerAddressForm(): React.JSX.Element {
    const user = useUser()
    return (
        <>
            <Form.Label>Server address (blank for default)</Form.Label>
            <Form.Control
                placeholder={DefaultUserSettings.serverUrl}
                value={user.userSettings.serverUrl}
                onChange={(e: any) => {
                    if (e.target.value === '') return user.saveAppSettings({ ...user.userSettings, serverUrl: DefaultUserSettings.serverUrl })
                    else user.saveAppSettings({ ...user.userSettings, serverUrl: e.target.value })
                }}
            />
        </>
    )
}

function ResetSettingsModal(props: { title: string, showModal: boolean, handleCloseModal: () => void }): React.JSX.Element {
    const appStyle = useAppStyle()
    const user = useUser()

    return (
        <Modal
            centered
            show={props.showModal}
            onHide={props.handleCloseModal}
        >
            <div className={`text-bg-${appStyle.classNames.mainColor} bg-gradient`} >
                <Modal.Header className={`border-${appStyle.classNames.fadedColor}`}>
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
                            props.handleCloseModal()
                        }}
                        variant="warning"
                        size="lg"
                    >
                        Restore
                    </Button>
                </Modal.Body>
            </div>
        </Modal >
    )
}