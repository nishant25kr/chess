import react from "react"
import { useState } from "react";
import {useNavigate} from "react-router-dom"

const Landing = () => {
    
    const navigate = useNavigate()
    const [roomId, setRoomId] = useState("")
    return (
            
        <div className="grid grid-cols-2 ">

            <div className="flex justify-center border p-3">
                <img src="/chessboard.jpeg"/>

            </div>

            <div className=" border p-3">
                <h1>Best multi player chess platform </h1>
                <button
                    className="border"
                    onClick={() => {
                            navigate("/game")
                    }}
                >JOIN ROOM</button>

            </div>

        </div>
    )
}

export default Landing;