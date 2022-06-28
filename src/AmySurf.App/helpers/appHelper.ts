export const amySurfVersion = process.env.AMYSURF_VERSION ?? 'DEV'

export async function showNotification(registration: ServiceWorkerRegistration): Promise<void> {
    const title = `Forecast updated`
    const comment = undefined
    const body = [title, comment].filter(x => x != null).join(' ')

    await registration.showNotification('AmySurf', { body, })
}