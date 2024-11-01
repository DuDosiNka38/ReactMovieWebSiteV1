import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table, Col, Row, Progress } from "reactstrap";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";

import notify from "../../services/notification";
import SyncApi from "../../api/SyncApi";

import { convertBytesToNormal, filterObj, getCurrentTimestamp, getSecondsToday, secToTime } from "../../services/Functions";

const MAX = 15;

class ManualSyncModal extends Component {
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
  };

  componentDidMount() {
    if (this.props.state) {
      const Upload_Files = this.props.state.New_Files.map((x) => ({
        File_id: x.File_id,
        File_dir: x.File_dir,
        File_ext: x.File_ext,
        File_name: x.File_name,
        File_size: x.File_size,
        File_uploaded_size: 0,
        File_uploaded_percents: 0,
      }));

      this.setState({
        ...this.props.state,
        Upload_Files,
        Start_File_Upload_Time: getCurrentTimestamp(),
      });

      const tempArr = [];
      Upload_Files.slice(0, MAX).map((e, i) => {
        tempArr[i] = e;
      });

      // for(let i = 1; i < 10; i++){
      //   tempArr[i] = tempArr[0];
      // }

      this.setState({ tempArr });

      const { Stat } = this.state;
      filterObj(this.props.state, (v, i, o) => {
        if(Stat[i]){
          Stat[i] = v;
        }
      })
  
      this.setState({ Stat });
    }

    ipcRenderer.on("onUploadStart", (event, args) => {
      const { Upload_Files, currentIndex, Start_File_Upload_Time } = this.state;
      const tempArr = [];
      let index = -1;
      if ((index = Upload_Files.findIndex((x) => x.File_id === args.File_id)) !== -1) {
        if (currentIndex !== null) {
          let numEl = index + MAX;
          if (Upload_Files.length <= index + MAX) {
            numEl = Upload_Files.length;
          }
          Upload_Files.slice(index, numEl).map((e, i) => {
            tempArr[i] = e;
          });

          if (Start_File_Upload_Time === null) this.setState({ Start_File_Upload_Time: getCurrentTimestamp() });

          this.setState({ tempArr });
        }

        this.setState({ currentIndex: index });
      }
    });

    ipcRenderer.on("onProgressChange", (event, args) => {
      const { tempArr, Total_Uploaded_Percent, Total_New_Files_Size, Total_Uploaded_Size, Start_File_Upload_Time } =
        this.state;
      let index = -1;
      if ((index = tempArr.findIndex((x) => x.File_id === args.File_id)) !== -1) {
        const delta = args.File_uploaded_size - tempArr[index].File_uploaded_size;
        tempArr[index].File_uploaded_percents = args.File_uploaded_percents;
        tempArr[index].File_uploaded_size = args.File_uploaded_size;

        const Upload_Speed =
          (Total_Uploaded_Size + args.File_uploaded_size) / (getCurrentTimestamp() - Start_File_Upload_Time);

        this.setState({
          tempArr,
          // Total_Uploaded_Size: Total_Uploaded_Size + delta,
          Total_Uploaded_Percent: Total_Uploaded_Percent + (delta * 100) / Total_New_Files_Size,
          Upload_Speed,
          Remaining_Time: (Total_New_Files_Size - Total_Uploaded_Size - args.File_uploaded_size) / Upload_Speed,
        });
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
        Start_File_Upload_Time,
      } = this.state;
      let index = -1;
      if ((index = tempArr.findIndex((x) => x.File_id === args.File_id)) !== -1) {
        const delta = File_size - tempArr[index].File_uploaded_size;
        this.setState({
          Total_Uploaded_Files: Total_Uploaded_Files + 1,
          Total_Uploaded_Size: Total_Uploaded_Size + File_size,
          Total_Uploaded_Percent: Total_Uploaded_Percent + (delta * 100) / Total_New_Files_Size,
          // Upload_Speed: File_size/(getCurrentTimestamp() - Start_File_Upload_Time)
        });
      }
    });

    ipcRenderer.on("onUploadEnd", (event, args) => {
      const { Total_New_Files, Total_New_Files_Size } = this.state;

      this.props.hideModal();
      this.props.showModal("SYNC_ENDS", { state: this.state });

      this.setState({
        Total_Uploaded_Files: Total_New_Files,
        Total_Uploaded_Size: Total_New_Files_Size,
        Total_Uploaded_Percent: 100,
        tempArr: [],
        Upload_Speed: 0,
      });
    });
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
    } = this.state;
    const { type } = this.props;
    const {  Remove_Locations, New_Versions, duplicateFiles, New_Locations } = Stat;

    return this.props.isMinimized ? (
      <>
        <div id={type} className="minimized-modal">
          <div className="minimized-modal-content d-block w-100">
            <div className="w-100" style={{ fontSize: "14px" }}>
              Uploading Files
              {tempArr.length && (
                <>
                  {" "}
                  {Total_Uploaded_Percent.toLocaleString()}%{" | "}(
                  {convertBytesToNormal(Total_Uploaded_Size + tempArr[0].File_uploaded_size)} /{" "}
                  {convertBytesToNormal(Total_New_Files_Size)}){" | "}
                  {Upload_Speed ? `${convertBytesToNormal(Upload_Speed)}/s` : " 0 Kb/s"}
                </>
              )}
            </div>
            <div className="progress">
              <div className="progress-value" style={{ width: `${Total_Uploaded_Percent}%` }}></div>
            </div>
          </div>
          <div className="minimized-modal-controls ml-4">
            <i
              className="ri-aspect-ratio-line mr-2"
              title="Maximize"
              onClick={() => this.props.maximizeModal(type)}
            ></i>
            <i className="ri-close-line" title="Maximize" onClick={() => this.props.maximizeModal(type)}></i>
          </div>
        </div>
      </>
    ) : (
      <>
        <Modal isOpen={true} centered={true} className="sync-progress-modal fullscreen-modal" size="xl" {...this.props.modalParams}>
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={() => this.props.minimizeModal("UPLOAD_FILES")}
            charCode="_"

          >
            Uploading Files to Server
          </ModalHeader>
          <ModalBody className="w-100 p-0" style={{height: "100vh"}}>
            
            {tempArr.length ? (
              <>
                <div className="sync-info-blocks w-100">
                  <div className="sync-info-block upload-progress">  
                    <div className="block-info w-100">
                      <div className="title d-flex align-items-center justify-content-between">
                        <div>Upload Progress</div>
                        <div>{convertBytesToNormal(Total_Uploaded_Size + tempArr[0].File_uploaded_size)} /{" "}
                        {convertBytesToNormal(Total_New_Files_Size)}</div>
                        <div>Remaining Time: {secToTime(Remaining_Time)}</div>
                      </div>
                      <div className="value">
                        <Progress animated value={Total_Uploaded_Percent}>{Total_Uploaded_Percent.toLocaleString()} %</Progress>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="text-left mt-2">{Upload_Speed ? `${convertBytesToNormal(Upload_Speed)}/s` : " 0 Kb/s"}</div>
                        <div>{Total_Uploaded_Files} / {Total_New_Files}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="sync-info-blocks upload-files w-100 justify-content-between">
                    <div className="sync-info-block">
                      <div className="block-icon">
                        <i className="ri-file-copy-2-line"></i>
                      </div>
                      <div className="block-info">
                        <div className="title">Found New Files</div>
                        <div className="value">{Total_New_Files}</div>
                      </div>
                    </div>
                    <div className="sync-info-block">
                      <div className="block-icon">
                        <i className="ri-file-copy-line"></i>
                      </div>
                      <div className="block-info">
                        <div className="title"> Duplicate Files Found</div>
                        <div className="value">{duplicateFiles}</div>
                      </div>
                    </div>
                    <div className="sync-info-block">
                      <div className="block-icon">
                        <i className="ri-map-pin-2-line"></i>
                      </div>
                      <div className="block-info">
                        <div className="title">Found New Locations</div>
                        <div className="value">{New_Locations.length}</div>
                      </div>
                    </div>
                    <div className="sync-info-block">
                      <div className="block-icon">
                        <i className="ri-file-forbid-line"></i>
                      </div>
                      <div className="block-info">
                        <div className="title">Removed Files</div>
                        <div className="value">{Remove_Locations.length}</div>
                      </div>
                    </div>
                    <div className="sync-info-block">
                      <div className="block-icon">
                        <i className="ri-file-copy-line"></i>
                      </div>
                      <div className="block-info">
                        <div className="title">Found New Versions</div>
                        <div className="value">{New_Versions.length}</div>
                      </div>
                    </div>
                  </div>
                  <Table className="customTable flex-table upload-table mb-0 coloredTable">
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
                  </Table>
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

  reffererData: state.Ref.reffererData,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  minimizeModal: (type) => dispatch(ModalActions.minimizeModal(type)),
  maximizeModal: (type) => dispatch(ModalActions.maximizeModal(type)),
  removeSyncSharePerson: (Share_to_Person_id) =>
    dispatch(SyncActions.removeSyncSharePersonRequested(Share_to_Person_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualSyncModal);
