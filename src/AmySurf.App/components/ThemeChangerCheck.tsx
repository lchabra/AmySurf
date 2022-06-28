import React from "react"
import { Container, Form } from "../core-ui/ui"
import { CapitalizeString } from "../helpers/forecastHelper"
import { getNextTheme, ThemeColor } from "../styles/theme"
import { useAppStyle } from "../contexts/useStyle"

export default function ThemeChangerCheck(): JSX.Element {
    return (
        <Container>
            {Object.values(ThemeColor).map(themeColor => {
                return (<ThemeCheck key={themeColor + "-theme-check"} themeColor={themeColor} />)
            })}
        </Container>
    )
}

function ThemeCheck(props: { themeColor: ThemeColor }): JSX.Element {
    const appStyle = useAppStyle()

    return (
        <Form.Check
            type='checkbox'
            id={"visibility-check-" + props.themeColor}
            label={CapitalizeString(props.themeColor)}
            checked={appStyle.theme === props.themeColor}
            onChange={(e: any) => {
                if (!e.target.checked) return
                return appStyle.saveAppStyle({ ...appStyle, theme: getNextTheme(appStyle.theme) })
            }}
        />
    )
}
