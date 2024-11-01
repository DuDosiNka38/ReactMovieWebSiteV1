import React, { PureComponent } from "react";
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

import { convertBytesToNormal, getCurrentTimestamp, getSecondsToday, mapStep } from "../../../services/Functions";
import "animate.css";

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

class SyncStep1 extends PureComponent {
  Stat = {
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
  };
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
    inProcess: false,
    stepEnds: false,

    isCountdown: false,
    countdownSec: 0,

    lastChangeTime: 0,
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

  nextStep = () => {
    const { onStepEnd } = this.props;
    this.confirmUpload();
    this.setState({ inProcess: false });

    if (onStepEnd && typeof onStepEnd === "function") onStepEnd();

    this.stopCountdown();

    this.setState({stepEnds: true})
  }

  componentDidMount() {
    if (this.props.state) {
      this.setState({ ...this.props.state });
    }
    ipcRenderer.on("onAdd", (event, args) => {
      // const Stat = { ...this.state.Stat };
      const Stat = this.Stat;
      const { type } = args;

      switch (type) {
        case "New_Files_Size":
          Stat[type] += args.size;
          break;

        case "Total_Scanned_Files_Size":
          const { UpdateProgress } = this.props;
          Stat[type] += args.size;
          const Total_Scanned_Files_Size = Stat[type];
          const { totalSize } = this.props;
          UpdateProgress(((Total_Scanned_Files_Size * 100) / totalSize).toLocaleString());
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

      this.render();
      this.setState({ lastChangeTime: getCurrentTimestamp() });
      // this.setState({ Stat });
    });

    ipcRenderer.on("onSyncLog", (event, message) => {
      this.setState({ syncMessage: message });
    });

    ipcRenderer.on("confirmUpload", (event, args) => {

      this.setState({ isScanned: true });
      this.runCountdown(10, null, this.nextStep);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.totalSize !== this.props.totalSize) {
      this.setState({ inProcess: true });
    }
  }

  render() {
    const { Stat, isScanned, isCountdown, countdownSec, inProcess, syncMessage, stepEnds } = this.state;
    const { totalSize, SyncData } = this.props;
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
    } = this.Stat;

    return (
      <>
        <div className="sync-step-block__header">
          <div className="sync-step-block__header-title">
            <div className="sync-step-block__header-title-step">Step 1</div>
            <div className="sync-step-block__header-title-step-text">Scan & Check Recieved Data</div>
          </div>
          {totalSize > 0 && totalSize !== undefined && !stepEnds && (
            <>
                {(Total_Scanned_Files_Size * 100) / totalSize >= 100 && inProcess ? (
                  <>
                  <Button onClick={this.nextStep}>
                      <i className="ri-arrow-right-s-line"></i>
                
                </Button>
                  </>
                ) : (
                  <>

                    <Spinner size="m" />
                  </>
                )}
            </>
          )}
        </div>
        <div className="sync-step-block__body">
          {/* <div className="step_holder"> */}
            <div className="block-info w-100 mb-3">
              {totalSize > 0 && totalSize !== undefined && (Total_Scanned_Files_Size * 100) / totalSize < 100 && (
                <>
                <div className="warning-message mb-2">
                <i class="ri-error-warning-line"></i> Please, do not turn off your computer until process ends.
                </div>
                  <div className="sync-message">{syncMessage}</div>
                  <div className="value">
                    <Progress animated value={((Total_Scanned_Files_Size * 100) / totalSize).toLocaleString()}>
                      {((Total_Scanned_Files_Size * 100) / totalSize).toLocaleString()} %
                    </Progress>
                  </div>
                </>
              )}
              {(Total_Scanned_Files_Size * 100) / totalSize >= 100 && inProcess && (
                <>
                  <div className="successfully-scanned">
                    <i class="ri-check-line"></i> Successfully Scanned. Next Step Automatically Starts After{" "}
                    {countdownSec} sec.
                  </div>
                </>
              )}
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
                      {convertBytesToNormal(Total_Scanned_Files_Size)} /{" "}
                      {totalSize ? convertBytesToNormal(totalSize) : 0}
                    </div>
                  </div>
                </div>
                {/* /////////// */}
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className="ri-folders-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title">SCANNED FOLDERS</div>
                    <div className="value">{Scanned_Folders}</div>
                  </div>
                </div>
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className="ri-folders-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title">SCANNED FILES</div>
                    <div className="value">{Scanned_Files}</div>
                  </div>
                </div>
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className="ri-file-copy-2-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title">NEW FILES</div>
                    <div className="value">{New_Files}</div>
                  </div>
                </div>
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className="ri-file-copy-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title">DUPLICATE FILES FOUND</div>
                    <div className="value">{Duplicate_Files}</div>
                  </div>
                </div>
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className=" ri-folder-shared-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title">ALREADY UPLOADED</div>
                    <div className="value">{Registered_Locations}</div>
                  </div>
                </div>
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className="ri-pin-distance-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title"> NEW LOCATIONS</div>
                    <div className="value">{File_Locations}</div>
                  </div>
                </div>
                <div className="sync-info-block">
                  <div className="block-icon">
                    <i className=" ri-folder-shared-line"></i>
                  </div>
                  <div className="block-info">
                    <div className="title">NEW VERSIONS</div>
                    <div className="value">{New_Versions}</div>
                  </div>
                </div>
              </div>
            </div>
            {1 == 0 && SyncData && inProcess && SyncData.length > 0 && (
              <Table className="customTable mb-4 mt-4 ">
                <thead>
                  <tr>
                    <td>Type</td>
                    <td>Path</td>
                    {/* <td>Assign To Case</td> */}
                    <td style={{ width: "100px" }}>Files</td>
                    <td style={{ width: "100px" }}>Size</td>
                  </tr>
                </thead>
                <tbody>
                  {SyncData.map((x, i) => (
                    <>
                      <tr>
                        <td>
                          <div className={`d-flex align-items-center ${x.type}`}>{ICONS[x.type]}</div>
                        </td>
                        <td style={{ maxWidth: "500px" }}>{x.path}</td>
                        {/* <td>
                          {((Case_NAME) => (
                            <>
                              <Select
                                name="Case_NAME"
                                attr-id={x.path}
                                options={Cases_opt}
                                value={Cases_opt.find((x) => x.value === Case_NAME) || null}
                                // value={row.value || null}
                                // isDisabled={row.disabled || false}
                                closeMenuOnSelect={true}
                                onChange={(val, el) => this.handleSelectChange(val, el, x.path)}
                                className="w-100"
                              />
                            </>
                          ))(x.Case_NAME)}
                        </td> */}
                        <td style={{ whiteSpace: "nowrap" }}>
                          {x.type === "dir" ? x.length || <Spinner size="sm" color="secondary" /> : "-"}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {x.size ? convertBytesToNormal(x.size) : <Spinner size="sm" color="secondary" />}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        {/* </div> */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  AuthHash: state.Main.auth_hash,
  cases: state.Case.cases,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SyncStep1);
