import React, { Component } from "react";
import { Media, Card, CardBody, Col, Row } from "reactstrap";
import * as CaseActions from "../../store/case/actions";
import { connect } from "react-redux";

class CaseCardForModal extends Component {
  state = {};

  render() {
    const { Cases, Case_Short_NAME } = this.props;
    const Case = Cases.find((x) => x.Case_Short_NAME === Case_Short_NAME) || {};

    return (
      <>
        <div className="case-card-for-modal mb-4" 
            style={{ background: `linear-gradient(150deg, #fff 50%, ${Case.CaseBg} 100% ` }}>
          <div
            className="case-name"
          >
            <label>Case</label>
            <h5 style={{ color: Case.CaseBg }}>{Case.Case_Full_NAME}</h5>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  Cases: state.Case.cases,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CaseCardForModal);
