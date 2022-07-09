import React from 'react'
import { useUser } from '../contexts/useUser'
import { Container, Form, Stack } from '../core-ui/ui'
import useLocalStorage from '../hooks/useLocalStorage'

export default function FontSizeSetting(): React.JSX.Element {
    const user = useUser()
    const [isFontCustom, setIsFontCustom] = useLocalStorage<boolean>('isFontCustom', false)

    return (
        <Container>
            <Form.Check
                label={"Default"}
                checked={!isFontCustom}
                onChange={(e: any) => {
                    if (!e.target.checked) return
                    setIsFontCustom(false)
                    user.saveAppSettings({ ...user.userSettings, fontSizePercent: 100 })
                }}
            />

            <Stack direction="horizontal">
                <Form.Check
                    className='pe-2'
                    checked={isFontCustom}
                    onChange={(e: any) => {
                        if (!e.target.checked) return
                        setIsFontCustom(true)
                    }}
                />
                <span className="text-nowrap me-2">
                    {`Custom ${user.userSettings.fontSizePercent ?? user.userSettings.fontSizePercent}%`}
                </span>

                <Form.Range
                    onChange={(e) => {
                        if (!isFontCustom) setIsFontCustom(true)
                        user.saveAppSettings({ ...user.userSettings, fontSizePercent: e.target.valueAsNumber })
                        return
                    }}
                    value={user.userSettings.fontSizePercent}
                    step={5}
                    min={50}
                    max={150}
                />
            </Stack>

        </Container>
    )
}