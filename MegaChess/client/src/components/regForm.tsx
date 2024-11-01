import axios from 'axios';
import {useEffect, useState} from 'react'
import './components.css'


const RegForm = () => {
 const [message, setmessage] = useState<any[]>([]);
 const [value, setValue] = useState("");


 useEffect(() => {
  subscribe()
}, [])


 const subscribe = async () => {
try {
  const response:any = await axios.get('http://localhost:5000/new-messenge-get')
    console.log(response.data)
    setmessage([...response.data])
} catch (error) {
  setTimeout(() => {
    console.log("Retrying...")
    subscribe()
  }, 500)
}
  
}



const MessangeSend = async () =>{
  console.log("messaenge Sendind...")
 await axios.post('http://localhost:5000/new', {
  message: value, 
  id: Date.now()
})

} 



return(

<form>
  <div className='contanierReg'>

    
  <input type="Intputmessage" placeholder="Text" onChange={(e) => setValue(e.target.value)} required />
   
 <button className="registerbtn" onClick={MessangeSend} >Register</button>
 


  <div className='contanierReg'>


    
     {message.map(mess => 
     <div className='Messanges' key={mess.id}>
      {mess.message}
      </div>)}
   </div>
  
</div>
</form>

)
}


export default RegForm;