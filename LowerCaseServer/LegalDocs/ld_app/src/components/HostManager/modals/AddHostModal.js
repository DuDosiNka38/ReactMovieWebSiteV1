import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import * as ModalActions from "./../../../store/modal/actions";
import Toggle from "react-toggle";
import "react-toggle/style.css";

import { ipcRenderer } from "electron";

import notify from "./../../../services/notification";
import axios from "./../../../services/axios";

import "./../style.scss";
import "./../../../assets/scss/custom/modal.scss";

class AddHostModal extends Component {
  state = {
    host: null,
    alias: null,
    active: false,

    isValidHost: false,
  };

  handleInputChange = (e, val) => {
    const { name } = e.currentTarget;
    this.setState({ [name]: val });
  };

  handleToggle = (e, val) => {
    this.setState({ active: e.target.checked });
  };

  handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      const { isValidHost } = this.state;
      
      isValidHost ? this.addHost() : this.checkHost();
    }
  }

  addHost = () => {
    const hostData = { ...this.state };

    const result = ipcRenderer.sendSync("onAddHost", {
      host: hostData.host,
      alias: hostData.alias,
      active: hostData.active,
      ports: hostData.ports,
    });

    if (result.hasOwnProperty("_id")) {
      this.props.hideModal();
      notify.isSuck("Host successfully added to list! You can choose it and sign in!");
    } else {
      notify.isError(JSON.stringify(result));
    }
  };

  checkHost = async () => {
    let { host } = this.state;

    if (host) {
      // this.props.showModal("PROCESSING");
      if (host.indexOf("https://") === -1 && host.indexOf("http://") === -1) {
        host = "http://" + host;
      }

      if (host[host.length - 1] !== "/") host += "/";
      this.setState({host});
      ipcRenderer.send("onCheckHost", { host });
    }
  };

  componentDidMount() {
    ipcRenderer.on("onCheckHost", (event, args) => {
      const { checkResult } = args;

      if (checkResult.result) {
        this.setState({ isValidHost: true, ...checkResult.data });
        notify.isSuck("Host successfully checked! You can edit alias and save it!");
      } else {
        notify.isError("Typed host is wrong! Check it and try again!");
      }
      // this.props.hideModal("PROCESSING");
    });
  }

  render() {
    const { host, alias, active, isValidHost } = this.state;

    return (
      <>
        <Modal isOpen={true} centered={true} size="l">
          <ModalHeader toggle={this.props.hideModal} className="text-center">
            Add host
          </ModalHeader>
          <ModalBody>
            <AvForm className="form-horizontal">
              <FormGroup className="ld-form-group-custom">
                {isValidHost ? <span className="readonly-avfield-label">readonly</span> : ""}
                {isValidHost ? (
                  <i className="ri-check-line" style={{ color: "#1cbb8c" }}></i>
                ) : (
                  <i className="ri-server-line"></i>
                )}

                <Label htmlFor="host">Host</Label>
                <AvField
                  name="host"
                  value={host}
                  type="text"
                  className="form-control"
                  id="host"
                  validate={{ required: true }}
                  placeholder="Type host like http://myhostname.com:8080"
                  onChange={this.handleInputChange}
                  disabled={isValidHost}
                  onKeyPress={this.handleKeyPress}
                />
              </FormGroup>
              {isValidHost && (
                <>
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
                  <FormGroup className="toggle mb-4">
                    <Label htmlFor="host">Do you want to set this host as primary?</Label>
                    <div className="d-flex align-items-center">
                      <Label for={!active ? null : `is_active`} className="mb-0 mr-2" style={{cursor: "pointer"}}>No</Label>
                      <Toggle id="is_active" name="active" defaultChecked={active} icons={false} onChange={this.handleToggle} />
                      <Label for={active ? null : `is_active`} className="mb-0 ml-2" style={{cursor: "pointer"}}>Yes</Label>
                    </div>
                  </FormGroup>
                </>
              )}
            </AvForm>
          </ModalBody>
          <ModalFooter className= "mfooterGTO">
            {isValidHost ? (
              <Button className="ld-button-success"onClick={this.addHost}>
                Save host
              </Button>
            ) : (
              <Button className="ld-button-success" onClick={this.checkHost}>
                Check host
              </Button>
            )}
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
  showModal: (type) => dispatch(ModalActions.showModal(type)),
  hideModal: (type) => dispatch(ModalActions.hideModal(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddHostModal);
