import axios from 'axios'
import {REACT_APP_API_URL} from '../const'

console.log(REACT_APP_API_URL())

const $host = axios.create({
baseURL: "http://localhost:5000"

}
)


const $authHost = axios.create({
    baseURL: "http://localhost:5000"
    
    }
    )



    const authInterceptor = config => {
    config.headers.authorithation = `Bearer ${localStorage.getItem("token")} `
    return config
}

$authHost.interceptors.request.use(authInterceptor)


export{
    $host,
    $authHost
}