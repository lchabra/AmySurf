import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav } from '../core-ui/ui'
import { HomeIcon, SearchIcon, SettingsIcon } from '../core-ui/icons'
import { RoutePath } from '../models/modelsApp';
import { getBorderFaded, getThemeContrastIconColor, getNavBackgroundClassName, ThemeColor } from '../styles/theme';
import { darkOrangeColor, navBarHeightEm, navBarIconHeightRem, orangeColor, useAppStyle } from '../contexts/useStyle';

export default function NavigationBar() {
    const location = useLocation();
    const appStyle = useAppStyle()
    const bgColor = getNavBackgroundClassName(appStyle.theme)

    return (
        <Navbar
            style={{ height: navBarHeightEm + 'rem', minHeight: navBarHeightEm + 'rem' }}
            className={`
            fixed-bottom 
            text-nowrap
            p-0
            ${bgColor} 
            border-top 
            ${getBorderFaded(appStyle.theme)}`}
        >
            <Nav className='w-100 d-flex justify-content-evenly'>
                <NavItem
                    title='Forecasts'
                    linkContainerName={RoutePath.Forecasts}
                    icon={
                        <HomeIcon
                            height={navBarIconHeightRem + 'rem'}
                            width={navBarIconHeightRem + 'rem'}
                            fill={getNavIconColors(appStyle.theme, location.pathname === '/forecasts')}
                        />}
                    textColor={location.pathname === '/forecasts' ? darkOrangeColor : getThemeContrastIconColor(appStyle.theme)}
                />
                <NavItem
                    title='Spots'
                    linkContainerName={RoutePath.Spots}
                    icon={
                        <SearchIcon
                            height={navBarIconHeightRem + 'rem'}
                            width={navBarIconHeightRem + 'rem'}
                            fill={getNavIconColors(appStyle.theme, location.pathname === '/spots')}
                        />}
                    textColor={location.pathname === '/spots' ? darkOrangeColor : getThemeContrastIconColor(appStyle.theme)}
                />
                <NavItem
                    title='Settings'
                    linkContainerName={RoutePath.Settings}
                    icon={
                        <SettingsIcon
                            height={navBarIconHeightRem + 'rem'}
                            width={navBarIconHeightRem + 'rem'}
                            fill={getNavIconColors(appStyle.theme, location.pathname === '/settings')}
                        />}
                    textColor={location.pathname === '/settings' ? darkOrangeColor : getThemeContrastIconColor(appStyle.theme)}
                />
            </Nav>
        </Navbar >
    )
}
// ${getTextColorClassName(appStyle.theme)}
export function NavItem(props: {
    title: string
    navLinkClassName?: string
    linkContainerName: string
    icon: JSX.Element
    disabled?: boolean
    textColor?: string
}) {

    return (
        <Nav.Link
            as={Link}
            to={props.linkContainerName}
            disabled={props.disabled}
            className={`${props.disabled ? 'opacity-50' : ''} ${props.navLinkClassName}`}
        >
            <div className="d-flex justify-content-center">
                {props.icon}
            </div>
            <div style={{ color: props.textColor }} className={`text-center`}>
                {props.title}
            </div>
        </Nav.Link>
    )
}

function getNavIconColors(themeColor: ThemeColor, isSelected: boolean): string {
    if (isSelected) return themeColor === ThemeColor.light ? darkOrangeColor : orangeColor
    else return getThemeContrastIconColor(themeColor)
}