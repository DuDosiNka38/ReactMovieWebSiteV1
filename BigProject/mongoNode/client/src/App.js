import {BrowserRouter} from "react-router-dom"
import NavBar from "./components/Navbar";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { check } from "./http/userApi";
import { Context } from ".";
import Spinner from 'react-bootstrap/Spinner';
import AppRouter from "./components/AppRouts";


const App = observer( () => {
 
  const {user} = useContext(Context)

    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
      check().then(() => {
          user.setUser(true)
          user.setIsAuth(true)
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
