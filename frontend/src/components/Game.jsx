import { useEffect } from "react"
import { useSocket } from "../hooks/useSocket"
import { Chessboard } from "./Chessboard"

export const Game = () => {

    const socket = useSocket()

    useEffect(() => {
        if (!socket) return;

        socket.onmesage = (e) => {
            const message = JSON.parse(e.data)
            console.log(message)
            switch (message.type) {
                case "init_game":
                    console.log('game init')
                    break;

                case "move":
                    console.log('game init move')
                    break;

                case "game_over":
                    console.log('game over')
                    break;

            }
        }
    }, [socket])

    if (!socket) {
        return (
            <h1>loading</h1>
        )
    }
    return (
        <div className="justify-center">
            <div className="pt-8 max-w-screen">
                <div class="grid grid-cols-6 gap-4">

                    <div class="col-span-4 p-4">
                        <Chessboard />
                    </div>
                    <div class="col-span-2 p-4">
                        <button
                            onClick={() => {
                                socket.send(JSON.stringify({
                                    type: "init_game"
                                }))
                            }}
                        >Play</button>
                    </div>

                </div>
            </div>
        </div>
    )
}