import { createGame } from "../controllers/game.controller.js";
import express from 'express'

const router = express.Router()

router.post("/create-game",createGame)

export default router;
