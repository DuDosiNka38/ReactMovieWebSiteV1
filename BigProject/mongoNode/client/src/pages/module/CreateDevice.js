
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Dropdown } from 'react-bootstrap';
import {useContext, useEffect, useState} from 'react';
import { Context } from "../..";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {createDevice, getBrands, getTypes} from "../../http/deviceApi";
import {observer} from "mobx-react-lite";
const CreateDevice = observer(({show, onHide}) => {

    const {device} = useContext(Context)

    useEffect(()=> {

        getTypes().then((data) => {
                device.setTypes(data)
                console.log(data)
            }
        )

        getBrands().then((data) => {
                device.setBrands(data)
                console.log(data)
            }
        )
    }, [])


    const [ name , setName] = useState("")
    const [price, setPrice] = useState(0)
    const [file, setFile] = useState(null)
    const [info, setInfo] = useState([])

 const addInfo = ()=>{
setInfo([...info, {title:'', discription:'', number:Date.now()} ])
 }


   


 const deleteInfo = (number)=>{
    setInfo(info.filter((i)=> i.number !== number))
     }

    const addDevice = () => {
        console.log("Work start")
        const formData = new FormData()
        formData.append('name', name)
        formData.append('price', `${price}`)
        formData.append('img', file)
        formData.append('brandId', device.selectedBrand._id)
        formData.append('typeId', device.selectedType._id)
        formData.append('info', JSON.stringify(info))

        console.log(formData)
        createDevice(formData).then(data => onHide())
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
          Create Device
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form >

           <Dropdown>
           <Dropdown.Toggle variant="success" id="dropdown-basic">
               {device.selectedType.name || "Type"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
       {device._types.map( e  =>
        <Dropdown.Item onClick={() => device.setSelectedType(e)} key={e.id}>{e.name} </Dropdown.Item>
       )}
      </Dropdown.Menu>
           </Dropdown>

           <Dropdown className='mt-2'>
           <Dropdown.Toggle variant="success" id="dropdown-basic">
               {device.selectedBrand.name || "Brand"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
       {device._brands.map( e  =>
        <Dropdown.Item onClick={() => device.setSelectedBrand(e)} key={e.id}>{e.name}</Dropdown.Item>
       )}
      </Dropdown.Menu>
           </Dropdown>


<Form.Control 
className='mt-3'
placeholder='Write a Title of a Device'
value={name}
onChange={e => setName(e.target.value)}

/>

<Form.Control 
className='mt-3'
placeholder='Write a Price '
type='number'
value={price}
onChange={e => setPrice(e.target.value)}
/>

<Form.Control 
className='mt-3'
type='file'
onChange={e => setFile(e.target.files[0])}
/>

<hr/>

<Button onClick={addInfo}>Add Information</Button>
{info.map(i => 

    <Row key={i.number}>
<Col>

<Form.Control 
className='mt-3'
placeholder='Write a Title of a Discription'
onChange={(e) => changeInfo('title', e.target.value, i.number)}
/>
</Col>

<Col>

<Form.Control 
className='mt-3'
placeholder='Write a  Discription'
onChange={(e) => changeInfo('discription', e.target.value, i.number)}/>
</Col>

<Col>

<Button variant='outline-danger'
className='mt-3'
onClick={() => deleteInfo(i.number)}
>
    Delete
</Button>
</Col>
    </Row>


)}


            </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>Close</Button>
        <Button variant="outline-info" onClick={addDevice}>Add</Button>
        </Modal.Footer>
      </Modal>
    
     
    
    );
});

export default CreateDevice