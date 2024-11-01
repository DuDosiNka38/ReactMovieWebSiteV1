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
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "./../../../services/axios";
import noteWindow from "../../../services/notifications";
import * as actions from "./../../../store/user/actions";
import { connect } from "react-redux";
import sysInfo from "./../../../electron/services/sysInfo";
import SlideToggle from "react-slide-toggle";

// const {dialog} = require('electron')
const { ipcRenderer } = require("electron");
let path = null;

class DerectorySettings extends Component {
  state = {
    path: null,
    toggleEvent: 0,
    isTogled: false,
  };

  selectDir = this.selectDir.bind(this);
  submitPath = this.submitPath.bind(this);
  setSelectedDir = this.setSelectedDir.bind(this);

  selectDir() {
    const {path} = this.state;
    const props = {};

    if(path !== "/")
      props.defaultPath = path;
      
    ipcRenderer.send("select-dirs", props);
    ipcRenderer.on("select-dirs", async (event, arg) => {
      if (arg !== null) this.setState({ path: arg[0] });
    });
  }
  onToggle = () => {
    this.setState({ toggleEvent: Date.now(), isTogled: !this.state.isTogled });
  };

  setSelectedDir() {
    if (this.props !== undefined) {
      const { settings, personeData, Core } = this.props;
      const Computers = Core.Computers;

      if (!settings.hasOwnProperty("USER")) {
        setTimeout(this.setSelectedDir, 100);
      } else {

        const uSettings = settings.USER[personeData.Person_id];
        const FILES_DIR = JSON.parse(uSettings.FILES_DIR);
        const MAC = sysInfo.get().uuid.macs[0];

        if (!FILES_DIR.hasOwnProperty(MAC)) FILES_DIR[MAC] = "/";

        this.setState({ path: FILES_DIR[MAC] });
      }
    } else {
      setTimeout(this.setSelectedDir, 100);
    }
  }

  componentDidMount() {
    this.setSelectedDir();
  }

  componentWillUnmount(){
    ipcRenderer.removeAllListeners();
  }

  submitPath() {
    const { settings, personeData } = this.props;
    const uSettings = settings.USER[personeData.Person_id];
    const FILES_DIR =
      uSettings.FILES_DIR == "/" ? {} : JSON.parse(uSettings.FILES_DIR);
    const MAC = sysInfo.get().uuid.macs[0];

    FILES_DIR[MAC] = this.state.path;

    const result = axios
      .post("/api/settings/setUser", {
        name: "FILES_DIR",
        value: JSON.stringify(FILES_DIR),
        pid: this.props.personeData.Person_id,
      })
      .then((result) => {
        if (result.data.result) {
          noteWindow.isSuck("Data successfully updated!");
          this.props.onGlobalLoad();
          return true;
        } else {
          noteWindow.isError(result.data.result_data);
          return false;
        }
      })
      .catch((result) => console.log(result));
  }

  removeAppLocation = (i, MAC) => {
    const el = document.body.querySelector(`tr[attr-index='${i}']`);
    el.classList.add("removing");
    
    const { settings, personeData } = this.props;
    const uSettings = settings.USER[personeData.Person_id];
    const FILES_DIR =
      uSettings.FILES_DIR == "/" ? {} : Object.assign({}, JSON.parse(uSettings.FILES_DIR));

    delete FILES_DIR[MAC];

    const result = axios
      .post("/api/settings/setUser", {
        name: "FILES_DIR",
        value: JSON.stringify(FILES_DIR),
        pid: this.props.personeData.Person_id,
      })
      .then((result) => {
        if (result.data.result) {
          noteWindow.isSuck("Data successfully updated!");
          this.props.onGlobalLoad();
          setTimeout(() => el.classList.remove("removing"), 500);
          return true;
        } else {
          noteWindow.isError(result.data.result_data);
          setTimeout(() => el.classList.remove("removing"), 500);
          return false;
        }
      })
      .catch((result) => console.log(result));
  }

  render() {
    if (!sysInfo.isLoad()) return <></>;

    const { values } = this.state;
    const { settings, personeData, Core } = this.props;
    const Computers = Core.Computers;

    if (
      !settings.hasOwnProperty("USER") ||
      !personeData.hasOwnProperty("Person_id")
    )
      return <></>;

    const uSettings = settings.USER[personeData.Person_id];
    const FILES_DIR = JSON.parse(uSettings.FILES_DIR);
    const MAC = sysInfo.get().uuid.macs[0];

    if (!FILES_DIR.hasOwnProperty(MAC)) FILES_DIR[MAC] = "/";

    const ANOTHER_PC_DIRS = [];
    for (let k in FILES_DIR) {
      const pc = Computers.find((x) => x.Mac_Address === k);
      if (k !== MAC && k !== "SERVER")
        ANOTHER_PC_DIRS.push({ key: pc.Computer_id, loc: FILES_DIR[k], MAC: k });
    }

    return (
      <>
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <h4 className="d-flex align-items-center h4">
                      Application directory
                  </h4>
                  <AvForm onValidSubmit={this.submitPath}>
                    <FormGroup className="auth-form-group-custom mb-4 holder-fo">
                    <Button
                      color="primary"
                      onClick={this.selectDir}
                      type="button"
                      className="d-block btn-file select-dir no-right"
                    >
                      <i className=" ri-more-fill dots-btn"></i>
                    </Button>
                      <i className="ri-user-2-line auti-custom-input-icon"></i>
                      <Label htmlFor="username">Application directory on your <b>"{sysInfo.get().os.hostname}"</b></Label>
                      <AvField
                        name="user_path"
                        value={this.state.path}
                        defaultValue={FILES_DIR[MAC]}
                        type="text"
                        className="form-control"
                        id="uPath"
                        validate={{ required: true }}
                        // disabled={true}
                        readonly="readonly"
                      />
                    </FormGroup>
                    {ANOTHER_PC_DIRS.length > 0 &&
                      <>
                      <hr/>
                        <FormGroup>
                          <h5 className="h5">Locations on your other computers</h5>
                          <Table className="customTable">
                            <thead>
                              <tr style={{fontWeight: "bold"}}>
                                <td></td>
                                <td>Computer</td>
                                <td>Application folder</td>
                              </tr>
                            </thead>
                            <tbody>
                              {ANOTHER_PC_DIRS.map((x, i) => (
                                <>
                                  <tr attr-index={`ALL_LOC_${i}`}>
                                    <td>
                                      <i
                                        class="ri-close-line removeSyncScheduleRow"
                                        onClick={(e) =>
                                          this.removeAppLocation(`ALL_LOC_${i}`,x.MAC)
                                        }
                                        title="Remove app location from this computer"
                                      ></i>
                                    </td>
                                    <td>{x.key}</td>
                                    <td>{x.loc}</td>
                                  </tr>
                                </>
                              ))}
                            </tbody>
                          </Table>                      
                        </FormGroup>
                      </>
                    }
                    <Button color="success" className="" type="submit"> Save Changes </Button>
                  </AvForm>
                </CardBody>
                              
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(DerectorySettings);
