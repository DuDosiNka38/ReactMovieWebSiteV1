import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { connect } from "react-redux";
import SingelCase from "./../../pages/AllCases/SingelCase";
import PRIVILEGE from "../../services/privileges";
import { NavLink } from "react-router-dom";
class ClodesCases extends Component {
  state = {  }
  render() { 
    const {cases, status} = this.props
    let closed = cases.filter((x) => x.Status === "CLOSED");

    return ( 
      <>
      <Row>
      {closed.map(
                          ({
                            Case_id,
                            Case_Full_NAME,
                            Case_Short_NAME,
                            Case_Number,
                            DESCRIPTION,
                            CaseBg
                          }) => (
                            <Col lg={4} key={Case_id}>
                              <SingelCase
                                caseId={Case_id}
                                caseName={Case_Full_NAME}
                                shortName={Case_Short_NAME}
                                caseNumber={Case_Number}
                                clN = "bordered_prew"
                                description={DESCRIPTION}
                                bg={CaseBg}
                                showInfo={true}
                              />
                            </Col>
                          )
                        )}
      </Row>
      </>
     );
  }
}
 
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    status: state.User.CaseStatuses,
    personeData: state.User.persone,
  };
};
export default connect(mapStateToProps)(ClodesCases); ;