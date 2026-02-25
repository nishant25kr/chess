import { createGame, moves } from "../controllers/game.controller.js";
import express from 'express'

const router = express.Router()

router.post("/create-game",createGame)
router.post("/moves", moves)

export default router;
