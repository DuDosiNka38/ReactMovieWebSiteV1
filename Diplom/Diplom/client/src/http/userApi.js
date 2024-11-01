import { $host, $authHost } from "./index";
import { jwtDecode } from 'jwt-decode';

export const registration = async (name, email, password, role = "USER") => {
const {data} = await $host.post('/company-chat/user/registration',{name: name, email: email, password: password, role})
localStorage.setItem('token',data)
console.log(data)

return jwtDecode(data)
}

export const login = async (email, password) => {
    const {data} = await $host.post('/company-chat/user/login',{email: email, password: password})
    localStorage.setItem('token', data)
    return jwtDecode(data)
    }



    export const check = async () => {
     try {
        const {data} = await $authHost.get("/company-chat/user/auth")
        localStorage.setItem('token', data)
        return jwtDecode(data)
     } catch (error) {
        return  Promise.reject("Failure")
     }
      
        }

        export const getAllUsers= async ( ) => {
         const {data} = await $authHost.get('/company-chat/user/get_users')
          console.log("ALL users")
          console.log(data)
         return data
         }