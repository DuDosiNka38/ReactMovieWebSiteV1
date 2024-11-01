import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import PageHeader from "./../../components/PageHader/PageHeader";
import combine from "../../routes/combine";
import { NavLink } from "react-router-dom";
import ConnectingAnimation from "../../components/StyledComponents/CoonectingAnimation/ConnectingAnnimation";

class Admin extends Component {
  state = {};
  render() {
    return (
      <>
        <div className="page-content">
          <Container fluid>
            <PageHeader>Admin Tools</PageHeader>
            <Row>
              <Col lg={3}>
                <NavLink to={combine("ADMIN_TOOLS/ERRORS")}>
                  <div className="table-button tb-1 error-tb ctb">
                    <div className="d-flex w-100 h-100 align-items-center justify-content-between">
                      <div className="button-text">Errors</div>
                      <i
                        class=" ri-terminal-box-line
"
                      ></i>
                    </div>
                  </div>
                </NavLink>
              </Col>
              <Col lg={3}>
                <NavLink to={combine("ADMIN_TOOLS/USERS")}>
                  <div className="table-button tb-1  users-tb ctb">
                    <div className="d-flex w-100 h-100 align-items-center justify-content-between">
                      <div className="button-text">Users & Personnel</div>
                      <i
                        class="ri-group-line 
"
                      ></i>
                    </div>
                  </div>
                </NavLink>
              </Col>
              <Col lg={3}>
                <NavLink to={combine("ADMIN_TOOLS/DEPARTMENTS")}>
                  <div className="table-button tb-1 ctb dpt-tb ">
                    <div className="d-flex w-100 h-100 align-items-center justify-content-between">
                      <div className="button-text">Departments</div>
                      <i class=" ri-government-line"></i>
                    </div>
                  </div>
                </NavLink>
              </Col>
              <Col lg={3}>
                <div className="table-button tb-1 prv-tb ctb">
                  <div className="d-flex w-100 h-100 align-items-center justify-content-between">
                    <div className="button-text">Privileges</div>
                    <i class="ri-shield-user-line"></i>
                  </div>
                </div>
              </Col>
              <div className="w-100 my-1"></div>
              <Col lg={3}>
                <NavLink to={combine("ADMIN_TOOLS/CALENDARS")}>
                <div className="table-button tb-1 cal-tb ctb">
                  <div className="d-flex w-100 h-100 align-items-center justify-content-between">
                    <div className="button-text">Calendars</div>
                    <i class="ri-calendar-2-line"></i>
                  </div>
                </div>
                </NavLink>
              </Col>
              <Col lg={3}>
                <NavLink to={combine("ADMIN_TOOLS/ACTIVITY_TYPES")}>
                  <div className="table-button tb-1 act-tb ctb">
                    <div className="d-flex w-100 h-100 align-items-center justify-content-between">
                      <div className="button-text">Activity Types</div>
                      <i class=" ri-auction-line"></i>
                    </div>
                  </div>
                </NavLink>
              </Col>
              {/* <ConnectingAnimation/> */}
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
