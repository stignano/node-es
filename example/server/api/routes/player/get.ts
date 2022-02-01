import { playerDomain } from "../../../../domain/player"
import { Request, Response } from "express"

type Params = {
  id: string
}

export async function get(req: Request<Params>, res: Response) {
  const { id } = req.params

  const player = await playerDomain.getAggregate(id)

  res.send(player)
}
