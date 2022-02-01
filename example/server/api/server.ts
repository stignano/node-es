import cors from "cors"
import express, { Router } from "express"
import { errorHandler } from "./error"
import { log } from "./routes/log"
import player from "./routes/player"

const app = express()
app.use(cors())
app.use(express.json())

const router = Router()

router.use("/player", player)
router.get("/log", log)
router.use(errorHandler)

app.use(router)

export { app }
