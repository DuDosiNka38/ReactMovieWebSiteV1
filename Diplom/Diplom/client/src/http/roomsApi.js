import {  $authHost, $host} from "./index";



export const createRoom= async (title, discription, members) => {  

    const {data} = await $authHost.post('/company-chat/rooms', {title, discription, members})
    console.log(data)
    return data
}


export const getAllRooms= async ( ) => {
      const {data} = await $authHost.get('/company-chat/rooms')

       console.log("ALL Devace")
       console.log(data)
      return data
      }
      
      export const getOneRoom= async (id) => { 
       try{
         const {data} = await $host.get('/company-chat/rooms/' + id )
         return data
      } catch (error) {
         return  Promise.reject("Failure")
      }
         } 



         export const postMessage = async (id, message, id_user) => {
            try {
              console.log("LLLLLLLL", id_user);
              const { data } = await $host.post(`/company-chat/rooms/${id}`, { message, id_user });
              return data;
            } catch (error) {
              return Promise.reject("Failure");
            }
          };