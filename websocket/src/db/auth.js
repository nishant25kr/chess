import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const extractAuthUser =async (token, ws) => {
    const decoded =  jwt.verify(token, JWT_SECRET)
    const user = {
        ws: ws, 
        id: decoded.id,
        email: decoded.email,
        name: decoded.name
    }

    return user
};