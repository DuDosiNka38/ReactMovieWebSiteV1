import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table, Progress } from "reactstrap";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";
import {
  convertBytesToNormal,
  filterObj,
  getCurrentTimestamp,
  getSecondsToday,
  secToTime,
} from "../../services/Functions";
import SyncStep1 from "./steps/SyncStep1";
import SyncStep2 from "./steps/SyncStep2";
import SyncStep3 from "./steps/SyncStep3";
import SyncApi from "../../api/SyncApi";

class SynchronizationModal extends Component {
  state = {
    Upload_Files: [],
    currentIndex: null,
    tempArr: [],
    Total_Uploaded_Files: 0,
    Total_Uploaded_Size: 0,
    Total_Uploaded_Percent: 0,
    Upload_Speed: 0,
    Remaining_Time: 0,
    Start_File_Upload_Time: null,
    Stat: {
      Remove_Locations: [],
      New_Versions: [],
      Total_New_Files: 0,
      New_Locations: [],
      duplicateFiles: 0,
    },
    totalSize: 0,
    currentStep: "SCAN_DATA",
    // currentStep: "UPLOAD_DATA",
    SyncData: [],

    hasNotUploaded: false,

    progress: 0,
  };

  checkClose = (state) => {
    const { SyncData } = state;

    if(!SyncData.length){
      this.props.hideModal(this.props.type);
      return;
    }
  }

  isActiveStep = (step) => {
    const { currentStep } = this.state;
    return step === currentStep ? "active" : "disabled";
  }

  nextStep = (step) => {
    this.setState({currentStep: step});
    this.UpdateProgress(0);
  }

  checkNotUploadedFiles = async () => {
    const { User, sysInfo, notUploaded } = this.props;
    const {hostname:Computer_id} = sysInfo.os;

    const isBlocked = ipcRenderer.sendSync("isSyncBlocked", {});

    if(isBlocked) return;
    if(User.Person_id && !notUploaded){
      this.setState({hasNotUploaded: true})
      const syncedFiles = await SyncApi.fetchSyncedFiles(User.Person_id, Computer_id, {locations: true});
      
      const notUploaded = syncedFiles.filter((x) => x.Upload_dt === null);
      
      if(notUploaded.length){
        this.props.showModal("NOT_UPLOADED_FILES", {data: notUploaded});
      }
    } else {
      this.showSelectModal();  
    }
  }

  showSelectModal = () => {
    const { notUploaded, totalSize, Case_NAME, Case_Full_NAME } = this.props;
    
    this.props.showModal("MANUAL_SYNC", {
      onSyncStart: (data) => this.setState({...data}),
      onClose: () => this.props.hideModal(this.props.type),
      notUploaded,
      totalSize,
      Case_NAME,
      Case_Full_NAME
    });
  }

  async componentDidMount() {
    const {
      totalSize,
      SyncData,
    } = this.state;
    const { onMount } = this.props;
    if(onMount && typeof onMount === "function")
      onMount();
    // await this.checkNotUploadedFiles();
    this.showSelectModal();
  }

  UpdateProgress = (val) => {
    this.setState({progress: val});
  }

