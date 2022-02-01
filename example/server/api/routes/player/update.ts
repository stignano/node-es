import { playerDomain } from "../../../../domain/player"
import { Request, Response } from "express"
import { Player } from "example/domain/player/types"

type Params = {
  id: string
}

type Body = {
  firstName?: string
  lastName?: string
  dob?: string
  height?: number
  weight?: number
  nationality?: string
  position?: Player.Position
}

export async function update(req: Request<Params, any, Body>, res: Response) {
  const { id } = req.params
  const { body } = req

  let parsedDob: Date | undefined = undefined

  try {
    if (body.dob) parsedDob = toDate(body.dob)
  } catch (ex) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid date format" })
  }

  await playerDomain.cmd.update(id, {
    ...body,
    dob: parsedDob,
  })

  res.json({ success: true, id })
}

function toDate(date: string) {
  const parsed = Date.parse(date)
  if (isNaN(parsed)) {
    throw new Error()
  }

  return new Date(parsed)
}
