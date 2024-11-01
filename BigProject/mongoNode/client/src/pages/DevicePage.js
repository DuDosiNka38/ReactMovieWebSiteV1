
import { useEffect, useState } from "react";
import { Container, Row, Image,Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getOneDevice } from "../http/deviceApi";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function DevicePage() {

     const [device, setDevice] = useState({discription: []});

     const {id} = useParams();
     useEffect( () => {
         getOneDevice(id).then(data => setDevice(data))


     }, [])

console.log(device)

    return (  
    <Container className="mt-3 p-0" fluid="md">
        <Row>
            <Col md={6}>
                <Image width={500} height={400} src={"http://localhost:5000/" + device.img}/>
            </Col>
            <Col md={2}>
                <Card
                    className="d-flex flex-column align-items-center justify-content-around"
                    style={{ width: 300, height: 300, fontSize: 32, border: '5px solid lightgray'}}
                >
                    <h2>{device.name}</h2>
                    <h3>from  {device.price} $</h3>
                    <Button variant={"outline-dark"}>Add to Backet</Button>
                </Card>
            </Col>
        </Row>
        <Row className="d-flex flex-column m-3">
            <h1>  Fetures</h1>
     { device.discription.map((info, index) =>
         <Row key={info.id} style={{ fontSize: 18,  background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
             {info.title}: {info.discription}
         </Row>

        ) }
</Row>

    </Container>
 

     );
}

export default DevicePage