export class CommandError extends Error {
  constructor(public msg: string, public code?: string) {
    super(msg)
  }
}

export function onError<E extends Error>(ex: E) {
  console.log(ex)
}
