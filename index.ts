import {
  Aggregate,
  AggregateMeta,
  Command,
  CommandHandler,
  CreateAggregateProps,
  Event,
  EventMeta,
  StoreEvent,
} from "types"

export function createAggregate<
  A extends Aggregate,
  C extends Command,
  E extends Event
>(props: CreateAggregateProps<A, E>) {
  function toNextAggregate(
    next: A & AggregateMeta,
    ev: StoreEvent<E>
  ): A & AggregateMeta {
    return {
      ...next,
      ...props.fold(ev.data, next, toMeta(ev)),
      version: ev.version,
      aggregateId: ev.aggregateId,
    }
  }

  async function getAggregate(id: string): Promise<A & AggregateMeta> {
    const events = await props.store.getAllEventsFor(id, props.stream)
    let version = 0

    const eventCount = events.length
    if (eventCount) {
      version = events[eventCount - 1].version
    }

    let initAgg: A & AggregateMeta = { ...props.init, aggregateId: id, version }
    return events.reduce(toNextAggregate, initAgg)
  }

  function cmd<TCmd extends C["type"]>(
    cmdType: TCmd,
    handler: CommandHandler<
      A & AggregateMeta,
      Extract<C, { type: typeof cmdType }>,
      E
    >
  ) {
    return async (id: string, cmd: Extract<C, { type: typeof cmdType }>) => {
      const agg = await getAggregate(id)
      const event = await handler(agg, cmd)

      props.store.append(event, props.stream, id, agg.version + 1)
    }
  }

  return {
    getAggregate,
    cmd,
  }
}

function toMeta(ev: StoreEvent): EventMeta {
  return {
    aggregateId: ev.aggregateId,
    position: ev.position,
    stream: ev.stream,
    timestamp: ev.timestamp,
    version: ev.version,
  }
}
