import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import RoomsItem from "./RoomsItem";

const RoomsList = observer(() => {
    const {rooms} = useContext(Context)

console.log("Rooms Rooomf list",JSON.stringify(rooms._rooms))
let item = JSON.parse(JSON.stringify(rooms._rooms))

item.map(i =>
    console.log(i ,"sSdasdasdasdasd")
      )
    return (
        <Row className="d-flex" style={{ flexDirection: "column", alignContent: "center" }}>
            {item.map(i =>
                <RoomsItem key={i._id} rooms={i}/>
            )}
        </Row>
    );
});

export default RoomsList;