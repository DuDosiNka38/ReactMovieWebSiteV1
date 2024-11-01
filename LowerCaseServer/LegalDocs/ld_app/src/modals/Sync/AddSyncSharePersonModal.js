import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";
import * as PersonnelActions from "../../store/personnel/actions";

import notify from "../../services/notification";
import SyncApi from "../../api/SyncApi";
import AvCheckboxGroup from "availity-reactstrap-validation/lib/AvCheckboxGroup";
import AvCheckbox from "availity-reactstrap-validation/lib/AvCheckbox";
import notification from "../../services/notification";

class AddSyncSharePersonModal extends Component {
  state = {
    isMainChecked: false,
    chkBoxModel: [],
  };

  toggleOne = (e) => {
    let { chkBoxModel } = this.state;
    const { Personnel, syncShare } = this.props;
    const { value, checked, name } = e.currentTarget;
    const availablePersons = Personnel.filter((x) => !syncShare.filter((y) => y.Password !== null).map((y) => (y.Share_to_Person_id)).includes(x.Person_id));

    if (checked === false && chkBoxModel.indexOf(value) >= 0)
      chkBoxModel.splice(chkBoxModel.indexOf(value), 1);
    if (checked === true) chkBoxModel.push(value);
    this.setState({ chkBoxModel: chkBoxModel, isMainChecked: chkBoxModel.length === availablePersons.length });
  };

  toggleAll = (e) => {
    let { chkBoxModel } = this.state;
    const { Personnel, syncShare } = this.props;
    const { value, checked, name } = e.currentTarget;
    const availablePersons = Personnel.filter((x) => !syncShare.filter((y) => y.Password !== null).map((y) => (y.Share_to_Person_id)).includes(x.Person_id));

    chkBoxModel = [];
    if (checked === true) {
      availablePersons.map((x) => {
        chkBoxModel.push(x.Person_id);
      });
    }
    this.setState({ chkBoxModel: chkBoxModel, isMainChecked: checked });
  };

  addSyncSharePersons = async () => {
    const { Personnel, User } = this.props;
    const { chkBoxModel } = this.state;

    const Choosed_Persons = Personnel.filter((x) => chkBoxModel.includes(x.Person_id)).map((x) => ({Person_id: User.Person_id, Share_to_Person_id: x.Person_id}));

    if(Choosed_Persons.length === 0){
      notification.isError("You need to choose at least one person!");
      return false;
    }

    this.props.addSyncSharePersons(Choosed_Persons);
    this.props.hideModal();
  }

  componentDidMount() {
    this.props.fetchPersonnel();
  }

  render() {
    let { chkBoxModel, isMainChecked } = this.state;
    const { Share_to_Person_id, Personnel, syncShare } = this.props;
    const availablePersons = Personnel.filter((x) => !syncShare.filter((y) => y.Password !== null).map((y) => (y.Share_to_Person_id)).includes(x.Person_id));

    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="l">
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Share to persons
          </ModalHeader>
          <ModalBody
            className="w-100 scrollable-modal"
          >
            <AvForm>
              <AvCheckboxGroup name="existingPersons">
                <Table className="customTable">
                  <thead>
                    <tr>
                      <td>
                        <AvCheckbox customInput onChange={this.toggleAll} checked={isMainChecked} />
                      </td>
                      <td>Person Identifier</td>
                      <td>Name</td>
                      <td>E-mail Address</td>
                    </tr>
                  </thead>
                  <tbody>
                    {availablePersons.map((p) => (
                      <>
                        <tr>
                          <td>
                            <AvCheckbox 
                            customInput 
                            value={p.Person_id} 
                            onChange={this.toggleOne} 
                            checked={
                              chkBoxModel.includes(
                                p.Person_id
                                )
                              } 
                            />
                          </td>
                          <td>{p.Person_id}</td>
                          <td>{p.NAME}</td>
                          <td>{p.Email_address || "-"}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </AvCheckboxGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-success" type="submit" onClick={this.addSyncSharePersons}>Submit</Button>
            <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  Personnel: state.Personnel.personnel,
  
  syncShare: state.Sync.syncShare,
  User: state.User.data,
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchPersonnel: () => dispatch(PersonnelActions.personnelFetchRequested()),
  fetchSyncShare: (Person_id) => dispatch(SyncActions.syncShareFetchRequested(Person_id)),
  addSyncSharePersons: (persons) => dispatch(SyncActions.addSyncSharePersonRequested(persons)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSyncSharePersonModal);
