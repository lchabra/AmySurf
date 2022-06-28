export const fetchTimerTimeoutMsBase = 5000;

export interface FetchResponse<T> {
    data?: T
    error?: Error
}

export async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
    const abortController = new AbortController();
    const options: RequestInit = { signal: abortController.signal }
    const id = setTimeout(() => abortController.abort(), timeoutMs)
    try {
        const response = await fetch(url, { ...options, signal: abortController.signal })
        return response
    }
    finally {
        clearTimeout(id)
    }
}

export async function fetchWithTimeoutNEW(url: string, timeoutMs: number): Promise<Response> {
    const abortController = new AbortController();
    const options: RequestInit = { signal: abortController.signal }
    const id = setTimeout(() => abortController.abort(), timeoutMs)

    try {
        const response = await fetch(url, { ...options, signal: abortController.signal })
        return response
    } catch (error) {
        return new Response(null)
    }
    finally {
        clearTimeout(id)
    }
}


export async function tryFetchUrl<T = unknown>(url: string, timeoutMs: number): Promise<FetchResponse<T>> {
    try {
        const response: Response = await fetchWithTimeout(url, timeoutMs)
        if (!response.ok) return { data: undefined, error: new Error(`${response.status} ${response.statusText}`) }
        const jsonResponse: T = await response.json();
        return { data: jsonResponse, error: undefined }
    } catch (error) {
        return { data: undefined, error: error }
    }
}