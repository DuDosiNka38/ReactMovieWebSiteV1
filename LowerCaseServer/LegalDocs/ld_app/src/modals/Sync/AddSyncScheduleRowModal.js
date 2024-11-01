import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Input, Table } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";

import notify from "../../services/notification";
import SyncApi from "../../api/SyncApi";
import Select from "react-select";

import { isHasEmptyFields } from "./../../services/FormChecker"
import notification from "../../services/notification";

const customSelectStyles = {
  menuList: (provided, state) => ({
    ...provided,
    maxHeight: "120px",
  }),
};

class AddSyncScheduleRowModal extends Component {
  state = {
    Directories: [],
    Sync_time: `${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(2,0)}:00`,
    Sync_days: null,
  };

  selectDir = () => {
    const { Directories } = this.state;
    const response = ipcRenderer.sendSync("select-sync-dirs", { props: ["multiSelections", "openDirectory"] });
    if (response !== null) {
      response.dirs.forEach((element) => {
        Directories.push(element);
      });

      this.setState({ Directories });
    }
  };

  deletePath = (index) => {
    const { Directories } = this.state;
    Directories.splice(index, 1);
    this.setState({ Directories });
  }

  handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  handleMultiSelectChange = (values, el) => {
    const { name, action } = el;
    
    switch(action){
      case 'select-option':
        this.setState({[name]: [...values.map((x) => (x.value))]});
        break;

      case 'clear':
        this.setState({[name]: null});
        break;

      default:
        const val = [...values.map((x) => (x.value))];
        this.setState({[name]: val.length > 0 ? val : null});
        break;
    }  
  }

  setSyncSchedule = async () => {
    const { sysInfo, User } = this.props;
    const syncScheduleData = this.state;

    if(isHasEmptyFields(syncScheduleData)){
      if(syncScheduleData.Directories.length === 0){
        notification.isError("You need to select folders for synchronization!");
        return false;
      }

      if(!syncScheduleData.Sync_days){
        notification.isError("You need to select days for synchronization!");
        return false;
      }
      return false;
    }

    syncScheduleData.Person_id = User.Person_id;
    syncScheduleData.Computer_id = sysInfo.os.hostname;
    syncScheduleData.Sync_days = JSON.stringify(syncScheduleData.Sync_days);

    await this.props.setSyncSchedule(syncScheduleData);
    
    this.props.hideModal();
  }

  render() {
    const { Share_to_Person_id, DAYS, sysInfo } = this.props;
    const { Directories } = this.state;
    
    return (
      <>
        <Modal isOpen={true} centered={true} className="delete-case-modal" size="xl" style={{ width: "600px" }}>
          <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
            Delete Person from Share
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal">
            <AvForm onSubmit={this.addNewSchedule}>
              <FormGroup className="auth-form-group-custom mb-4">
                <i class="ri-computer-line auti-custom-input-icon"></i>
                <Label htmlFor="Computer_id">Computer id</Label>

                <AvField
                  name="Computer_id"
                  value={sysInfo.os.hostname}
                  type="text"
                  className="form-control"
                  id="Computer_id"
                  readonly
                  disabled
                />
              </FormGroup>
              <Table className="customTable">
                <thead>
                  <tr>
                    <td style={{ width: "40px" }}></td>
                    <td>Directory Path</td>
                  </tr>
                </thead>
                <tbody>
                  {Directories.map((x, i) => (
                    <>
                      <tr>
                        <td style={{ width: "40px" }}>
                          <i
                            class="ri-close-line removeSyncScheduleRow"
                            onClick={() => this.deletePath(i)}
                            title="Remove Directory"
                          ></i>
                        </td>
                        <td>{x}</td>
                      </tr>
                    </>
                  ))}

                  <tr>
                    <td colSpan={2} onClick={this.selectDir} className="table-button">
                      <div className="d-flex w-100 h-100 align-items-center justify-content-center">
                      <i class="ri-folder-add-line mr-2"></i> Add more
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <FormGroup className="auth-form-group-custom mb-4">
                <i className=" ri-time-line auti-custom-input-icon"></i>
                <Label htmlFor="username">Synchronization time</Label>
                <Input
                  className="form-control w-100"
                  type="time"
                  defaultValue={`${`${new Date().getHours()}`.padStart(2, 0)}:${`${new Date().getMinutes()}`.padStart(
                    2,
                    0
                  )}:00`}
                  id="example-time-input"
                  name="Sync_time"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup className=" mb-4">
                <Label>Synchronization days</Label>
                <Select
                  name="Sync_days"
                  isMulti={true}
                  options={DAYS}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select days"
                  closeMenuOnSelect={false}
                  onChange={this.handleMultiSelectChange}
                  menuPlacement="top"
                  styles={customSelectStyles}
                  // onChange={}
                />
              </FormGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-success" type="submit" onClick={this.setSyncSchedule}>
              Submit
            </Button>
            <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  sysInfo: state.Main.system,
  User: state.User.data
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  setSyncSchedule: (data) => dispatch(SyncActions.setSyncScheduleFetchRequested(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSyncScheduleRowModal);
