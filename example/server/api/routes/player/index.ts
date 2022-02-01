import { Router } from "express"
import { create } from "./create"
import { get } from "./get"
import { update } from "./update"

export { router as default }

const router = Router()

router.post("/", create)
router.put("/:id", update)

router.get("/:id", get)
