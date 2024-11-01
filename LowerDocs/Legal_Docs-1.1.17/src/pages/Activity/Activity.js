import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ActivityTable from "./ActivityTable";

import PRIVILEGE from "../../services/privileges";

class Activity extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "Activity Types", link: "#" },
    ],
  };
  render() {
    if (this.props.personeData === undefined) return <></>;

    const pData = this.props.personeData;

    if (!PRIVILEGE.check("SHOW_ACTIVITY_TYPES", pData))
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
            <Row>
              {PRIVILEGE.check("ADD_ACTIVITY_TYPE", pData) && (
                <>
                  {/* <Col lg={4}>
              <Card body className="text-center">
                          <CardTitle className="mt-0">Add new activity</CardTitle>
                          <CardText>
                            <AddActivityType/>
                          </CardText>
                        </Card>
              </Col> */}
                </>
              )}
              <div className="w-100"></div>
              <Col lg={12}>
                <ActivityTable />
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
    personeData: state.User.persone,
  };
};
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
