export type Aggregate = {}
export type AggregateMeta = { aggregateId: string; version: number }

export type Command = { type: string }

export type CommandHandler<
  A extends Aggregate,
  C extends Command,
  E extends Event
> = (aggregate: A, command: C) => Promise<E>

export type WrappedCommandHandler<C extends Command> = (
  id: string,
  command: C
) => Promise<void>

export type Event = { type: string }

export type EventMeta = {
  stream: string
  position: any
  version: number
  timestamp: Date
  aggregateId: string
}
export type StoreEvent<T = unknown> = EventMeta & { data: T }

export type EventStore<E extends Event> = {
  getAllEventsFor: (
    aggregateId: string,
    stream: string,
    startPosition?: number
  ) => Promise<Array<StoreEvent<E>>>
  append: (
    event: E,
    stream: string,
    aggregateId: string,
    nextVersion: number
  ) => Promise<void>
}

export type CreateAggregateProps<A extends Aggregate, E extends Event> = {
  store: EventStore<E>
  stream: string
  init: A
  fold: Fold<A, E>
}

export type AggregateService<
  A extends Aggregate,
  C extends Command,
  E extends Event
> = {
  getAggregate: (id: string) => Promise<A & AggregateMeta>
  registerCommand: (
    handler: CommandHandler<A, C, E>
  ) => WrappedCommandHandler<C>
}

export type Fold<A, E> = (
  ev: E,
  agg: A & AggregateMeta,
  meta: EventMeta
) => Partial<A>
