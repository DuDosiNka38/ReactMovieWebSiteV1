import React, { Component } from "react";
import { Button, Label, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table, Spinner } from "reactstrap";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import Select from "react-select";
import axios from "./../../services/axios"

import * as ModalActions from "../../store/modal/actions";
import * as SyncActions from "../../store/sync/actions";
import * as CaseActions from "../../store/case/actions";

import notify from "../../services/notification";
import SyncApi from "../../api/SyncApi";

import { convertBytesToNormal, getSecondsToday, mapStep } from "./../../services/Functions";
import "animate.css";

const ICONS = {
  file: (
    <>
      <i class="ri-file-2-line mr-2"></i> File
    </>
  ),
  dir: (
    <>
      <i class="ri-folder-3-line mr-2"></i> Directory
    </>
  ),
};

let INTERVAL = null;

class ManualSyncModal extends Component {
  state = {
    SyncData: [],
    Upload_Files: [],
    Cases_opt: [],

    chkBoxModel: [],

    syncCase: null,

    shownRecords: 0,
    showStep: 50,
    showLimit: 100,
    showPage: 1,
  };

  alreadyAdded = (errStack) => {
    let errorMsg = '';
    

    return (
      <>
        <h5 className="text-justify h5"><div>Some folders are already added to synchronization list:</div></h5>
        <ul className="mb-0">
        {errStack.map((x) => (
          <li className="mb-1">{x}</li>
        ))}
        </ul>
      </>
    )
  }

  selectSyncFolders = () => {
    const { SyncData, syncCase } = this.state;
    const { AuthHash } = this.props;
    const response = ipcRenderer.sendSync("select-sync-dirs", {
      props: ["multiSelections", "openDirectory"],
      hash: AuthHash,
    });
    let errStack = [];

    if (response !== null) {
      response.map((path) => {
        if (SyncData.findIndex((x) => x.path === path) === -1) {
          SyncData.push({ path, size: false, length: false, type: "dir", Case_NAME: syncCase });
        } else {
          errStack.push(path);
        }
      });

      if (errStack.length) {
        this.props.showModal("SYNC_WARNING", {content: this.alreadyAdded(errStack)})
      }

      this.setState({ SyncData });
      // this.getFoldersInfo(response);
      setTimeout(() => this.getFoldersInfo(response), 1000);
      this.stepRender();
    }
  };

  selectSyncFiles = () => {
    const { SyncData, syncCase } = this.state;
    const { AuthHash } = this.props;
    const response = ipcRenderer.sendSync("select-sync-dirs", {
      props: ["multiSelections", "openFile"],
      hash: AuthHash,
    });
    if (response !== null) {
      response.map((path) => {
        if (SyncData.findIndex((x) => x.path === path) === -1) {
          SyncData.push({ path, size: null, type: "file", Case_NAME: syncCase });
        }
      });

      this.setState({ SyncData });
      setTimeout(() => this.getFilesInfo(response), 1000);
      this.stepRender();
    }
  };

  getFoldersInfo = async (folders) => {
    const { SyncData, formats } = this.state;
    const { AuthHash } = this.props;

    await mapStep(folders, async (path, next) => {
      const info = await ipcRenderer.sendSync("getFolderInfo", { path, formatsArr: formats });
      const i = SyncData.findIndex((x) => x.path === path);

      SyncData[i] = { ...SyncData[i], ...info };
      setTimeout(() => next(), 500);
      this.setState({ SyncData });
    });
  };

  getFilesInfo = async (folders) => {
    const { SyncData } = this.state;

    await mapStep(folders, async (path, next) => {
      const info = await ipcRenderer.sendSync("getFileInfo", { path });
      const i = SyncData.findIndex((x) => x.path === path);

      SyncData[i] = { ...SyncData[i], ...info };
      setTimeout(() => next(), 500);
      this.setState({ SyncData });
    });
  };

  deletePath = (index) => {
    let { chkBoxModel } = this.state;
    const data = [...this.state.SyncData];

    chkBoxModel = chkBoxModel.filter((x) => x !== data[index].path);
    data.splice(index, 1);

    this.setState({ SyncData: data, chkBoxModel, isMainChecked: chkBoxModel.length === data.length ? true : false });
  };

