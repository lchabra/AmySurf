import React, { useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { DefaultUser, IUser, User, UserSettings } from "../models/modelsApp";

const UserContext = React.createContext<IUser | null>(null);
// Context Provider
export function UserProvider(props: { children: React.ReactNode }) {
    const user = _useUser()
    return (<UserContext.Provider value={user}>{props.children}</UserContext.Provider>)
}

// Global function used to get the User
export function useUser(): IUser {
    const value = React.useContext(UserContext)
    if (!value) throw new Error('User is not initialized')
    return value
}

function _useUser(): IUser {
    const [userState, setUserState] = useLocalStorage<User>('user', DefaultUser)

    useMemo(() => {
        document.documentElement.style.setProperty('font-size', `${userState.userSettings.fontSizePercent}%`)
    }, [userState.userSettings.fontSizePercent])

    return {
        ...userState,
        saveAppSettings: (value: UserSettings) => {
            setUserState(s => ({ ...s, userSettings: value }))
            return value
        },
    }
}