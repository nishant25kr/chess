import { useEffect, useState } from "react"

const URL = "ws://localhost:8080"

export const useSocket = () =>{
    const [socket,setSocket]  = useState(null)
    
    useEffect(()=>{
        const ws = new WebSocket(URL)

        ws.onopen(()=>{
            setSocket(ws)
        })

        ws.onclose(()=>{
            setSocket(null)
        })

        return ()=>{
            ws.close()
        }

    },[])


    return (
       socket
    )
}