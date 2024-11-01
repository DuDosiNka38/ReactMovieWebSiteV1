

import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from '../const';


 function DeviceItem({device}){
   const navigate = useNavigate(); 
 console.log(device)
 console.log("http://localhost:5000/" +device.img)

    return (  
      
      <Col md={3} className='mt-5'  onClick={()=> { navigate(DEVICE_ROUTE+"/"+device._id)


      }}> 

          <Card style={{width: 200, height: 350, cursor: 'pointer'}} >
       
       <Image width={200} height={200} src={ "http://localhost:5000/" +device.img}/>
         
         <div>
         <h4> {device.name}</h4> 
            <h3>{device.price}</h3>

            </div>

    
    
    </Card>
   </Col>
     
    )
}

export default DeviceItem