import React, { Component, Suspense, lazy } from "react";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  CardHeader,
  Spinner,
} from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import * as CaseActions from "./../../store/case/actions";
import { connect } from "react-redux";
import TrotlingBlocks from "./../StyledComponents/TrotlingBlocks";
import Tilt from "react-parallax-tilt";

import * as ModalActions from "./../../store/modal/actions";

import Combine from "./../../routes/combine";
import CaseBlock from "./CaseBlock";

class DashboardCases extends Component {
  state = {};
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

  renderCases = () => {
    const { cases } = this.props;
    return cases
      .filter((x) => x.Status === "ACTIVE")
      .sort(function (a, b) {
        return a.Case_LAST_CHANGED_DATE < b.Case_LAST_CHANGED_DATE;
      })
      .map((x, index) => (
        <Col key={x.Case_Number} lg={6}>
        
            <CaseBlock caseData={x} />
       
        </Col>
      ));
  };

  render() {
    const { cases, isInit } = this.props;
    const activeCasesLength = cases.filter((x) => x.Status === "ACTIVE").length;
    return (
      <>
        <Card className="home-cases-block">
          <CardHeader>
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="h4">Last Cases</h4>
              <div className="d-flex align-items-center justify-content-between">
                <NavLink to={Combine("ALL_CASES")}>
                  <Button className="d-flex align-items-center ld-button-info text-uppercase">
                    <i className="ri-add-line"></i> View All
                  </Button>
                </NavLink>
                <Button
                  className="d-flex align-items-center ld-button-warning text-uppercase ml-2"
                  onClick={() => this.props.showModal("NEW_CASE")}
                >
                  <i className="ri-add-line"></i> Create new
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
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
                    <div className="d-flex justify-content-center">
                      <Spinner/>
                    </div>
                  )}
                </Suspense>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
});

const mapStateToProps = (state) => ({
  cases: state.Case.cases,
  isLoading: state.Case.loading,
  isInit: state.Case.isInit,
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardCases);
