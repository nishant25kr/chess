import { login,loginwithgoogle,signup } from "../controllers/user.controller.js";
import express from "express"

const router = express.Router()

router.post("/login",login)
router.post("/signup",signup)
router.post("/loginwithgoogle",loginwithgoogle)

export default router;        