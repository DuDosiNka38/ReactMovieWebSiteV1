import AvField from "availity-reactstrap-validation/lib/AvField";
import AvForm from "availity-reactstrap-validation/lib/AvForm";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Table,
} from "reactstrap";
import Select from "react-select";
import * as ModalActions from "../../store/modal/actions";

class StartTimer extends Component {
  render() {
    const { cases, currentCase } = this.props;
    const casesOpts = cases.map((x) => ({label: x.Case_Full_NAME, value: x.Case_Short_NAME}));

    return (
      <Modal isOpen={true} centered={true} size="xl" style={{ width: "600px" }}>
        <ModalHeader
          className="d-flex align-items-center justify-content-center"
          style={{
            textTransform: "uppercase!important",
            fontSize: "24px!important",
            fontWeight: "100!important"
          }}
          toggle={this.props.hideModal}
        >
          <i className="ri-timer-line mr-2"></i> New Timer
        </ModalHeader>
        <ModalBody className="w-100">
          <AvForm onSubmit={this.addNewSchedule}>
            <FormGroup className="mb-4">
              <Label htmlFor="Computer_id">Description</Label>
              <AvField
                name="Computer_id"
                type="text"
                className="form-control"
                id="Computer_id"
              />
            </FormGroup>
            <FormGroup className="mb-4">
              <Label htmlFor="Computer_id">Case</Label>              
              <Select
                  name="Case_NAME"
                  options={casesOpts}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select Case"
                  onChange={this.handleMultiSelectChange}
                  defaultValue={currentCase ? casesOpts.find((x) => x.value === currentCase.Case_Short_NAME) : null}
                  // onChange={}
                />
            </FormGroup>
          </AvForm>
        </ModalBody>
        <ModalFooter className="mfooterGT">
          <Button
            className="ld-button-success"
            type="submit"
            onClick={this.setSyncSchedule}
          >
            START
          </Button>
          <Button
            className="ld-button-danger"
            type="submit"
            onClick={this.props.hideModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  cases: state.Case.cases,
  currentCase: state.Case.currentCase,
  sysInfo: state.Main.system,
  User: state.User.data
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartTimer);
