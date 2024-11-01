import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "../../store/modal/actions";
import * as CaseActions from "../../store/case/actions";

import notify from "../../services/notification";
import CaseApi from "../../api/CaseApi";
import CaseCardForModal from "../../components/Case/CaseCardForModal";

class ManageCaseParticipantsModal extends Component {
  state = {};

  componentDidMount() {
    this.props.fetchCaseParticipants(this.props.Case_Short_NAME);
  }

  render() {
    const { Cases, Case_Short_NAME, isLoading, User } = this.props;
    const Case = Cases.find((x) => x.Case_Short_NAME === Case_Short_NAME) || {};
    const Case_Participants = Case.Case_Participants || [];
    return (
      <>
        <Modal isOpen={true} centered={true} className="new-case-modal" size="xl" style={{ width: "700px" }}>
          <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
            Manage Case Participants
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal manage-case-participants">
            <CaseCardForModal Case_Short_NAME={Case.Case_Short_NAME}/>

            <Table className="customTable">
              <thead>
                <tr>
                  <td></td>
                  <td>Person id</td>
                  <td>Role</td>
                  <td>Side</td>
                  <td>Date</td>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const p = Case_Participants.find((x) => x.Person_id === User.Person_id);

                  if(!p)
                    return null;

                  return (
                    <tr>
                      <td></td>
                      <td>
                        {p.Person_NAME}{" "}
                          <span
                            style={{color: "#c7c7c7"}}>
                            (you)
                          </span>
                      </td>
                      <td>{p.Role_Desc}</td>
                      <td>{p.Role_Desc === "Owner" ? "Office" : p.Side_Desc}</td>
                      <td>{new Date(p.Start_date).toLocaleString()}</td>
                    </tr>
                  )
                })()}
                
                {Case_Participants.filter((x) => x.Person_id !== User.Person_id).map((p) => (
                  <>
                    <tr>
                      <td>
                        <i className="ri-close-line" style={{cursor: "pointer"}} onClick={() => {this.props.showModal("CP_DELETE_CASE_PARTICIPANT", {...p})}}></i>
                      </td>
                      <td>
                        {p.Person_NAME}{" "}
                        {p.Person_id === User.Person_id && (
                          <span
                            style={{color: "#c7c7c7"}}>
                            (you)
                          </span>
                        )}
                      </td>
                      <td>{p.Role_Desc}</td>
                      <td>{p.Role_Desc === "Owner" ? "Office" : p.Side_Desc}</td>
                      <td>{new Date(p.Start_date).toLocaleString()}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter className="p-0  mfooterG">
            <Button
              className="ld-button-info  border-0 m-0"
              onClick={() => this.props.showModal("CP_CHOOSE_EXISTING_PERSON", { Case_Short_NAME })}
            >
              Choose An Existing
            </Button>
            <Button
              className="ld-button-warning  border-0 m-0"
              onClick={() => this.props.showModal("CP_ADD_NEW_PERSON", { Case_Short_NAME })}
              // , refModal: {type: "MANAGE_CASE_PARTICIPANTS", data: {Case_Short_NAME}}
            >
              Add New
            </Button>
            <Button className="ld-button-danger  border-0 m-0" onClick={this.props.hideModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.User.data,
  Cases: state.Case.cases,
  isLoading: state.Case.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchCaseParticipants: (Case_NAME) => dispatch(CaseActions.caseParticipantsFetchRequested(Case_NAME)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageCaseParticipantsModal);
