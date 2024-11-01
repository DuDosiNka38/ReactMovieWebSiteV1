import React, { Component } from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/user/actions";
import * as actionsT from "./store/files/actions";
import * as syncActions from "./store/sync/actions";
import { authProtectedRoutes, publicRoutes } from "./routes/";
import AppRoute from "./routes/route";

import VerticalLayout from "./components/VerticalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import PreloaderLD from "./services/preloader-core";
import { ipcRenderer } from "electron";
import authCore from './../src/electron/services/core'
import axios from "./services/axios";
import sysInfo from "./../src/electron/services/sysInfo";
import { sync } from "md5-file";
require("./theme.scss")

let isSysInfoLoaded = false;

class App extends Component {
  constructor(props) {
    super(props);

    this.Preloader = new PreloaderLD(this);
    this.state = {
      userAuthHash: null,
      dataHash: null
    };
    this.getLayout = this.getLayout.bind(this);
    this.isActualDataHash = this.isActualDataHash.bind(this);
  }

  getGlobalInfo() {
    this.props.onCaseLoad();
    this.props.onDepartmentLoad();
    this.props.onCaseTypeLoad();
    this.props.onPersoneLoad();
    this.props.onGlobalLoad();
    this.props.onCalendarsLoad();
    this.props.onRelTypeLoad();
    this.props.onEventsLoad();
    this.props.onCSLoad();
    this.props.onSettingsLoad();
    this.props.onSagaLoad()
  }

  writeToConsole(event, args){
    console.group("Message from Electron:");
    console.log(args.data);
    console.groupEnd();
  }  

  isActualDataHash(){
    const { dataHash } = this.state;
    axios.post("/api/user/isActualDataHash", {dataHash: dataHash})
    .then((r) => {
      const {result, result_data} = r.data;
      if(result == false){
        this.setState({dataHash: result_data.dataHash});
        this.props.onGlobalLoad();
      }
    });
  }

  setSyncInfo = () =>{
      if(sysInfo.get() === undefined){
        setTimeout(this.setSyncInfo, 200);
      } else {    
        const MAC = sysInfo.get().uuid.macs[0];
        
        axios
        .post("/api/user/get_data", { hash: authCore.getHash() })
        .then((resp) => {
          const { Person, Core } = resp.data;

          if(Core !== undefined){

            const Computer_id = sysInfo.get().os.hostname;
            const { Sync_Schedule, Syncronization, Settings } = Core;
            const dayStartTimestamp = new Date().setHours(0,0,0,0)/1000;

            const makedSyncToday = Syncronization.filter((x) => x.Person_id === Person.Person_id && x.Computer_id === Computer_id && x.timestamp >= dayStartTimestamp).map((x) => ({secondsAfterDayStarts: x.day_seconds, Status: x.Status}));

            const userSchedule =
              Sync_Schedule !== undefined
                ? Sync_Schedule.filter(
                    (x) =>
                      x.Person_id === Person.Person_id &&
                      x.Computer_id === Computer_id
                  )
                : undefined;

            let scanTasks = {};

            const curDayNumber = new Date().getDay();

            userSchedule.map((x) => {
              const time = x.Sync_time.split(":");
              const days = x.Sync_days !== null && x.Sync_days !== undefined ? JSON.parse(x.Sync_days) : [];

              if(days.includes(curDayNumber)){
                const secondsAfterDayStarts = (parseInt(time[0])*60*60)+parseInt(time[1])*60;

                if(!scanTasks.hasOwnProperty(secondsAfterDayStarts))
                  scanTasks[secondsAfterDayStarts] = [];

                scanTasks[secondsAfterDayStarts].push(x.Directory_name);
              }              
            });

            if(scanTasks.length === 0)
              this.props.setSyncData({action: "NOTHING_TO_SCAN"})

            this.props.setSyncInfo({
              scanTasks: scanTasks,
              makedSyncs: makedSyncToday
            });
          }
        });   
      }
  }

