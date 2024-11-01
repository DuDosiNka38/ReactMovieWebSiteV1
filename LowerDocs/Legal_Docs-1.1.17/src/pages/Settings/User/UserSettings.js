import React, { Component } from 'react';
import { Container, Row, Col, Card, CardText, CardBody} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import UserChangePassword from "../../../components/UserComponents/ChangePassword";
import AlersSettings from "./AlertsSettings";
import CalendarSettings from "./CalendarSettings"

class UserSettings extends Component {
  state = { 
    breadcrumbItems: [
      { title: "Legal Docs", link: "#" },
      { title : "Your Actions", link : "#" },
    ],
   }
  render() { 
    return ( 
      <>
       <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="Your Actions"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            <h5 className="mb-3">Your Actions</h5>

             <Row>
              <Col lg={3}>
                <Card body className="text-center">
                <div className="settingIconHolder">
                    <i className="ri-lock-2-line settingIcon"></i>
                  </div>
                  <CardBody>
                    <h5>Change Password</h5>
                    Here you can change your password.
                  </CardBody>
                  <CardText>

                  <UserChangePassword />
                  </CardText>
                </Card>
              </Col>
              {/* <Col lg={3}>
                <Card body className="text-center">
                <div className="settingIconHolder">
                    <i className="ri-notification-3-line settingIcon"></i>
                  </div> 
                <CardBody>
               
                    <h5>Activity Alert Settings</h5>
                    Here you can tune your activity alerts.
                  </CardBody>
                  <CardText>
                 <AlersSettings/>
                  </CardText>
                </Card>
              </Col> */}
              <Col lg={3}>
                <Card body className="text-center">
                <div className="settingIconHolder">
                    <i className="ri-calendar-todo-line settingIcon"></i>
                  </div> 
            
                <CardBody>
                    <h5>Change Default Calendar Layout</h5>
                    Here you can change your calendars layout.
                  </CardBody>
                  <CardText>
                 <CalendarSettings/>
                  </CardText>
                </Card>
              </Col>
              </Row>
            </Container>
            </div>
      </>
     );
  }
}
 
export default UserSettings;