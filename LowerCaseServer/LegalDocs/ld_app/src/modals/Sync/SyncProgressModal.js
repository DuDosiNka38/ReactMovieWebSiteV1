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
  Col,
  Row,
  Spinner,
  Progress,
} from "reactstrap";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";
import * as RefActions from "../../store/ref/actions";

import notify from "../../services/notification";
import SyncApi from "../../api/SyncApi";

import { convertBytesToNormal } from "../../services/Functions";

class ManualSyncModal extends Component {
  state = {
    Stat: {
      New_Files_Size: 0,
      Remove_Locations: 0,
      Scanned_Folders: 0,
      New_Versions: 0,
      New_Files: 0,
      File_Locations: 0,
      Duplicate_Files: 0,
      Total_Scanned_Files_Size: 0,
      Scan_Speed: null,
      Registered_Locations: 0,
      Scanned_Files: 0,
    },
    isScanned: false,

    isCountdown: false,
    countdownSec: 0,
  };

  confirmUpload = () => {
    ipcRenderer.send("confirmUpload", {});
  };

  runCountdown = (sec, cbStep, cbEnd) => {
    this.setState({ isCountdown: true, countdownSec: sec });

    this.countdown(sec, cbStep, cbEnd);
  };

  stopCountdown = () => {
    this.setState({ isCountdown: false, countdownSec: 0 });
  };

  countdown = (sec, stepCb, endCb) => {
    this.setState({ countdownSec: sec });

    if (sec > 0) {
      setTimeout(() => this.countdown(sec - 1, stepCb, endCb), 1000);

      if (typeof stepCb === "function") stepCb();
    } else {
      this.stopCountdown();

      if (typeof endCb === "function") endCb();
    }
  };

  componentDidMount() {
    if (this.props.state) {
      this.setState({ ...this.props.state });
    }
    ipcRenderer.on("onAdd", (event, args) => {
      const Stat = { ...this.state.Stat };
      const { type } = args;

      switch (type) {
        case "New_Files_Size":
          Stat[type] += args.size;
          break;

        case "Total_Scanned_Files_Size":
          Stat[type] += args.size;
          break;

        case "Scan_Speed":
          Stat[type] = args.scanSpeed;
          break;

        case "New_Files":
          Stat[type] += 1;
          break;

        default:
          Stat[type] += 1;
          break;
      }

      this.setState({ Stat });
    });

    ipcRenderer.on("confirmUpload", (event, args) => {
      this.setState({ isScanned: true });
      this.runCountdown(10, null, this.confirmUpload);
    });

    // ipcRenderer.on("onSendDataToReact", (event, args) => {
    //   this.props.setReffererData("UPLOAD_FILE", this.state.Stat);
    // });
  }

