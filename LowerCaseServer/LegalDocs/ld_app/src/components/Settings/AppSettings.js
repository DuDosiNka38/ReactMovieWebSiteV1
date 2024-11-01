import React, { Component } from "react";
import { Card, CardBody, CardHeader, Label, FormGroup, Button, Spinner } from "reactstrap";
import { AvField } from "availity-reactstrap-validation";
import { ipcRenderer } from "electron";
import { connect } from "react-redux";
import ParamsApi from "../../api/ParamsApi";

import * as ProgressModalActions from "./../../store/progress-modal/actions"

class AppSettings extends React.Component {
  state = {
    APP_DIR: null,

    APP_DIRS: [],

    isInit: false, 
  }

  selectAppDir = () => {
    const { APP_DIR } = this.state;
    const path = ipcRenderer.sendSync("select-dirs", {defaultPath: APP_DIR});
    
    if(path) {
      this.setState({APP_DIR: path[0]});
    }
  }

  saveAppDir = async () => {
    const { Person_id } = this.props.User;
    const { sysInfo, showProgressModal, hideProgressModal, updateProgressModal } = this.props;
    const Computer_id = sysInfo.os.hostname;
    const { isInit } = this.state;

    let _info = null;

    const { APP_DIR, APP_DIRS } = this.state;

    const Value = APP_DIRS;

    const CurrentComputerDirIndex =Value.findIndex((x) => x.Computer_id === Computer_id);
    if(CurrentComputerDirIndex !== -1){
      Value[CurrentComputerDirIndex].APP_DIR = APP_DIR;
    } else {
      Value.push({
        Computer_id,
        APP_DIR
      });
    }

    showProgressModal("SAVE_SETTINGS", { step: "IN_PROCESS" }, (data) => { _info = data; });

    if(APP_DIRS.length){
      const response = await ParamsApi.putUserParam({
        Parameter_name: "APP_DIR",
        Person_id,
        Value: JSON.stringify(Value)
      });
    } else {
      const response = await ParamsApi.postUserParam({
        Parameter_name: "APP_DIR",
        Person_id,
        Value: JSON.stringify(Value)
      });
    }

    // hideProgressModal("SAVE_SETTINGS");
    updateProgressModal({..._info, props: {..._info.props, step: "SUCCESS"}});
    
    setTimeout(() => hideProgressModal(_info), 1000);
  }

  setAppDir = async () => {
    const { Person_id } = this.props.User;
    const { sysInfo } = this.props;
    const Computer_id = sysInfo.os.hostname;

    const result = await ParamsApi.fetchUserParam(Person_id, "APP_DIR");

    if(result){
      const Value = JSON.parse(result.Value);
      const CurrentComputerDir = Value.find((x) => x.Computer_id === Computer_id);

      if(CurrentComputerDir){
        this.setState({APP_DIR: CurrentComputerDir.APP_DIR})
      }

      this.setState({APP_DIRS: Value})
    }    

    setTimeout(() => this.setState({isInit: true }), 1000);
  }
  
  componentDidUpdate(prevProps, prevState) {
    if(this.state.APP_DIR !== prevState.APP_DIR && this.state.isInit === true){
      this.saveAppDir();
    }

    if(prevProps.User !== this.props.User){
      this.setAppDir();
    }
  }

  render() {
    const { APP_DIR, isInit } = this.state;
    
    return (
      <>
        <Card>
          <CardHeader>App Settings</CardHeader>
          <CardBody className="w-100">
            {isInit
              ?
                (
                  <>
                    <FormGroup className="auth-form-group-custom ">
                      <Label>Local Data Storage Path</Label>
                      {/* <i className=" ri-time-line  auti-custom-input-icon"></i> */}
                      <i className="ri-folder-shield-2-line auti-custom-input-icon"></i>
                      <AvField
                        value={APP_DIR || "Click to choose Application Directory..."}
                        type="text"
                        name="APP_DIR"
                        readOnly={true}
                        placeholder="Click to choose Application Directory..."
                        onClick={this.selectAppDir}
                        className="cursor-pointer"
                        disabled={!isInit}
                        style={{color:"#5664d2"}}
                      ></AvField>
                    </FormGroup>
                  </>
                )
              : (
                  <>
                    <div className="d-flex align-items-center justify-content-center p-3">
                      <Spinner size="m"/>
                    </div>
                  </>
                )
            }
            
          </CardBody>
        </Card>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.User.data,
  sysInfo: state.Main.system,
});

const mapDispatchToProps = (dispatch) => ({
  showProgressModal: (type, props, cb) => dispatch(ProgressModalActions.showModal(type, props, cb)),
  hideProgressModal: ({type, props, _id}) => dispatch(ProgressModalActions.hideModal({type, props, _id})),
  updateProgressModal: ({type, props, _id}) => dispatch(ProgressModalActions.updateModal({type, props, _id})),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);
