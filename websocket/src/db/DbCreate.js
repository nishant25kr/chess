import axios from "axios";

export async function DbCreate(gameId ,token1 , token2){
    try {
        const response = await axios.post("http://localhost:3000/api/game/create-game",{gameId ,token1 , token2})
        if(response){
            return;
        }else{
            console.log("db error")
        }
    } catch (error) {
        console.log("db error",error.message)
        
    }

}