
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Dropdown } from 'react-bootstrap';
import {useContext, useState} from 'react';
import { Context } from "../..";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {createRoom} from "../../http/roomsApi";
import {observer} from "mobx-react-lite";
import { getAllUsers } from '../../http/userApi';


const CreateRoom = observer(({show, onHide}) => {

    const { user} = useContext(Context)
    const [name, setName] = useState("");
    const [discription, setDiscription] = useState("");
    const [members, setMembers] = useState([]);

    const [users, setUsers] = useState([]);

    const [userName, setUserName] = useState({});
  
  
    const addRoom = () => {
        console.log(userName)

        setMembers(members.map(item => ({
            ...item,
            _id: userName[item.number] || '' 
          })))
        console.log(members)

        let title = name
     createRoom(title, discription, JSON.stringify(members)).then(data => onHide())
    }



    const changeInfo = ( value, number) => {
        setMembers(members.map(i => i.number === number ? {...i, _id: value} : i))
        console.log(members)
        
    }


    const addMember = ()=>{
        if (user._isAuth && user._isAdmin) {
            getAllUsers().then(data => {
                setUsers(JSON.parse(JSON.stringify(data)));
            });
        }
      
        setMembers([...members, {_id:'', number: Date.now()} ])
         }


     
    


    const deleteMember = (number)=>{
        setMembers(members.filter((i)=> i.number !== number))
         }




        const Name =  (i)=>{
           
            const add = members.find((user) => (user.number=== i.number))
            return add ? add._id : "Unknown user";
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
          Create Room
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form >


<Form.Control 
className='mt-3'
placeholder='Write a Title of a Device'
value={name}
onChange={e => setName(e.target.value)}

/>

<Form.Control 
className='mt-3'
placeholder='Write a Discription '
value={discription}
onChange={e => setDiscription(e.target.value)}
/>



<hr/>

<Button onClick={addMember}>Add Members</Button>
{members.map(i => 

    <Row key={i.number} style={{ flexDirection: "column" , margin: "10px"}}>
        <hr/>
<Col>

<Dropdown>
           <Dropdown.Toggle variant="success" id="dropdown-basic">
           {Name(i)}
      </Dropdown.Toggle>
      <Dropdown.Menu>
       {users.map( e  =>
        <Dropdown.Item onClick={() => changeInfo(e._id, i.number)} key={e._id}>{e.name} </Dropdown.Item>
       )}
      </Dropdown.Menu>
           </Dropdown>
</Col>

<Col>

<Button variant='outline-danger'
className='mt-3'
onClick={() => deleteMember(i.number)}
>
    Delete
</Button>
</Col>
<hr/>
    </Row>


)}


            </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="outline-danger" onClick={onHide}>Close</Button>
        <Button variant="outline-info" onClick={addRoom}>Add</Button>
        </Modal.Footer>
      </Modal>
    
     
    
    );}) ;

export default CreateRoom