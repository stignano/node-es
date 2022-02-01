import { CommandError } from "../../../error"
import { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (error instanceof CommandError) {
    res
      .status(400)
      .json({ success: false, message: `${error.message}`, code: error.code })
    return
  }

  next(error)
}
