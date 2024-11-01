import {BrowserRouter} from "react-router-dom"
import AppRouter from "./components/AppRoutes";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { check } from "./http/userApi";
import { Context } from ".";
import Spinner from 'react-bootstrap/Spinner';
import NavBar from "./components/Navbar";


const App = observer( () => { 
 
  const {user} = useContext(Context)

    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
      check().then((data) => {
  
          user.setUser(data)
          user.setIsAuth(true)
          if(data.role !== "ADMIN"){
            user.setIsAdmin(false)
         }else{
            user.setIsAdmin(true)
         }
      },
      () => {
        console.log("no auth")
      }
       
    ).finally(() => setisLoading(false))
  }, [])
  
  if(isLoading){
    return <Spinner animation="glow"></Spinner>
  
  }
  
  return (
  <BrowserRouter>
  <NavBar></NavBar>
  <AppRouter/>
  </BrowserRouter>
  
  );
}
)
export default App;