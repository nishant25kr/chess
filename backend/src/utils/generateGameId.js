const MAX_LENGTH = 5
const generateRandomGameId =  ()=>{
    
    let id="";
    const random = "abcdefghijklmnopqrstuvwxyz123456789"
    for(let i=0 ; i<MAX_LENGTH; i++){
        id+= random[Math.floor(Math.random() * random.length)]

    }
    return id;

}

export default generateRandomGameId