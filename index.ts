import { getEventsFor, publishEvent } from "./repository"
import {
  Aggregate,
  Event,
  AggregateService,
  CommandHandlers,
  Fold,
  Rehydrator,
  Command,
  CommandService,
} from "types"

export function createAggregateRoot<
  A extends Aggregate,
  C extends Command,
  E extends Event
>(
  rehydrator: Rehydrator<A>,
  cmd: CommandHandlers<A, C, E>
): AggregateService<A, C, E> {
  const wrappedCmd: CommandService<C, E> = {} as any
  const keys = Object.keys(cmd) as Array<C["type"]>

  for (const type of keys) {
    wrappedCmd[type] = async (id, body) => {
      // rehydrate the aggregate
      const agg = await rehydrator(id)

      // perform the command and get the resulting event
      const result = await cmd[type](agg, body)
      await onCommandResult(result, agg)
    }
  }

  async function onCommandResult(result: E | void, agg: A) {
    if (!result) return
    publishEvent("players", agg.id, agg.version + 1, result)
  }

  return {
    getAggregate: rehydrator,
    cmd: wrappedCmd,
  }
}

export function createRehydrator<A extends Aggregate, E extends Event>(
  init: A,
  fold: Fold<A, E>
): Rehydrator<A> {
  return async function getAggregate(id: string) {
    const wrappedEvents = await getEventsFor(id)
    let version = 0

    if (wrappedEvents.length) {
      version = wrappedEvents[wrappedEvents.length - 1].version
    }

    const agg: A = { ...init, id, version }
    const events: E[] = wrappedEvents.map((stored) => stored.event)
    return events.reduce<A>(fold, agg)
  }
}
