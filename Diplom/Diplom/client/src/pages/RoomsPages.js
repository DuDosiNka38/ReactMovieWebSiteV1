
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useContext} from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import RoomsList from "../components/RoomsList";
import { getAllRooms } from "../http/roomsApi";


const RoomsPage =  observer(()=> {
const {user, rooms} = useContext(Context)

if (user._isAuth && user._isAdmin) {
    getAllRooms().then(data => {
        rooms.setRooms(JSON.parse(JSON.stringify(data)));
    });
}

if (user._isAuth && !user._isAdmin) {
   
        rooms.setRooms(JSON.parse(JSON.stringify(user._user.rooms)));
   
}






    return (  
       <Container>

<Row className="mt-5">

 
    <Col md="9">
       
        {user._isAuth ? <RoomsList/> : "You are not logged in"}

    </Col>


</Row>

       </Container>
    
    
        );
}
)
export default RoomsPage