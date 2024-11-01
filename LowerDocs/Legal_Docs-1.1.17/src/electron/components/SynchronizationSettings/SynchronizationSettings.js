import React, { Component } from "react";
import {
  Row,
  Button,
  Col,
  Container,
  Card,
  CardBody,
  FormGroup,
  Label,
  CardHeader,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "./../../../services/axios";
import noteWindow from "../../../services/notifications";
import * as actions from "./../../../store/user/actions";
import { connect } from "react-redux";
import sysInfo from "./../../../electron/services/sysInfo";
import SlideToggle from "react-slide-toggle";
import authCore from "./../../../../src/electron/services/core";
import Select from "react-select";
import * as syncActions from "./../../../store/sync/actions";

const { ipcRenderer } = require("electron");
let path = null;

class SynchronizationSettongs extends Component {
  state = {
    path: "",
    toggleEvent: 0,
    isTogled: false,
    syncFolders: null,
    Sync_time: null,
    isSyncBlocked: false,
    modal: true,
    Users: [],

    MODAL_ACTION: null,

    selectedPersons: [],

    addNewSchedule: null,
  };

  selectDir = this.selectDir.bind(this);
  setSyncSchedule = this.setSyncSchedule.bind(this);

  switch_modal = (action) => {
    const { MODAL_ACTION } = this.state;

    console.log(action, MODAL_ACTION);

    this.setState((prevState) => ({
      MODAL_ACTION: action,
      modal: action === undefined || action === MODAL_ACTION ? !prevState.modal : true,
    }));

    this.render();
  };

  onToggle = () => {
    this.setState({ toggleEvent: Date.now(), isTogled: !this.state.isTogled });
  };

  componentDidMount() {
    this.setDefaultScheduleData();
    ipcRenderer.send("IS_SYNC_BLOCKED", {});
    ipcRenderer.on("IS_SYNC_BLOCKED", (event, args) => {
      this.setState({ isSyncBlocked: args.isSyncBlocked });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
  }

  onSelectChange = (el) => {
    this.setState({ [el.name]: el.value });
  };

  usersSelectChange = (el, e) => {
    this.setState({ Users: el });
  };

  setSyncSchedule() {
    const { syncInfo } = this.props;
    let { addNewSchedule } = this.state;
    addNewSchedule.Sync_days = addNewSchedule.Sync_days.map((x) => x.value);
    addNewSchedule.Person_id = this.props.personeData.Person_id;
    addNewSchedule.Computer_id = sysInfo.get().os.hostname;

    axios.post("/api/sync/setSyncSchedule", addNewSchedule).then((r) => {
      const { result, result_data } = r.data;
      if (result === true) {
        this.switch_modal();
        noteWindow.isSuck("Data successfully updated!");
        this.props.onGlobalLoad();
        syncInfo.update();
        this.setDefaultScheduleData();
      } else {
        noteWindow.isError(result_data);
      }
    });
  }

  addNewSyncFolder = () => {
    const { addNewSchedule } = this.state;
    addNewSchedule.Directory_name.push("");
    this.setState({ addNewSchedule });
  };
  selectDir() {
    const { addNewSchedule } = this.state;
    ipcRenderer.send("select-sync-dirs", {});
    ipcRenderer.once("select-sync-dirs", async (event, arg) => {
      if (arg !== null) {
        addNewSchedule.Directory_name.push(arg[0]);
        this.setState({ addNewSchedule });
      }
    });
  }
  deletePath(index) {
    const { addNewSchedule } = this.state;
    addNewSchedule.Directory_name.splice(index, 1);
    this.setState({ addNewSchedule });
  }

  handleChange = (e) => {
    const { name, value } = e.currentTarget;
    const { addNewSchedule } = this.state;

    addNewSchedule[name] = value;

    this.setState({ addNewSchedule });
  };

  onMultiChange = (arr, e) => {
    const { name } = e;
    const { addNewSchedule } = this.state;

    addNewSchedule[name] = arr;

    this.setState({ addNewSchedule });
  };

  removeSyncScheduleRow = (row, i) => {
    const { syncInfo } = this.props;

    const el = document.body.querySelector(`tr[attr-index='${i}']`);
    el.classList.add("removing");

    axios
      .post("/api/sync/removeSyncScheduleRow", {
        Person_id: row.Person_id,
        Computer_id: row.Computer_id,
        Directory_name: row.Directory_name,
      })
      .then((r) => {
        setTimeout(() => el.classList.remove("removing"), 500);
        this.props.onGlobalLoad();
        syncInfo.update();
      });
  };

  setDefaultScheduleData = () => {
    this.setState({
      addNewSchedule: {
        Sync_time: `${`${new Date().getHours()}`.padStart(
          2,
          0
        )}:${`${new Date().getMinutes()}`.padStart(2, 0)}:00`,
        Sync_days: [],
        Directory_name: [],
      },
    });
  };

  isSelectedPerson = (pid) => {
    const { selectedPersons } = this.state;
    return selectedPersons.includes(pid);
  }

  togglePerson = (pid) => {
    const { selectedPersons } = this.state;
    if(this.isSelectedPerson(pid)){
      selectedPersons.splice(selectedPersons.indexOf(pid), 1);
    } else {
      selectedPersons.push(pid);
    }

    this.setState({selectedPersons: selectedPersons});

    console.log(selectedPersons)
  }

  shareSyncToPersons = () => {
    const { selectedPersons } = this.state;
    const { personeData } = this.props;

    if(selectedPersons.length === 0){
      noteWindow.isError("You need to select persons!");
    } else {
      selectedPersons.map((x, i) => {
        axios.post("/api/sync/shareToPerson", {
          Person_id: personeData.Person_id,
          Share_to_Person_id: x
        }).then((r) => {
          if(i === selectedPersons.length-1){
            this.switch_modal();
            this.props.onGlobalLoad();
          }
        })
      });
    }
  }

  unshareSyncToPersons = (i, pid) => {
    const { personeData } = this.props;

    const el = document.body.querySelector(`tr[attr-index='${i}']`);
    el.classList.add("removing");

    axios.post("/api/sync/unshareToPerson", {
      Person_id: personeData.Person_id,
      Share_to_Person_id: pid
    }).then((r) => {
      this.props.onGlobalLoad();
      setTimeout(() => el.classList.remove("removing"), 500);
    })
  }

  render() {
    if (!sysInfo.isLoad()) return <></>;

    const DAYS = [
      { label: "Sunday", value: 7 },
      { label: "Monday", value: 1 },
      { label: "Tuesday", value: 2 },
      { label: "Wednesday", value: 3 },
      { label: "Thursday", value: 4 },
      { label: "Friday", value: 5 },
      { label: "Saturday", value: 6 },
    ];

    const { values, syncFolders, addNewSchedule, MODAL_ACTION } = this.state;
    let { settings, personeData, sp, Core, Users } = this.props;

    // Users = Users.filter((x) => x.visible === true);

    if(Core === undefined || Core.length === 0)
      return null;

    const { Sync_Schedule, Sync_Share } = Core;
    const Computer_id = sysInfo.get().os.hostname;

    const Share_To = Sync_Share.filter((x) => x.Person_id === personeData.Person_id);

    if (addNewSchedule === null) return null;

    const userSchedule =
      Sync_Schedule !== undefined
        ? Sync_Schedule.filter(
            (x) =>
              x.Person_id === personeData.Person_id &&
              x.Computer_id === Computer_id
          )
        : [];

    const MAC = sysInfo.get().uuid.macs[0];

    if (
      !settings.hasOwnProperty("USER") ||
      !personeData.hasOwnProperty("Person_id")
    )
      return <></>;

    return (
      <>
        <Container fluid>
          <Row>
            <Col lg={12} style={{ position: "relative" }}>
              <div
                className="block-sync-settings"
                style={{
                  display: this.state.isSyncBlocked === true ? "block" : "none",
                }}
              >
                Settings blocked until sync ends.
              </div>
              <Card
                className={`${
                  this.state.isSyncBlocked === true ? "blur-sync-settings" : ""
                }`}
              >
                <CardBody>
                  <Row>
                    <Col lg={12} className="d-flex justify-content-between">
                      <h4 className="d-flex align-items-center h4">
                        Synchronization Settings
                      </h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Row>
                        <Col
                          lg={12}
                          className="d-flex justify-content-between align-items-center mb-1"
                        >
                          <h5 className="h5 mb-0">
                            Persons which can manage uploaded files
                          </h5>
                          <Button
                            onClick={() => this.switch_modal("ADD_PERSONS")}
                            className="btn btn-success d-flex align-items-center"
                          >
                            <i class="ri-add-line"></i>
                            <span>Add persons</span>
                          </Button>
                        </Col>
                      </Row>

                      <Table className="customTable" attr-type="SHARE_PERSONS">
                        <thead>
                          <tr>
                            <td></td>
                            <td>Person id</td>
                            <td>Name</td>
                            <td>E-mail</td>
                            <td>Share date</td>
                          </tr>
                        </thead>
                        <tbody>
                          {Share_To.length > 0 ? (
                            Share_To.map((x, i) => {
                              const data = Users.length > 0 ? Users.find((u) => u.Person_id === x.Share_to_Person_id) : {NAME: null, Email_address: null};
                              return (
                                <>
                                  <tr attr-index={`SHARE_PERSONS_${i}`}>
                                    <td>
                                      <i
                                        class="ri-close-line removeSyncScheduleRow"
                                        onClick={(e) =>
                                          this.unshareSyncToPersons(`SHARE_PERSONS_${i}`,x.Share_to_Person_id)
                                        }
                                        title="Remove this person from share"
                                      ></i>
                                    </td>
                                    <td>{x.Share_to_Person_id}</td>
                                    <td>{data.NAME}</td>
                                    <td>{data.Email_address}</td>
                                    <td>{x.Share_date}</td>
                                  </tr>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <tr>
                                <td colSpan="5">Persons list is empty</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="pt-1">
                    <Col lg={12}>
                      <Row>
                        <Col
                          lg={12}
                          className="d-flex justify-content-between align-items-center mb-1"
                        >
                          <h5 className="h5 mb-0">Synchronization schedule</h5>
                          <Button
                            onClick={() => this.switch_modal("ADD_SYNC_DIR")}
                            className="btn btn-success d-flex align-items-center"
                          >
                            <i class="ri-add-line"></i>
                            <span>Add synchronization directory</span>
                          </Button>
                        </Col>
                      </Row>
                      <Table className="customTable" attr-type="SYNC_DIRS">
                        <thead>
                          <tr>
                            <td></td>
                            <td>Computer id</td>
                            <td>Directory</td>
                            <td>Synchronization time</td>
                            <td>Synchronization days</td>
                          </tr>
                        </thead>
                        <tbody>
                          {userSchedule.length > 0 ? (
                            userSchedule.map((x, i) => (
                              <>
                                <tr attr-index={`SYNC_DIRS_${i}`}>
                                  <td style={{ textAlign: "center" }}>
                                    <i
                                      class="ri-close-line removeSyncScheduleRow"
                                      onClick={() =>
                                        this.removeSyncScheduleRow(x, `SYNC_DIRS_${i}`)
                                      }
                                      title="Remove this directory from schedule"
                                    ></i>
                                  </td>
                                  <td>{x.Computer_id}</td>
                                  <td>{x.Directory_name}</td>
                                  <td>{x.Sync_time}</td>
                                  <td>
                                    {JSON.parse(x.Sync_days !== null && x.Sync_days !== undefined ? x.Sync_days : [])
                                      .map(
                                        (x) =>
                                          DAYS.find((y) => y.value === x).label
                                      )
                                      .join(", ")}
                                  </td>
                                </tr>
                              </>
                            ))
                          ) : (
                            <>
                              <tr>
                                <td colSpan="5">
                                  Synchronization directories list is empty
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {MODAL_ACTION === "ADD_PERSONS" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="l">
              <ModalHeader
                toggle={() => this.setState({ modal: false })}
                className="text-center"
              >
                Select persons to share uploaded files
              </ModalHeader>
              <ModalBody toggle={() => this.setState({ modal: false })}>
                {Users.filter((x) => Share_To.map((x) => (x.Share_to_Person_id)).includes(x.Person_id) === false).length > 0 
                  ?
                    <>
                      {Users.filter((x) => Share_To.map((x) => (x.Share_to_Person_id)).includes(x.Person_id) === false).map((x) => (
                        <>
                          <div onClick={() => this.togglePerson(x.Person_id)} attr-pid={x.Person_id} className={`share-sync-to-person ${this.isSelectedPerson(x.Person_id) ? "active" : ""}`}>{x.Person_id}</div>
                        </>
                      ))}
                      <br/>
                      <Button 
                        color="success"
                        className="w-md waves-effect waves-light w-100"
                        type="button"
                        onClick={this.shareSyncToPersons}
                      >
                        Add persons to list
                      </Button>
                    </>
                  :
                    <>
                      <div className="w-100 text-center mb-2">All persons already selected</div>
                    </>
                }
                
              </ModalBody>
            </Modal>
          </>
        )}

        {MODAL_ACTION === "ADD_SYNC_DIR" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="l">
              <ModalHeader
                toggle={() => this.setState({ modal: false })}
                className="text-center"
              >
                Add new folder for synchronization
              </ModalHeader>
              <ModalBody toggle={() => this.setState({ modal: false })}>
                <AvForm onSubmit={this.addNewSchedule}>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i class="ri-computer-line auti-custom-input-icon"></i>
                    <Label htmlFor="Computer_id">Computer id</Label>

                    <AvField
                      name="Computer_id"
                      value={sysInfo.get().os.hostname}
                      type="text"
                      className="form-control"
                      id="Computer_id"
                      readonly
                      disabled
                    />
                  </FormGroup>
                  {addNewSchedule.Directory_name.map((x, i) => (
                    <>
                      <FormGroup className="auth-form-group-custom mb-1">
                        <i class="ri-folder-user-line auti-custom-input-icon"></i>
                        <Label htmlFor="Directory_name">
                          Path to directory #{i + 1}
                        </Label>
                        <AvField
                          name="Directory_name"
                          value={x}
                          type="text"
                          className="form-control"
                          id="Directory_name"
                          disabled
                          validate={{ required: true }}
                          placeholder="Choose directory.."
                        />
                        <Button
                          color=""
                          className="del-btn inverse"
                          type="button"
                          onClick={() => this.deletePath(i)}
                          attr-index={i}
                        >
                          <i className="  ri-delete-bin-line"></i>
                        </Button>
                      </FormGroup>
                    </>
                  ))}
                  <div
                    className="addNewSyncFolder mb-4"
                    onClick={this.selectDir}
                  >
                    Add folder
                  </div>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className=" ri-time-line auti-custom-input-icon"></i>
                    <Label htmlFor="username">Synchronization time</Label>
                    <Input
                      className="form-control w-100"
                      type="time"
                      defaultValue={`${`${new Date().getHours()}`.padStart(
                        2,
                        0
                      )}:${`${new Date().getMinutes()}`.padStart(2, 0)}:00`}
                      id="example-time-input"
                      name="Sync_time"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                  <FormGroup className=" mb-4">
                    <Label>Select days</Label>
                    <Select
                      name="Sync_days"
                      isMulti={true}
                      options={DAYS}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select sync days"
                      closeMenuOnSelect={false}
                      onChange={this.onMultiChange}
                      // onChange={}
                    />
                  </FormGroup>
                  <div className="mt-4 text-center">
                    <Button
                      color="primary"
                      className="w-md waves-effect waves-light w-100"
                      type="button"
                      onClick={this.setSyncSchedule}
                    >
                      Add
                    </Button>
                  </div>
                </AvForm>
              </ModalBody>
            </Modal>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.User.settings,
    personeData: state.User.persone,
    sp: state.User.syncPath,
    Core: state.User.globalData,
    syncInfo: state.Sync.syncInfo,
    Users: state.User.staff,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onCaseLoad: () => dispatch(actions.getCase()),
    onSyncPathLoad: () => dispatch(actions.requestSyncPath()),
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
    setSyncInfo: (data) => dispatch(syncActions.setSyncInfo(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SynchronizationSettongs);
