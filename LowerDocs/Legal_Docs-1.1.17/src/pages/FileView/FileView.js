import React, { Component } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  Container,
  Media,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  FormGroup,
  Label,
  Input,
  ModalFooter,
  CardHeader,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
// import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import FileViewer from "react-file-viewer";
import { connect } from "react-redux";
import axios from "./../../services/axios";
import { NavLink } from "react-router-dom";
import noteWindow from "./../../services/notifications";
import { AvField, AvForm } from "availity-reactstrap-validation/lib/AvField";
import sysInfo from "./../../electron/services/sysInfo";
// import logger from 'logging-library';
import PreloaderLD from "../../services/preloader-core";
import * as actions from "./../../store/user/actions";
import SlideToggle from "react-slide-toggle";

const { ipcRenderer, app } = require("electron");
const pathinfo = require("pathinfo");

const SERVER = axios.defaults.baseURL;

let counter = 0;

class FileView extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "" },
      { title: "All Cases", link: "/allcases" },
      { title: "Case", link: "#" },
      { title: "Document", link: "#" },
      { title: "File", link: "#" },
    ],
    currentFile: null,
    modal: false,
    modalAction: "",
    File_Name: "",
    openAfterDownload: false,
    downloadStep: "DOWNLOAD_FILE",
    refresh: true,
  };
  Preloader = new PreloaderLD(this);
  checkFileExists = this.checkFileExists.bind(this);
  switch_modal = this.switch_modal.bind(this);
  downloadFile = this.downloadFile.bind(this);
  downloadResult = this.downloadResult.bind(this);
  openDownloadedFile = this.openDownloadedFile.bind(this);
  removeLocation = this.removeLocation.bind(this);
  chooseAntoherFileName = this.chooseAntoherFileName.bind(this);
  rewriteFile = this.rewriteFile.bind(this);
  openDocFolder = this.openDocFolder.bind(this);

  componentDidMount() {
    this.getCurrentFile();
    ipcRenderer.on("downloadFile", this.downloadResult);
    this.setState({ toggleEvent: Date.now() });
    console.log(this.props);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.refresh !== prevState.refresh) {
      this.setState({ refresh: !prevState.refresh });
    }
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
  }

  switch_modal(e, cb, act) {
    if (e === null && cb === null && act === null) return false;

    if (e !== null && !e.hasOwnProperty("currentTarget"))
      e.currentTarget = e.target;

    if (cb !== undefined && cb !== null) {
      cb(e);
    } else {
      const action =
        e !== null ? e.currentTarget.getAttribute("attr-modal-type") : act;
      this.setState({
        modalAction: action,
        File_Name: this.state.currentFile.File_name_fingerprint,
      });

      this.setState((prevState) => ({
        modal: !prevState.modal,
        downloadStep: "DOWNLOAD_FILE",
      }));
    }
  }
  async getCurrentFile() {
    await axios
      .post("/api/file/get", {
        File_id: this.props.match.params.filePath,
      })
      .then((response) => {
        this.setState({ currentFile: response.data });
      })
      .catch((response) => response);
  }
  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };
  onChangeCheckbox = (el) => {
    const { checked } = el.currentTarget;
    this.setState({ openAfterDownload: checked });
  };
  onToggle = () => {
    this.setState({ toggleEvent: Date.now(), isTogled: !this.state.isTogled });
  };

  downloadResult(event, args) {
    this.setState({ downloadStep: "OPEN_SAVED_FILE" });
    const { currentFile } = this.state;
    const { settings, personeData } = this.props;
    const cID = sysInfo.get().os.hostname;

    const uSettings = settings.USER[personeData.Person_id];
    const MAC = sysInfo.get().uuid.macs[0];
    uSettings.FILES_DIR =
      typeof uSettings.FILES_DIR === "object"
        ? uSettings.FILES_DIR
        : JSON.parse(uSettings.FILES_DIR);

    if (!uSettings.FILES_DIR.hasOwnProperty(MAC))
      uSettings.FILES_DIR[MAC] = "/";

    const FILES_DIR = uSettings.FILES_DIR[MAC];

    if (args.result) {
      if (Array.isArray(args.path)) {
        noteWindow.isSuck(`File exists: ${args.path}.`);
        args.path.forEach((el) => {
          let info = pathinfo(el);
          axios
            .post("/api/file/addLocation", {
              File_id: currentFile.File_id,
              Person_id: personeData.Person_id,
              Computer_id: cID,
              File_name: info.filename,
              File_path: info.abspath,
              File_name_fingerprint: info.basename,
              base_name_fingerprint: info.basename,
              Preview_img: currentFile.Preview_img,
            })
            .then(() => this.getCurrentFile());
        });
        this.getCurrentFile();
        this.render();
      } else {
        if (args.message == "FILE_SUCCESSFULLY_DOWNLOADED") {
          noteWindow.isSuck(`File successfully downloaded: ${args.path}.`);
          let info = pathinfo(args.path);
          axios
            .post("/api/file/addLocation", {
              File_id: currentFile.File_id,
              Person_id: personeData.Person_id,
              Computer_id: cID,
              File_name: info.filename,
              File_path: info.abspath,
              File_name_fingerprint: info.basename,
              base_name_fingerprint: info.basename,
              Preview_img: currentFile.Preview_img,
            })
            .then(() => this.getCurrentFile());
        }

        if (args.message == "FILE_WITH_SAME_NAME_ALREADY_EXISTS") {
          this.setState({
            downloadStep: "FILE_WITH_SAME_NAME_ALREADY_EXISTS",
            storage: args,
          });
          // this.switch_modal(null, null, "download");

          // noteWindow.isSuck(`FILE_ALREADY_EXISTS: ${args.path}.`);
        }
      }
    } else {
      noteWindow.isError(args);
    }
    this.Preloader.hide();
  }

  checkFileExists(e) {
    const { currentFile, File_Name } = this.state;
    const { settings, personeData } = this.props;
    const uSettings = settings.USER[personeData.Person_id];
    const MAC = sysInfo.get().uuid.macs[0];

    uSettings.FILES_DIR =
      typeof uSettings.FILES_DIR === "object"
        ? uSettings.FILES_DIR
        : JSON.parse(uSettings.FILES_DIR);

    if (!uSettings.FILES_DIR.hasOwnProperty(MAC))
      uSettings.FILES_DIR[MAC] = "/";

    const FILES_DIR = uSettings.FILES_DIR[MAC];

    if (FILES_DIR === "/") {
      noteWindow.isError(
        "You need to select <a href='/app/settings'><u>App Folder</u></a>"
      );
    } else {
      const appDir = FILES_DIR;
      const fileDir = `/${currentFile.Case_NAME}/Documents/${currentFile.DOC_ID}`;
      const fileName = currentFile.File_name;

      ipcRenderer.send("checkFile", {
        fileName: File_Name + "." + currentFile.Format,
        appDir: appDir,
        hash: currentFile.File_id,
      });
      ipcRenderer.once("checkFile", (event, args) => {
        if (args !== null) {
          if (args.hasOwnProperty("checkResult")) {
            const { checkResult } = args;
            if (checkResult === true) {
              //DOWNLOAD
              this.switch_modal(null, null, "download");
            } else {
              //FILE_EXISTS
              this.switch_modal(null, null, "download");
              this.setState({
                downloadStep: "FILE_ALREADY_EXISTS",
                fileLocations: checkResult,
              });
            }
          }
        }
      });
    }
  }

  downloadFile(params) {
    const { currentFile, File_Name } = this.state;
    const { settings, personeData } = this.props;
    const uSettings = settings.USER[personeData.Person_id];
    const MAC = sysInfo.get().uuid.macs[0];

    if (params === undefined) params = {};

    if (this.state.hasOwnProperty("checkHash"))
      params.checkHash = this.state.checkHash;

    uSettings.FILES_DIR =
      typeof uSettings.FILES_DIR === "object"
        ? uSettings.FILES_DIR
        : JSON.parse(uSettings.FILES_DIR);

    if (!uSettings.FILES_DIR.hasOwnProperty(MAC))
      uSettings.FILES_DIR[MAC] = "/";

    const FILES_DIR = uSettings.FILES_DIR[MAC];

    if (FILES_DIR === "/") {
      noteWindow.isError(
        "You need to select <a href='/app/settings'><u>App Folder</u></a>"
      );
    } else {
      const appDir = FILES_DIR;
      const fileDir = `/${currentFile.Case_NAME}/Documents/${currentFile.DOC_ID}`;
      const fileName = currentFile.File_name;

      ipcRenderer.send("downloadFile", {
        filePath: SERVER + currentFile.File_path,
        fileName: File_Name + "." + currentFile.Format,
        appDir: appDir,
        fileDir: fileDir,
        hash: currentFile.File_id,
        params: params,
      });
      ipcRenderer.on("downloadFile", (event, args) => {
        this.setState({ checkHash: true });
        this.getCurrentFile();
      });
    }
  }

  openDocFolder() {
    const { currentFile } = this.state;
    const { settings, personeData } = this.props;
    const uSettings = settings.USER[personeData.Person_id];
    const MAC = sysInfo.get().uuid.macs[0];

    uSettings.FILES_DIR =
      typeof uSettings.FILES_DIR === "object"
        ? uSettings.FILES_DIR
        : JSON.parse(uSettings.FILES_DIR);

    if (!uSettings.FILES_DIR.hasOwnProperty(MAC))
      uSettings.FILES_DIR[MAC] = "/";

    const FILES_DIR = uSettings.FILES_DIR[MAC];
    const fileDir = `${FILES_DIR}/${currentFile.Case_NAME}/${currentFile.DOC_ID}/`;
    ipcRenderer.send("openFolder", {
      path: fileDir,
    });
  }

  openDownloadedFile() {
    const { currentFile } = this.state;
    const { settings, personeData } = this.props;
    const uSettings = settings.USER[personeData.Person_id];
    const MAC = sysInfo.get().uuid.macs[0];

    uSettings.FILES_DIR =
      typeof uSettings.FILES_DIR === "object"
        ? uSettings.FILES_DIR
        : JSON.parse(uSettings.FILES_DIR);

    if (!uSettings.FILES_DIR.hasOwnProperty(MAC))
      uSettings.FILES_DIR[MAC] = "/";

    const FILES_DIR = uSettings.FILES_DIR[MAC];

    ipcRenderer.send("openFile", {
      hash: currentFile.File_id,
      appDir: FILES_DIR,
    });

    this.setState({
      modal: !this.state.modal,
    });
  }

  openFile(path) {
    ipcRenderer.send("openFile", {
      path: path,
    });
  }

  removeLocation(path, currentFile) {
    // const { currentFile } = this.state;
    const { settings, personeData, Core } = this.props;
    const Computers = Core.Computers;
    const uSettings = settings.USER[personeData.Person_id];
    const MAC = sysInfo.get().uuid.macs[0];

    const currentComputer = Computers.find((x) => x.Mac_Address === MAC);

    const result = axios
      .post("/api/file/removeLocation", {
        Person_id: personeData.Person_id,
        File_id: currentFile.File_id,
        Computer_id: currentComputer.Computer_id,
        File_path: path,
      })
      .then((event, args) => {
        this.getCurrentFile();
        this.setState({ refresh: !this.state.refresh });
      })
      .catch((event, args) => {
        console.log(event, args);
      });
  }

  removeFile(path) {
    this.Preloader.show();
    this.setState({ refresh: !this.state.refresh });

    ipcRenderer.send("removeFile", {
      path: path,
    });
    ipcRenderer.once("removeFile", (event, args) => {
      if (args !== null) {
        if (args.hasOwnProperty("result") && args.result === true) {
          this.removeLocation(path, this.state.currentFile);
          this.switch_modal(null, this.checkFileExists(null));
        }
      }
    });
  }

  openFolder(path) {
    const pi = pathinfo(path);
    ipcRenderer.send("showFileInFolder", {
      path: path,
    });
  }

  chooseAntoherFileName() {
    this.setState({ downloadStep: "DOWNLOAD_FILE" });
  }

  rewriteFile() {
    this.downloadFile({ rewrite: true });
  }

  render() {
    this.Preloader.show();
    const { currentFile } = this.state;
    const { settings, personeData, Core } = this.props;
    const { Computers } = Core;

    if (currentFile == null) return <>{this.Preloader.get()}</>;

    if (
      settings == undefined ||
      settings.length == 0 ||
      Object.is(settings, {})
    )
      return <>{this.Preloader.get()}</>;

    if (personeData == undefined || personeData.length == 0)
      return <>{this.Preloader.get()}</>;

    if (!sysInfo.isLoad()) return <>{this.Preloader.get()}</>;

    if (
      !settings.hasOwnProperty("USER") ||
      !settings.USER.hasOwnProperty(personeData.Person_id)
    )
      return <>{this.Preloader.get()}</>;

    const uSettings = settings.USER[personeData.Person_id];
    const MAC = sysInfo.get().uuid.macs[0];
    uSettings.FILES_DIR =
      typeof uSettings.FILES_DIR === "object"
        ? uSettings.FILES_DIR
        : JSON.parse(uSettings.FILES_DIR);

    if (!uSettings.FILES_DIR.hasOwnProperty(MAC))
      uSettings.FILES_DIR[MAC] = "/";

    const FILES_DIR =
      uSettings.FILES_DIR[MAC] +
      "/" +
      currentFile.Case_NAME +
      "/" +
      currentFile.DOC_ID +
      "/";

    const currentComputer = Computers.find((x) => x.Mac_Address === MAC);

    let cFaile = this.state.currentFile;
    let format = cFaile.Format;

    console.log(cFaile);

    if (cFaile == null) return <>{this.Preloader.get()}</>;

    if (this.state.currentFile == null) return <>{this.Preloader.get()}</>;
    const meta = cFaile.Meta;
    const docs = [
      { uri: `${SERVER + this.state.currentFile.File_path}` },
    ];

    const { cases } = this.props;
    const doc = cases.find(
      (x) => cFaile.Case_NAME === x.Case_Short_NAME
    ).Case_Documents;
    const cDoc = doc.find((x) => cFaile.DOC_ID === x.DOC_ID).DOCUMENT_NAME;

    return (
      <>
        <div className="">
          <Container fluid>
            <Row className="d-flex align-items-center">
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h5 className="mb-3 file-name">
                      {" "}
                      File: {this.state.currentFile.File_name}
                    </h5>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <div className="toolbar d-flex case-toolbar">
                      <Button
                        color="warning"
                        attr-modal-type="download"
                        onClick={(e) =>
                          this.switch_modal(e, this.checkFileExists)
                        }
                        className="d-flex align-items-center"
                      >
                        <i
                          className=" ri-save-line
  font-size-20 mr-1  auti-custom-input-icon "
                        ></i>
                        Save File to PC
                      </Button>

                      <Button
                        color="primary"
                        className="d-flex align-items-center ml-3"
                      >
                        <i
                          className="  ri-file-edit-line
  font-size-20 mr-1  auti-custom-input-icon "
                        ></i>
                        Edit File Information
                      </Button>
                      <Button
                        color="info"
                        className="d-flex align-items-center ml-3"
                        onClick={this.switch_modal}
                      >
                        <i
                          className="  ri-eye-line
  font-size-20 mr-1  auti-custom-input-icon "
                        ></i>
                        Fast File Preview
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
           <Card>
             <CardBody>
               <Row>
                 <Col lg={12}><h5>File Information:</h5></Col>
               <Col lg={6}>
                <Card className="cstmCB">
                  <CardBody >
                    <span>
                      {" "}
                      Case:{" "}
                      <NavLink
                        to={`/app/case-explorer/single-case/${
                          this.props.cases.find(
                            (x) => cFaile.Case_NAME === x.Case_Short_NAME
                          ).Case_Short_NAME
                        }`}
                      >
                        {
                          this.props.cases.find(
                            (x) => cFaile.Case_NAME === x.Case_Short_NAME
                          ).Case_Full_NAME
                        }
                      </NavLink>
                    </span>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="cstmCB">
                  <CardBody >
                    <span>
                      {" "}
                      Document:{" "}
                      <NavLink
                        to={`/app/case-explorer/case/${cases.find((x)=> cFaile.Case_NAME === x.Case_Short_NAME).Case_Short_NAME}/document/${cFaile.DOC_ID}`}
                      >
                        {
                        cDoc
                        }
                      </NavLink>
                    </span>
                  </CardBody>
                </Card>
               
              </Col>
              <Col lg={4}>
                    <Card className="cstmCB">
                      <CardBody>
                        <span>
                         Form: {cFaile.Form}

                        </span>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="cstmCB">
                      <CardBody>
                        <span>
                        Created date: {cFaile.CREATED_DATE_HUMAN}

                        </span>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="cstmCB">
                      <CardBody>
                        <span>
                        Status: {cFaile.Status}
                        </span>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={6}>
                    <Card className="cstmCB">
                      <CardBody>
                        <span>
                        Format: {cFaile.Format}
                        </span>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg={6}>
                    <Card className="cstmCB">
                      <CardBody>
                        <span>
                        Created by: {cFaile.Person_id}
                        </span>
                      </CardBody>
                    </Card>
                  </Col>
               </Row>
             </CardBody>
           </Card>
          
            <Card>
              <CardBody>
                <h4>File Locations</h4>
                <Table className="customTable">
                  <thead>
                    <tr>
                      <td className="td-pcID">Computer Id</td>
                      <td className="td-FN">File Name</td>
                      <td className="td-FP">File_path</td>
                      <td className="td-pID">Person Id</td>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFile.Locations.map((x) => (
                      <>
                        <tr>
                          <td className="td-pcID">{x.Computer_id}</td>
                          <td className="td-FN">{x.File_name}</td>
                          <td className="td-FP">
                            <div
                              style={{
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "12px",
                              }}
                              className={
                                x.Computer_id === currentComputer.Computer_id
                                  ? "custom-link"
                                  : ""
                              }
                              title={x.File_path}
                              onClick={() => {
                                if (
                                  x.Computer_id === currentComputer.Computer_id
                                )
                                  this.openFolder(x.File_path);
                              }}
                            >
                              {x.File_path}
                            </div>
                          </td>
                          <td className="td-pID">{x.Person_id}</td>
                          {/* <td><img src={`${api.defaultUrl}/${x.Preview_img}`} alt="File preview"/></td> */}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            <Card>
              <CardHeader onClick={() => this.onToggle()}>
                <div className="d-flex align-items-center">
                  <h4>File Meta Information</h4>
                  <span
                    className="toggle toggle-icon ml-1 table-sm"
                    color="info"
                  >
                    <i
                      className={
                        this.state.isTogled === false
                          ? " ri-arrow-drop-down-fill"
                          : " ri-arrow-drop-up-fill"
                      }
                    ></i>
                  </span>
                </div>
              </CardHeader>

              <SlideToggle toggleEvent={this.state.toggleEvent} collapsed>
                {({ setCollapsibleElement }) => (
                  <div className="my-collapsible">
                    <div
                      className="my-collapsible__content"
                      ref={setCollapsibleElement}
                    >
                      <div className="my-collapsible__content-inner">
                        <CardBody>
                          
                            <Table className="customTable">
                              <thead>
                                <tr>
                                  <td>Metadata parameter</td>
                                  <td>Value</td>
                                </tr>
                              </thead>
                              <tbody>
                                {meta.map(({ Param_name, Value }) => (
                                  <>
                                    <tr>
                                      <td className="w-50">{Param_name}:</td>
                                      <td>{Value}</td>
                                    </tr>
                                  </>
                                ))}
                              </tbody>
                            </Table>
                        </CardBody>
                      </div>
                    </div>
                  </div>
                )}
              </SlideToggle>
            </Card>

            <Row>
              <Col lg={8}></Col>
              <Col lg={4}></Col>
            </Row>

            {this.state.modalAction === "download" ? (
              <>
                {this.state.downloadStep == "DOWNLOAD_FILE" && (
                  <>
                    <Modal
                      size="xl"
                      isOpen={this.state.modal}
                      switch={this.switch_modal}
                      centered={true}
                    >
                      <ModalHeader
                        toggle={() => this.setState({ modal: false })}
                        className="text-center"
                      >
                        Download file
                      </ModalHeader>
                      <ModalBody toggle={() => this.setState({ modal: false })}>
                        <FormGroup className="auth-form-group-custom mt-1">
                          <i className=" ri-numbers-line auti-custom-input-icon"></i>
                          <Label htmlFor="minDa">
                            Path to file on your computer
                          </Label>

                          <Input
                            name="dir"
                            type="text"
                            className="form-control"
                            id="dir"
                            value={FILES_DIR}
                            placeholder=""
                            readOnly={true}
                            style={{ fontWeight: "bold" }}
                          />
                        </FormGroup>

                        <FormGroup className="auth-form-group-custom mt-1">
                          <i className=" ri-numbers-line auti-custom-input-icon"></i>
                          <Label htmlFor="minDa">Choose a file name</Label>

                          <Input
                            name="File_Name"
                            type="text"
                            className="form-control"
                            id="fileName"
                            defaultValue={currentFile.File_name_fingerprint}
                            onChange={this.handleChange}
                            validate={{ required: true }}
                            placeholder="Enter a file name"
                          />
                        </FormGroup>
                      </ModalBody>
                      <ModalFooter>
                        <div className="justify-content-end">
                          <Button
                            color="success"
                            className="mr-2"
                            onClick={() => this.downloadFile()}
                          >
                            Save
                          </Button>
                          <Button color="danger" onClick={this.switch_modal}>
                            Cancel
                          </Button>
                        </div>
                      </ModalFooter>
                    </Modal>
                  </>
                )}
                {this.state.downloadStep == "OPEN_SAVED_FILE" && (
                  <>
                    <Modal
                      size="m"
                      isOpen={this.state.modal}
                      switch={this.switch_modal}
                      centered={true}
                    >
                      <ModalHeader
                        toggle={() => this.setState({ modal: false })}
                        className="text-center"
                      >
                        Do you want to open downloaded file?
                      </ModalHeader>
                      <ModalBody toggle={() => this.setState({ modal: false })}>
                        <p>
                          Folder: <b>{FILES_DIR}</b>
                        </p>
                        <p>
                          File:{" "}
                          <b
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "block",
                            }}
                            title={`${this.state.File_Name}.${currentFile.Format}`}
                          >
                            {this.state.File_Name}.{currentFile.Format}
                          </b>
                        </p>
                      </ModalBody>
                      <ModalFooter>
                        <div className="justify-content-end">
                          <Button
                            color="info"
                            className="mr-2"
                            onClick={this.openDocFolder}
                          >
                            Open Folder
                          </Button>
                          <Button
                            color="success"
                            className="mr-2"
                            onClick={this.openDownloadedFile}
                          >
                            Open File
                          </Button>
                          <Button color="danger" onClick={this.switch_modal}>
                            Cancel
                          </Button>
                        </div>
                      </ModalFooter>
                    </Modal>
                  </>
                )}
                {this.state.downloadStep ==
                  "FILE_WITH_SAME_NAME_ALREADY_EXISTS" && (
                  <>
                    <Modal
                      size="l"
                      isOpen={this.state.modal}
                      switch={this.switch_modal}
                      centered={true}
                    >
                      <ModalHeader
                        toggle={() => this.setState({ modal: false })}
                        className="text-center"
                      >
                        Warning
                      </ModalHeader>
                      <ModalBody toggle={() => this.setState({ modal: false })}>
                        {this.state.hasOwnProperty("storage") && (
                          <>
                            <div>
                              <h6>
                                Different file with same name already exists on
                                your PC:
                              </h6>
                              <h7 className="d-flex align-content-center">
                                <a
                                  href="#"
                                  onClick={() =>
                                    this.openFolder(this.state.storage.path)
                                  }
                                  title="Open containig folder"
                                  style={{
                                    fontWeight: "bold",
                                    color: "#5664d2",
                                    fontWeight: "100",
                                  }}
                                >
                                  <i class="ri-folder-open-line"></i>
                                </a>
                                &nbsp;
                                <a
                                  href="#"
                                  onClick={() =>
                                    this.openFile(this.state.storage.path)
                                  }
                                  title="Click to show the file"
                                >
                                  {this.state.storage.path}
                                </a>
                              </h7>
                            </div>
                          </>
                        )}

                        <h6 style={{ marginTop: "20px" }}>
                          You can
                          <Button
                            color="info"
                            className="mr-2"
                            onClick={this.rewriteFile}
                            style={{
                              lineHeight: "1",
                              padding: "5px",
                              margin: "0 5px",
                            }}
                          >
                            rewrite it
                          </Button>
                          or
                          <Button
                            color="info"
                            onClick={this.chooseAntoherFileName}
                            style={{
                              lineHeight: "1",
                              padding: "5px",
                              margin: "0 5px",
                            }}
                          >
                            choose another name
                          </Button>
                          for file to download
                        </h6>
                      </ModalBody>
                      <ModalFooter>
                        <div className="justify-content-end">
                          <Button color="danger" onClick={this.switch_modal}>
                            Cancel
                          </Button>
                        </div>
                      </ModalFooter>
                    </Modal>
                  </>
                )}
                {this.state.downloadStep == "FILE_ALREADY_EXISTS" && (
                  <>
                    <Modal
                      size="l"
                      isOpen={this.state.modal}
                      switch={this.switch_modal}
                      centered={true}
                    >
                      <ModalHeader
                        toggle={() => this.setState({ modal: false })}
                        className="text-center"
                      >
                        Same file already exists on your PC
                      </ModalHeader>
                      <ModalBody toggle={() => this.setState({ modal: false })}>
                        {this.state.hasOwnProperty("fileLocations") &&
                        Array.isArray(this.state.fileLocations) ? (
                          <>
                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                marginBottom: "0",
                              }}
                            >
                              Locations of this file on your PC
                            </p>
                            {this.state.fileLocations.map((x) => (
                              <>
                                <div
                                  style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                  }}
                                  className="d-flex align-items-center"
                                >
                                  <a
                                    href="#"
                                    onClick={() => this.removeFile(x)}
                                    title="Remove file from PC"
                                    style={{
                                      fontWeight: "bold",
                                      color: "#ff002e",
                                      fontSize: "16px",
                                      marginTop: "2px",
                                      fontWeight: "100",
                                    }}
                                  >
                                    <i class="ri-close-circle-line"></i>
                                  </a>
                                  &nbsp;
                                  <a
                                    href="#"
                                    onClick={() => this.openFolder(x)}
                                    title="Open containig folder"
                                    style={{
                                      fontWeight: "bold",
                                      color: "#5664d2",
                                      fontSize: "16px",
                                      marginTop: "2px",
                                      fontWeight: "100",
                                    }}
                                  >
                                    <i class="ri-folder-open-line"></i>
                                  </a>
                                  &nbsp;
                                  <a
                                    href="#"
                                    onClick={() => this.openFile(x)}
                                    title={`Click here to open file "${x}"`}
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {x}
                                  </a>
                                  <br />
                                </div>
                              </>
                            ))}
                          </>
                        ) : (
                          <></>
                        )}
                      </ModalBody>
                      <ModalFooter>
                        <div className="justify-content-end">
                          <Button
                            color="success"
                            onClick={() => {
                              this.setState({
                                downloadStep: "DOWNLOAD_FILE",
                                checkHash: false,
                              });
                            }}
                          >
                            Skip to download
                          </Button>
                          <Button color="danger" onClick={this.switch_modal}>
                            Cancel
                          </Button>
                        </div>
                      </ModalFooter>
                    </Modal>
                  </>
                )}
              </>
            ) : (
              <>
                <Modal
                  size="xl"
                  isOpen={this.state.modal}
                  switch={this.switch_modal}
                  centered={true}
                >
                  <ModalHeader
                    toggle={() => this.setState({ modal: false })}
                    className="text-center"
                  ></ModalHeader>
                  <ModalBody toggle={() => this.setState({ modal: false })}>
                    <div>
                      {/* <DocViewer
                        documents={docs}
                        pluginRenderers={DocViewerRenderers}
                        className="docView"
                      /> */}
                      <FileViewer
                        fileType={format}
                        filePath={`${
                          SERVER + this.state.currentFile.File_path
                        }`}
                      />
                    </div>
                  </ModalBody>
                </Modal>
              </>
            )}
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    settings: state.User.settings,
    personeData: state.User.persone,
    Core: state.User.globalData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onCaseLoad: () => dispatch(actions.getCase()),
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileView);
