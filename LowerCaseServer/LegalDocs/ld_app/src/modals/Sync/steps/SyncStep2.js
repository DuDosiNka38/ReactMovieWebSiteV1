import React, { Component } from "react";
import {
  Button,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  Spinner,
  Progress,
} from "reactstrap";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import Select from "react-select";

import notify from "../../../services/notification";

import * as ModalActions from "./../../../store/modal/actions";
import * as SyncActions from "./../../../store/sync/actions";

import {
  convertBytesToNormal,
  getCurrentTimestamp,
  getSecondsToday,
  mapStep,
  secToTime,
} from "../../../services/Functions";
import "animate.css";
import SyncApi from "../../../api/SyncApi";

const ICONS = {
  file: (
    <>
      <i class="ri-file-2-line mr-2"></i>
    </>
  ),
  dir: (
    <>
      <i class="ri-folder-3-line mr-2"></i>
    </>
  ),
};

let INTERVAL = null;
class SyncStep2 extends Component {
  state = {
    lastChangeTime: 0,
    isInit: false,

    shownRecords: 0,
    showStep: 10,
    showLimit: 50,
    showPage: 1,

    isUploadStarts: false,

    totalRequests: null,
    currentRequest: null,

  };
  MAX = 15;

  MY_STATE = {
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
  };

  loadMore = () => {
    const { showPage } = this.state;

    this.setState({ showPage: showPage + 1 });
    this.stepRender();
  };

  stepRender = () => {
    if (INTERVAL !== null) {
      clearInterval(INTERVAL);
      this.setState({ shownRecords: 0 });
    }

    INTERVAL = setInterval(() => {
      let { tempArr } = this.MY_STATE;
      let { shownRecords, showStep, showLimit, showPage } = this.state;
      shownRecords =
        shownRecords + showStep > tempArr.length
          ? tempArr.length
          : shownRecords + showStep;

      this.setState({ shownRecords });

      if (shownRecords === showLimit * showPage) {
        clearInterval(INTERVAL);
        INTERVAL = null;
        return;
      }

      if (shownRecords === tempArr.length) {
        clearInterval(INTERVAL);
        INTERVAL = null;
        return;
      }
    }, 100);
  };

  setMyState = (data) => {
    this.MY_STATE = { ...this.MY_STATE, ...data };
    this.setState({ lastChangeTime: getCurrentTimestamp() });
  };

  removeItem = async (file) => {
    const { Total_New_Files, Total_New_Files_Size } = this.MY_STATE;
    const { User, sysInfo } = this.props;
    const { Person_id } = User;
    const Computer_id = sysInfo.os.hostname;
    const tempArr = [...this.MY_STATE.tempArr];
    console.log({ file });
    const result = ipcRenderer.sendSync("synchronization/removeItem", file);

    const i = tempArr.findIndex((x) => x.File_id === file.File_id);

    if (result && i !== -1) {
      tempArr.splice(i, 1);
      SyncApi.deleteSyncFile({ ...file, Person_id, Computer_id });
      this.setMyState({
        tempArr,
        Total_New_Files: Total_New_Files - 1,
        Total_New_Files_Size: tempArr[i]
          ? Total_New_Files_Size - tempArr[i].File_size
          : Total_New_Files_Size,
      });
    }
  };

