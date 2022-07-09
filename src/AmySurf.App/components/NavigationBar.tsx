import React from 'react'
import { Link, useLocation } from 'react-router'
import { Navbar, Nav } from '../core-ui/ui'
import { HomeIcon, SearchIcon, SettingsIcon } from '../core-ui/icons'
import { AppStyle, RoutePath } from '../models/modelsApp';
import { navBarHeightEm, navBarIconHeightRem, useAppStyle } from '../contexts/useStyle';

export default function NavigationBar() {
    const location = useLocation();
    const appStyle = useAppStyle()

    return (
        <Navbar
            style={{ height: navBarHeightEm + 'rem', minHeight: navBarHeightEm + 'rem' }}
            className=
            {`
                text-bg-${appStyle.classNames.mainColor}
                bg-gradient
                fixed-bottom 
                text-nowrap
                p-0
                border-top 
                border-${appStyle.classNames.toneColor}
            `}
        >
            <Nav className='w-100 d-flex justify-content-evenly'>
                <NavItem
                    title='Forecasts'
                    linkContainerName={RoutePath.Forecasts}
                    icon={
                        <HomeIcon
                            height={navBarIconHeightRem + 'rem'}
                            width={navBarIconHeightRem + 'rem'}
                            fill={getColor(appStyle, location.pathname === '/forecasts')}
                        />}
                    textColor={getTextColor(appStyle, location.pathname === '/forecasts')}
                />
                <NavItem
                    title='Spots'
                    linkContainerName={RoutePath.Spots}
                    icon={
                        <SearchIcon
                            height={navBarIconHeightRem + 'rem'}
                            width={navBarIconHeightRem + 'rem'}
                            fill={getColor(appStyle, location.pathname === '/spots')}
                        />}
                    textColor={getTextColor(appStyle, location.pathname === '/spots')}
                />
                <NavItem
                    title='Settings'
                    linkContainerName={RoutePath.Settings}
                    icon={
                        <SettingsIcon
                            height={navBarIconHeightRem + 'rem'}
                            width={navBarIconHeightRem + 'rem'}
                            fill={getColor(appStyle, location.pathname === '/settings')}
                        />}
                    textColor={getTextColor(appStyle, location.pathname === '/settings')}
                />
            </Nav>
        </Navbar >
    )
}

export function NavItem(props: {
    title: string
    navLinkClassName?: string
    linkContainerName: string
    icon: React.JSX.Element
    disabled?: boolean
    textColor?: string
}) {

    return (
        <Nav.Link
            as={Link}
            to={".." + props.linkContainerName}
            disabled={props.disabled}
            className={`${props.disabled ? 'opacity-50' : ''} ${props.navLinkClassName}`}
        >
            <div className="d-flex justify-content-center">
                {props.icon}
            </div>

            <span className={`text-${props.textColor} text-center`}>{props.title}</span>
        </Nav.Link>
    )
}

function getTextColor(appStyle: AppStyle, isSelected: boolean) {
    return isSelected ? appStyle.classNames.toneColor : appStyle.classNames.mainContrastColor
}

function getColor(appStyle: AppStyle, isSelected: boolean) {
    return isSelected ? appStyle.colorValues.themeTone : appStyle.colorValues.themeConstrast
}