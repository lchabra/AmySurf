// import { showNotification } from './helpers/appHelper'
import { manifest, version } from '@parcel/service-worker'
declare const self: ServiceWorkerGlobalScope

async function install() {
    self.skipWaiting()

    const cache = await caches.open(version)
    await cache.addAll(manifest)
}
self.addEventListener('install', e => e.waitUntil(install()))

async function activate() {
    const keys = await caches.keys()
    await Promise.all(
        keys.map(key => key !== version && caches.delete(key))
    )
}
self.addEventListener('activate', e => e.waitUntil(activate()))

function handleFetch(e: FetchEvent) {
    // const request = normalizeRequest(e.request)
    const request = e.request

    return caches.match(request).then(response => {
        if (typeof response !== 'undefined') {
            return response
        }
        return fetch(request)
    })
}

function normalizeRequest(request: Request) {
    let index = request.url.lastIndexOf('/')
    if (index < 0) {
        return request
    }

    const path = request.url.substring(index + 1)
    index = path.lastIndexOf('.')
    if (index < 0) {
        return new Request('/index.html')
    }
    return request
}

self.addEventListener('fetch', e => e.respondWith(handleFetch(e)))

// The event can be pass to showNotification() to display detailed notification
// self.addEventListener('push', async event => {
//     try {
//         const promise = showNotification(self.registration)
//         event.waitUntil(promise)
//     } catch (e) {
//         console.error(e)
//     }
// })