  componentDidMount() {
    ipcRenderer.on("onSendDataToReact", (event, args) => {
      if (args) {
        this.setState({ isInit: true });
        const Upload_Files = args.New_Files.map((x) => ({
          File_id: x.File_id,
          File_dir: x.File_dir,
          File_ext: x.File_ext,
          File_name: x.File_name,
          File_size: x.File_size,
          File_uploaded_size: 0,
          File_uploaded_percents: 0,
        }));

        this.setMyState({
          ...args,
          Upload_Files,
          Start_File_Upload_Time: getCurrentTimestamp(),
        });

        const tempArr = [];
        Upload_Files.slice(0, this.MAX).map((e, i) => {
          tempArr[i] = e;
        });

        this.setMyState({ tempArr: Upload_Files });
        this.stepRender();
      }
    });

    ipcRenderer.on("onUploadStart", (event, args) => {
      const { Upload_Files, tempArr, currentIndex, Start_File_Upload_Time } =
        this.MY_STATE;

      let index = -1;
      if (
        (index = Upload_Files.findIndex((x) => x.File_id === args.File_id)) !==
        -1
      ) {
        if (currentIndex !== null) {
          let numEl = index + this.MAX;
          if (Upload_Files.length <= index + this.MAX) {
            numEl = Upload_Files.length;
          }
          Upload_Files.slice(index, numEl).map((e, i) => {
            tempArr[i] = e;
          });

          if (Start_File_Upload_Time === null)
            this.setMyState({ Start_File_Upload_Time: getCurrentTimestamp() });

          this.setMyState({ tempArr: tempArr.slice(0) });
        }

        this.setMyState({ currentIndex: index });
      }
    });

    ipcRenderer.on("onProgressChange", (event, args) => {
      const {
        tempArr,
        Total_Uploaded_Percent,
        Total_New_Files_Size,
        Total_Uploaded_Size,
        Start_File_Upload_Time,
      } = this.MY_STATE;
      let index = -1;
      if (
        (index = tempArr.findIndex((x) => x.File_id === args.File_id)) !== -1
      ) {
        const delta =
          args.File_uploaded_size - tempArr[index].File_uploaded_size;
        tempArr[index].File_uploaded_percents = args.File_uploaded_percents;
        tempArr[index].File_uploaded_size = args.File_uploaded_size;

        const Upload_Speed =
          (Total_Uploaded_Size + args.File_uploaded_size) /
          (getCurrentTimestamp() - Start_File_Upload_Time);

        this.setMyState({
          tempArr,
          // Total_Uploaded_Size: Total_Uploaded_Size + delta,
          Total_Uploaded_Percent:
            Total_Uploaded_Percent + (delta * 100) / Total_New_Files_Size,
          Upload_Speed,
          Remaining_Time:
            (Total_New_Files_Size -
              Total_Uploaded_Size -
              args.File_uploaded_size) /
            Upload_Speed,
        });

        this.props.UpdateProgress(
          Total_Uploaded_Percent + (delta * 100) / Total_New_Files_Size
        );
      }
    });

    ipcRenderer.on("onFileUploadFinish", (event, args) => {
      const { File_size } = args;
      const {
        tempArr,
        Total_Uploaded_Files,
        Total_Uploaded_Size,
        Total_New_Files_Size,
        Total_Uploaded_Percent,
      } = this.MY_STATE;
      let index = -1;
      if (
        (index = tempArr.findIndex((x) => x.File_id === args.File_id)) !== -1
      ) {
        const delta = File_size - tempArr[index].File_uploaded_size;
        this.setMyState({
          Total_Uploaded_Files: Total_Uploaded_Files + 1,
          Total_Uploaded_Size: Total_Uploaded_Size + File_size,
          Total_Uploaded_Percent:
            Total_Uploaded_Percent + (delta * 100) / Total_New_Files_Size,
          // Upload_Speed: File_size/(getCurrentTimestamp() - Start_File_Upload_Time)
        });

        this.props.UpdateProgress(
          Total_Uploaded_Percent + (delta * 100) / Total_New_Files_Size
        );
      }
    });

    ipcRenderer.on("onUploadEnd", (event, args) => {
      const { Total_New_Files, Total_New_Files_Size } = this.MY_STATE;

      // this.props.hideModal();
      this.props.showModal("SYNC_ENDS", {
        state: this.MY_STATE,
        onClose: () => this.props.hideModal(this.props.type),
      });

      this.setMyState({
        Total_Uploaded_Files: Total_New_Files,
        Total_Uploaded_Size: Total_New_Files_Size,
        Total_Uploaded_Percent: 100,
        tempArr: [],
        Upload_Speed: 0,
      });

      this.props.UpdateProgress(100);
    });

    ipcRenderer.on("onSendDataToDatabase/start", (event, args) => {
      this.setState({...args});
    });

    ipcRenderer.on("onSendDataToDatabase/step", (event, args) => {
      console.log({args})
      this.setState({...args});
    });

    ipcRenderer.on("onSendDataToDatabase/end", (event, args) => {
      setTimeout( () => this.setState({ isUploadStarts: true }), 300);
    });
  }

