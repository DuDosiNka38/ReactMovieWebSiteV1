import React, { Component } from "react";
import { Container, Card, CardBody, Row, Col, Button } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DirectorySettings from "./../../components/DirectorySettings/DirectorySettings";
import SynchronizationSettings from "./../../components/SynchronizationSettings/SynchronizationSettings";
class ElectronSettings extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "App Actions", link: "#" },
    ],
  };
  render() {
    return (
      <>
        <div className="page-content">
          <Container fluid>
            <h5 className="mb-3">Application Actions</h5>

            {/* <Breadcrumbs
              title="App Actions"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            <Row>
              <DirectorySettings> </DirectorySettings>
              <SynchronizationSettings></SynchronizationSettings>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default ElectronSettings;
