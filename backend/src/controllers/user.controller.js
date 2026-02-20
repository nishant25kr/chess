import { PrismaClient } from "@prisma/client"
import { hashPassword, verifyPassword } from "../utils/bcrypt.js"

const prisma = new PrismaClient()

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body

        if (!email || !password || !name) {
            return res.status(400).json({
                message: "Email, name and password are required"
            })
        }

        const existUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existUser) {
            return res.status(400).json({
                message: "User already exists with this email"
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })

        const { password: _, ...safeUser } = user

        return res.status(201).json({
            user: safeUser,
            message: "User created successfully"
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        const isMatch = await verifyPassword(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Password is incorrect"
            })
        }

        const { password: _, ...safeUser } = user

        return res.status(200).json({
            user: safeUser,
            message: "Login successful"
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}