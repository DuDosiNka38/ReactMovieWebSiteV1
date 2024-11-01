import React, { Component, Suspense, lazy } from "react";
import { Container, Card, CardBody, Row, Col, Button } from "reactstrap";
import * as CaseActions from "../../store/case/actions";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import TrotlingBlocks from "./../../components/StyledComponents/TrotlingBlocks"

import * as ModalActions from "./../../store/modal/actions";

import Combine from "./../../routes/combine";
import CaseBlock from "../../components/Case/CaseBlock";
import PageHeader from "../../components/PageHader/PageHeader";

class Cases extends Component {
  state = {};

  componentDidMount= async() =>  {
    // const EventsData = await EventsApi.fetchEvents();
    // this.setState({ EventsData });
  }

  renderCases = () => {
    const { cases } = this.props;
    return cases
      .filter((x) => x.Status === "ACTIVE")
      .sort(function (a, b) {
        return a.Case_LAST_CHANGED_DATE < b.Case_LAST_CHANGED_DATE;
      })
      .map((x, index) => (
        <Col key={x.Case_Number} lg={4}>
        
            <CaseBlock caseData={x} />
       
        </Col>
      ));
  };

  createCase = () => (
    <Col>
      <p className="d-flex align-items-center mb-0">
        <i className="ri-briefcase-line mr-2"></i> Cases list is unset. Do you
        want to{" "}
        <NavLink
          to=""
          onClick={() => this.props.showModal("NEW_CASE")}
          className="ml-1"
        >
          Create New
        </NavLink>
        ?
      </p>
    </Col>
  );

  render() {
    const { cases, isLoading, isInit } = this.props;
    const activeCasesLength = cases.filter((x) => x.Status === "ACTIVE").length;
    
    return (
      <>
        <div className="page-content">
          <Container fluid>
            <PageHeader>Active Cases</PageHeader>
          <Row>
              <Col lg={12}>
                <Suspense fallback={<TrotlingBlocks TRtype="line" />}>
                  {isInit ? (
                    activeCasesLength > 0 ? (
                      <>
                        <Row>{this.renderCases()}</Row>
                      </>
                    ) : (
                      this.createCase()
                    )
                  ) : (
                    <TrotlingBlocks TRtype="line" />
                  )}
                </Suspense>
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
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

});

const mapStateToProps = (state) => ({
  cases: state.Case.cases,
  isLoading: state.Case.loading,
  isInit: state.Case.isInit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Cases);
