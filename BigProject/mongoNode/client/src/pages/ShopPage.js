
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import { useContext, useEffect } from "react";
import { Context } from "..";
import { getAllDevice, getBrands, getTypes } from "../http/deviceApi";
import { observer } from "mobx-react-lite";
import Pages from "../components/Pages";

const ShopPage =  observer(()=> {
const {device} = useContext(Context)

        console.log(device);
useEffect(()=>{

  getTypes().then((data)=>{
    device.setTypes(data)
    console.log(data)
  }

  )

  getBrands().then((data)=>{
    device.setBrands(data)
    console.log(data)
  }
  )

  getAllDevice(null, null, 1, 8).then((data)=>{

    device.setDevice(data.devices)

      device.setTotalCount(data.totalCount)

})},[])


        useEffect(() => {
            getAllDevice(device.selectedType._id, device.selectedBrand._id, 1, 8).then(data => {
                console.log("device",data)
                console.log("device",data)
                console.log("device",data)
                device.setDevice(data.devices)
                device.setTotalCount(data.totalCount)
            })
        }, [device.selectedType, device.selectedBrand])


        useEffect(() => {
            getAllDevice(device.selectedType._id, device.selectedBrand._id, device._page, 8).then(data => {
                console.log("device",data)
                console.log("device",data)
                console.log("device",data)
                device.setDevice(data.devices)
                device.setTotalCount(data.totalCount)
            })
        }, [device._page])



    return (  
       <Container>

<Row className="mt-5">

    <Col md ="3">
    <TypeBar/>
    </Col>

    <Col md="9">
    <BrandBar/>
 
  <DeviceList/>

        <Pages/>

    </Col>


</Row>

       </Container>
    
    
        );
}
)
export default ShopPage