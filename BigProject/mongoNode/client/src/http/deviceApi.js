import { $host, $authHost } from "./index";
import jwt_decode from "jwt-decode"

export const getTypes = async () => {
const {data} = await $host.get('api/type')
return data
}


export const createType = async (name) => {
    const {data} = await $authHost.post('api/type', {name: name})
    console.log(data);
    return data
}


export const createBrand = async (name) => {
    const {data} = await $authHost.post('api/brand', {name: name})
    console.log(data);
    return data
}

export const createDevice= async (device) => {
    console.log(device.name);
    const {data} = await $authHost.post('api/device', device)
    console.log("CREATE" + data);
    return data
}





export const getBrands = async () => {
   const {data} = await $host.get('api/brand')
   return data
   }


   export const getAllDevice = async (typeId , brandId, page, limit=3 ) => {
      const {data} = await $host.get('api/device',{params: {
              typeId, brandId, page, limit
          }})

       console.log("ALL Devace")
       console.log(data)
      return data
      }
      
      export const getOneDevice = async (id) => {
       
       try{
         const {data} = await $host.get('api/device/' + id )
         console.log("in get one",data)
         return data
      } catch (error) {
         return  Promise.reject("Failure")
      }
         } 