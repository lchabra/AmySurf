import React, { useEffect } from 'react'
import { amySurfVersion } from '../helpers/appHelper'
import { isIos } from '../core-ui/ui'

/**
 * PwaState
 */
export type PwaState = {
    hasUpdate: boolean
    version: string
    registration: ServiceWorkerRegistration | null
}

const initialPwaState: PwaState = Object.freeze({ hasUpdate: false, version: amySurfVersion, registration: null })
const PwaContext = React.createContext<PwaState | null>(null)

/**
 * shouldDisplayInstallPopup
 */
export function shouldDisplayInstallPopup() {
    return isIos
}

export function PwaProvider(props: { children: React.ReactNode }) {
    const [state, setState] = React.useState<PwaState>(initialPwaState)

    useEffect(() => { registerAsync() }, [])

    async function registerAsync() {
        const registration = await navigator.serviceWorker.register(new URL('../service-worker.ts', import.meta.url), { type: 'module' })
        console.debug('registered', registration.scope)
        setState(s => ({ ...s, registration }))
    }

    return (<PwaContext.Provider value={state} > {props.children} </PwaContext.Provider>)
}

export default function usePwa(): Readonly<PwaState> {
    const sw = React.useContext(PwaContext)
    if (!sw) {
        throw new Error('usePwa must be used within a PwaProvider')
    }
    return sw
}