import { Request, Response } from "express"
import { EVENT_LOG } from "../../../../repository"

export async function log(_: Request, res: Response) {
  res.send(EVENT_LOG)
}
