import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import EditableTables from "./DepartmentTable";
import PRIVILEGE from "../../services/privileges";

class Departments extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "Departments", link: "#" },
    ],
  };

  render() {
    if (this.props.personeData === undefined) return <></>;

    const pData = this.props.personeData;

    if (!PRIVILEGE.check("SHOW_DEPARTMENTS", pData))
      return (
        <>
          <div className="page-content">
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h5>You don't have permissions to see this page!</h5>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      );
    return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="Departments"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
<h5 className="mb-3">Departments</h5>
            
            <Row>
              <Col lg={12}>
                <Row>
                  {/* <Col lg={4}>
                  {PRIVILEGE.check("ADD_DEPARTMENT", pData) && 
                    <>
                      <Card body className="text-center">
                        <CardTitle className="mt-0">Add new department</CardTitle>
                        <CardText>
                          <AddDepartment/>
                        </CardText>
                      </Card>
                    </>
                  }
                  </Col> */}
                  <div className="w-100"></div>
                  <Col lg={12}>
                    <EditableTables />
                  </Col>
                </Row>
              </Col>
              <Col lg={4}></Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    personeData: state.User.persone,
  };
};
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Departments);
