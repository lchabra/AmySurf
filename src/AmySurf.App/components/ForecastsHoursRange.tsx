import React from "react";
import { useUser } from "../contexts/useUser";
import { Container, Form, Stack } from "../core-ui/ui";
import { IUser } from "../models/modelsApp";

export function ForecastsHoursRange(): React.JSX.Element {
    const user = useUser();
    // const style: CSSProperties = { minWidth: 90 } // was apply to span
    return (
        <Container>
            <Stack direction="horizontal">
                <span className="text-nowrap me-2">Start at {user.userSettings.startHours}h </span>
                <Form.Range
                    onChange={(e) => { handleStartHourChange(e, user) }}
                    value={user.userSettings.startHours}
                    min={0}
                    max={23}
                />
            </Stack>
            <Stack direction="horizontal">
                <span className="text-nowrap me-2">End at {user.userSettings.endHours}h </span>
                <Form.Range
                    onChange={(e) => { handleEndHourChange(e, user) }}
                    value={user.userSettings.endHours}
                    min={0}
                    max={23}
                />
            </Stack>
        </Container>
    );
}

function handleStartHourChange(e: React.ChangeEvent<HTMLInputElement>, user: IUser) {
    // if (e.target.valueAsNumber > user.userSettings.endHours) {
    //     user.saveAppSettings({ ...user.userSettings, startHours: e.target.valueAsNumber, endHours: e.target.valueAsNumber });
    // }
    // else {
    user.saveAppSettings({ ...user.userSettings, startHours: e.target.valueAsNumber });
    // }
}

function handleEndHourChange(e: React.ChangeEvent<HTMLInputElement>, user: IUser) {
    // if (e.target.valueAsNumber < user.userSettings.startHours) {
    //     user.saveAppSettings({ ...user.userSettings, startHours: e.target.valueAsNumber, endHours: e.target.valueAsNumber });
    // }
    // else {
    user.saveAppSettings({ ...user.userSettings, endHours: e.target.valueAsNumber });
    // }
}
