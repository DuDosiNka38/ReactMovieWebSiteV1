import React, { Component } from "react";
import { connect } from "react-redux";

import fn from "./../../services/functions";
import sysInfo from "./../../electron/services/sysInfo";
import { ipcMain, ipcRenderer } from "electron";
import * as actions from "./../../store/user/actions";
import * as syncActions from "./../../store/sync/actions";
import authCore from "./../../electron/services/core";
import noteWindow from "./../../services/notifications";

let autoScan = null;
let isCountDownWorks = false;
let firstScan = false;

class SyncBar extends Component {
  state = {
    showScanBar: false,
    isPaused: false,
    userScanInterval: 0,
    scanDirs: [],
    userInterval: 0,
    showSyncControls: true
  };

  setSyncInfo = (event, args) => {
    const { setSyncData } = this.props;
    const syncData = args;

    if (
      syncData !== undefined &&
      syncData.hasOwnProperty("action") &&
      syncData.action !== null
    ) {
      this.setState({ showScanBar: true });
    } else {
      this.setState({ showScanBar: false });

      if (
        syncData !== undefined &&
        syncData.hasOwnProperty("reason")
      ){
        switch( syncData.reason ){
          case "BREAK_SCAN":
            noteWindow.isSuck("Synchronization successfully breaked!");
            break;

          case "SUCCESSFULLY_SCANNED":
            noteWindow.isSuck("Synchronization completed successfully!");
            break;

          default:
            break;
        }
      }
        
    }

    setSyncData(syncData);
    // this.setState({ syncData: syncData });
  };

  getSyncInfo = () => {
    let {syncData} = this.props;

    if (syncData !== undefined && syncData.hasOwnProperty("action") && syncData.action !== null) {
      const { action } = syncData;
      const { isPaused } = this.state;
      let showSyncControls = true;
      let render = null;

      switch (action) {
        case "NOTHING_TO_SCAN":
          showSyncControls = false;
          render = (
            <>
              <div className="sync-title" style={{overflow:"visible", height: "auto", fontSize: "14px"}}>
              You have no scheduled syncs today            
              </div>
            </>
          );
          break;
        case "WAIT_FOR_SCAN":
          showSyncControls = false;
          const { remainingTime, remainingTimeSec } = syncData;
          const { userScanInterval } = this.state;
          const percent = Math.ceil(remainingTimeSec*100/userScanInterval*10)/10;
          
          render = (
            <>
              <div className="sync-title" style={{overflow:"visible", height: "auto", fontSize: "14px"}}>
                Wait for auto-sync               
              </div>
              <div className="sync-data" style={{overflow:"visible", height:"auto"}}>
                <i class="ri-time-line"></i>
                <div className="countdown-text">{remainingTime}</div>
              </div>
            </>
          );
          break;

        case "PREPARE_TO_SYNC":
          render = (
            <>
              <div className="sync-title"> <i class="ri-loader-line"></i> start scanning</div>
            </>
          );
          break;

        case "CHECK_LOCATIONS":
          const { currentLocation } = syncData;
          render = (
            <>
              <div className="sync-title">Check locations...</div>
              <div className="sync-data">{currentLocation}</div>
            </>
          );
          break;

        case "SCAN_FOLDERS":
          const { totalDirs, currentDirIndex, filesFound, foundFile } =
            syncData;
          render = (
            <>
              <div className="sync-title">Scan sync folders...</div>
              <div className="sync-data">{foundFile}</div>
            </>
          );
          break;

        case "PREPARE_TO_UPLOAD":
          {
            const { currentIndex, totalFiles, currentFile, remainingTime } =
              syncData;
            render = (
              <>
                <div className="sync-title">
                    <div className="position-relative">
                      <i class="ri-search-eye-line move-circle"></i> SEARCH FOR NEW FILES ({currentIndex}/{totalFiles})
                    </div>
                </div>
                <div className="sync-data">{currentFile}</div>
              </>
            );
          }
          break;

        case "UPLOAD_FILES":
          {
            const {
              uploadPercent,
              uploadFile,
              totalFilesSize,
              uploadedSize,
              uploadSpeed,
              remainingTime,
            } = syncData;
            render = (
              <>
              <div className="progress-bar" style={{width: `${uploadPercent}%`}}></div>
                <div className="sync-title d-block" >
                  <div>Uploading files ({uploadedSize}/{totalFilesSize})</div>
                  <div style={{ textTransform: "lowercase", color: "#55586b" }}>
                    {uploadPercent} % | {uploadSpeed} Mb/s | Remaining time:{" "}
                    {remainingTime}
                  </div>
                </div>
                <div className="sync-data">{uploadFile}</div>
              </>
            );
          }
          break;

        default:
          // render = null;
          render = (
            <>
              <div className="sync-title">UNHANDLED CASE ACTION: {action}</div>
            </>
          );
          break;
      }

      return (
        <>
          <div className="sync-main">{render}</div>
          {showSyncControls
            &&
              <>
                <div class="sync-controls">
                  {isPaused === true ? (
                    <>
                      <div className="sync-continue" title="Continue sync">
                        <i class="ri-play-line"></i>
                      </div>
                    </>
                  ) : (
                    <>
                      <div class="sync-pause" title="Set sync to pause">
                        <i class="ri-pause-line"></i>
                      </div>
                    </>
                  )}
                  <div
                    class="sync-stop"
                    title="Break sync"
                    onClick={() => ipcRenderer.send("BREAK_SCAN", {})}
                  >
                    <i class="ri-stop-line blur"></i>
                    <i class="ri-stop-fill hover"></i>
                  </div>
                </div>
              </>
          }
        </>
      );
    } else {
      return (
        <>
          <div className="sync-main">
            <div className="sync-title">
              <div className="container">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
              </div>  
            </div>
          </div>
        </>
      );
    }
  };

