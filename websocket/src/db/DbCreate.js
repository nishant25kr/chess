import axios from "axios";

export async function createdGameInDB(gameId ,token1 , token2){
    try {
        const response = await axios.post("http://localhost:3000/api/game/create-game",{gameId ,token1 , token2})
        if(response){
            console.log(response)
            return;
        }else{
            console.log("db error")
        }
    } catch (error) {
        console.log("db error",error.message)
        
    }

}