import React, { ReactNode, useState } from "react";
import { getBorderFaded, ThemeColor } from "../styles/theme";
import { Accordion, Stack } from "../core-ui/ui";
import { ExpandLessIcon, ExpandMoreIcon } from "../core-ui/icons";
import useLocalStorage from "../hooks/useLocalStorage";
import { bookmarkIconHeightRem, darkOrangeColor, orangeColor, useAppStyle } from "../contexts/useStyle";

type Props = {
    title: string
    children: React.PropsWithChildren<ReactNode>
    uniqueLocalStorageKey: string
    disableExpand?: boolean
    defaultExpand?: boolean
    saveExpandedState?: boolean
}

export default function ExpandableStack(props: Props): JSX.Element {
    const appStyle = useAppStyle()

    const [expanded, setExpanded] = props.saveExpandedState === false ?
        useState(props.defaultExpand ?? true) :
        useLocalStorage(`settingsGroup-${props.uniqueLocalStorageKey}`, props.defaultExpand ?? true)

    return (
        <div className={`pb-3 border-top ${getBorderFaded(appStyle.theme)}`}>
            <Stack
                direction='horizontal'
                onClick={() => props.disableExpand ? null : setExpanded(!expanded)}
            >
                <span className="fs-1 flex-grow-1">
                    {props.title}
                </span>

                {!props.disableExpand && expanded &&
                    <ExpandLessIcon
                        height={bookmarkIconHeightRem + 'rem'}
                        fill={appStyle.theme === ThemeColor.light ? darkOrangeColor : orangeColor}
                    />
                }
                {!props.disableExpand && !expanded &&
                    <ExpandMoreIcon
                        height={bookmarkIconHeightRem + 'rem'}
                        fill={appStyle.theme === ThemeColor.light ? darkOrangeColor : orangeColor}
                    />
                }
            </Stack>
            {expanded && props.children}
        </div >
    )
}

// Use Accordion Component instead?
export function AccordionComponent(props: { title: string, children: React.PropsWithChildren<ReactNode> }): JSX.Element {
    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>{props.title}</Accordion.Header>
                <Accordion.Body>
                    {props.children}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}