import React, { Component } from "react";
import {
  Button,
  Alert,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
} from "reactstrap";
import { ipcRenderer } from "electron";
import Select from "react-select";
import axios from "./../../services/axios";

import noteWindow from "./../../services/notifications";

class HostManager extends Component {
  state = {
    modal: false,
    MODAL_ACTION: null,
    newHost: "",
    error: "",

    HOSTS_LIST: [],
  };
  
  constructor(props) {
    super(props);

    this.isSidebar = this.props.isSidebar ?? false;
  }

  switch_modal = (action) => {
    const { MODAL_ACTION } = this.state;
    let show = true;

    switch (action) {
      case "CONFIRM_SAVING":
        const { Uploaded_files } = this.state;
        if (Uploaded_files.filter((x) => x.Case_NAME !== null).length === 0) {
          show = false;
          noteWindow.isError(
            "Nothing to submit! You need fill fields at first!"
          );
        }
        break;
    }

    if (show === true) {
      this.setState((prevState) => ({
        MODAL_ACTION: action,
        modal:
          action === undefined || action === MODAL_ACTION
            ? !prevState.modal
            : true,
      }));

      this.render();
    }
  };

  handleChange = (e) => {
    const { name, value } = e.currentTarget;

    this.setState({ [name]: value });
  };

  onHostChange = (e, el) => {
    const { name } = el;

    if (name === "host") {
      const host = e.value;

      this.switch_modal("PROCESSING");
      ipcRenderer.send("SET_APPLICATION_SERVER", { host: host });
    }
  };

  addNewHost = async () => {
    this.setState({ error: "" });

    let { newHost, HOSTS_LIST } = this.state;

    if (
      newHost.indexOf("https://") === -1 &&
      newHost.indexOf("http://") === -1
    ) {
      newHost = "http://" + newHost;
    }

    if (newHost[newHost.length - 1] !== "/") newHost += "/";

    if (HOSTS_LIST.find((x) => x.host === newHost)) {
      this.setState({ error: "Host is already exists in list!" });
    } else {
      this.switch_modal("PROCESSING");
      const response = await fetch(newHost + "app/checker.php")
        .then((r) => r.json())
        .catch((e) => e.json);

      console.log(response);

      if (response !== undefined && response.result === true) {
        ipcRenderer.send("ADD_HOST", { host: newHost, alias: response.server_alias });
        noteWindow.isSuck("Host successfully added!");
        this.switch_modal();
      } else {
        this.switch_modal("ADD_HOST");
        this.setState({ error: "Wrong host name! Check it and try again!" });
      }
    }
  };

  removeHost = () => {
    ipcRenderer.send("REMOVE_HOST", {});
    ipcRenderer.send("REMOVE_HOST", (event, args) => {
      this.switch_modal();
    });
  };

  setHostsList = (event, args) => {
    console.log(args);
    this.setState({ HOSTS_LIST: args.hostsList });
  };

  componentDidMount() {
    ipcRenderer.send("GET_HOSTS_LIST", {});
    ipcRenderer.addListener("GET_HOSTS_LIST", this.setHostsList);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("GET_HOSTS_LIST", this.setHostsList);
  }

  render() {
    if (this.state === undefined || this.state === null) return null;

    const { HOSTS_LIST } = this.state;

    let HOST = axios.defaults.baseURL;
    const { MODAL_ACTION, newHost, error } = this.state;
    return (
      <>
        {MODAL_ACTION === "ADD_HOST" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="l">
              <ModalHeader
                toggle={() => this.setState({ modal: false })}
                className="text-center"
              >
                Add NEW host
              </ModalHeader>
              <ModalBody>
                <Label>Hostname</Label>
                <Input
                  type="text"
                  name="newHost"
                  value={newHost}
                  placeholder="Type host like http://myhostname.com:8080"
                  onChange={this.handleChange}
                />
                <div className="error">{error}</div>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={this.addNewHost}>
                  Submit
                </Button>
              </ModalFooter>
            </Modal>
          </>
        )}

        {MODAL_ACTION === "REMOVE_HOST" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="l">
              <ModalHeader
                toggle={() => this.setState({ modal: false })}
                className="text-center"
              >
                Remove host from list
              </ModalHeader>
              <ModalBody>
                <p>
                  Host <b>{HOST}</b> would be removed from hosts list?
                </p>
                <p>
                  <b>Are you sure?</b>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={this.removeHost}>
                  Submit
                </Button>
                <Button color="danger" onClick={this.switch_modal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </>
        )}

        {MODAL_ACTION === "PROCESSING" && (
          <>
            <Modal
              isOpen={this.state.modal}
              centered={true}
              size="s"
              style={{ width: "200px" }}
            >
              <ModalHeader
                // toggle={() => this.setState({ modal: false })}
                className="text-center d-flex align-items-center justify-content-center"
                charCode=""
              >
                Processing
              </ModalHeader>
              <ModalBody className="text-center w-100">
                <div className="lds-default">
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
              </ModalBody>
            </Modal>
          </>
        )}

        {(() => {
          const options = HOSTS_LIST.map((host) => ({
            value: host.host,
            label: this.isSidebar ? host.alias : `${host.alias} [${host.host}]`,
          }));

          const customStyle = this.isSidebar ? {
            control: (base, state) => ({
                ...base,
                backgroundColor: "rgba(0,0,0,0)",
                color:"#fff"
            }),

            singleValue: (base, state) => ({
              ...base,
              color:"#fff"
            }),

            option: (base, state) => ({
              ...base,
              color:"#333"
            })
          } : {
            option: (base, state) => ({
              ...base,
              color:"#333"
            })
          };

          return (
            <>
            <div className={`host-manager ${this.isSidebar ? "d-flex sidebar" : ""}`}>
                {!this.isSidebar && 
                    <>
                        <div>Choose server:</div>
                    </>
                }
              
              <div className={!this.isSidebar ? "d-flex align-items-center justify-content-center" : "w-100"}>
                <Select
                  name="host"
                  options={options}
                  value={options.find((o) => o.value === HOST)}
                  className="w-100 hm-select"
                  onChange={this.onHostChange}
                  styles={customStyle}
                />
                {this.isSidebar ?
                    <>
                        <Button
                            className="ml-1 customBtn add"
                            onClick={() => this.switch_modal("ADD_HOST")}
                        >
                        <i class="ri-add-line"></i> Add new host
                        </Button>
                    </>
                :
                    <>
                        <Button
                            className="ml-1 customBtn add"
                            onClick={() => this.switch_modal("ADD_HOST")}
                        >
                        <i class="ri-add-line"></i>
                        </Button>
                    </>
                }
                
                {/* <Button
                    className="ml-1 customBtn remove" onClick={() => this.switch_modal("REMOVE_HOST")}><i class="ri-close-line"></i></Button> */}
              </div>
              </div>
            </>
          );
        })()}
      </>
    );
  }
}

export default HostManager;
