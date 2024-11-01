import React, { Component } from "react";

import { Row, Col, Container, CardTitle, CardText, Card } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import UserChangePassword from "./../../components/UserComponents/ChangePassword";
import AlersSettings from "../Settings/User/AlertsSettings";

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "Legal Docs", link: "/general" },
        { title: "User Settings", link: "/" },
      ],
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title=""
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}

            <h5 className="mb-3">Settings</h5>

            <Row>
              <Col lg={3}>
                <Card body className="text-center">
                  <div className="settingIconHolder">fdfdsf
                    <i className="ri-lock-2-line settingIcon"></i>
                  </div>
                  <CardText>
                    <UserChangePassword />
                  </CardText>
                </Card>
              </Col>
              <Col lg={3}>
                <Card body className="text-center">
                  <CardText>
                    <AlersSettings />
                  </CardText>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default UserSettings;
