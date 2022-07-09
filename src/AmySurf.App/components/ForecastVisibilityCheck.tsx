import React from 'react'
import { Container, Form, Stack } from '../core-ui/ui'
import { useUser } from '../contexts/useUser'
import { RowVisibility } from '../models/modelsApp'
import { allRows, ForecastData } from '../models/forecast-grid'
import { GridRowDefinition } from './Grid'
import { isBasicForecastRow } from '../helpers/forecastHelper'
import { SubSettingWrapper } from '../pages/SettingsPage'

export function ForecastVisibilityCheck() {
    const basicRow = allRows.filter(r => isBasicForecastRow(r.id) && r.id !== "hours")
    const advancedRow = allRows.filter(r => !isBasicForecastRow(r.id) && r.id !== "hours")

    return (
        <Stack>
            <SubSettingWrapper title='Basic' settings={<RowCheckNew rows={basicRow} />} />
            <SubSettingWrapper title='Details' settings={<RowCheckNew rows={advancedRow} />} />
        </Stack>
    )
}

function RowCheckNew(props: { rows: GridRowDefinition<ForecastData>[] }): React.JSX.Element {
    const user = useUser()

    return (
        <Container>
            {props.rows.map(row =>
                <Form.Check
                    key={row.id + "-visibility-toggle"}
                    type='checkbox'
                    id={"visibility-check-" + row.id}
                    label={row.name}
                    checked={user.userSettings.rowVisibility.find(i => i.id === row.id)?.isVisible}
                    onChange={(e: any) => {
                        const newRowVisibility: RowVisibility[] = getUpdatedRowOrder(user.userSettings.rowVisibility, row.id, e.target.checked)
                        user.saveAppSettings({
                            ...user.userSettings,
                            rowVisibility: newRowVisibility
                        })
                    }}
                />
            )}
        </Container>
    )
}

function getUpdatedRowOrder(actualRowVisibility: RowVisibility[], clickedRowId: string, isRowSelected: boolean): RowVisibility[] {
    let newRowOrder = [...actualRowVisibility]
    const i = actualRowVisibility.findIndex((r) => r.id === clickedRowId)
    newRowOrder[i].isVisible = isRowSelected
    return newRowOrder
}
