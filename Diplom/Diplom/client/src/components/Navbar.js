import { ADMIN_ROUTE, LOGIN_ROUTE, ROOMS_ROUTE } from "../const";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button'
import { useContext } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";



const NavBar = observer(() =>  {

    const {user} = useContext(Context)

    const logout = ()=>{
   
      user.setUser({});
      user.setIsAuth(false);
      user.setIsAdmin(false);
      console.log(user._isAuth, " _isAuth");
console.log(user._isAdmin, "  isAdmin");
      localStorage.setItem('token', '');

    }

    return (  
<Navbar data-bs-theme="dark" bg="info">
        <Container>
          <Navbar.Brand href={ROOMS_ROUTE}>Company-chat</Navbar.Brand>

            {user._isAuth ?
            
 <Nav className="ml-auto">
          <Button variant="secondary" href={ ADMIN_ROUTE}>AdminPanel</Button>
          <Button variant="secondary"  style={{marginLeft: 2 + 'em'}} onClick={()=>{logout()}}>LogOut</Button>
      
          </Nav>
        :
        <Nav className="ml-auto">
            <Button variant="secondary"  style={{marginLeft: 2 + 'em'}} href={LOGIN_ROUTE}>Sing Up</Button>
         </Nav>
        }
        </Container>
      </Navbar>
    
     
    
    );
})

export default NavBar