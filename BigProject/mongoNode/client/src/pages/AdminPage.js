
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import CreateType from "./module/CreateType";
import { useState } from "react";
import CreateDevice from "./module/CreateDevice";
import CreateBrand from "./module/CreateBrand";



function AdminPage() {
    const [visibaleType, setvisibaleType] = useState(false)
    const [visibaleBrand, setvisibaleBrand] = useState(false)
    const [visibaleDevice, setvisibaleDevice] = useState(false)



    return (  
    
        <Container>
         <Col>
        <Row className="mt-5">
        <Button variant="secondary" onClick={()=> setvisibaleDevice(true)}>Create Device</Button>
        </Row>
        <Row className="mt-5">
        <Button variant="secondary" onClick={()=> setvisibaleBrand(true)}>Create Brand</Button>
        </Row>
        <Row className="mt-5">
        <Button variant="secondary" onClick={()=> setvisibaleType(true)}>Create Type</Button>
        </Row>
        </Col>

        <CreateType  show={visibaleType} onHide={() => setvisibaleType(false)} />
        <CreateBrand  show={visibaleBrand} onHide={() =>setvisibaleBrand(false)} />
        <CreateDevice  show={visibaleDevice} onHide={() =>setvisibaleDevice(false)} />
               </Container>

    
    
    
    );
}

export default AdminPage