  componentDidMount() {
    this.setSyncInfo();

    this.props.setSyncInfoUpdate(this.setSyncInfo);

    ipcRenderer.send("getSysInfo", {});
    setTimeout(this.getGlobalInfo(),0);
    ipcRenderer.on("writeToConsole", this.writeToConsole);
    ipcRenderer.on("NEXT_SCAN", this.setSyncInfo);
    ipcRenderer.on("getSysInfo", (event, args) => {
      isSysInfoLoaded = true;
      this.render();
    });

  }

  componentWillUnmount(){
    ipcRenderer.removeAllListeners();
  }
  getLayout = () => {
    let layoutCls = VerticalLayout;
    return layoutCls;
  };
  
  render() {
    this.Preloader.showOnStart();
    const Layout = this.getLayout();   
  
    if(!this.props.IS_MOUNT_DATA_LOADED)
      return (<>{this.Preloader.get()}</>);

    if(!isSysInfoLoaded)
      return (<>{this.Preloader.get()}</>);


    this.Preloader.hide();   

    return (
      
      <React.Fragment>
          <Router>
            <Switch>
              {publicRoutes.map((route, idx) => (
                <AppRoute
                  path={route.path}
                  layout={NonAuthLayout}
                  component={route.component}
                  key={idx}
                  isAuthProtected={false}
                  isUserLoggedIn={this.props.IS_USER_LOGGED_IN}
                  isMountDataLoaded={this.props.IS_MOUNT_DATA_LOADED}
                />
              ))}

              {authProtectedRoutes.map((route, idx) => (
                  <AppRoute
                    path={route.path}
                    layout={Layout}
                    component={route.component}
                    key={idx}
                    isAuthProtected={true}
                    isUserLoggedIn={this.props.IS_USER_LOGGED_IN}
                    isMountDataLoaded={this.props.IS_MOUNT_DATA_LOADED}
                    getLocalStorage={this.getLocalStorage}
                  />
              ))}
            </Switch>
          </Router>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    getGlobal: state.User.globalData,
    personeData: state.User.persone,
    layout: state.Layout,
    allEvents: state.User.AllEvents,
    alerts: state.User.alerts,
    todos: state.User.todos,
    activityTypes: state.User.activityTypes,
    settings: state.User.settings,
    keywords: state.User.keywords,
    syncInfo: state.Sync.syncInfo,

  IS_USER_LOGGED_IN: state.User.IS_USER_LOGGED_IN ,
  IS_USER_CHECKED_LOGGED_IN: state.User.IS_USER_CHECKED_LOGGED_IN ,
  IS_MOUNT_DATA_LOADED:state.User.IS_MOUNT_DATA_LOADED  ,
  };
};
const mapDispatchToProps = (dispatch) => ({
  onCaseLoad: () => dispatch(actions.getCase()),
  onDepartmentLoad: () => dispatch(actions.getDepartament()),
  onCaseTypeLoad: () => dispatch(actions.getCasesType()),
  onPersoneLoad: () => dispatch(actions.getPersonData()),
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
  onCalendarsLoad: () => dispatch(actions.getCalendar()),
  onRelTypeLoad: () => dispatch(actions.getRelationTypes()),
  onEventsLoad: () => dispatch(actions.getAllEvent()),
  onCSLoad: () => dispatch(actions.getCaseStat()),
  onAlertsLoad: () => dispatch(actions.getAllAlert()),
  onTodosLoad: () => dispatch(actions.getAllTodo()),
  onActivityTypeLoad: () => dispatch(actions.getActivityType()),
  onSettingsLoad: () => dispatch(actions.getSetting()),
  onKeywoardsLoad: () => dispatch(actions.getKeyword()),  
  onSagaLoad: () => dispatch(actionsT.getFiles()),
  setSyncInfo: (data) => dispatch(syncActions.setSyncInfo(data)),
  setSyncInfoUpdate: (data) => dispatch(syncActions.setSyncInfoUpdate(data)),
  setSyncData: (data) => dispatch(syncActions.setSyncData(data)),


});

export default connect(mapStateToProps, mapDispatchToProps)(App);
