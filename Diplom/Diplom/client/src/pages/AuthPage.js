
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import { useLocation, useNavigate} from 'react-router-dom';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, ROOMS_ROUTE} from '../const';
import { useContext, useState } from 'react';
import { login, registration } from '../http/userApi';
import { Context } from '..';

 

function AuthPage() {
      
const navigate = useNavigate()




const location = useLocation()
 let isLogin = location.pathname === LOGIN_ROUTE


const [showPassword, setShowPassword] = useState("password")
const handleKeyDown = event => {
   setShowPassword("text")
  };
  const handleKeyUp = event => {
    setShowPassword("password")
   };

   const {user, rooms} = useContext(Context)



 const [email,setEmial] = useState()
 const [name,setName] = useState()
 const [password,setPassword] = useState()

 const ClickForAction = async()=> {
 try {
    let response;
        if(!isLogin){
        response = await registration(name, email, password)
        console.log(response)
 
    rooms._rooms = response.rooms;
   
        }else{
         response = await  login(email, password)
     
         rooms._rooms = response.rooms;

         console.log(response)
         }
         navigate(ROOMS_ROUTE)
           navigate(0)
         } catch (e) {
            if (e.response && e.response.data) {
                alert(e.response.data)
              } else {
                alert("An error occurred. Please try again.")
              }
              console.log(e)
           }

 }


    return (  

        <Container className='d-flex justify-content-center align-items-center' style={{height: window.innerHeight - 54}}>
<Card  style={{ width: '35em', height: '23em', border: "1px solid black" }}>

    <Form className='d-flex flex-column p-5'>
    {isLogin ? 
    <h2 className='m-auto'>Sing In</h2>
:
<h2 className='m-auto'>Registration</h2>
}


{!isLogin ? 
    <Form.Control
    className='mr-4 mt-3'
    placeholder='Write a name...'
    value={name}
    onChange={e => setName(e.target.value)}
    />
    
    :
console.log()

}

<Form.Control
 className='mr-4 mt-3'
 placeholder='Write a email...'
 value={email}
 onChange={e => setEmial(e.target.value)}
 />
 


<Form.Control
 className='mr-4 mt-3'
 placeholder='Write a password...'
 value={password}
 type={showPassword}
 onChange={e => setPassword(e.target.value)}
 />
 <Button variant="secondary-outline" onMouseDown={handleKeyDown} onMouseUp={handleKeyUp}>Show password</Button>


<div className='d-flex justify-content-between mt-3 pl-3 pr-3'>
{isLogin ? 
 <Nav className='align-items-center'>
 <div>Dont have account?</div>
 <Nav.Link href ={REGISTRATION_ROUTE}> Sing up! </Nav.Link>
</Nav>
:
<Nav className='align-items-center'>
<div>Alredy have account?</div>
<Nav.Link href={LOGIN_ROUTE}> Login! </Nav.Link>
</Nav>

}


 <Button  variant="secondary" onClick={ClickForAction}>{isLogin ? "Login" :  "Sing up!" }</Button>  

</div>
    </Form>
    
    </Card>
    </Container>
    
    );
}

export default AuthPage