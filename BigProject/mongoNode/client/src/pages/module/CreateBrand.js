
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useState} from "react";
import {createBrand} from "../../http/deviceApi";
function CreateBrand({show, onHide}) {

    const [brand, setBrand] = useState("");

    function create() {
        const data = createBrand(brand);
        console.log(brand);
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
          Create Brand
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="Name"
                placeholder="Brand Name"
                value={brand}
                onChange={e => setBrand(e.target.value)}
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

export default CreateBrand