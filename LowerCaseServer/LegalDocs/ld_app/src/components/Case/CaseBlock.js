import React, { Component } from "react";
import { Media, Card, CardBody, Col, Row } from "reactstrap";
import { NavLink } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import combine from "../../routes/combine";
import { connect } from "react-redux";
import Tilt from "react-parallax-tilt";

import * as ModalActions from "./../../store/modal/actions";


class CaseBlock extends Component {
  state = {
    showInfo: false,
  };

  combine = (...args) => {
    if(this.props.disableLinks)
      return "#";

    return combine(...args);
  }

  showModal = (...args) => {
    if(this.props.disableLinks)
      return false;

    this.props.showModal(...args);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.caseData !== prevProps.caseData){
      this.render();
    }
  }
  componentDidMount() {
    
  }
  render() {
    const { caseData } = this.props;

    return (
      <>
        <Card
          className={`case-block`}
          style={{ background: `linear-gradient(150deg, #fff 50%, ${caseData.CaseBg} 100% ` }}
        >
          {/* <Tilt  tiltEnable={true} > */}
          <CardBody className={`${this.props.class}`} className="caseCard">
            <Media className="d-flex flex-column">
              <div className="case-name d-flex align-items-center justify-content-between">
                <NavLink 
                  to={this.combine("SINGLE_CASE", {Case_Short_NAME: caseData.Case_Short_NAME})} 
                  className="case-name-link" 
                  style={{color: caseData.CaseBg}}
                  title={caseData.Case_Full_NAME}
                >
                  {caseData.Case_Full_NAME || <i className="ri-subtract-line"></i>}
                </NavLink>
                <div class="case-actions">
                  <NavLink to="#" onClick={() => this.showModal("MANAGE_CASE_PARTICIPANTS", {Case_Short_NAME: caseData.Case_Short_NAME})} className="d-inline-flex case-settings mr-2" title="Case Participants">
                    <i className="ri-user-settings-line"></i>
                  </NavLink>
                  <div onClick={() => this.showModal("SETTINGS_CASE", {CaseData: caseData})} className="d-inline-flex case-settings mr-2" title="Case Settings">
                    <i className="ri-settings-5-line"></i>
                  </div>
                  <NavLink to="#" onClick={() => this.showModal("DELETE_CASE", {Case_Short_NAME: caseData.Case_Short_NAME})}  className="d-inline-flex case-settings" title="Delete Case">
                    <i class="ri-delete-bin-line"></i>
                  </NavLink>
                </div>
              </div>
              <div className="case-desc mb-2">
                {caseData.DESCRIPTION || <i className="ri-subtract-line"></i>}
              </div>
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center">
                  <div className="case-type" title="Case Type">{caseData.Case_Type || <i className="ri-subtract-line"></i>}</div>
                  <div className="case-number" title="Case Number">
                    <i className="ri-hashtag"></i> {caseData.Case_Number || <i className="ri-subtract-line"></i>}
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <NavLink to={this.combine("CASE_EVENTS", { Case_Short_NAME: caseData.Case_Short_NAME })} className="mr-2" title="Case Events">
                    <div className="case-events d-flex align-items-center" title="Case Events">
                      <i className="ri-calendar-event-line"></i>{" "}
                      {caseData.Case_Events_Count || "0"}
                    </div>
                  </NavLink>
                  <NavLink to={this.combine("CASE_DOCUMENTS", { Case_Short_NAME: caseData.Case_Short_NAME })} title="Case Documents">
                    <div className="case-docs d-flex align-items-center" title="Case Documents">
                      <i className="ri-file-copy-2-line"></i> {caseData.Case_Docs_Count || "0"}
                    </div>
                  </NavLink>
                </div>
              </div>
            </Media>
          </CardBody>
          {/* </Tilt> */}
          <ReactTooltip />
        </Card>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
});

export default connect(null, mapDispatchToProps)(CaseBlock);