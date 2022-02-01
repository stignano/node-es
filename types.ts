export type Aggregate = {
  id: string
  version: number
}

export type Entity = {
  id: string
}

export type Event = {
  type: string
}

export type Command = {
  type: string
}

export type CommandService<C extends Command, E extends Event> = {
  [key in C["type"]]: (
    id: string,
    body: Omit<Extract<C, { type: key }>, "type">
  ) => Promise<E | void>
}

export type CommandHandlers<
  A extends Aggregate,
  C extends Command,
  E extends Event
> = {
  [key in C["type"]]: (
    agg: A,
    body: Omit<Extract<C, { type: key }>, "type">
  ) => Promise<E | void>
}

export type AggregateService<
  A extends Aggregate,
  C extends Command,
  E extends Event
> = {
  getAggregate: Rehydrator<A>
  cmd: CommandService<C, E>
}

export type Fold<A, E> = (agg: A, ev: E) => A

export type Rehydrator<A> = (id: string) => Promise<A>
