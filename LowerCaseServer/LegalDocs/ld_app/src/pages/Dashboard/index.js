import React, { Component, Suspense, lazy } from "react";
import { Container, Card, CardBody, Row, Col, Button } from "reactstrap";
import DashboardCases from "./../../components/Case/DashboardCases";
import TrotlingBlocks from "./../../components/StyledComponents/TrotlingBlocks";
import * as CaseActions from "./../../store/case/actions";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHader/PageHeader";
import DashboardCalendar from "../../components/Calendar/DashboardCalendar";
import Calendar from "./../../components/Calendar/Calendar";
import EventsLog from "./../../components/EventsLog/EventsLog";
import * as PreloaderActions from '../../store/preloader/actions';
import KHuyamCalendar from "../../components/KHuyamCalendar";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.props.fetchUserCases();
  }

  componentDidMount() {
    if(this.props.location.state && this.props.location.state.from.pathname === "/signin"){
      this.props.hidePreloader('SIGN_IN_FORM');
    }
  }
  refreshPage = () => {
    let path = this.props.match.url
    this.props.history.push(path);
  }

  render() {
    return (
      <>
        <div className="page-content">
          <Container fluid>
            <PageHeader resreshPage  = {this.refreshPage}>Dashboard</PageHeader>
            <Row>
              <Col lg={8}>
                <DashboardCases />
              </Col>
              <Col lg={4}>
                <Suspense fallback={<TrotlingBlocks TRtype="line" />}>
                  <EventsLog />
                </Suspense>
              </Col>
              {/* <Col lg={8}>
                <Suspense fallback={<TrotlingBlocks TRtype="line" />}>
                  
                </Suspense>
              </Col> */}
            </Row>
            <DashboardCalendar history={this.props.history}/>
          </Container>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
  hidePreloader: (type) => dispatch(PreloaderActions.hidePreloader(type)),
});

const mapStateToProps = (state) => ({
  cases: state.Case.cases,
  isLoading: state.Case.loading,
  isInit: state.Case.isInit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
