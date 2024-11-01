import React, { Component } from "react";
import { Container, Card, CardBody, Row, Col, Media, Spinner } from "reactstrap";
import { NavLink } from "react-router-dom";
import * as CaseActions from "../../store/case/actions";
import PageHeader from "./../../components/PageHader/PageHeader";
import { connect } from "react-redux";
import CaseApi from "./../../api/CaseApi";
import ReactTooltip from "react-tooltip";
import combine from "./../../routes/combine";
import CaseLog from "../../components/Case/CaseLog";
import * as ModalActions from "./../../store/modal/actions";
import CaseCalendar from "../../components/Calendar/CaseCalendar";

class SingleCase extends Component {
  state = {
    caseid: this.props.match.params.Case_Short_NAME,
    // casename: this.props.match.params.Case_Short_NAME,
    CaseData: [],
    DocsData: [],
    EventsData: [],
    show: "events",
    isInit: false,
  };

  combine = (...args) => {
    if (this.props.disableLinks) return "#";

    return combine(...args);
  };

  componentDidMount = async () => {
    const CaseData = await CaseApi.fetchSingleCase(this.state.caseid);
    this.setState({ CaseData, isInit: true });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const Case_Short_NAME = this.props.match.params.Case_Short_NAME;
    if (Case_Short_NAME !== this.state.caseid) {
      const CaseData = await CaseApi.fetchSingleCase(Case_Short_NAME);
      this.setState({ CaseData, caseid: Case_Short_NAME, isInit: true });
    }
  };

  render() {
    const showModal = (type, props) => this.props.showModal(type, props);
    const { CaseData, caseid, isInit } = this.state;

    return (
      <>
        <div className="page-content">
          <Container fluid>
            <PageHeader>Case {CaseData.Case_Full_NAME} </PageHeader>
            <Row>
              <Col lg={12}>
                <Card
                  className={`case-block`}
                  style={{
                    background: `linear-gradient(150deg, #fff 50%, ${CaseData.CaseBg} 100% `,
                  }}
                >
                  <CardBody className={`${this.props.class}`} className="caseCard FullCard">
                    {!isInit ? (
                      <>
                        <div className="d-flex h-100 justify-content-center align-items-center">
                          <Spinner className="mt-5"/>
                        </div>
                      </>
                    ) : (
                      <Media className="d-flex flex-column">
                        <div className="case-name d-flex align-items-center justify-content-between">
                          <div
                            className="case-name-link"
                            style={{ color: CaseData.CaseBg }}
                            title={CaseData.Case_Full_NAME}
                          >
                            {CaseData.Case_Full_NAME}
                          </div>
                          <div class="case-actions">
                            <div
                              onClick={() =>
                                showModal("MANAGE_CASE_PARTICIPANTS", {
                                  Case_Short_NAME: CaseData.Case_Short_NAME,
                                })
                              }
                              className="d-inline-flex case-settings mr-2"
                              title="Case Participants"
                            >
                              <i className="ri-user-settings-line"></i>
                            </div>
                            <div
                              className="d-inline-flex case-settings mr-2"
                              title="Case Settings"
                              onClick={() => showModal("SETTINGS_CASE", { CaseData: CaseData })}
                            >
                              <i className="ri-settings-5-line"></i>
                            </div>

                            <div className="d-inline-flex case-settings mr-2" title="Archive Case">
                              <i className=" ri-folder-zip-line"></i>
                            </div>

                            <NavLink
                              to="#"
                              onClick={() =>
                                showModal("DELETE_CASE", {
                                  Case_Short_NAME: CaseData.Case_Short_NAME,
                                })
                              }
                              className="d-inline-flex case-settings"
                              title="Delete Case"
                            >
                              <i class="ri-delete-bin-line"></i>
                            </NavLink>
                          </div>
                        </div>
                        <div className="case-desc mb-2">
                          {CaseData.DESCRIPTION || <i className="ri-subtract-line"></i>}
                        </div>
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="d-flex align-items-center">
                            <div className="case-type" title="Case Type">
                              {CaseData.Case_Type || <i className="ri-subtract-line"></i>}
                            </div>
                            <div className="case-number" title="Case Number">
                              <i className="ri-hashtag"></i>{" "}
                              {CaseData.Case_Number || <i className="ri-subtract-line"></i>}
                            </div>
                            <div className="ml-5 addBlock d-flex ">
                              <div className="mr-2" title="Add Event">
                                <div
                                  className="case-events d-flex align-items-center btn"
                                  title="Add Event"
                                  onClick={() =>
                                    showModal("ADD_EVENT", {
                                      Case_NAME: CaseData.Case_Short_NAME,
                                      Case_Full_NAME: CaseData.Case_Full_NAME,
                                    })
                                  }
                                >
                                  <i className="ri-calendar-event-line"></i> Add Event
                                </div>
                              </div>

                              <div
                                className="mr-2"
                                title="Add Document"
                                onClick={() =>
                                  showModal("ADD_DOC", {
                                    Case_NAME: CaseData.Case_Short_NAME,
                                    Case_Full_NAME: CaseData.Case_Full_NAME,
                                  })
                                }
                              >
                                <div className="case-events d-flex align-items-center btn" title="Add Document">
                                  <i className="ri-file-copy-2-line"></i> Add Document
                                </div>
                              </div>
                              <div className="mr-2" title="Add Event">
                                <div
                                  className="case-events d-flex align-items-center btn"
                                  title="Synchronize Data"
                                  onClick={() =>
                                    showModal("SYNCHRONIZATION", {
                                      Case_NAME: CaseData.Case_Short_NAME,
                                      Case_Full_NAME: CaseData.Case_Full_NAME
                                    })
                                  }
                                >
                                  <i className="ri-recycle-line"></i> Synchronize Data
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <NavLink
                              to={this.combine("CASE_EVENTS", {
                                Case_Short_NAME: CaseData.Case_Short_NAME,
                              })}
                              className="mr-2"
                              title="Case Events"
                            >
                              <div className="case-events d-flex align-items-center" title="Case Events">
                                <i className="ri-calendar-event-line"></i> Events: {CaseData.Case_Events_Count || "0"}
                              </div>
                            </NavLink>
                            <NavLink
                              to={this.combine("CASE_DOCUMENTS", {
                                Case_Short_NAME: CaseData.Case_Short_NAME,
                              })}
                              title="Case Documents"
                            >
                              <div className="case-docs d-flex align-items-center" title="Case Documents">
                                <i className="ri-file-copy-2-line"></i> Documents: {CaseData.Case_Docs_Count || "0"}
                              </div>
                            </NavLink>
                          </div>
                        </div>
                      </Media>
                    )}
                  </CardBody>
                  <ReactTooltip />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={8}>
                <CaseCalendar
                  Case_NAME={this.props.match.params.Case_Short_NAME}
                  Case_Full_NAME={CaseData.Case_Full_NAME}
                  history={this.props.history}
                />
              </Col>
              <Col lg={4}>
                <CaseLog />
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
});

const mapStateToProps = (state) => ({
  cases: state.Case.cases,
  isLoading: state.Case.loading,
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleCase);