  countDown = (userInterval, cb) => {
    if (isCountDownWorks === false) {
      isCountDownWorks = true;
      fn.countDown(
        userInterval,
        (sec) => {
          this.setSyncInfo(null, {
            action: "WAIT_FOR_SCAN",
            remainingTimeSec: sec,
            remainingTime: fn.secToNormal(sec),
          });
          this.render();
        },
        () => {
          isCountDownWorks = false;

          if (cb !== null && cb !== undefined) cb();
        }
      );
    }
  };

  removeCountDown = () => {
    fn.removeCountDown();
    isCountDownWorks = false;
  }

  nextScanHandle = async (e, a) => {
    ipcRenderer.send("IS_SYNC_BLOCKED", {});
    ipcRenderer.on("IS_SYNC_BLOCKED", (event, args) => {
      const {isSyncBlocked} = args;

      if(!isSyncBlocked){
        const { syncInfo } = this.props;

        if(syncInfo !== null && syncInfo !== undefined){
          this.removeCountDown();

          const { makedSyncs } = syncInfo;
          const scanTasks = Object.assign({}, syncInfo.scanTasks);
          const secondsToday = fn.getSecondsToday();

          const successfullSyncs = makedSyncs.map((x) => (x.secondsAfterDayStarts));
        
          for(let time in scanTasks){
            const dirs = scanTasks[time];

            if(!successfullSyncs.includes(time)){
              if(time <= secondsToday){
                this.scanFiles(dirs, time);
              } else {
                const secondsToScan = time - secondsToday;
                this.countDown(secondsToScan, () => this.scanFiles(dirs, time));
              }
            } else {
              delete scanTasks[time];
            }              
          }

          if(fn.isEmptyObj(scanTasks)){
            this.setSyncInfo(null, {
              action: "NOTHING_TO_SCAN"
            })
          }         
        }
      }
    })
       
  };

  scanFiles = (dirs, time) => {
    ipcRenderer.send("SYNC_FILESYSTEM", { hash: authCore.getHash(), dirs: dirs, daySeconds: time });
  };

  componentDidMount(prevState, prevProps) {
    ipcRenderer.on("SET_SYNC_DATA", this.setSyncInfo);
    this.props.setSyncInfoCb(this.nextScanHandle);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("SET_SYNC_DATA", this.setSyncInfo);
  }

  render() {
    const { showScanBar, isPaused, showSyncControls } = this.state;
    const { action } = this.props.syncData;
    const getSyncInfo = this.getSyncInfo();

    return (
      <>
        <div className="sync-filesystem-info">
          {getSyncInfo}
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Person: state.User.persone,
    getGlobal: state.User.globalData,
    syncData: state.Sync.syncData,
    syncInfo: state.Sync.syncInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
    setSyncData: (data) => dispatch(syncActions.setSyncData(data)),
    setSyncInfo: (data) => dispatch(syncActions.setSyncInfo(data)),
    setSyncInfoCb: (data) => dispatch(syncActions.setSyncInfoCb(data)),
    setSyncDataCb: (data) => dispatch(syncActions.setSyncDataCb(data))
    // getSyncData: () => dispatch(syncActions.getSyncData())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SyncBar);
