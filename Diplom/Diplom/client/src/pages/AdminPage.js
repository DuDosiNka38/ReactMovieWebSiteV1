import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';

import { useState } from "react";
import CreateRoom from "./module/CreateRoom";




function AdminPage() {

    const [visibaleDevice, setvisibaleDevice] = useState(false)



    return (  
    
        <Container>
         <Col>
        <Row className="mt-5">
        <Button variant="secondary" onClick={()=> setvisibaleDevice(true)}>Create Room</Button>
        </Row>
        </Col>


        <CreateRoom show={visibaleDevice} onHide={() =>setvisibaleDevice(false)} /> 
               </Container>

    
    
    
    );
}

export default AdminPage