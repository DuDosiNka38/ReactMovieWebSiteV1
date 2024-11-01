
import { useContext } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Context } from '..';
import { observer } from "mobx-react-lite";



const TypeBar = observer(()=> {
    const {device} = useContext(Context)
const a = false

    return (  
 
       <ListGroup>
    {
      device.types.length !== 0 ?
    device.types.map((i) => 
    <ListGroup.Item key={i._id} active ={ device.selectedType._id === i._id} action onClick={()=>device.setSelectedType(i)}> {i.name} </ListGroup.Item>
   
    )   
    :
    <ListGroup.Item > Ничего нет </ListGroup.Item>
    }  

       </ListGroup>
     
    
    
        );
})

export default TypeBar