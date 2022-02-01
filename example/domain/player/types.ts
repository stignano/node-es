import { Aggregate } from "types"

export namespace Player {
  export type Agg = Aggregate & {
    firstName: string
    lastName: string
    dob: Date
    height: number
    weight: number
    nationality: string
    position: Position
  }

  export type Evt =
    | {
        type: "PlayerCreated"
        firstName: string
        lastName: string
        dob: Date
        height: number
        weight: number
        nationality: string
        position: Position
      }
    | {
        type: "PlayerUpdated"
        firstName?: string
        lastName?: string
        dob?: Date
        height?: number
        weight?: number
        nationality?: string
        position?: Position
      }

  export type Cmd =
    | {
        type: "create"
        firstName: string
        lastName: string
        dob: Date
        height: number
        weight: number
        nationality: string
        position: Position
      }
    | {
        type: "update"
        firstName?: string
        lastName?: string
        dob?: Date
        height?: number
        weight?: number
        nationality?: string
        position?: Position
      }

  export type Position = "fwd" | "mid" | "def" | "gkp" | "unk"
}
