
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useState} from "react";
import {createType} from "../../http/deviceApi";
function CreateType({show, onHide}) {

 const [type, setType] = useState("");
    console.log(123);
 function create() {
     const data = createType(type);
     console.log(123);
     onHide();



 }


    return (  

        <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header >
          <Modal.Title id="contained-modal-title-vcenter">
          Create Type
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="name"
                placeholder="Type"
                onChange={(e)=> setType(e.target.value)}
                value={type}
                autoFocus
              />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Close</Button>
          <Button variant="outline-info" onClick={create}>Add</Button>
        </Modal.Footer>
      </Modal>
    
     
    
    );
}

export default CreateType