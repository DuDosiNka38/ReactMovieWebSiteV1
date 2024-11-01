import { ipcRenderer } from "electron";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";
import DocsApi from "../../api/DocsApi";
import UserApi from "../../api/UserApi";
import CountDown from "../../services/CountDown";
import * as ProgressModalActions from "../../store/progress-modal/actions";
import ProgressModal from "./../../components/ProgressModal/ProgressModal";
import AuthService from "./../../services/AuthService";

class CheckLocations extends Component {
  state = {
    currentFile: null,
    newVersions: 0,
    checkedLocations: 0,
    wrongLocations: 0,
    totalLocations: "-",
    rightLocations: 0,

    isProcess: false,
    isChecked: false,

    secondsToClose: 5,

    countDown: null,
  };

  beforeCheckingFiles = (event, { totalLocations }) => {
    if(totalLocations === 0){
      ipcRenderer.send("closeModal", {});
    }

    this.setState({
      totalLocations,
      inProcess: true
    });
  };

  startCheckingFile = (event, { file }) => {
    this.setState({
      currentFile: `${file.File_dir} ${file.File_name}`,
    });
  };

  endCheckingFile = async (event, { file, isExists, isNewVersion }) => {
    try{
      const { checkedLocations, rightLocations, wrongLocations, newVersions } = this.state;
      if(isNewVersion) console.log({file})

      this.setState({
        checkedLocations: checkedLocations + 1,
        rightLocations: isExists ? rightLocations + 1 : rightLocations,
        wrongLocations: !isExists ? wrongLocations + 1 : wrongLocations,
        newVersions: isNewVersion ? newVersions + 1: newVersions
      });
    } catch (e) {
      console.log({e})
    }
  };

  afterCheckingFiles = async (event, data) => {
    const { secondsToClose, countDown } = this.state;
    // const { _info, hideProgressModal } = this.props;
    this.setState({
      inProcess: false,
      isChecked: true,
    });

    try {
      const User = await UserApi.fetchUser();
      console.log({User})
      const Computer_id = this.props.sysInfo.os.hostname;

      await DocsApi.postCheckLocations({Person_id: User.data.Person_id, Computer_id })
    } catch (error) {
      
    }
    
    countDown.runCountdown(secondsToClose, (secondsToClose) => {
      this.setState({secondsToClose})
    }, () => {
      ipcRenderer.send("closeModal", {});
    });
  }

  componentDidMount = async () => {
    const docLocations = await DocsApi.fetchFilesLocations({Computer_id: this.props.sysInfo.os.hostname});

    ipcRenderer.send("SYNC/CHECK_LOCATIONS", {hash:AuthService.getAuthHash(), docLocations});

    this.setState({countDown: new CountDown()});

    ipcRenderer.addListener(
      "SYNC/CHECK_LOCATIONS/BEFORE_CHECKING_FILES",
      this.beforeCheckingFiles
    );
    ipcRenderer.addListener(
      "SYNC/CHECK_LOCATIONS/START_CHECKING_FILE",
      this.startCheckingFile
    );
    ipcRenderer.addListener(
      "SYNC/CHECK_LOCATIONS/END_CHECKING_FILE",
      this.endCheckingFile
    );
    ipcRenderer.addListener(
      "SYNC/CHECK_LOCATIONS/AFTER_CHECKING_FILES",
      this.afterCheckingFiles
    );
  }

  componentWillUnmount() {
    const { countDown } = this.state;

    ipcRenderer.removeListener(
      "SYNC/CHECK_LOCATIONS/BEFORE_CHECKING_FILES",
      this.beforeCheckingFiles
    );
    ipcRenderer.removeListener(
      "SYNC/CHECK_LOCATIONS/START_CHECKING_FILE",
      this.startCheckingFile
    );
    ipcRenderer.removeListener(
      "SYNC/CHECK_LOCATIONS/END_CHECKING_FILE",
      this.endCheckingFile
    );
    ipcRenderer.removeListener(
      "SYNC/CHECK_LOCATIONS/AFTER_CHECKING_FILES",
      this.afterCheckingFiles
    );

    if(countDown) {
      countDown.stopCountdown();
      this.setState({countDown: null});
    }
  }

  render() {
    const {
      currentFile,
      checkedLocations,
      totalLocations,
      newVersions,
      wrongLocations,
      rightLocations,
      inProcess,
      isChecked,
      secondsToClose
    } = this.state;

    return (
      <>
        <>
            <ProgressModal
              title={
                <>
                  <div className="d-flex justify-content-between w-100 align-items-center">
                    <div className="d-flex w-100">
                      {inProcess && <Spinner size="sm"/>}
                      {isChecked && <i className="ri-check-line"></i>}
                      {`Check File Locations`}
                    </div>
                    <div className="d-flex w-100 text-right" style={{justifyContent: "flex-end"}}>
                      {isChecked && (<div>{`Close after ${secondsToClose} sec.`}</div>)}
                    </div>
                  </div>
                  
                </>
              }
              className="check-locations-modal"
            >
              <div className="d-block w-100">
                <div className="d-flex w-100 text-center">
                  <div className="count-block">
                    <div className="label">Progress</div>
                    <div className="value">{checkedLocations}/{totalLocations}</div>                  
                  </div>
                  <div className="count-block">
                    <div className="label">New Versions</div>
                    <div className="value">{newVersions}</div>
                  </div>
                  <div className="count-block">
                    <div className="label">File Exists</div>
                    <div className="value">{rightLocations}</div>   
                  </div>
                  <div className="count-block">
                    <div className="label">File isn't Exists</div>
                    <div className="value">{wrongLocations}</div>   
                  </div>
                </div>
                {/* <div className="current-file">{currentFile}</div> */}
              </div>
            </ProgressModal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  sysInfo: state.Main.system,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckLocations);
