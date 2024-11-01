import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardText,
  CardBody,
  Button,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import ErrorsSettings from "./Errors";
import * as actions from "../../../store/user/actions";
import axios from "./../../../services/axios";
import { connect } from "react-redux";
// import { Button } from 'bootstrap';
import { NavLink } from "react-router-dom";

class AdminSettings extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "Settings", link: "/admin/settings/" },
    ],
  };
  render() {
    return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="Admin Actions"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            <h5 className="mb-3">Admin Actions</h5>
            <Row className="d-flex">
              <Col lg={3}>
                <Card body className="text-center settings-card">
                  <div className="settingIconHolder">
                    <i className="ri-code-box-line settingIcon"></i>
                  </div>
                  <CardBody>
                    <h5>Error Descriptions</h5>
                    Here you can tune app errors descriptions.
                  </CardBody>
                  <CardText>
                    <ErrorsSettings />
                  </CardText>
                </Card>
              </Col>

              <Col lg={3}>
                <Card body className="text-center settings-card">
                  <div className="settingIconHolder">
                    <i className=" ri-group-line settingIcon"></i>
                  </div>
                  <CardBody>
                    <h5>Users Management</h5>
                    Here you can add new user, aspect user PC, edit user data, etc.

                  </CardBody>
                  <CardText>
                  <NavLink to="/usersmanagement" className="settings-btn">
                    <Button color="info" className="w-100">
                      
                        View
                    </Button>
                    </NavLink>

                  </CardText>
                </Card>
              </Col>

              <Col lg={3}>
                <Card body className="text-center settings-card">
                  <div className="settingIconHolder">
                    <i className="ri-government-fill settingIcon"></i>
                  </div>
                  <CardBody>
                    <h5>Departments</h5>
                    Here you can add and edit departments.
                  </CardBody>
                  <CardText>
                  <NavLink to="/departments" className="settings-btn">

                    <Button color="info" className="w-100">
                        View
                    </Button>

                      </NavLink>
                  </CardText>
                </Card>
              </Col>

              <Col lg={3}>
                <Card body className="text-center settings-card">
                  <div className="settingIconHolder">
                    <i className="ri-shield-user-fill settingIcon"></i>
                  </div>
                  <CardBody>
                    <h5>Privileges</h5>
                    Here you can add edit privileges
                  </CardBody>
                  <CardText>
                  <NavLink to="/priviliges" className="settings-btn">

                    <Button color="info" className="w-100">
                       View
                    </Button>

                      </NavLink>
                  </CardText>
                </Card>
              </Col>

              <Col lg={3}>
                <Card body className="text-center settings-card">
                  <div className="settingIconHolder">
                    <i className="ri-calendar-todo-line settingIcon"></i>
                  </div>
                  <CardBody>
                    <h5>Calendars</h5>
                    Here you can add and edit calendars
                  </CardBody>
                  <CardText>
                      <NavLink to="/calendars" className="settings-btn">
                    <Button color="info" className="w-100">

                       View
                    </Button>

                      </NavLink>
                  </CardText>
                </Card>
              </Col>

              <Col lg={3}>
                <Card body className="text-center settings-card">
                  <div className="settingIconHolder">
                    <i className=" ri-function-fill settingIcon"></i>
                  </div>
                  <CardBody>
                    <h5> Activity Types</h5>
                    Here you can add and edit activity types
                  </CardBody>
                  <CardText>
                      <NavLink to="/activity" className="settings-btn">
                    <Button color="info" className="w-100">

                       View
                    </Button>

                      </NavLink>
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

const mapStateToProps = (state) => {
  return {
    Core: state.User.globalData,
  };
};
const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminSettings);
