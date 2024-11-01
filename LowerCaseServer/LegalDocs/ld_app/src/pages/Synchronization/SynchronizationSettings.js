import React, { Component, Suspense } from "react";
import { Container } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHader/PageHeader";
import SyncShare from "../../components/Synchronization/SyncShare";
import SyncSchedule from "../../components/Synchronization/SyncSchedule";
import SyncShared from "../../components/Synchronization/SyncShared";

class SynchronizationSettings extends Component {
  state = {};

  render() {
    
    return (
      <>
        <div className="page-content">
          <Container fluid className="pageWithSearchTable">
            <PageHeader>Synchronization Settings</PageHeader>
            <SyncSchedule/>
            <SyncShare/>
            <SyncShared/>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SynchronizationSettings);
