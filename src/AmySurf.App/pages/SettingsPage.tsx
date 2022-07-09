import React from "react"
import AdvancedSettings from "../components/AdvancedSettings"
import ExpandableStack from "../components/ExpandableStack"
import { ForecastDurationCheck } from "../components/ForecastDurationCheck"
import { ForecastPrecisionCheck } from "../components/ForecastPrecisionCheck"
import { ForecastsHoursRange } from "../components/ForecastsHoursRange"
import { ForecastVisibilityCheck } from "../components/ForecastVisibilityCheck"
import { LimitedWidthContainer } from "../components/LimitedWidthContainer"
import VisibilityMapCheck from "../components/MapSizeSelect"
import PageTitle from "../components/PageTitle"
import StyleSettings from "../components/StyleSettings"
import { WavesSizePreference } from "../components/WavesSizePreference"
import { Container, Stack } from "../core-ui/ui"

export default function SettingsPage(): React.JSX.Element {

    return (
        <Stack direction='vertical'>
            <PageTitle title={'Settings'} />
            <LimitedWidthContainer>
                <Container fluid className='h-100'>

                    <ExpandableStack title="Style" uniqueLocalStorageKey="StyleSetting"  >
                        <StyleSettings />
                    </ExpandableStack>

                    <ExpandableStack title="Map" uniqueLocalStorageKey="MapSetting">
                        <VisibilityMapCheck />
                    </ExpandableStack>

                    <ExpandableStack title="Details" uniqueLocalStorageKey="DetailsSetting">
                        <div>
                            <WavesSizePreference />
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

export function SubSettingWrapper(props: { title: string, settings: React.JSX.Element }): React.JSX.Element {

    return (
        <Container>
            <span className='fs-6 fw-semibold'>
                {props.title}
            </span>
            <div className='ms-2'>
                {props.settings}
            </div>
        </Container>
    )
}