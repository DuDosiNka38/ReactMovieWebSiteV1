import React, { Component } from "react";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from '../../../store/modal/actions';
import { ipcRenderer } from "electron";

class HostsSettingsModal extends Component {
  state = {
    Hosts: [],
  };

  setHostsList = () => {
    this.setState({ Hosts: ipcRenderer.sendSync("onGetHosts") });
  };

  deleteHost = (e) => {
    const id = e.currentTarget.getAttribute('attr-id');
    ipcRenderer.sendSync('onDeleteHost', {_id: id});
  }

  componentDidMount() {
    this.setHostsList();

    ipcRenderer.addListener('onHostsChange', this.setHostsList);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('onHostsChange', this.setHostsList);
  }

  render() {
    const { Hosts } = this.state;
    return (
      <>
        <Modal isOpen={true} centered={true} size="xl" style={{width:"700px"}}>
          <ModalHeader
            toggle={this.props.hideModal}
            className="text-center"
          >
            Hosts manager
          </ModalHeader>
          <ModalBody className="p-0">
            {Hosts.length > 0 
              ?
                <>
                  <Table className="customTable hostsManager mb-0">
                    <thead>
                      <tr>
                        <td></td>
                        <td>Host</td>
                        <td>Alias</td>
                        <td className="text-center">Current</td>
                      </tr>
                    </thead>
                    <tbody>
                      {Hosts.map((x) => (
                        <tr>
                          <td>
                          {x.active === false && (<i className="ri-close-line deleteHost" onClick={this.deleteHost} attr-id={x._id}></i>)}
                          <i className="ri-settings-5-line editHost" onClick={() => this.props.showModal("EDIT_HOST", {host: x})} attr-id={x._id}></i>
                          </td>
                          <td>{x.host}</td>
                          <td>{x.alias}</td>
                          <td className="text-center">{x.active ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              :
                <>
                  <p>Hosts list is empty. You can <a href="#" onClick={() => this.props.showModal("ADD_HOST")}>add new host</a> to start use application!</p>
                </>
            }
          </ModalBody>
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

export default connect(mapStateToProps, mapDispatchToProps)(HostsSettingsModal);
