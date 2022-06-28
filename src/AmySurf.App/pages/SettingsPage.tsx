import React from "react"
import { Container, Stack } from "../core-ui/ui"
import { ForecastPrecisionCheck } from "../components/ForecastPrecisionCheck"
import ForecastVisibilityCheck from "../components/ForecastVisibilityCheck"
import VisibilityMapCheck from "../components/MapSizeSelect"
import { ForecastsHoursRange } from "../components/ForecastsHoursRange"
import ThemeChangerCheck from "../components/ThemeChangerCheck"
import { ForecastDurationCheck } from "../components/ForecastDurationCheck"
import AdvancedSettings from "../components/AdvancedSettings"
import ExpandableStack from "../components/ExpandableStack"
import PageTitle from "../components/PagesTitles"
import FontSizeSetting from "../components/FontSizeSetting"
import { LimitedWidthContainer } from "../components/LimitedWidthContainer"

export default function SettingsPage(): JSX.Element {

    return (
        <Stack direction='vertical'>
            <PageTitle title={'Settings'} />
            <LimitedWidthContainer>
                <Container fluid className='h-100'>

                    <ExpandableStack title="Style" uniqueLocalStorageKey="StyleSetting"  >
                        <ThemeChangerCheck />
                    </ExpandableStack>

                    <ExpandableStack title="Font" uniqueLocalStorageKey="FontSetting"  >
                        <FontSizeSetting />
                    </ExpandableStack>

                    <ExpandableStack title="Map" uniqueLocalStorageKey="MapSetting">
                        <VisibilityMapCheck />
                    </ExpandableStack>

                    <ExpandableStack title="Details" uniqueLocalStorageKey="DetailsSetting">
                        <div>
                            <ForecastPrecisionCheck />
                            <ForecastsHoursRange />
                            <ForecastDurationCheck />
                        </div>
                    </ExpandableStack>

                    <ExpandableStack title="Visibility" uniqueLocalStorageKey="VisibilitySetting">
                        <ForecastVisibilityCheck />
                    </ExpandableStack>

                    <ExpandableStack title="Advanced" defaultExpand={false} saveExpandedState={false} uniqueLocalStorageKey="AdvancedSetting">
                        <AdvancedSettings />
                    </ExpandableStack>
                </Container>
            </LimitedWidthContainer>
        </Stack>
    )
}