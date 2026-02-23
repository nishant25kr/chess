import jwt from 'jsonwebtoken';
import { User } from '../SocketManager';
import { Player } from '../Game';
import { WebSocket } from 'ws';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const extractAuthUser = (token, ws) => {
    const decoded = jwt.verify(token, JWT_SECRET)
     const user = {
        ws: ws, 
        id:decoded
    }

    return user
};