  deleteSelectedPaths = () => {
    const { chkBoxModel, SyncData } = this.state;
    this.setState({SyncData: SyncData.filter((x) => !chkBoxModel.includes((x.path))), isMainChecked: false, chkBoxModel: []})
  }

  manualSync = () => {
    const { SyncData } = this.state;
    const { AuthHash, onSyncStart } = this.props;

    if (SyncData.length === 0) {
      notify.isError("You need to choose folders or files for synchronization at first!");
      return false;
    }

    ipcRenderer.send("SYNC_FILESYSTEM", {
      hash: AuthHash,
      dirs: SyncData.filter((x) => x.type === "dir"),
      files: SyncData.filter((x) => x.type === "file"),
      daySeconds: getSecondsToday(),
    });
    this.setState({ SyncData: [] });
    this.props.hideModal();

    if(onSyncStart && typeof onSyncStart === "function"){
      onSyncStart({ totalSize: this.getTotalSize(), SyncData });
    }

    // this.props.showModal("SYNC_PROGRESS", { totalSize: this.getTotalSize() });
  };

  getTotalSize = () => {
    const { SyncData } = this.state;
    let totalSize = 0;

    SyncData.map((x) => {
      totalSize += x.size;
    });

    return totalSize;
  };

  getTotalFiles = () => {
    const { SyncData } = this.state;
    let totalFiles = 0;

    SyncData.map((x) => {
      totalFiles += x.type === "dir" ? x.length : 1;
    });

    return totalFiles;
  }

  handleSelectChange = async (val, el, path) => {
    const { SyncData } = this.state;
    const { value } = val;

    const element = SyncData.find((x) => x.path === path);

    if(element){
      element.Case_NAME = value;
    }

    this.setState({SyncData});
  };

  toggleOne = async (e) => {
    let { chkBoxModel, SyncData } = this.state;
    const { value, name, checked } = e.currentTarget;
    
    if(checked){
      if(chkBoxModel.indexOf(value) === -1){
        chkBoxModel.push(value);
      }
    } else {
      if(chkBoxModel.indexOf(value) !== -1){
        chkBoxModel = chkBoxModel.filter((x) => x !== value);
      }
    }

    const isMainChecked = SyncData.length === chkBoxModel.length;
    
    this.setState({chkBoxModel, isMainChecked});
  }

  toggleAll = async (e) => {
    let { chkBoxModel, isMainChecked, SyncData } = this.state;
    const { checked } = e.currentTarget;

    if(checked){
      chkBoxModel = SyncData.map((x) => (x.path));
    } else {
      chkBoxModel = [];
    }

    this.setState({chkBoxModel, isMainChecked: checked});
  }

  unCheckAll = async () => {
    this.setState({chkBoxModel: [], isMainChecked: false})
  }

  assignCase = () => {
    const { Cases_opt } = this.state;
    const { showModal } = this.props;

    showModal("ASSIGN_CASE_TO_ITEMS", {
      Cases_opt,
      onSuccess: (Case_NAME) => {
        const { SyncData } = this.state;

        SyncData.map((x, i) => {
          SyncData[i].Case_NAME = Case_NAME;
        })

        this.setState({SyncData});
      }
    })
  }

  stepRender = () => {
    if(INTERVAL !== null){
      clearInterval(INTERVAL);
      this.setState({shownRecords: 0})
    }

    INTERVAL = setInterval(() => {
      let { shownRecords, showStep, SyncData, showLimit, showPage } = this.state;
      shownRecords = shownRecords+showStep > SyncData.length ? SyncData.length : shownRecords+showStep;

      this.setState({shownRecords});

      if(shownRecords === showLimit*showPage){
        clearInterval(INTERVAL);
        INTERVAL = null;
        return;
      }

      if(shownRecords === SyncData.length){
        clearInterval(INTERVAL);
        INTERVAL = null;
        return;
      }
    }, 100)
  }

  loadMore = () => {
    const { showPage } = this.state;

    this.setState({showPage: showPage+1});
    this.stepRender();
  }