  render() {
    const { isInit, shownRecords, isUploadStarts, currentRequest, totalRequests } = this.state;
    const {
      tempArr,
      Total_New_Files,
      Total_Uploaded_Size,
      Total_New_Files_Size,
      Total_Uploaded_Percent,
      Total_Uploaded_Files,
      Upload_Speed,
      Remaining_Time,
      Upload_Files,
    } = this.MY_STATE;

    return (
      <>
        <div className="sync-step-block__header">
          <div className="sync-step-block__header-title">
            <div className="sync-step-block__header-title-step">Step 2</div>
            <div className="sync-step-block__header-title-step-text">
              Upload Files
            </div>
          </div>
        </div>
        <div className="sync-step-block__body">
          {isInit ? (
            <>
              <div className="warning-message">
                <i class="ri-error-warning-line"></i> Please, do not turn off
                your computer until process ends.
              </div>
              {!isUploadStarts ? (
                <>
                  <div className="info-message" style={{marginTop: "16px"}}>
                  <Spinner size="sm" className="mr-2"/> Saving scan data to database 
                  {totalRequests !== null && (
                    <>
                      &nbsp;({currentRequest} / {totalRequests})
                    </>
                  )}
                  </div>
                  
                </>
              ) : (
                <>
                <div className="sync-info-block upload-progress">
                  <div className="block-info w-100">
                    <div className="title d-flex align-items-center justify-content-between">
                      <div>Upload Progress</div>
                      <div>
                        {tempArr.length > 0
                          ? convertBytesToNormal(
                              Total_Uploaded_Size + tempArr[0].File_uploaded_size
                            )
                          : 0}{" "}
                        /{" "}
                        {Total_New_Files_Size
                          ? convertBytesToNormal(Total_New_Files_Size)
                          : 0}
                      </div>
                      <div>Remaining Time: {secToTime(Remaining_Time)}</div>
                    </div>
                    <div className="value">
                      <Progress animated value={Total_Uploaded_Percent}>
                        {Total_Uploaded_Percent.toLocaleString()} %
                      </Progress>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="text-left mt-2">
                        {Upload_Speed
                          ? `${convertBytesToNormal(Upload_Speed)}/s`
                          : " 0 Kb/s"}
                      </div>
                      <div>
                        {Total_Uploaded_Files} / {Total_New_Files || 0}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-block upload-table-container">
                  <div className="gridTable">
                    {tempArr.slice(0, shownRecords).map((x, i) => (
                      <div className="gTbody_row" key={i} row={i}>
                        <div className="gT_row_item">
                          {i > 0 && (
                            <Button
                              color="danger"
                              className="w-100"
                              onClick={() => this.removeItem(x)}
                            >
                              <i class="ri-close-line"></i> Remove
                            </Button>
                          )}
                        </div>
                        <div className="gT_row_item">{x.File_name}</div>
                        <div className="gT_row_item">{x.File_dir}</div>
                        <div className="gT_row_item">
                          {convertBytesToNormal(x.File_size)}
                        </div>
                        <div className="gT_row_item">
                          {convertBytesToNormal(x.File_uploaded_size)}
                        </div>
                        <div className="gT_row_item">
                          <div className="progress">
                            <div
                              className="progress-value"
                              style={{ width: `${x.File_uploaded_percents}%` }}
                            ></div>
                          </div>
                          <div className="progress-percents">
                            {x.File_uploaded_percents}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {shownRecords !== tempArr.length && (
                    <>
                      <Button
                        style={{ width: "100%", marginTop: "16px" }}
                        onClick={this.loadMore}
                      >
                        Load More
                      </Button>
                    </>
                  )}
                </div>
                    </>
              )}
            </>
          ) : (
            <>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "100px",
                  fontSize: "200px",
                  color: "#ffffff1c",
                }}
              >
                <i class="ri-forbid-line"></i>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  AuthHash: state.Main.auth_hash,
  cases: state.Case.cases,
  User: state.User.data,
  sysInfo: state.Main.system,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncStep2);
