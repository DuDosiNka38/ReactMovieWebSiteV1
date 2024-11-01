import { useContext } from 'react';

import { Context } from '..';
import { observer } from "mobx-react-lite";
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';




const BrandBar = observer(()=> {
    const {device} = useContext(Context)
console.log(device)

    return (  
      <Row style={{ display: "flex", flexWrap: "wrap" }}>
      {

      device._brands.map((i) => 
      <Col key={i._id} className='d-flex justify-content-center align-text-center ' xs lg="2"> 
       <Card
         style={{cursor: "pointer"}}
         action="true" onClick={()=>device.setSelectedBrand(i)}
          bg={device.selectedBrand._id === i._id ? 'primary' : 'light'}
          text={device.selectedBrand._id === i._id ? 'light' : 'dark'}
          key={i._id}
          className="m-2"
          body
        >{i.name}</Card>
     
      
      
      
       </Col>
     
      )   

      }  
  
         </Row>
       
    
    )


   })
export default BrandBar