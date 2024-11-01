import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { connect } from "react-redux";
import SingelCase from "./SingelCase";
import PRIVILEGE from "../../services/privileges";
import { NavLink } from "react-router-dom";
// import { Button } from "bootstrap";

class AllCases extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "All cases", link: "#" },
    ],
  };

  render() {
    if(this.props.personeData === undefined)
            return (<></>);

    const pData = this.props.personeData;

    if(!PRIVILEGE.check("SHOW_CASES", pData))
      return(
        <>
          <div className="page-content">
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h2>You don't have permissions to see this page!</h2>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      );

    const {cases, status} = this.props
    let closed = cases.filter((x)=> x.Status === "CLOSED");
    let active = cases.filter((x)=> x.Status === "ACTIVE");
    return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="All Cases"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
<h5 className="mb-3">All Cases</h5>

             {PRIVILEGE.check("CREATE_CASE", pData) && (
               <>
                  <Row>
                  <Col lg={12}>
                    <Card>
                      <CardBody>
                        <NavLink to="/createcase">
                          <Button color="info" className="w-100">
                              Create New Case
                          </Button>
                        </NavLink>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                
               </>
                )}
           <Row>
              
              <Col lg={4}>
          
                  <Card>

                    <CardBody>
                  <h5 className="ml-3 mb-3">Active Cases</h5>
                    {active.length > 0 ? 
                      <>
                          {active.map(
                          ({
                            Case_id,
                            Case_Full_NAME,
                            Case_Short_NAME,
                            Case_Number,
                            DESCRIPTION,
                            CaseBg
                          }) => (
                            <Col lg={12} key={Case_id}>
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
                      </>
                      :
                      <>
                        <p style={{marginLeft: "20px"}}>Nothing to show</p>
                      </>
                    }
                    </CardBody>
                  </Card>
               
              </Col>
              <Col lg={4}>
               
                  <Card>
                    
                    <CardBody>
                    <h5 className="ml-3 mb-3">Closed Cases</h5>
                    {closed.length > 0 ? 
                      <>
                        {closed.map(
                          ({
                            Case_id,
                            Case_Full_NAME,
                            Case_Short_NAME,
                            Case_Number,
                            DESCRIPTION,
                            CaseBg
                          }) => (
                            <Col lg={12} key={Case_id}>
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
                      </>
                      :
                      <>
                        <p style={{marginLeft: "20px"}}>Nothing to show</p>
                      </>
                    }
                    </CardBody>
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
    cases: state.User.caseData.cases,
    status: state.User.CaseStatuses,
    personeData: state.User.persone,
  };
};
export default connect(mapStateToProps)(AllCases);
