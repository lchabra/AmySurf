import React, { useState } from 'react'
import { bookmarkIconHeightRem, useAppStyle } from '../contexts/useStyle';
import { useUser } from '../contexts/useUser';
import { BookmarkAddedIcon, BookmarkIcon } from '../core-ui/icons';
import { IUser } from '../models/modelsApp';
import { Spot } from '../models/modelsForecasts';

export default function FavoriteStarSpot(props: { data: Spot; }) {
    const user = useUser()
    const appStyle = useAppStyle()
    const isFavorite = user.userSettings.favoriteSpots.filter(spot => spot.id === props.data.id).length > 0;

    const [isHoverState, setHoverState] = useState(false)

    return (
        <div
            onPointerEnter={() => setHoverState(true)}
            onPointerLeave={() => setHoverState(false)}
            onClick={() => handleFavoriteClick(isFavorite, user, props.data)}
        >
            {
                isFavorite &&
                <BookmarkAddedIcon
                    mixBlendMode={isHoverState ? 'difference' : 'normal'}
                    height={bookmarkIconHeightRem + 'rem'}
                    width={bookmarkIconHeightRem + 'rem'}
                    fill={appStyle.colorValues.themeTone}
                />
            }
            {
                !isFavorite &&
                <BookmarkIcon
                    mixBlendMode={isHoverState ? 'difference' : 'normal'}
                    height={bookmarkIconHeightRem + 'rem'}
                    width={bookmarkIconHeightRem + 'rem'}
                    fill={appStyle.colorValues.themeTone}
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
