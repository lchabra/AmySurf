// https://usehooks-typescript.com/react-hook/use-local-storage
import { Dispatch, SetStateAction, useState } from 'react'

type SetValue<T> = Dispatch<SetStateAction<T>>
export type Value<T> = T | null

export function useReadLocalStorage<T>(key: string): Value<T> {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const item = window.localStorage.getItem(key)
        return item ? (JSON.parse(item) as T) : null
    } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error)
        return null
    }
}

export default function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, SetValue<T>] {
    // Get from local storage then
    // parse stored json or return initialValue
    const readValue = (): T => {
        // Prevent build error "window is undefined" but keep keep working
        if (typeof window === 'undefined') {
            return initializeLocalStorageValue<T>(key, initialValue)
        }

        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initializeLocalStorageValue<T>(key, initialValue)
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error)
            return initializeLocalStorageValue<T>(key, initialValue)
        }
    }

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(readValue)

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue: SetValue<T> = value => {
        // Prevent build error "window is undefined" but keeps working
        if (typeof window === 'undefined') {
            console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`)
        }

        try {
            // Allow value to be a function so we have the same API as useState
            if (value instanceof Function) {
                setStoredValue(oldValue => {
                    const newValue = value(oldValue)
                    setLocalStorageValue(key, newValue)
                    return newValue
                })
            } else {
                setLocalStorageValue(key, value)
                setStoredValue(value)
            }
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error)
        }
    }

    return [storedValue, setValue]
}

function initializeLocalStorageValue<T>(key: string, initialValue: T | (() => T)): T {
    const value = typeof (initialValue) === 'function' ? (initialValue as Function)() : initialValue
    setLocalStorageValue(key, value)
    return value
}

function setLocalStorageValue(key: string, value: unknown | null) {
    if (value == null) {
        window.localStorage.removeItem(key)
    } else {
        window.localStorage.setItem(key, JSON.stringify(value))
    }
}