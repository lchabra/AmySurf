import React, { CSSProperties } from 'react';
import { getBorderFaded, getThemeContrastIconColor } from '../styles/theme';
import { forecastDaySummaryHeightEm, forecastTypeIconHeightRem, useAppStyle } from '../contexts/useStyle';
import { useUser } from '../contexts/useUser';
import { ExpandLessIcon, ExpandMoreIcon } from '../core-ui/icons';

export function LabelsStyleChanger() {
    const user = useUser()
    const appStyle = useAppStyle()

    const iconColor = getThemeContrastIconColor(appStyle.theme)

    const styles = getStyles()

    return (

        <div
            className={`d-flex justify-content-center align-items-center border-end border-start border-bottom ${getBorderFaded(appStyle.theme)}`}
            style={styles.wrapper}
            onClick={() => { user.saveAppSettings({ ...user.userSettings, denseLabel: !user.userSettings.denseLabel }) }}
        >
            {user.userSettings.denseLabel && <ExpandMoreIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={iconColor} />}
            {!user.userSettings.denseLabel && <ExpandLessIcon height={forecastTypeIconHeightRem + 'rem'} width={forecastTypeIconHeightRem + 'rem'} fill={iconColor} />}
        </div>
    )
}

function getStyles(): Record<string, CSSProperties> {
    return {
        wrapper: {
            minHeight: forecastDaySummaryHeightEm + 'rem',
            height: forecastDaySummaryHeightEm + 'rem'
        }
    }
}