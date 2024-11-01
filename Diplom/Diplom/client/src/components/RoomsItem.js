
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import {  ROOMS_ROUTE } from '../const';
import { _allowStateChangesInsideComputed } from 'mobx';



 function RoomsItem({rooms}){
   const navigate = useNavigate(); 

console.log(rooms._id)

    return (  
      
      <Col md={3} className='mt-5'  onClick={()=> { navigate(ROOMS_ROUTE+"/"+rooms._id)


      }}> 

          <Card style={{width: 500, height: 150, cursor: 'pointer'}} >
          
         <div>
         <h1> {rooms.title}</h1> 
            <h3>{rooms.discription}</h3>


            </div>

    
    
    </Card>
   </Col>
     
    )
}

export default RoomsItem