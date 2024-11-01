import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import DeviceItem from "./DeviceItem";

const DeviceList = observer(() => {
    const {device} = useContext(Context)

console.log("device list",device._devices)

    return (
        <Row className="d-flex">
            {device._devices.map(i =>

                <DeviceItem key={i._id} device={i}/>
            )}
        </Row>
    );
});

export default DeviceList;