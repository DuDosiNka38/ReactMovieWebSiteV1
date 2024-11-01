import { io } from "socket.io-client";

import React, { Component } from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import { authProtectedRoutes, publicRoutes } from "./routes/";
import { ipcRenderer } from "electron";
import AppRoute from "./routes/route";

import * as ModalActions from "./store/modal/actions";
import * as CaseActions from "./store/case/actions";
import * as SyncActions from "./store/sync/actions";
import * as PreloaderActions from "./store/preloader/actions";
import * as DocsActions from "./store/documents/actions";
import * as EventActions from "./store/event/actions";

import VerticalLayout from "./components/VerticalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import Modals from "./services/ModalsConnection";
import ProgressModals from "./services/ProgressModalsConnection";

// Import scss
import "./theme.scss";
import ModalService from "./services/ModalService";
import ProgressModal from "./services/ProgressModal";

import AuthService from "./services/AuthService";
import SyncApi from "./api/SyncApi";
import * as ProgressModalActions from "./store/progress-modal/actions";
import CheckLocationsPm from "./progress-modals/Synchronization/CheckLocations.pm";
import DocsApi from "./api/DocsApi";

const { checkLocations } = require("./services/Sync.service");



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _SOCKET: null,
      USER_DATA: null,
      isAuthenticated: false,

      isCalledCheckLocations: false,
    };
  }

  writeToConsole(event, args) {
    console.group("Message from Electron:");
    console.log(...args);
    console.groupEnd();
  }

  socketConnect = async () => {
    const { hostInfo } = this.props;
    let { _SOCKET } = this.state;
    let host = new URL(hostInfo.host);

    const opts = {
      transports: ["polling", "websocket"],
      transportOptions: {
        polling: {
          extraHeaders: {
            hostId: host.hostname.split(".")[0],
          },
        },
      },
    };

    host.port = hostInfo.ports.socket;
    _SOCKET = io.connect(host.href, opts);
    this.setState({ _SOCKET });
    return _SOCKET;
  };

  listenNewComputers = async () => {
    //CHECK USER PRIVILEGES AT FIRST!!!!
    // const { User, hostInfo } = this.props;
    // let { _SOCKET } = this.state;
    // if(_SOCKET === null) _SOCKET = await this.socketConnect();
    // _SOCKET.on("new-computer-request", (args) => {
    //   this.props.showModal("USER_PC_CONFIG", {User_id: args.Person_id, Computer: args, Modal_Header: "Request for approve a new computer"})
    // })
  };

  listenParsing = async () => {
    // let { _SOCKET } = this.state;
    // if(_SOCKET === null) _SOCKET = await this.socketConnect();
    // _SOCKET.on("connect", () => {
    //   console.log(_SOCKET.id); // x8WIv7-mJelg7on_ALbx
    // });
    // _SOCKET.on("parsing-files", (args) => {
    //   console.log(args);
    // })
  };

  checkNotUploadedFiles = async () => {
    // return;
    const { User, hostInfo, sysInfo, remindLaterNotUploaded } = this.props;
    const { hostname: Computer_id } = sysInfo.os;

    const isBlocked = ipcRenderer.sendSync("isSyncBlocked", {});

    if (isBlocked) return false;

    if (User.Person_id && !remindLaterNotUploaded) {
      const syncedFiles = await SyncApi.fetchSyncedFiles(User.Person_id, Computer_id, { locations: true });

      const notUploaded = syncedFiles.filter((x) => x.Upload_dt === null);

      if (notUploaded.length) {
        this.props.showModal("NOT_UPLOADED_FILES", { data: notUploaded });
      }
    }
  };

  setListeners = () => {
    ipcRenderer.on("onSetSyncProcess", (event, args) => this.props.setSyncProcess(args));
    ipcRenderer.on("onSendDataToReact", (event, args) => {
      const { Total_New_Files } = args;

      if (Total_New_Files === 0) {
        this.props.hideModal("SYNC_PROGRESS");
        this.props.showModal("SYNC_ENDS", { state: { ...args, Total_Uploaded_Files: 0 } });
        return;
      }
    });
  }

  checkLocations = async (Person_id, Computer_id) => {
    this.setState({isCalledCheckLocations: true});
    setTimeout(async () => {
      const docLocations = await DocsApi.fetchFilesLocations({Computer_id});

      if(docLocations.length === 0) return;

      const lastCheck = await DocsApi.fetchLastCheckLocations({Person_id, Computer_id });

      if(lastCheck.length){
        const dateTS = new Date(lastCheck[0].Check_Date);
        const todayTS = new Date();
        const today = `${todayTS.getUTCFullYear()}-${todayTS.getUTCMonth()+1}-${todayTS.getUTCDate()}`;
        const date = `${dateTS.getUTCFullYear()}-${dateTS.getUTCMonth()+1}-${dateTS.getUTCDate()}`;
        if(date === today) return;        
      }
      
      ipcRenderer.send("openModal", {width: 600, height: 120, openPath: "/modal/test"});
      
    }, 2000)
  }

  async componentDidMount() {
    ipcRenderer.on("writeToConsole", this.writeToConsole);
    ipcRenderer.on("onHostsChange", (event, args) => {
      AuthService.removeAuthHash();
    });

    if (AuthService.getAuthHash()) {
      this.props.fetchDocForms();
      this.props.requestCaseTypes();
      this.props.requestDepartments();

      this.setListeners();
    }
    Modals();
    ProgressModals();    

    this.setState({isAuthenticated: Boolean(AuthService.getAuthHash())})

    ipcRenderer.on("onSyncLog", (e, a) => console.log(a))
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.minimized !== this.props.minimized) {
      this.render();
    }

    if (prevProps.User !== this.props.User && prevProps.User.Person_id === undefined && this.props.User.Person_id) {
      const { isCalledCheckLocations } = this.state;
      const { sysInfo } = this.props;

      this.listenNewComputers();
      this.checkNotUploadedFiles();
      this.listenParsing();

      if(!isCalledCheckLocations){
        // console.log(this.props.User);
        // this.checkLocations(this.props.User.Person_id, sysInfo.os.hostname);

      }

      this.props.fetchUserUpcomingEvents(this.props.User.Person_id);
    }

    if(prevProps.auth_hash !== this.props.auth_hash && prevProps.auth_hash === null){
      this.setListeners();
    }
  }  

  render() {

    return (
      <React.Fragment>
        {ModalService.renderModal(this.props.history)}
        {ProgressModal.renderModal(this.props.history)}
        <Router>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
              />
            ))}

            {authProtectedRoutes.map((route, idx) => (
                <AppRoute
                  path={route.path}
                  layout={VerticalLayout}
                  component={route.component}
                  key={idx}
                  isAuthProtected={true}
                />
            ))}
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  sessionToken: state.Main.auth_hash,
  callersQueue: state.Preloader.callersQueue,
  displayed: state.Modal.displayed,
  minimized: state.Modal.minimized,
  User: state.User.data,
  isLoadingUser: state.User.loading,
  reload: state.Modal.reload,
  reloadPM: state.ProgressModal.reload,
  hostInfo: state.Main.hostInfo,
  remindLaterNotUploaded: state.Main.remindLaterNotUploaded,

  auth_hash: state.Main.auth_hash,

  departments: state.Case.departments,
  calendars: state.Case.calendars,
  sysInfo: state.Main.system,

  Upcoming_Events: state.Event.Upcoming_Events
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  fetchDocForms: () => dispatch(DocsActions.docFormsFetchRequested()),

  requestCaseTypes: () => dispatch(CaseActions.caseTypesFetchRequested()),
  requestDepartments: () => dispatch(CaseActions.departmentsFetchRequested()),
  setSyncProcess: (data) => dispatch(SyncActions.setSyncProcess(data)),

  fetchUserUpcomingEvents: (Person_id) => dispatch(EventActions.userUpcomingEventsFetchRequested(Person_id)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("CHOOSE_CP_ROLES")),
    hide: () => dispatch(PreloaderActions.hidePreloader("CHOOSE_CP_ROLES")),
  },
  showProgressModal: (type, props) => dispatch(ProgressModalActions.showModal(type, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
