import { $host, $authHost } from "./index";
import jwt_decode from "jwt-decode"

export const registration = async (name, email, password) => {
const {data} = await $host.post('api/user/registration',{name: name, email: email, password: password, role: "ADMIN"})
localStorage.setItem('token',data)
console.log(data)

return jwt_decode(data)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login',{email: email, password: password, role: "ADMIN"})
    localStorage.setItem('token', data)
    return jwt_decode(data)
    }



    export const check = async () => {
     try {
        const {data} = await $authHost.get("api/user/auth")
        localStorage.setItem('token', data)
        return jwt_decode(data)
     } catch (error) {
        return  Promise.reject("Failure")
     }
      
       
        }