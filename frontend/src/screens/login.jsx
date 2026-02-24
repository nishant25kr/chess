import { useState } from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"

export const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function submitform() {
        try {

            const response = await axios.post(
                "http://localhost:3000/api/user/login",
                { email, password },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log('Response data:', response.data);
            console.log('Status code:', response.status);

            if(response.status == 200){
                navigate("/game")
            }

        } catch (err) {
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
        }
    }
    return (
        <div>
            <input type="text" className="border" onChange={(e) => { setEmail(e.target.value) }} />
            <input type="text" className="border" onChange={(e) => { setPassword(e.target.value) }} />
            <button onClick={() => submitform()}>Login</button>
        </div>
    )
}