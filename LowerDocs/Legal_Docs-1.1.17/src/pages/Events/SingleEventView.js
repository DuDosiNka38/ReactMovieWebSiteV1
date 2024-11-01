import React, { Component } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  CardHeader,
  Label,
} from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from "./../../store/user/actions";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import noteWindow from "../../services/notifications";
import PRIVILEGE from "../../services/privileges";
import SlideToggle from "react-slide-toggle";
import axios from "./../../services/axios";
import EventModal from "../../components/Events/EventModal";
import sysInfo from "./../../electron/services/sysInfo";
import PreloaderLD from "../../services/preloader-core";
import fn from "./../../services/functions";
import AddDocument from "./../../components/Document/AddDocument";
import SelectDocument from "../../components/Document/SelectDocument";
const { ipcRenderer, app } = require("electron");
const async = require("async");
const { SearchBar, ClearSearchButton } = Search;
const pathinfo = require("pathinfo");

const SERVER = axios.defaults.baseURL;

class SingleEventView extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "All Cases", link: "/allcases" },
      {
        title: `${this.props.match.params.caseId}`,
        link: `/caseview/${this.props.match.params.caseId}`,
      },
      { title: `${this.props.match.params.eventId}`, link: "#" },
    ],
    modal: false,
    doc_modal: false,
    select_modal: false,

    AN: "",
    selectedDocs: [],
    Case_NAME: this.props.match.params.caseId,
    Activity_Name: "",
    Activity_type: "",
    Owner: "",
    Comments: "",
    Tentative_Calendar_name: "",
    Tentative_date: "",
    Parent_Activity_Name: "",
    Parent_Activity_type: "",
    Time_estimate_days: "",
    Responsible_Person_id: "",
    Responsible_person_Role: "",
    notify: true,
    CDM: false,
    child: {
      selectedDocs: [],
      Case_NAME: this.props.match.params.caseId,
      Activity_Name: "",
      Activity_type: "",
      Owner: "",
      Comments: "",
      Tentative_Calendar_name: "",
      Tentative_date: "",
      Parent_Activity_Name: "",
      Parent_Activity_type: "",
      Time_estimate_days: "",
      Responsible_Person_id: "",
      Responsible_person_Role: "",
      notify: true,
    },
    toggleEvent: 0,
    isTogled: false,
    toggleChildeEvent: 0,
    isTogledChilde: false,
    modalAction: "",
  };

  Preloader = new PreloaderLD(this);
  deleteRow = this.deleteRow.bind(this);
  updateEvent = this.updateEvent.bind(this);
  prepareDocuments = this.prepareDocuments.bind(this);
  downloadFile = this.downloadFile.bind(this);
  showEventFolder = this.showEventFolder.bind(this);
  createZip = this.createZip.bind(this);
  getFilesFolder = this.getFilesFolder.bind(this);
  onToogleChange = this.onToogleChange.bind(this);

  switch_doc_modal = (e) => {
    this.setState((prevState) => ({
      doc_modal: !prevState.doc_modal,
    }));
  };
  select_modal = (e) => {
    this.setState((prevState) => ({
      select_modal: !prevState.select_modal,
    }));
  };

  async deleteRow(e) {
    const delRow = e.currentTarget.getAttribute("row");
    const doc = this.state.selectedDocs[delRow];
    let result = false;
    if (doc.DOC_ID !== "") {
      result = axios
        .post("/api/event/deleteDocument", doc)
        .then(function (response) {
          if (response.data.result) {
            noteWindow.isSuck("Document successfully delete from event!");
            return true;
          } else {
            noteWindow.isError(response.data.result_data.result_error_text);
            return false;
          }
        })
        .catch((response) => {
          noteWindow.isError(response);
          return false;
        });
    } else {
      result = true;
    }

    if (result) {
      this.state.selectedDocs.splice(delRow, 1);
      let state = this.state.selectedDocs.map((st) => st);
      this.setState({ selectedDocs: state });

      if (result) {
        this.props.onGlobalLoad();
      }
    }
  }
  onToogleChange() {
    this.setState({
      notify: !this.state.notify,
    });
    console.log(this.state.notify);
  }
  onSelectChange = (el, e) => {
    let p = this.state.selectedDocs;
    switch (el.name) {
      case "document":
        p[e.name]["DOC_ID"] = el.value;
        this.setState({ selectedDocs: p });
        break;

      case "rTypes":
        p[e.name]["Relation_type"] = el.value;
        this.setState({ selectedDocs: p });
        break;

      default:
        this.setState({ [el.name]: el.value });
        break;
    }
  };

  onChangeCheckbox = (el) => {
    const { checked } = el.currentTarget;
    this.setState({ notify: checked });
  };

  handleTableChange = (e) => {
    const rID = e.currentTarget.getAttribute("row");
    const { name, value } = e.currentTarget;
    let p = this.state.selectedDocs;
    p[rID][name] = value;
    this.setState({ selectedDocs: p });
  };

  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };
  onToggle = () => {
    this.setState({ toggleEvent: Date.now(), isTogled: !this.state.isTogled });
  };
  onToogleChilde = () => {
    this.setState({
      toggleChildeEvent: Date.now(),
      isTogledChilde: !this.state.isTogledChilde,
    });
  };
  async deleteRowChild(e) {
    const delRow = e.currentTarget.getAttribute("row");
    const doc = this.state.child.selectedDocs[delRow];
    let result = false;
    if (doc.DOC_ID !== "") {
      result = axios
        .post("/api/event/deleteDocument", doc)
        .then(function (response) {
          if (response.data.result) {
            noteWindow.isSuck("Document successfully delete from event!");
            return true;
          } else {
            noteWindow.isError(response.data.result_data.result_error_text);
            return false;
          }
        })
        .catch((response) => {
          noteWindow.isError(response);
          return false;
        });
    } else {
      result = true;
    }

    if (result) {
      this.state.child.selectedDocs.splice(delRow, 1);
      let state = this.state.child.selectedDocs.map((st) => st);
      let child = this.state.child;
      child.selectedDocs = state;
      this.setState({ child: child });

      if (result) {
        this.props.onGlobalLoad();
      }
    }
  }

  onSelectChangeChild = (el, e) => {
    let p = this.state.child.selectedDocs;
    let child = this.state.child;

    switch (el.name) {
      case "document":
        p[e.name]["DOC_ID"] = el.value;
        child.selectedDocs = p;
        this.setState({ child: child });
        break;

      case "rTypes":
        p[e.name]["Relation_type"] = el.value;
        child.selectedDocs = p;
        this.setState({ child: child });
        break;

      default:
        child[el.name] = el.value;
        this.setState({ child: child });
        break;
    }
  };

  onChangeCheckboxChild = (el) => {
    const { checked } = el.currentTarget;
    let child = this.state.child;
    child.notify = checked;

    this.setState({ child: child });
  };

  handleTableChangeChild = (e) => {
    const rID = e.currentTarget.getAttribute("row");
    const { name, value } = e.currentTarget;
    let p = this.state.child.selectedDocs;
    p[rID][name] = value;
    let child = this.state.child;
    child.selectedDocs = p;
    this.setState({ child: child });
  };

  handleChangeChild = (el) => {
    const { name, value } = el.currentTarget;
    let child = this.state.child;
    child[name] = value;
    this.setState({ child: child });
  };

  switch_modal = (act, switchModal) => {
    // const action = e.hasOwnProperty("currentTarget") ? e.currentTarget.getAttribute("attr-action") : e;

    this.setState({ modalAction: act });
    if (switchModal === null || switchModal === undefined) {
      this.setState((prevState) => ({
        modal: !prevState.modal,
      }));
    }
  };

  addedLinkToCell = (cell, row, rowIndex, formatExtraData) => {
    return (
      <>
        <NavLink
          to={`/app/case-explorer/case/${this.props.match.params.caseId}/document/${cell}`}
        >
          <Button
            className="m-0 px-2 py-1"
            type="button"
            color="primary"
            onClick={() => this.switch_modal(null)}
            value={cell}
            attr-row-id={rowIndex}
            name="del"
          >
            View
          </Button>
        </NavLink>
      </>
    );
  };
  componentDidMount() {
    this.setState({ toggleEvent: Date.now() });
    this.setState({ toggleChildeEvent: Date.now() });
  }

  setActivityData() {
    const { cases } = this.props;
    const { caseId, eventId } = this.props.match.params;
    const currentCase = cases.find((x) => x.Case_Short_NAME === caseId);

    if (currentCase === undefined) return <></>;

    const currentEvent = currentCase.Case_Events.find(
      (x) => x.Activity_Name === eventId
    );

    for (let key in currentEvent) {
      if (key === "Tentative_date_normal")
        this.setState({ Tentative_date: currentEvent[key] });

      if (key === "Activity_Title")
        this.setState({ Activity_Name: currentEvent[key] });

      if (key === "Activity_Name" || key === "Activity_type") {
        let child = this.state.child;
        const field = `Parent_${key}`;
        child[field] = currentEvent[key];
        this.setState({ child: child });
      }

      if (key === "Activity_Name") {
        this.setState({ AN: currentEvent[key] });
      }
      if (key !== "Tentative_date" || key !== "Activity_Name")
        this.setState({ [key]: currentEvent[key] });
    }

    this.setState({ selectedDocs: currentEvent.Docs });
    this.setState({ CDM: true });
  }

  getFilesFolder() {
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

    return FILES_DIR;
  }

  getCurrentComputer() {
    const { computers } = this.props;
    const MAC = sysInfo.get().uuid.macs[0];
    return computers.find((x) => x.Mac_Address === MAC);
  }

  async downloadFile(params) {
    const { personeData, computers } = this.props;
    const FILES_DIR = this.getFilesFolder();
    const currentComputer = this.getCurrentComputer();

    if (FILES_DIR === "/") {
      noteWindow.isError(
        "You need to select <a href='/app/settings'><u>App Folder</u></a>"
      );
    } else {
      const appDir = FILES_DIR;
      const fileDir = `/${params.Case_NAME}/Events/${params.Activity_Name}/${params.DOC_ID}`;
      const fileName = params.File_name;

      await ipcRenderer.send("downloadFile", {
        filePath: SERVER + params.File_path,
        fileName: fileName,
        appDir: appDir,
        fileDir: fileDir,
        hash: params.File_id,
      });
      await ipcRenderer.once("downloadFile", async (event, args) => {
        await this.addLocation({
          File_id: params.File_id,
          Person_id: personeData.Person_id,
          Computer_id: currentComputer.Computer_id,
          File_name: fileName,
          File_path: `${appDir}${fileDir}/${fileName}`,
          Preview_img: params.Preview_img,
          File_name_fingerprint: params.File_name_fingerprint,
          base_name_fingerprint: params.base_name_fingerprint,
        });
      });

      return true;
    }
  }

  async getFileData(hash) {
    const result = await axios
      .post("/api/file/get", {
        File_id: hash,
      })
      .then((response) => response.data)
      .catch((response) => response);

    await console.log(result);
  }

  async addLocation(data) {
    return await axios.post("/api/file/addLocation", data).then((r) => r.data);
  }

  prepareDocuments() {
    // this.Preloader.show();
    const FILES_DIR = this.getFilesFolder();

    if (FILES_DIR === "/" || FILES_DIR === undefined) {
      noteWindow.isError(
        "You need to select <a href='/app/settings'><u>App Folder</u></a>"
      );
    } else {
      const { cases } = this.props;
      const { caseId, eventId } = this.props.match.params;
      const currentCase = cases.find((x) => x.Case_Short_NAME === caseId);
      this.switch_modal("PREPARE_DOCS");

      const currentEvent = currentCase.Case_Events.find(
        (x) => x.Activity_Name === eventId
      );

      const docsId = currentEvent.Docs.map((x) => x.DOC_ID);
      const docs = currentCase.Case_Documents.filter((x) =>
        docsId.includes(x.DOC_ID)
      );

      let count = 0;

      docs.forEach((doc, i, a) => {
        const files = doc.Document_Files;
        files.forEach((file, ind, arr) => {
          count += 1;
        });
      });

      this.setState({
        prepare: { count: count, percent: 0, saveHierarchy: true },
      });

      async.mapLimit(docs, 1, async (doc) => {
        const files = doc.Document_Files;
        let counter = 1;
        let c = 0;
        await async.mapLimit(files, 1, async (file) => {
          counter += 1;
          setTimeout(async () => {
            c += 1;
            let prep =
              this.state.prepare !== undefined ? this.state.prepare : {};
            prep.currentFile = file.File_name;
            prep.percent =
              count !== c ? prep.percent + Math.round(100 / count) : 100;
            this.setState({ prepare: prep });
            await this.downloadFile({
              Case_NAME: currentCase.Case_Short_NAME,
              Activity_Name: currentEvent.Activity_Name,
              DOC_ID: doc.DOC_ID,
              File_path: file.File_Path,
              File_name: file.File_name,
              Format: file.Format,
              File_id: file.File_id,
              Preview_img: file.Preview_img,
              base_name_fingerprint: file.base_name_fingerprint,
              File_name_fingerprint: file.File_name_fingerprint,
            });
          }, 100 * counter);
        });
      });
    }
  }

  showEventFolder() {
    const { Case_NAME, AN } = this.state;
    const FILES_DIR = this.getFilesFolder();

    const folder = `${FILES_DIR}/${Case_NAME}/Events/${AN}/`;

    ipcRenderer.send("openFolder", { path: folder });
  }

  createZip() {
    const { Case_NAME, AN, prepare } = this.state;
    const FILES_DIR = this.getFilesFolder();

    const folder = `${FILES_DIR}/${Case_NAME}/Events/${AN}`;
    const locToSave = `${FILES_DIR}/${Case_NAME}/Events/`;
    const zipName = `${AN}`;

    prepare.folder = folder;
    prepare.locToSave = locToSave;
    prepare.zipName = zipName;

    this.setState({ prepare: prepare });

    ipcRenderer.send("createZip", {
      toZip: folder,
      locToSave: locToSave,
      zipName: zipName,
      saveHierarchy: prepare.saveHierarchy,
    });
    ipcRenderer.on("createZip", (event, args) => {
      if (args.result !== false) {
        this.switch_modal("ARCHIVE_CREATED");
      } else {
        noteWindow.isError("Something went wrong! Try again.");
      }
    });
  }

  componentDidUpdate(prewState, prewProps) {
    if (!this.state.CDM) this.setActivityData();

    if (
      this.state.CDM &&
      this.state.AN !== "" &&
      this.props.match.params.eventId !== this.state.AN
    )
      this.setActivityData();
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
  }

  updateEvent() {
    let data = new Date(this.state.Tentative_date).getTime();
    const result = axios
      .post("/api/event/update", {
        Case_NAME: this.state.Case_NAME,
        Activity_Name: this.props.match.params.eventId,
        Activity_Title: this.state.Activity_Name,
        Activity_type: this.state.Activity_type,
        Owner: this.state.Owner,
        Comments: this.state.Comments,
        Tentative_Calendar_name: this.state.Tentative_Calendar_name,
        Tentative_date: data.toString().slice(0, -3),
        Parent_Activity_Name: this.state.Parent_Activity_Name,
        Parent_Activity_type: this.state.Parent_Activity_type,
        Time_estimate_days: this.state.Time_estimate_days,
        docs: this.state.selectedDocs,
        notify: this.state.notify,
      })
      .then(function (response) {
        if (response.data.result) {
          noteWindow.isSuck("Event successfully updated!");
          return true;
        } else {
          noteWindow.isError(response.data.result_data.result_error_text);
          return false;
        }
      })
      .catch((response) => {
        noteWindow.isError(response);
        return false;
      });

    if (result) {
      setTimeout(this.props.onGlobalLoad(), 100);
    }

    setTimeout(this.setState({ modal: false }), 200);
  }

  addEvent = async () => {
    let data = new Date(this.state.child.Tentative_date).getTime();
    const result = axios
      .post("/api/event/add", {
        Case_NAME: this.state.child.Case_NAME,
        Activity_Name: this.state.child.Activity_Name,
        Activity_type: this.state.child.Activity_type,
        Owner: this.state.child.Owner,
        Comments: this.state.child.Comments,
        Tentative_Calendar_name: this.state.child.Tentative_Calendar_name,
        Tentative_date: data.toString().slice(0, -3),
        Parent_Activity_Name: this.state.child.Parent_Activity_Name,
        Parent_Activity_type: this.state.child.Parent_Activity_type,
        Time_estimate_days: this.state.child.Time_estimate_days,
        Responsible_Person_id: this.props.personeData.Person_id,
        docs: this.state.child.selectedDocs,
      })
      .then(function (response) {
        if (response.data.result) {
          noteWindow.isSuck("Event Added!");

          return true;
        } else {
          noteWindow.isError(response.data.result_data.result_error_text);
          return false;
        }
      })
      .catch((response) => {
        noteWindow.isError(response);
        return false;
      });

    if (result) {
      this.props.onGlobalLoad();
    }
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  onChangeRadio = (e) => {
    const { prepare } = this.state;
    prepare.saveHierarchy = e.currentTarget.value;
    e.target.checked = true;
    this.setState({ prepare: prepare });
  };

  render() {
    if (!this.state.CDM) return <></>;

    if (this.props.personeData === undefined) return <></>;

    const pData = this.props.personeData;

    if (!PRIVILEGE.check("SHOW_CASE_EVENTS", pData))
      return (
        <>
          <div className="page-content">
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h5>You don't have permissions to see this page!</h5>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      );

    const { cases } = this.props;
    const { caseId, eventId } = this.props.match.params;
    const currentCase = cases.find((x) => x.Case_Short_NAME === caseId);
    const currentCaseChilde = cases.find((x) => x.Case_Short_NAME === caseId);

    if (currentCase === undefined) return <></>;

    const currentEvent = currentCase.Case_Events.find(
      (x) => x.Activity_Name === eventId
    );

    const docsId = currentEvent.Docs.map((x) => x.DOC_ID);
    const docs = currentCase.Case_Documents.filter((x) =>
      docsId.includes(x.DOC_ID)
    );

    if (currentEvent === undefined)
      window.location.href = `/caseview/${caseId}`;

    const deleteEvent = async () => {
      const result = await axios
        .post("/api/event/delete", {
          Activity_Name: eventId,
        })
        .then(function (r) {
          if (r.data.result) document.location.replace(`/app/case-explorer/case/${caseId}/events`);
          else console.log(r.data);
        })
        .catch((response) => console.log(response));
    };
    const columns = [
      {
        dataField: "DOC_ID",
        text: "View",
        formatter: this.addedLinkToCell,
      },
      {
        dataField: "DOCUMENT_NAME",
        text: "Document Name",
      },
      {
        dataField: "DOCUMENT_TYPE",
        text: "Document Type",
      },
      {
        dataField: "Description",
        text: "Description",
      },
    ];
    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <div className="btn-group" role="group">
        {options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? "btn-secondary" : "btn-light"}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    );

    const pagination = {
      sizePerPageRenderer,
    };
    const Case_Name = currentCase.Case_Full_NAME;

    const l = currentEvent.Activity_Name;
    return (
      <>
        {this.Preloader.get()}
        <div className="">
          <Container fluid>
            {/* <Breadcrumbs
              title=
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}

            <Row className="align-items-center">
              <Col lg={4}>
                <Card>
                  <CardBody>
                  <h5 className="event_header">
                  {`Case: ${Case_Name}`} 
                </h5>
                  </CardBody>
                </Card>
              </Col>
             
              <Col lg={8}>
                <Card>
                  <CardBody>
                    {PRIVILEGE.check("EDIT_CASE_EVENT", pData) ||
                    PRIVILEGE.check("DELETE_CASE_EVENT", pData) ? (
                      <>
                        <div className="toolbar  case-toolbar ">
                          <div className="btnbar d-flex">
                            {PRIVILEGE.check("EDIT_CASE_EVENT", pData) && (
                              <>
                                <Button
                                  color="info"
                                  attr-action="edit"
                                  onClick={() =>
                                    this.switch_modal("EDIT_EVENT")
                                  }
                                  className="d-flex align-items-center mr-3"
                                >
                                  <i className=" ri-pencil-line font-size-20 mr-1  auti-custom-input-icon "></i>{" "}
                                  Edit Event
                                </Button>
                              </>
                            )}

                            <>
                              <Button
                                color="primary"
                                className="d-flex align-items-center "
                                onClick={() =>
                                  this.switch_modal("ADD_CHILD_EVENT")
                                }
                                attr-action="add"
                              >
                                <i className="ri-add-box-fill font-size-20 mr-1  auti-custom-input-icon "></i>{" "}
                                Add Child Event
                              </Button>
                            </>
                            {docs.length !== 0 && (
                              <>
                                <Button
                                  color="warning"
                                  className="d-flex align-items-center ml-3"
                                  onClick={this.prepareDocuments}
                                  attr-action="prepare"
                                >
                                  <i class="ri-file-copy-2-line font-size-20 mr-1  auti-custom-input-icon"></i>{" "}
                                  Prepare Documents To Event
                                </Button>
                              </>
                            )}
                            {PRIVILEGE.check("DELETE_CASE_EVENT", pData) && (
                              <>
                                <Button
                                  color="danger"
                                  className="d-flex align-items-center ml-3"
                                  onClick={() =>
                                    this.switch_modal("DELETE_EVENT")
                                  }
                                  attr-action="del"
                                >
                                  <i className="ri-delete-bin-line font-size-20 mr-1  auti-custom-input-icon "></i>{" "}
                                  Delete Event
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
<Row>
<Col lg={12}>
                <Card>
                  <CardBody>
                  <span className="event_title">{`Event: "${currentEvent.Activity_Title}"`}</span>
                  </CardBody>
                </Card>
              </Col>
</Row>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col lg={4}>
                        <h6>Event Name:</h6>
                        <p className="mr-1   font-size-16 customTitle ">
                          {currentEvent.Activity_Title}
                        </p>
                      </Col>

                      <Col lg={4}>
                        <h6>Responsible Person:</h6>
                        <p className="mr-1   font-size-16 customTitle ">
                          {currentEvent.Responsible_Person_id}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <h6>Responsible Person Role:</h6>
                        <p className="mr-1   font-size-16 customTitle ">
                          {currentEvent.Responsible_person_Role}
                        </p>
                      </Col>
                      <Col lg={4}>
                        <h6>Parent Activity Name:</h6>
                        <p className="mr-1   font-size-16 customTitle ">
                          {currentEvent.Parent_Activity_Name}
                        </p>
                      </Col>

                      <Col lg={4}>
                        <h6>Parent Activity Type:</h6>
                        <p className="mr-1   font-size-16 customTitle ">
                          {currentEvent.Parent_Activity_type}
                        </p>
                      </Col>

                      <Col lg={4}>
                        <h6>Tentative Date:</h6>
                        <p className="mr-1   font-size-16 customTitle ">
                          {currentEvent.Tentative_date_human}
                        </p>
                      </Col>

                      <Col lg={4}>
                        <h6>Time Estimate Days:</h6>
                        <p className="mr-1   font-size-16 customTitle ">
                          {currentEvent.Time_estimate_days}
                        </p>
                      </Col>

                      <Col lg={4}>
                        <h6>Comments:</h6>
                        <p className="mr-1   font-size-16 customTitle ">
                          {currentEvent.Comments}
                        </p>
                      </Col>
                    </Row>
                    {/* <Row>
                     
                    </Row> */}
                  </CardBody>
                </Card>
              </Col>
              <Col lg={12}>
                <Card>
                  <CardHeader>
                    <div className="d-flex align-items-center justify-content-between">
                      <div
                        className="d-flex align-items-center "
                        onClick={this.onToggle}
                      >
                        <h5 className="d-flex align-items-center">
                          Event Documents{" "}
                          <span className="card-counter">{docs.length}</span>
                        </h5>
                        <span className="toggle toggle-icon ml-1" color="info">
                          <i
                            className={
                              this.state.isTogled === false
                                ? " ri-arrow-drop-down-fill"
                                : " ri-arrow-drop-up-fill"
                            }
                          ></i>
                        </span>
                      </div>
                      <Button
                        color="success"
                        className="ml-3 d-flex align-items-center"
                        onClick={() => this.switch_modal("SELECT_TYPE")}
                      >
                        <i className="ri-file-add-line font-size-20 mr-1  auti-custom-input-icon "></i>
                        Add Document
                      </Button>
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
                              {PRIVILEGE.check(
                                "SHOW_EVENT_DOCUMENTS",
                                pData
                              ) ? (
                                <>
                                  {docs.length === 0 ? (
                                    <>
                                      <h6>Documents list is empty.</h6>
                                    </>
                                  ) : (
                                    <>
                                      <ToolkitProvider
                                        bootstrap4
                                        keyField="1"
                                        data={docs}
                                        columns={columns}
                                        className="striped"
                                        search
                                      >
                                        {(props) => (
                                          <div>
                                            <Row className="d-flex align-items-center justify-content-between">
                                              <Col lg="11">
                                                <SearchBar
                                                  className="mb-3"
                                                  onChang={this.handleChange}
                                                  {...props.searchProps}
                                                  style={{
                                                    width: "400px",
                                                    height: "40px",
                                                  }}
                                                />
                                              </Col>

                                              <Col
                                                lg={1}
                                                className="d-flex justify-content-end mb-4"
                                              >
                                                <ClearSearchButton
                                                  {...props.searchProps}
                                                  className="btn btn-info"
                                                />
                                              </Col>
                                            </Row>
                                            <div className="some-table">
                                              <BootstrapTable
                                                {...props.baseProps}
                                                filter={filterFactory()}
                                                noDataIndication="There is no solution"
                                                pagination={
                                                  docs.length > 10 &&
                                                  paginationFactory(pagination)
                                                }
                                                striped
                                                hover
                                                condensed
                                                className="custom-table"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </ToolkitProvider>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <h5>
                                    You don't have permissions to see event
                                    documents
                                  </h5>
                                </>
                              )}
                            </CardBody>
                          </div>
                        </div>
                      </div>
                    )}
                  </SlideToggle>
                </Card>
              </Col>
              <Col lg={12}>
                <Card>
                  <CardHeader onClick={this.onToogleChilde}>
                    <div className="d-flex align-items-center">
                      <h5 className="d-flex align-items-center">
                        Child events{" "}
                        <span className="card-counter">
                          {currentEvent.Child_Events.length}
                        </span>
                      </h5>

                      <span className="toggle toggle-icon ml-1" color="info">
                        <i
                          className={
                            this.state.isTogledChilde === false
                              ? " ri-arrow-drop-down-fill"
                              : " ri-arrow-drop-up-fill"
                          }
                        ></i>
                      </span>
                    </div>
                  </CardHeader>

                  <SlideToggle
                    toggleEvent={this.state.toggleChildeEvent}
                    collapsed
                  >
                    {({ setCollapsibleElement }) => (
                      <div className="my-collapsible">
                        <div
                          className="my-collapsible__content"
                          ref={setCollapsibleElement}
                        >
                          <div className="my-collapsible__content-inner">
                            <CardBody>
                              {currentEvent.Child_Events.length !== 0 ? (
                                <>
                                  <Table className=" table  table-sm custom-table">
                                    <thead>
                                      <tr>
                                        <td>Link</td>
                                        <td>Activity_Title</td>
                                        <td>Activity_type</td>
                                        <td>Comments</td>
                                        <td>Time_estimate_days</td>
                                        <td>Tentative_date_human</td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {currentEvent.Child_Events.map((e) => (
                                        <>
                                          <tr>
                                            <td>
                                              <NavLink
                                                to={`/app/case-explorer/case/${this.props.match.params.caseId}/event/${e.Activity_Name}`}
                                              >
                                                <Button
                                                  className="m-0 px-2 py-1"
                                                  type="button"
                                                  color="primary"
                                                >
                                                  View
                                                </Button>
                                              </NavLink>
                                            </td>
                                            <td>{e.Activity_Title}</td>
                                            <td>{e.Activity_type}</td>
                                            <td>{e.Comments}</td>
                                            <td>{e.Time_estimate_days}</td>
                                            <td>{e.Tentative_date_human}</td>
                                          </tr>
                                        </>
                                      ))}
                                    </tbody>
                                  </Table>
                                </>
                              ) : (
                                <>
                                  <h6>No child events yet</h6>
                                </>
                              )}
                            </CardBody>
                          </div>
                        </div>
                      </div>
                    )}
                  </SlideToggle>
                </Card>
                <Card></Card>
              </Col>
              {this.state.modalAction === "PREPARE_DOCS" && (
                <>
                  <Modal
                    isOpen={this.state.modal}
                    switch={() => this.switch_modal(null)}
                    centered={true}
                    size="l"
                  >
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      {this.state.prepare.percent < 100 ? (
                        <>Processing {this.state.prepare.percent}%</>
                      ) : (
                        <>Successfully downloaded</>
                      )}
                    </ModalHeader>
                    <ModalBody toggle={() => this.setState({ modal: false })}>
                      {this.state.prepare.percent < 100 ? (
                        <>
                          <b
                            style={{
                              display: "block",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: "12px",
                            }}
                          >
                            {this.state.prepare.currentFile}
                          </b>
                          <div
                            className="load-block"
                            style={{
                              width: "100%",
                              border: "2px solid #21a27c",
                              "border-radius": "5px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              className="loaded"
                              style={{
                                width: `${this.state.prepare.percent}%`,
                                height: "100%",
                                background: "#1cbb8c",
                                color: "#fff",
                                fontWeight: "900",
                                fontSize: "12px",
                                padding: "5px 2px",
                                textAlign: "center",
                              }}
                            >
                              {this.state.prepare.percent}%
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            color="success"
                            onClick={this.showEventFolder}
                            // onClick={deleteEvent}
                          >
                            Open containig folder
                          </Button>
                          <Button
                            type="button"
                            color="info"
                            onClick={() =>
                              this.switch_modal("CREATE_ARCHIVE", true)
                            }
                            // onClick={deleteEvent}
                          >
                            <i class="ri-folder-zip-line"></i> Create archive
                          </Button>
                        </>
                      )}
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                  </Modal>
                </>
              )}
              {this.state.modalAction === "CREATE_ARCHIVE" && (
                <>
                  <Modal
                    isOpen={this.state.modal}
                    switch={() => this.switch_modal(null)}
                    centered={true}
                    size="l"
                  >
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      Create archive
                    </ModalHeader>
                    <ModalBody toggle={() => this.setState({ modal: false })}>
                      <h6>Do you want to save hierarchy of directories?</h6>
                      <div class="border-0 p-0 h-auto is-touched is-dirty av-valid">
                        <div class="form-check">
                          <input
                            name="saveHierarchy"
                            label="Yes"
                            id="radio-saveHierarchy-true"
                            required=""
                            type="radio"
                            class="is-touched is-dirty av-valid form-check-input"
                            value="true"
                            onClick={this.onChangeRadio}
                            defaultChecked
                          />
                          <label
                            for="radio-saveHierarchy-true"
                            class="form-check-label"
                          >
                            Yes
                          </label>
                        </div>
                        <div class="form-check">
                          <input
                            name="saveHierarchy"
                            label="No"
                            id="radio-saveHierarchy-false"
                            required=""
                            type="radio"
                            class="is-touched is-dirty av-valid form-check-input"
                            value="false"
                            onClick={this.onChangeRadio}
                          />
                          <label
                            for="radio-saveHierarchy-false"
                            class="form-check-label"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        type="button"
                        color="success"
                        onClick={this.createZip}
                      >
                        Create
                      </Button>
                      <Button
                        type="button"
                        color="danger"
                        onClick={() => this.switch_modal(null)}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}
              {this.state.modalAction === "ARCHIVE_CREATED" && (
                <>
                  <Modal
                    isOpen={this.state.modal}
                    switch={() => this.switch_modal(null)}
                    centered={true}
                    size="m"
                  >
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      Archive successfully created
                    </ModalHeader>
                    <ModalBody toggle={() => this.setState({ modal: false })}>
                      <Button
                        type="button"
                        color="success"
                        onClick={() =>
                          fn.openFolder(this.state.prepare.locToSave)
                        }
                        // onClick={deleteEvent}
                      >
                        Open containig folder
                      </Button>
                      <Button
                        type="button"
                        color="info"
                        onClick={() =>
                          fn.openFile(
                            `${this.state.prepare.locToSave}.${this.state.prepare.zipName}`
                          )
                        }
                      >
                        <i class="ri-folder-zip-line"></i> Open archive
                      </Button>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        type="button"
                        color="primary"
                        onClick={() => this.switch_modal(null)}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}
              {this.state.modalAction === "EDIT_EVENT" && (
                <>
                  <Modal
                    isOpen={this.state.modal}
                    switch={() => this.switch_modal(null)}
                    centered={true}
                    size="xl"
                  >
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      Edit Event
                    </ModalHeader>
                    <ModalBody toggle={() => this.setState({ modal: false })}>
                      <AvForm onValidSubmit={this.updateEvent}>
                        <EventModal
                          Case_NAME={this.state.Case_NAME}
                          Activity_Name={this.state.Activity_Name}
                          Activity_type={this.state.Activity_type}
                          Owner={this.state.Owner}
                          Comments={this.state.Comments}
                          Tentative_Calendar_name={
                            this.state.Tentative_Calendar_name
                          }
                          Tentative_date={this.state.Tentative_date}
                          Parent_Activity_Name={this.state.Parent_Activity_Name}
                          Parent_Activity_type={this.state.Parent_Activity_type}
                          Time_estimate_days={this.state.Time_estimate_days}
                          Responsible_Person_id={
                            this.state.Responsible_Person_id
                          }
                          Responsible_person_Role={
                            this.state.Responsible_person_Role
                          }
                          handleChange={this.handleChange}
                          onSelectChange={this.onSelectChange}
                          calendars={this.props.calendars}
                          events={currentCase.Case_Events}
                          relationType={this.props.reltype}
                          docs={currentCase.Case_Documents}
                          selectedDocs={this.state.selectedDocs}
                          handleTableChange={this.handleTableChange}
                          deleteRow={this.deleteRow}
                          eventId={eventId}
                          onChangeCheckbox={this.onChangeCheckbox}
                          notify={this.state.notify}
                          calendarType="no_calendar"
                          onToogleChange={this.onToogleChange}
                        />

                        <Button className="posAButton evPos" color="success">
                          Update <br /> Event
                        </Button>
                      </AvForm>
                    </ModalBody>
                  </Modal>
                </>
              )}
              {this.state.modalAction === "ADD_CHILD_EVENT" && (
                <>
                  <Modal
                    isOpen={this.state.modal}
                    switch={() => this.switch_modal(null)}
                    centered={true}
                    size="xl"
                  >
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      Add Child Event
                    </ModalHeader>
                    <ModalBody toggle={() => this.setState({ modal: false })}>
                      <AvForm onValidSubmit={this.addEvent}>
                        <EventModal
                          Case_NAME={this.state.Case_NAME}
                          Activity_Name={this.state.child.Activity_Name}
                          Activity_type={this.state.child.Activity_type}
                          Owner={this.state.child.Owner}
                          Comments={this.state.child.Comments}
                          Tentative_Calendar_name={
                            this.state.child.Tentative_Calendar_name
                          }
                          Tentative_date={this.state.child.Tentative_date}
                          Parent_Activity_Name={
                            this.state.child.Parent_Activity_Name
                          }
                          Parent_Activity_type={this.state.Parent_Activity_type}
                          Time_estimate_days={
                            this.state.child.Time_estimate_days
                          }
                          Responsible_Person_id={
                            this.state.child.Responsible_Person_id
                          }
                          Responsible_person_Role={
                            this.state.child.Responsible_person_Role
                          }
                          handleChange={this.handleChangeChild}
                          onSelectChange={this.onSelectChangeChild}
                          calendars={this.props.calendars}
                          events={currentCaseChilde.Case_Events}
                          relationType={this.props.reltype}
                          docs={currentCase.Case_Documents}
                          selectedDocs={this.state.child.selectedDocs}
                          handleTableChange={this.handleTableChangeChild}
                          deleteRow={this.deleteRowChild}
                          eventId={eventId}
                          onChangeCheckbox={this.onChangeCheckbox}
                          notify={this.state.notify}
                        />

                        <Button className="posAButton evCh" color="success">
                          Add
                          <br /> Child <br /> Event
                        </Button>
                      </AvForm>
                    </ModalBody>
                  </Modal>
                </>
              )}
              {this.state.modalAction === "DELETE_EVENT" && (
                <>
                  <Modal
                    isOpen={this.state.modal}
                    switch={() => this.switch_modal(null)}
                    centered={true}
                    size="m"
                  >
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      Delete Event
                    </ModalHeader>
                    <ModalBody toggle={() => this.setState({ modal: false })}>
                      <p>
                        Are you sure you want to delete
                        <span className="accent_text"></span>?
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        type="button"
                        color="danger"
                        onClick={deleteEvent}
                      >
                        Delete
                      </Button>
                      <Button
                        type="button"
                        color="primary"
                        onClick={() => this.setState({ modal: false })}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              {this.state.modalAction === "SELECT_TYPE" && (
                <>
                  <Modal
                    isOpen={this.state.modal}
                    switch={() => this.switch_modal(null)}
                    centered={true}
                    size="m"
                  >
                    {" "}
                    <ModalHeader
                      toggle={() => this.setState({ modal: false })}
                      className="text-center"
                    >
                      Select type
                    </ModalHeader>
                    <ModalFooter>
                      <Button
                        type="button"
                        color="success"
                        className="mr-2"
                        onClick={() =>
                          this.setState((prevState) => ({
                            doc_modal: !prevState.doc_modal,
                            modal: false,
                          }))
                        }
                      >
                        Add New Document
                      </Button>
                      <Button
                        type="button"
                        color="success"
                        onClick={() =>
                          this.setState((prevState) => ({
                            select_modal: !prevState.select_modal,
                            modal: false,
                          }))
                        }
                      >
                        Select an existing document
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              )}

              <AddDocument
                modal={this.state.doc_modal}
                switch_modal={this.switch_doc_modal}
                whereopen="inside_case"
                case={this.props.match.params.caseId}
                addfromevent ={true}
                eventName={eventId}
                eventType={this.state.Activity_type}
              

              ></AddDocument>

              <SelectDocument
                modaltype={this.state.select_modal}
                select_modal={this.select_modal}
                caseId={this.props.match.params.caseId}
                eventName={eventId}
                eventType={this.state.Activity_type}
              />
            </Row>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    calendars: state.User.calendars,
    reltype: state.User.relationType,
    personeData: state.User.persone,
    settings: state.User.settings,
    computers: state.User.globalData.Computers,
    // doc:
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // onCaseLoad: () => dispatch(actions.getCase()),
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleEventView);
