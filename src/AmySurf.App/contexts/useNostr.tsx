import React from 'react'
import { Event, relayPool, PartialEvent, Subscription, RelayPool, generatePrivateKey, getPublicKey } from 'nostr-tools'
import { Badge, OverlayTrigger, Popover, Stack, ToggleButton, ToggleButtonGroup } from '../core-ui/ui';
import useLocalStorage from '../hooks/useLocalStorage';
const NOSTR_RELAY_URL = process.env.NOSTR_RELAY_URL ?? 'wss://nostr.freejungle.net:443';
const RELAY_URLS = [NOSTR_RELAY_URL]

const NostrContext = React.createContext<Nostr>(null!);

export { Event }

export type ReportEvent = {
  event: Event
  content: Report
}

export type Report = {
  spotId: string
  time: string
  comment: string
  rating: number
}

export enum EventKind {
  Report = 357
}

export type HourlyRatingGroupMap = Map<number, RatingGroup[]>

export type RatingGroup = {
  rating: number
  events: ReportEvent[]
}

export interface Nostr {
  client: NostrClient
  publishReport(report: Report): Promise<void>
}

type NostrSettings = {
  privateKey: string
}

export function NostrProvider(props: {
  children: React.ReactNode
}) {
  console.debug('nostr.context');
  const [settings, _setSettings] = useLocalStorage<NostrSettings>('nostr', () => {
    console.debug('generate nostr key')
    return { privateKey: generatePrivateKey() }
  })

  const nostr = React.useMemo<Nostr>(() => {
    const client = new NostrClient(settings);

    return {
      client,
      publishReport: async report => { await client.publishReport(report) },
    }
  }, [settings]);

  React.useEffect(() => {
    console.debug('nostr.open');
    nostr.client.open()

    // Cleanup callback
    return () => {
      console.debug('nostr.dispose');
      nostr.client.close()
    }
  }, [nostr])

  return (<NostrContext.Provider value={nostr}>{props.children}</NostrContext.Provider>)
}

export function useNostr(): Nostr {
  const value = React.useContext(NostrContext)
  if (!value) throw new Error('Nostr is not initialized')
  return value!
}

export class NostrClient {
  private readonly _pool: RelayPool
  private readonly _pubkey: string

  constructor(settings: NostrSettings) {
    console.info('NostrClient..ctor', settings)
    const privateKey = settings.privateKey ?? generatePrivateKey();
    this._pubkey = getPublicKey(privateKey);
    this._pool = relayPool()
    this._pool.setPrivateKey(privateKey)
    this._pool.onNotice(function () { console.debug('ON', arguments) })
    this._pool.offNotice(function () { console.debug('OFF', arguments) })
  }

  get publicKey(): string { return this._pubkey }

  async publishReport(report: Report): Promise<Event> {
    const eventObject: PartialEvent = {
      kind: EventKind.Report,
      pubkey: this._pubkey,
      created_at: Math.round(Date.now() / 1000),
      content: JSON.stringify(report),
      tags: [],
    }
    console.debug('eventObject', eventObject)
    const event = await this._pool.publish(eventObject, (status, url) => {
      if (status === 0) {
        console.debug(`publish request sent to ${url}`)
      }
      if (status === 1) {
        console.debug(`event published by ${url}`, event)
      }
    })
    return event;
  }

  open(): void {
    console.debug('nostr.client.open', Object.values(this._pool.relays))
    for (const relayUrl of RELAY_URLS) {
      console.debug('nostr relay', relayUrl)
      const relay = this._pool.addRelay(relayUrl, { read: true, write: true })
      console.debug('nostr relay added', relayUrl, relay)
    }
  }

  close(): void {
    console.debug('nostr.client.close', Object.values(this._pool.relays))
    for (const relayUrl of RELAY_URLS) {
      const relay = this._pool.relays[relayUrl];
      this._pool.removeRelay(relayUrl)
      console.debug('nostr.removeRelay', relayUrl, relay)
    }
  }

  subscribe(handler: (event: Event) => void): Subscription {
    console.debug('nostr.subscribe')
    const subscription = this._pool.sub({
      cb: (event, _relay) => {
        handler(event);
      },
      filter: {
        kinds: [EventKind.Report]
      }
    })
    return subscription;
  }
}

export function RatingControl({ value, onChange }: { value: number, onChange: (value: number) => void }) {
  return (
    <ToggleButtonGroup type="radio" name="options" value={value} onChange={onChange}>
      <ToggleButton variant="outline-primary" id="up" className="border-0" value={1}>👎</ToggleButton>
      <ToggleButton variant="outline-primary" id="down" className="border-0" value={3}>👍</ToggleButton>
    </ToggleButtonGroup>
  )
}

export function useReportEvents(): ReportEvent[] {
  const nostr = useNostr();
  const [events, setEvents] = React.useState<ReportEvent[]>([])

  React.useEffect(() => {
    const subscription = nostr.client.subscribe(event => {
      const content: Report = JSON.parse(event.content);
      setEvents(events => [{ event, content }, ...events])
    })

    return () => {
      subscription.unsub();
    }
  }, [nostr])

  return events
}

export function useHourlyRatingGroupMap(): HourlyRatingGroupMap {
  const events = useReportEvents()

  return React.useMemo(() => {
    const result = new Map<number, RatingGroup[]>();
    for (const event of events) {
      const report = event.content
      const time = new Date(report.time);
      const key = time.valueOf()
      let groups = result.get(key)
      if (!groups) {
        result.set(key, groups = [])
      }
      // Ignore duplicates report by same pubkey
      if (groups.some(g => g.events.some(e => e.event.pubkey === event.event.pubkey)))
        continue;
      let group = groups.find(c => c.rating === report.rating);
      if (!group) {
        groups.push(group = { rating: report.rating, events: [event] })
      }
      else {
        group.events.push(event)
      }
    }

    for (const s of result.values()) {
      s.sort((a, b) => b.events.length - a.events.length)
    }

    return result;
  }, [events]);
}

export function Ratings(props: { ratings: RatingGroup[], reportFactory: () => Report }) {
  const { ratings } = props
  const nostr = useNostr();
  const report = props.reportFactory()
  const [show, setShow] = React.useState(false)
  const rating = ratings.find(r => r.events.find(e => e.event.pubkey === nostr.client.publicKey))?.rating ?? 0;

  const popover = (
    <Popover id="rating-popover">
      {show && <RatingControl value={rating} onChange={async rating => {
        nostr.publishReport({ ...report, rating })
        setShow(false)
      }} />}
    </Popover>
  );

  const onToggle = (nextShow: boolean): void => {
    setShow(nextShow);
  };

  return (
    <OverlayTrigger show={show} trigger="click" onToggle={onToggle} placement="top-end" overlay={popover} rootClose>
      <Stack className="d-flex justify-content-center">
        {ratings.map(g => <Badge className="m-1" key={g.rating} pill bg="secondary">{g.rating === 3 ? '👍' : '👎'} {g.events.length}</Badge>)}
      </Stack>
    </OverlayTrigger>
  );
}