  render() {
    const { type } = this.props;
    const { Stat, isScanned, isCountdown, countdownSec } = this.state;
    const {
      New_Files,
      New_Files_Size,
      Total_Scanned_Files_Size,
      File_Locations,
      Remove_Locations,
      New_Versions,
      Scanned_Folders,
      Scan_Speed,
      Duplicate_Files,
      Registered_Locations,
      Scanned_Files,
    } = Stat;

    return this.props.isMinimized ? (
      <>
        <div id={type} className="minimized-modal">
          <div className="minimized-modal-content">
            <div className="minimized-modal-header">Scanning...</div>
            <div className="minimized-modal-data">{convertBytesToNormal(New_Files_Size)}</div>
          </div>
          <div className="minimized-modal-controls">
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
        <Modal
          isOpen={true}
          centered={true}
          className="sync-progress-modal"
          size="xl"
          fullscreen={true}
          {...this.props.modalParams}
        >
          <ModalHeader
            className="d-flex align-items-center justify-content-center d-flex align-items-center"
            toggle={() => {
              ipcRenderer.send("declineUpload", {});
              this.props.hideModal(type);
            }}
            // toggle={() => this.props.minimizeModal(type)}
            // charCode="_"
          >
            {isScanned ? (
              <>Scanning</>
            ) : (
              <>
                <Spinner size="sm" color="light" className="mr-2" /> Scanning
              </>
            )}
          </ModalHeader>
          <ModalBody className="w-100 p-0">
            <div className="sync-info-blocks w-100">
              <div className="sync-info-block upload-progress">
                <div className="block-info w-100">
                  {/* <div className="title d-flex align-items-center justify-content-between">
                    <div>{convertBytesToNormal(Total_Uploaded_Size + tempArr[0].File_uploaded_size)} /{" "}
                    {convertBytesToNormal(Total_New_Files_Size)}</div>
                    <div>Remaining Time: {secToTime(Remaining_Time)}</div>
                  </div> */}
                  <div className="value">
                    <Progress
                      animated
                      value={((Total_Scanned_Files_Size * 100) / this.props.totalSize).toLocaleString()}
                    >
                      {((Total_Scanned_Files_Size * 100) / this.props.totalSize).toLocaleString()} %
                    </Progress>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="text-left mt-2">
                      {Scan_Speed ? `${convertBytesToNormal(Scan_Speed)}/s` : "- Kb/s"}
                    </div>
                    {/* <div>{Total_Uploaded_Files} / {Total_New_Files}</div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="syncModalOKH">
              <div className="sync-info-blocks">
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className="ri-scan-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title">Scan Speed</div>
                    <div className="value">{Scan_Speed ? `${convertBytesToNormal(Scan_Speed)}/s` : "- Kb/s"}</div>
                  </div>
                </div>
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className="ri-file-cloud-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title d-flex justify-content-between">TOTAL SIZE of UNIQUE FILES FOUND</div>
                    <div className="value">{convertBytesToNormal(New_Files_Size)}</div>
                  </div>
                </div>
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className="ri-file-cloud-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title d-flex justify-content-between">TOTAL SIZE of SCANNED FILES</div>
                    <div className="value">
                      {convertBytesToNormal(Total_Scanned_Files_Size)} / {convertBytesToNormal(this.props.totalSize)}
                    </div>
                  </div>
                </div>
              </div>
              <Table className="customTable flex-table mb-0 coloredTable">
                <thead></thead>
                <tbody>
                  <tr>
                    <td className="centeredTD">
                      <i className="ri-folders-line"></i> SCANNED FOLDERS
                    </td>
                    <td>{Scanned_Folders}</td>
                  </tr>
                  <tr>
                    <td className="centeredTD">
                      <i className="ri-folders-line"></i> SCANNED FILES
                    </td>
                    <td>{Scanned_Files}</td>
                  </tr>
                  <tr>
                    <td className="centeredTD">
                      <i className="ri-file-copy-2-line"></i> NEW FILES
                    </td>
                    <td>{New_Files}</td>
                  </tr>
                  <tr>
                    <td className="centeredTD">
                      <i className="ri-file-copy-line"></i>DUPLICATE FILES FOUND
                    </td>
                    <td>{Duplicate_Files}</td>
                  </tr>
                  <tr>
                    <td className="centeredTD">
                      {" "}
                      <i className=" ri-folder-shared-line"></i> ALREADY UPLOADED
                    </td>
                    <td>{Registered_Locations}</td>
                  </tr>
                  <tr>
                    <td className="centeredTD">
                      <i className="ri-pin-distance-line"></i> NEW LOCATIONS
                    </td>
                    <td>{File_Locations}</td>
                  </tr>
                  <tr>
                    <td className="centeredTD">
                      <i className="ri-file-forbid-line"></i>DELETED LOCATIONS
                    </td>
                    <td>{Remove_Locations}</td>
                  </tr>
                  <tr>
                    <td className="centeredTD">
                      {" "}
                      <i className=" ri-folder-shared-line"></i> NEW VERSIONS
                    </td>
                    <td>{New_Versions}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <i className="ri-search-line modal-image-bg"></i>
          </ModalBody>
          <ModalFooter className="p-0 border-0">
            <Button
              className="ld-button-success scan-modal-button"
              type="submit"
              onClick={this.confirmUpload}
              disabled={!isScanned}
            >
              {isScanned ? (
                <>
                  <div className="d-flex align-items-center animate__animated animate__zoomIn">
                    Next Step {isCountdown && <>({countdownSec})</>} <i className="ri-arrow-right-s-line"></i>
                  </div>
                </>
              ) : (
                <>
                  <Spinner size="sm" color="light" />
                </>
              )}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  AuthHash: state.Main.auth_hash,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type)),
  minimizeModal: (type) => dispatch(ModalActions.minimizeModal(type)),
  maximizeModal: (type) => dispatch(ModalActions.maximizeModal(type)),
  removeSyncSharePerson: (Share_to_Person_id) =>
    dispatch(SyncActions.removeSyncSharePersonRequested(Share_to_Person_id)),
  setReffererData: (dataFor, data) => dispatch(RefActions.setReffererData(dataFor, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualSyncModal);
