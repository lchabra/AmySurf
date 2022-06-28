import React from "react"
import { Container, Form } from "../core-ui/ui"
import { useUser } from "../contexts/useUser"
import { MapSize } from "../models/modelsApp"

export default function VisibilityMapCheck(): JSX.Element {
    const availablesMapSize = Object.values(MapSize)
    const user = useUser()

    return (
        <Container>
            {availablesMapSize.map(mapSize => {
                return (
                    <Form.Check
                        key={"key-map-size-check-" + mapSize}
                        type='checkbox'
                        id={"map-size-check-" + mapSize}
                        label={mapSize}
                        checked={user.userSettings.mapSize === mapSize}
                        onChange={() => user.saveAppSettings({ ...user.userSettings, mapSize: mapSize })}
                    />
                )
            })}
        </Container>
    )
}