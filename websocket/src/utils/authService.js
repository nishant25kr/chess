import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const generateAccesstoken = ({user})  => {
    const payload = {
        id: user.id,
        email: user.email
    }

    return jwt.sign(
        payload,
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_EXPIRATION,
        }
    )
} 

export const verifyJwt = async (req,res,next) =>{
    try {
        const token = req.cookies?.accessToken
        
        if(!token) {
            // todo:add error
            console.log("no token")
            return ;
        }

        const decodeToken = jwt.verify(token,process.env.JWT_ACCESS)



    } catch (error) {
        
    }


}