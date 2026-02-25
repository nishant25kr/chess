import axios from "axios";

export async function createdGameInDB(id, whitePlayerId, blackPlayerId) {
    try {
        const response = await axios.post("http://localhost:3000/api/game/create-game", { id, whitePlayerId, blackPlayerId })
        if (response.status == 201) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log("db error", error.message)

    }

}