  async componentDidMount() {
    this.props.fetchUserCases();
    
    const { SyncData } = this.state;
    const { notUploaded, totalSize, Case_NAME } = this.props;

    if(Case_NAME){
      this.setState({syncCase: Case_NAME});
    }

    if(notUploaded && totalSize){
      notUploaded.map((file) => {
        const path = file.File_dir+"/"+file.Location_Name;
        const size = file.Size;

        if (SyncData.findIndex((x) => x.path === path) === -1) {
          SyncData.push({ path, size, type: "file", Case_NAME: file.Case_NAME });
        }
      });

      this.setState({ SyncData });

      this.stepRender();
    }

    if (this.props.state) {
      this.setState({ ...this.props.state });
    }

    await axios
      .get("/api/file-formats")
      .then((x) => {
        const formats = x.data ? x.data.map((f) => `.${f.Format.toLowerCase()}`) : [];
        this.setState({formats});
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cases !== this.props.cases || this.state.Cases_opt.length !== this.props.cases.length+1) {
      const Cases_opt = [...[{label: "Detect automatically", value: null}], ...this.props.cases.map((x) => ({ value: x.Case_Short_NAME, label: x.Case_Full_NAME }))];
      this.setState({ Cases_opt });
    }
  }

  closeModal = () => {
    const { onClose, type, hideModal } = this.props;
    if(onClose && typeof onClose === "function"){
      onClose();
    }

    hideModal(type)
  }

  // componentWillUnmount() {
  //   const { onClose } = this.props;
  //   if(onClose && typeof onClose === "function"){
  //     onClose(this.state);
  //   }
  // }

  render() {
    const { SyncData, Cases_opt, chkBoxModel, isMainChecked, shownRecords, syncCase } = this.state;
    const { type, ModalProps, Case_Full_NAME } = this.props;
    
    return (
          <>
            <Modal isOpen={true} centered={true} className=" position-relative" size="xl" {...ModalProps} backdrop={false}>
              <ModalHeader className="d-flex align-items-center justify-content-center" 
              // toggle={this.props.hideModal}
              toggle={this.closeModal}
              >
                Manual Synchronization
                {syncCase && (
                  <>
                    {`: ${Case_Full_NAME}`}
                  </>
                )}
              </ModalHeader>
              <ModalBody className="w-100 position-relative">
                <div className="table-buttons d-flex">
                  <div onClick={this.selectSyncFolders} className="table-button tb-1 w-50 mr-4">
                    <div className="d-flex w-100 h-100 align-items-center justify-content-between">
                      <div className="button-text">Synchronize Folders</div>
                      <i class="ri-folder-open-line">
                       
                      </i>
                    </div>
                  </div>
                  <div onClick={this.selectSyncFiles} className="table-button tb-2 w-50">
                    <div className="d-flex w-100 h-100 align-items-center justify-content-between">
                      <div className="button-text">Synchronize Files</div>
                      <i class="ri-file-copy-2-line">
                      
                      </i>
                    </div>
                  </div>
                </div>
            {SyncData.length > 0 && (
              <>
                <div className="d-flex w-100 mt-4">
                  <Button className="mr-2">Total items: {SyncData.length}</Button>
                  {chkBoxModel.length ? (
                    <>
                      <Button className="mr-2 d-flex align-items-center" onClick={this.unCheckAll}>Selected {chkBoxModel.length} items <i className="ri-close-line ml-2"></i> </Button>
                      <Button className="ld-button-success mr-2 d-flex align-items-center" disabled={!chkBoxModel.length || Boolean(syncCase)} onClick={this.assignCase}><i className="ri-briefcase-line mr-2"></i> Assign Case</Button>

                      <Button className="ld-button-danger mr-2 d-flex align-items-center" disabled={!chkBoxModel.length} onClick={this.deleteSelectedPaths}><i className="ri-close-line mr-2"></i> Remove Items From List</Button>
                    </>
                  ) : (
                    <>
                    </>
                  )}
                  <Button
                    className="ld-button-success scan-modal-button modal-content-scan-button"
                    type="submit"
                    onClick={this.manualSync}
                    disabled={SyncData.length ? (SyncData.find((x) => x.size === null) ? true : false) : true}
                  >
                    {SyncData.length ? (
                      SyncData.find((x) => x.size === null) ? (
                        <Spinner size="sm" color="light" />
                      ) : (
                        <>
                          <div className="d-flex align-items-center animate__animated animate__zoomIn">
                            Start synchronization <i className="ri-arrow-right-s-line"></i>
                          </div>
                        </>
                      )
                    ) : (
                      "Select files/folders at first!"
                    )}
                  </Button>
                  
                  
                </div>
                <Table className="customTable mb-4 mt-4 ">
                  <thead>
                    <tr>
                      <td style={{ width: "40px" }}>
                        <input type="checkbox" checked={isMainChecked} onChange={this.toggleAll}/>
                      </td>
                      <td style={{ width: "60px" }}>
                        #
                      </td>
                      <td>Type</td>
                      <td>Path</td>
                      <td>Assign To Case</td>
                      <td style={{ width: "100px" }}>Files</td>
                      <td style={{ width: "100px" }}>Size</td>
                      <td style={{ width: "40px" }}></td>
                    </tr>
                  </thead>
                  <tbody>
                    {SyncData.slice(0, shownRecords).map((x, i) => (
                      <>
                        <tr>
                          <td style={{ width: "40px" }}>
                            <input type="checkbox" checked={chkBoxModel.find((p) => p === x.path) ? true : false} value={x.path} onChange={this.toggleOne}/>
                          </td>
                          <td style={{ width: "60px" }}>
                            {i+1}
                          </td>
                          <td>
                            <div className={`d-flex align-items-center ${x.type}`}>{ICONS[x.type]}</div>
                          </td>
                          <td style={{ maxWidth: "500px" }}>{x.path}</td>
                          <td>
                            {((Case_NAME) => (
                              <>
                                <Select
                                  name="Case_NAME"
                                  attr-id={x.path}
                                  options={Cases_opt}
                                  value={Cases_opt.find((x) => x.value === Case_NAME) || null}
                                  // value={row.value || null}
                                  // isDisabled={row.disabled || false}
                                  // menuIsOpen = {true}
                                  closeMenuOnSelect={true}
                                  onChange={(val, el) => this.handleSelectChange(val, el, x.path)}
                                  className="w-100 openTop"
                                  isDisabled={Boolean(syncCase)}
                                />
                              </>
                            ))(x.Case_NAME)}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {x.type === "dir" ? (x.length !== false ? x.length : <Spinner size="sm" color="secondary" />) : "-"}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {x.size !== false ? convertBytesToNormal(x.size) : <Spinner size="sm" color="secondary" />}
                          </td>
                          <td style={{ width: "40px" }}>
                            <i
                              class="ri-close-line removeSyncScheduleRow"
                              onClick={() => this.deletePath(i)}
                              title="Remove Directory"
                            ></i>
                          </td>
                        </tr>
                      </>
                    ))}
                    <tr className="total">
                      <td colSpan={6} className="text-right">
                        Total:
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{this.getTotalFiles()}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{convertBytesToNormal(this.getTotalSize())}</td>
                    </tr>
                  </tbody>
                </Table>
                {shownRecords !== SyncData.length && (
                  <>
                    <Button onClick={this.loadMore}>Load More</Button>
                  </>
                )}           
                
              </>
            )}
          </ModalBody>
          <ModalFooter className="p-0 border-0">
            <Button
              className="ld-button-success scan-modal-button"
              type="submit"
              onClick={this.manualSync}
              disabled={SyncData.length ? (SyncData.find((x) => x.size === null) ? true : false) : true}
            >
              {SyncData.length ? (
                SyncData.find((x) => x.size === null) ? (
                  <Spinner size="sm" color="light" />
                ) : (
                  <>
                    <div className="d-flex align-items-center animate__animated animate__zoomIn">
                      Start synchronization <i className="ri-arrow-right-s-line"></i>
                    </div>
                  </>
                )
              ) : (
                "Select files/folders at first!"
              )}
            </Button>
            {/* <Button className="ld-button-danger" type="submit" onClick={this.props.hideModal}>
                  Cancel
                </Button> */}
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  display: state.Modal.display,
  AuthHash: state.Main.auth_hash,
  cases: state.Case.cases,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  minimizeModal: (type) => dispatch(ModalActions.minimizeModal(type)),
  maximizeModal: (type) => dispatch(ModalActions.maximizeModal(type)),
  fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
  removeSyncSharePerson: (Share_to_Person_id) =>
    dispatch(SyncActions.removeSyncSharePersonRequested(Share_to_Person_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualSyncModal);
