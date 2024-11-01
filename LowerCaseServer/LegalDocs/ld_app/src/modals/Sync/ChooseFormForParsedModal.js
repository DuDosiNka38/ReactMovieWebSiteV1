import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";

import * as ModalActions from "../../store/modal/actions";
import * as CaseActions from "../../store/case/actions";
import * as PreloaderActions from "../../store/preloader/actions";
import Select from "react-select";

import notify from "../../services/notification";
import CaseApi from "../../api/CaseApi";
import SyncApi from "../../api/SyncApi";

class ChooseFormForParsedModal extends Component {
  state = {
    Form: null,
  };

  handleSelectChange = (val, el) => {
    const { name, action } = el;

    switch (action) {
      case "select-option":
        const { value } = val;
        this.setState({ [name]: value });
        break;

      case "clear":
        this.setState({ [name]: null });
        break;

      default:
        break;
    }
  };

  setFormForSelected = async () => {
    const { files, Preloader } = this.props;
    const { Form } = this.state;
    Preloader.show();

    const response = await SyncApi.putParsedFiles(files.map((x) => ({Person_id: x.Person_id, Computer_id: x.Computer_id, File_id: x.File_id, Form})));

    if(response){
      if (this.props.onSuccess) {
        this.props.onSuccess(this);
      }
    }
  
    this.props.hideModal();
    Preloader.hide();
  }

  componentWillUnmount() {
    if (this.props.onClose) {
      this.props.onClose(this);
    }
  }

  render() {
    const Doc_forms = this.props.Doc_forms || [];

    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="m">
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Choose Form
          </ModalHeader>
          <ModalBody
            className="w-100 confirm-modal"
          >
            <h5>Choose File Form for selected({this.props.files.length}) files</h5>
            <Label>File Form</Label>
            <Select
              placeholder={"Choose file form.."}
              isMulti={false}
              options={Doc_forms.map((x) => ({ value: x.Form, label: `${x.Form} | ${x.Description}` }))}
              closeMenuOnSelect={true}
              onChange={this.handleSelectChange}
              name="Form"
            />
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-success" type="submit" onClick={this.setFormForSelected}>Submit</Button>
            <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  Doc_forms: state.Documents.Doc_form,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  removeCase: (Case_Short_NAME) => dispatch(CaseActions.removeCase(Case_Short_NAME)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("ChooseFormForParsedModal")),
    hide: () => dispatch(PreloaderActions.hidePreloader("ChooseFormForParsedModal"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseFormForParsedModal);
