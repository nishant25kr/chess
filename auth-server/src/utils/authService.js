import jwt from "jsonwebtoken"
import prisma from "../db/prismaClient.js"

export const generateAccesstoken = (user)  => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name
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
        const email = decodeToken?.email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if(!user){
            throw new ApiError(401,"Invalid access token")
        }
    
        req.user = user
        next()

    } catch (error) {
        
    }


}