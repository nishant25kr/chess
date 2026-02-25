

export class UserManager{
    #users
    constructor(){
        this.#users = []
    }

    addUser(user){
        if(!user){
            console.log("error while decoding user")
            return false
        }
        this.#users.push(user)
        return true;
    }

    getUser(socket){
        const user = this.#users.find(u => u.ws === socket);
        return user;
    }

    removeUser(user){

    }

    // gameInit(user){
    //     gameManager.addUser(user.ws);
    // }

}