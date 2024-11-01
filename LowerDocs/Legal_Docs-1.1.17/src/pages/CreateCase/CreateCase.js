import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import CreateCaseForm from "./CreateCaseForm";

class CreateCase extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "Create new case", link: "#" },
    ],
  };

  goTo = this.goTo.bind(this);

  goTo(page){
    this.props.history.push(page);
  }

  render() {
    return (
      <>
        <div className="">
          <Container fluid>
            {/* <Breadcrumbs
              title="Create new Case"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
<h5 className="mb-3">Create new Case</h5>

            <Row>
              <Col lg={12}>
                <CreateCaseForm goTo={this.goTo}/>
              </Col>
              {/* <Col lg={4}></Col> */}
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default CreateCase;
