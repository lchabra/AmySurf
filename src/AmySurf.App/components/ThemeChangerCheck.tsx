import React from "react"
import { getNextTheme } from "../contexts/useStyle"
import { useUser } from "../contexts/useUser"
import { Container, Form } from "../core-ui/ui"
import { CapitalizeString } from "../helpers/forecastHelper"
import { ThemeColor } from "../models/modelsApp"

export default function ThemeChangerCheck(): React.JSX.Element {
    return (
        <Container>
            {Object.values(ThemeColor).map(themeColor => {
                return (<ThemeCheck key={themeColor + "-theme-check"} themeColor={themeColor} />)
            })}
        </Container>
    )
}

function ThemeCheck(props: { themeColor: ThemeColor }): React.JSX.Element {
    const user = useUser()

    return (
        <Form.Check
            type='checkbox'
            id={"visibility-check-" + props.themeColor}
            label={CapitalizeString(props.themeColor)}
            checked={user.userSettings.themeColor === props.themeColor}
            onChange={(e: any) => {
                if (!e.target.checked) return
                return user.saveAppSettings({ ...user.userSettings, themeColor: getNextTheme(user.userSettings.themeColor) })
            }}
        />
    )
}
