import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import * as ModalActions from "../../../store/modal/actions";
import Toggle from "react-toggle";
import "react-toggle/style.css";

import { ipcRenderer } from "electron";

import notify from "../../../services/notification";
import axios from "../../../services/axios";

import "./../style.scss";
import "./../../../assets/scss/custom/modal.scss";
import { filterObj } from "../../../services/Functions";

class EditHostModal extends Component {
  state = {};

  handleInputChange = (e, val) => {
    const { name } = e.currentTarget;
    this.setState({ [name]: val });
  };

  editHost = () => {
    const hostData = { ...this.state };

    const result = ipcRenderer.sendSync("onUpdateHost", {_id: hostData._id, set: filterObj(hostData, (v, i) => (i !== "_id" && i !== "active"))});

    if (result.hasOwnProperty("_id")) {
      this.props.showModal("HOSTS_SETTINGS");
      notify.isSuck("Host successfully updated!");
    } else {
      notify.isError(JSON.stringify(result));
    }
  };

  componentDidMount() {
    this.setState({ ...this.props.host });
  }

  render() {
    const { host, alias, active, timestamp, _id, ports } = this.state;
    return (
      <>
        <Modal isOpen={true} centered={true} size="xl" style={{ width: "500px" }}>
          <ModalHeader toggle={this.props.hideModal} className="text-center">
            Edit host
          </ModalHeader>
          <ModalBody>
            <AvForm className="form-horizontal">
              <FormGroup className="ld-form-group-custom">
                <i className="ri-server-line"></i>
                <Label htmlFor="host">Host</Label>
                <AvField
                  name="host"
                  value={host}
                  type="text"
                  className="form-control"
                  id="host"
                  validate={{ required: true }}
                  placeholder="Type host like http://myhostname.com:8080"
                  disabled={true}
                />
              </FormGroup>
              <FormGroup className="ld-form-group-custom mb-4">
                <i className="ri-links-line"></i>
                <Label htmlFor="host">Alias</Label>
                <AvField
                  name="alias"
                  value={alias}
                  type="text"
                  className="form-control"
                  id="alias"
                  placeholder={'Type host alias like "My Host"'}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter >
            <Button color="success" onClick={this.editHost}>
              Save host
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditHostModal);
