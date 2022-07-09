declare module 'nostr-tools' {
  export function relayPool(): RelayPool
  export function generatePrivateKey(): string
  export function getPublicKey(privateKey: string): string
  export function relayConnect(url: string, onNotice: () => void, onError: () => void): Relay
  export function verifySignature(event: Event): unknown
  export function validateEvent(event: Event): boolean

  export interface RelayPool {
    setPrivateKey(privateKey: string): void
    addRelay(url: string, policy: RelayPolicy): Relay
    publish(eventObject: PartialEvent, cb: PublishCallback): Promise<Event>
    sub(request: { cb: SubscriptionCallback, filter: SubscriptionFilter }): Subscription
    relays: {
      [url: string]: { policy: RelayPolicy, relay: Relay }
    }
    removeRelay(url: string): void
    onNotice(cb: OnNoticeCallback): void
    offNotice(cb: OnNoticeCallback): void
    setPolicy(url: string, value: RelayPolicy): void
  }

  export type RelayPolicy = { read: boolean, write: boolean }

  export interface Relay {
    url: string
    publish(eventObject: PartialEvent, cb: PublishCallback): Promise<Event>
    sub(request: { cb: SubscriptionCallback, filter: SubscriptionFilter }): Subscription
    close(): void
    readonly status: RelayStatus
  }

  /* https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState */
  export enum RelayStatus {
    Connectiong = 0,
    Open = 1,
    Closing = 2,
    Closed = 3,
  }

  export type SubscriptionFilter = {
    kinds?: number[]
    ids?: string[]
    authors?: string[]
  }

  export type Subscription = {
    readonly url: string
    unsub(): void
  }

  export type OnNoticeCallback = () => void;
  export type OffNoticeCallback = () => void;
  export type SubscriptionCallback = (event: Event, relay: string) => void;
  export type PublishCallback = (status: 0 | 1, relay: string) => void;

  export type Event = {
    id: string
    pubkey: string
    created_at: number
    tags: string[]
    sig: string
    content: string
    kind: number
  }

  export type PartialEvent = {
    pubkey: string
    created_at: number
    tags: string[]
    content: string
    kind: number
  }
}