  render() {
    const {
      tempArr,
      Total_New_Files,
      Total_Uploaded_Size,
      Total_New_Files_Size,
      Total_Uploaded_Percent,
      Total_Uploaded_Files,
      Upload_Speed,
      Remaining_Time,
      currentIndex,
      Stat,
      totalSize,
      SyncData,
      currentStep,
      progress
    } = this.state;
    const { type, Case_NAME, Case_Full_NAME } = this.props;
    const { Remove_Locations, New_Versions, duplicateFiles, New_Locations } = Stat;

    const stepLable = {
      SCAN_DATA: "Scanning system...",
      UPLOAD_DATA: "Upload Files to Server..."
    }

    return (
      <>
        <div id={type} className="minimized-modal" style={{display: this.props.isMinimized ? "flex" : "none"}}>
          <div className="minimized-modal-content d-block w-100">
            <div className="w-100" style={{ fontSize: "14px" }}>
              {stepLable[currentStep]}
            </div>
            <Progress animated value={progress}>
              {progress.toLocaleString()} %
            </Progress>
          </div>
          <div className="minimized-modal-controls ml-4">
            <i
              className="ri-aspect-ratio-line mr-2"
              title="Maximize"
              onClick={() => this.props.maximizeModal(type)}
            ></i>
            {/* <i className="ri-close-line" title="Maximize" onClick={() => this.props.maximizeModal(type)}></i> */}
          </div>
        </div>
        <Modal
          isOpen={true}
          centered={true}
          className="sync-progress-modal fullscreen-modal overflow-hidden"
          size="xl"
          {...this.props.modalParams}
          backdrop={!this.props.isMinimized}
          zIndex={this.props.isMinimized ? -1000 : 1050}
          fade={!this.props.isMinimized}
          style={{display: this.props.isMinimized ? "none" : "block"}}
          wrapClassName={this.props.isMinimized ? "d-none" : ""}
          modalClassName={this.props.isMinimized ? "d-none" : ""}
          backdropClassName={this.props.isMinimized ? "d-none" : ""}
          contentClassName={this.props.isMinimized ? "d-none" : ""}
        >
          <ModalHeader
            className="d-block"
          >
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="title">
                Manual Synchronization
                {Case_NAME && (
                  <>
                    {`: ${Case_Full_NAME}`}
                  </>
                )}
              </div>
              <div className="buttons d-flex align-items-center">
                <i className="ri-subtract-line mr-2" title="Minimize Modal" onClick={() => this.props.minimizeModal(this.props.type)}></i>
                {/* <i className="ri-close-line" title="Close Modal" onClick={() => this.props.hideModal(this.props.type)}></i> */}
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="w-100 p-0">
            {!tempArr.length ? (
              <>
                <div className="d-flex justify-content-between" style={{height: "-webkit-fill-available", maxHeight: "-webkit-fill-available", overflow:"hidden"}}>
                  <div className={`sync-step-block scanning ${this.isActiveStep("SCAN_DATA")}`}>
                    <div className="sync-step-block__overlay"></div>  
                    <SyncStep1 totalSize={totalSize} SyncData={SyncData} onStepEnd={() => this.nextStep("UPLOAD_DATA")} UpdateProgress={this.UpdateProgress}/>                  
                  </div>
                  <div className={`sync-step-block upload ${this.isActiveStep("UPLOAD_DATA")}`}>
                    <div className="sync-step-block__overlay"></div>
                      <SyncStep2 UpdateProgress={this.UpdateProgress}/>
                  </div>
                  {/* <div className={`sync-step-block parse ${this.isActiveStep("PARSE_DATA")}`}>
                    <div className="sync-step-block__overlay"></div>
                    <SyncStep3 />
                  </div> */}
                  {/* <Table className="customTable flex-table upload-table mb-0 coloredTable">
                    <tbody>
                      {tempArr.map((x) => (
                        <>
                          <tr>
                            <td>{x.File_name}</td>
                            <td>{x.File_dir}</td>
                            <td>{convertBytesToNormal(x.File_size)}</td>
                            <td>{convertBytesToNormal(x.File_uploaded_size)}</td>
                            <td>
                              <div className="progress">
                                <div className="progress-value" style={{ width: `${x.File_uploaded_percents}%` }}></div>
                              </div>
                              <div className="progress-percents">{x.File_uploaded_percents}%</div>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </Table> */}
                </div>
              </>
            ) : (
              <>
                <div className="p-5 text-center w-100">
                  <h3>Preparing files to upload...</h3>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="lds-spinner">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  AuthHash: state.Main.auth_hash,
  sysInfo: state.Main.system,
  User: state.User.data,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  minimizeModal: (type) => dispatch(ModalActions.minimizeModal(type)),
  maximizeModal: (type) => dispatch(ModalActions.maximizeModal(type)),
  removeSyncSharePerson: (Share_to_Person_id) =>
    dispatch(SyncActions.removeSyncSharePersonRequested(Share_to_Person_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SynchronizationModal);
