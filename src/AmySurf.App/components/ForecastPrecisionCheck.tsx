import React from "react";
import { useUser } from "../contexts/useUser";
import { Container, Form, Stack } from "../core-ui/ui";

export function ForecastPrecisionCheck(): React.JSX.Element {
    return (
        <Container>
            <Stack gap={2} direction="horizontal">
                <span>Forecasts precision </span>
                <IntervalCheck interval={1} />
                <IntervalCheck interval={2} />
                <IntervalCheck interval={3} />
            </Stack>
        </Container>
    );
}

function IntervalCheck(props: { interval: number }): React.JSX.Element {
    const user = useUser();

    return (
        <Form.Check
            type='checkbox'
            id={`Interval ${props.interval}h`}
            label={`${props.interval}h`}
            checked={user.userSettings.forecastInterval === props.interval}
            onChange={(e) => {
                if ((e.target as HTMLInputElement).checked) { user.saveAppSettings({ ...user.userSettings, forecastInterval: props.interval }); }
            }}
        />
    )
}