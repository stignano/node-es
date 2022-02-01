import { Event } from "./types"

type WrappedEvent<E extends Event> = {
  stream: string
  aggId: string
  version: number
  event: E
}

export async function publishEvent<E extends Event>(
  stream: string,
  aggId: string,
  nextVersion: number,
  event: E
) {
  const toStore: WrappedEvent<E> = {
    stream,
    aggId,
    version: nextVersion,
    event,
  }

  EVENT_LOG.push(toStore)
}

export async function getEventsFor(aggId: string) {
  return EVENT_LOG.filter((ev) => ev.aggId === aggId)
}

export const EVENT_LOG: Array<WrappedEvent<any>> = []
