import { createAggregateRoot, createRehydrator } from "../../../index"
import { CommandHandlers, Fold } from "types"
import { Player } from "./types"
import { CommandError } from "../../../error"

const emptyPlayer: Player.Agg = {
  dob: new Date(0),
  firstName: "",
  lastName: "",
  height: 0,
  id: "",
  nationality: "",
  position: "unk",
  version: 0,
  weight: 0,
}

const applyPlayerEvent: Fold<Player.Agg, Player.Evt> = (agg, ev) => {
  switch (ev.type) {
    case "PlayerCreated":
      return {
        ...agg,
        dob: ev.dob,
        firstName: ev.firstName,
        lastName: ev.lastName,
        height: ev.height,
        nationality: ev.nationality,
        position: ev.position,
        weight: ev.weight,
      }
    case "PlayerUpdated":
      return {
        ...agg,
        dob: ev.dob ?? agg.dob,
        firstName: ev.firstName ?? agg.firstName,
        lastName: ev.lastName ?? agg.lastName,
        height: ev.height ?? agg.height,
        nationality: ev.nationality ?? agg.nationality,
        position: ev.position ?? agg.position,
        weight: ev.weight ?? agg.weight,
      }
  }
}

const rehydrator = createRehydrator<Player.Agg, Player.Evt>(
  emptyPlayer,
  applyPlayerEvent
)

const cmd: CommandHandlers<Player.Agg, Player.Cmd, Player.Evt> = {
  async create(agg, body) {
    if (agg.version !== 0) {
      throw new CommandError("Player with this ID already exists")
    }

    return {
      type: "PlayerCreated",
      firstName: body.firstName,
      lastName: body.lastName,
      dob: body.dob,
      height: body.height,
      weight: body.weight,
      nationality: body.nationality,
      position: body.position,
    }
  },
  async update(agg, body) {
    if (agg.version === 0) throw new CommandError("Player does not exist")

    return {
      type: "PlayerUpdated",
      firstName: body.firstName,
      lastName: body.lastName,
      dob: body.dob,
      height: body.height,
      weight: body.weight,
      nationality: body.nationality,
      position: body.position,
    }
  },
}

const playerDomain = createAggregateRoot<Player.Agg, Player.Cmd, Player.Evt>(
  rehydrator,
  cmd
)

export { playerDomain }
