import React from 'react'
import { bookmarkIconHeightRem, darkOrangeColor, orangeColor, useAppStyle } from '../contexts/useStyle';
import { useUser } from '../contexts/useUser';
import { BookmarkAddedIcon, BookmarkIcon } from '../core-ui/icons';
import { IUser } from '../models/modelsApp';
import { Spot } from '../models/modelsForecasts';
import { ThemeColor } from '../styles/theme';

export default function FavoriteStarSpot(props: { data: Spot; }) {
    const user = useUser()
    const appStyle = useAppStyle()
    const isFavorite = user.userSettings.favoriteSpots.filter(spot => spot.id === props.data.id).length > 0;

    return (
        <div onClick={() => handleFavoriteClick(isFavorite, user, props.data)}>
            {
                isFavorite &&
                <BookmarkAddedIcon
                    // stroke={getIconStrokeColor(appStyle.theme)}
                    // strokeOpacity={iconStrokeOpacityRem + 'rem'}
                    // strokeWidth={iconStrokeWidthRem + 'rem'}
                    height={bookmarkIconHeightRem + 'rem'}
                    width={bookmarkIconHeightRem + 'rem'}
                    fill={appStyle.theme === ThemeColor.light ? darkOrangeColor : orangeColor}
                />
            }
            {
                !isFavorite &&
                <BookmarkIcon
                    height={bookmarkIconHeightRem + 'rem'}
                    width={bookmarkIconHeightRem + 'rem'}
                    fill={appStyle.theme === ThemeColor.light ? darkOrangeColor : orangeColor}
                // fill={getThemeColorWhenSelected(appStyle.theme, isFavorite)}
                />
            }
        </div>
    )
}

export function handleFavoriteClick(isFavorite: boolean, user: IUser, clickedSpot: Spot) {
    if (isFavorite) {
        const newFavorite: Spot[] = user.userSettings.favoriteSpots.filter(spot => spot.id !== clickedSpot.id);
        user.saveAppSettings({ ...user.userSettings, favoriteSpots: newFavorite });

    } else {
        const newFavorite: Spot[] = [...user.userSettings.favoriteSpots];
        newFavorite.push(clickedSpot);
        newFavorite.sort((a: Spot, b: Spot) => (a.name > b.name) ? 1 : -1);
        user.saveAppSettings({ ...user.userSettings, favoriteSpots: newFavorite });
    }
}
