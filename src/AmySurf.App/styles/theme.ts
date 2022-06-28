import { orangeColor } from "../contexts/useStyle";

export enum ThemeColor {
    dark = 'dark',
    light = 'light'
}

export function getThemeContrastIconColor(themeColor: ThemeColor): string {
    switch (themeColor) {
        case ThemeColor.dark:
            return 'white'
        case ThemeColor.light:
            return 'black'
        default:
            return 'black';
    }
}

export function getThemeColorWhenSelected(themeColor: ThemeColor, isSelected: boolean): string {
    if (isSelected)
        return orangeColor
    else
        return getThemeContrastIconColor(themeColor)
}

export function getNextTheme(themeColor: ThemeColor): ThemeColor {
    switch (themeColor) {
        case ThemeColor.dark:
            return ThemeColor.light
        case ThemeColor.light:
            return ThemeColor.dark
        default:
            return ThemeColor.light;
    }
}

export function getGradiantBackgroundClassName(themeColor: ThemeColor): string {
    return `bg-grad-page-${themeColor}`
}

export function getNavBackgroundClassName(themeColor: ThemeColor): string {
    return `bg-grad-nav-${themeColor}`
}

export function getSelectedColorClassName(themeColor: ThemeColor): string {
    return `bg-selected-${themeColor}`
}

export function getTextColorClassName(themeColor: ThemeColor): string {
    return `text-theme-${themeColor}`
}

export function getBackgroundSecondary(themeColor: ThemeColor): string {
    return `bg-theme-secondary-${themeColor}`
}

export function getBorderConstrated(themeColor: ThemeColor): string {
    switch (themeColor) {
        case ThemeColor.dark:
            return 'border-white'
        case ThemeColor.light:
            return 'border-dark'
        default:
            return 'border-dark'
    }
}

export function getBorderFaded(themeColor: ThemeColor): string {
    switch (themeColor) {
        case ThemeColor.dark:
            return 'border-secondary'
        case ThemeColor.light:
            return ''
        default:
            return 'border-secondary'
    }
}