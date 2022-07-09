
import React from "react";
import { useUser } from "../contexts/useUser";
import { Container, Form, Stack } from "../core-ui/ui";
import { IUser } from "../models/modelsApp";

export function WavesSizePreference(): React.JSX.Element {
    const user = useUser();
    // const style: CSSProperties = { minWidth: 90 } // was apply to span
    return (
        <Container>
            <Stack direction="horizontal">
                <span className="text-nowrap me-2">Favorite waves size {user.userSettings.wavesSizePrefered}ft </span>
                <Form.Range
                    onChange={(e) => { handleStartHourChange(e, user) }}
                    value={user.userSettings.wavesSizePrefered}
                    min={1}
                    max={12}
                />
            </Stack>
        </Container>
    );
}

function handleStartHourChange(e: React.ChangeEvent<HTMLInputElement>, user: IUser) {
    user.saveAppSettings({ ...user.userSettings, wavesSizePrefered: e.target.valueAsNumber });
}