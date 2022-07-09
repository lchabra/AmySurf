import React from 'react'
import { Stack } from '../core-ui/ui'
import { SubSettingWrapper } from '../pages/SettingsPage'
import FontSizeSetting from './FontSizeSetting'
import ThemeChangerCheck from './ThemeChangerCheck'

export default function StyleSettings(): React.JSX.Element {

    return (
        <Stack>
            <SubSettingWrapper title='Theme' settings={<ThemeChangerCheck />} />
            <SubSettingWrapper title='Font' settings={<FontSizeSetting />} />
        </Stack>
    )
}
