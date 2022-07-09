import React from "react";
import { useUser } from "../contexts/useUser";
import { Container, Form, Stack } from "../core-ui/ui";

export function ForecastDurationCheck(): React.JSX.Element {
    return (
        <Container>
            <Stack gap={2} direction="horizontal">
                <span>Forecasts duration</span>
                <DurationCheck duration={1} />
                <DurationCheck duration={2} />
                <DurationCheck duration={3} />
            </Stack>
        </Container>
    );
}

function DurationCheck(props: { duration: number }): React.JSX.Element {
    const user = useUser();

    return (
        <Form.Check
            type='checkbox'
            id={`DurationDays ${props.duration}d`}
            label={`${props.duration}d`}
            checked={user.userSettings.forecastDurationDays === props.duration}
            onChange={(e) => {
                if ((e.target as HTMLInputElement).checked) { user.saveAppSettings({ ...user.userSettings, forecastDurationDays: props.duration }); }
            }}
        />
    )
}