import { playerDomain } from "../../../../domain/player"
import { Player } from "../../../../domain/player/types"
import { Request, Response } from "express"
import { nanoid } from "nanoid"

type Body = {
  firstName: string
  lastName: string
  dob: string
  height: number
  weight: number
  nationality: string
  position: Player.Position
}

export async function create({ body }: Request<any, any, Body>, res: Response) {
  const id = nanoid()
  let parsedDob: Date

  try {
    parsedDob = toDate(body.dob)
  } catch (ex) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid date format" })
  }

  await playerDomain.cmd.create(id, {
    ...body,
    dob: parsedDob,
  })

  return res.json({ success: true, id })
}

function toDate(date: string) {
  const parsed = Date.parse(date)
  if (isNaN(parsed)) {
    throw new Error()
  }

  return new Date(parsed)
}
