import { ipcRenderer } from "electron";
import React, { Component } from "react";
import { connect } from "react-redux";

class CheckLocations extends Component {
  state = {
    currentFile: null,
    newVersions: 0,
    checkedLocations:0,
    wrongLocations: 0,
    totalLocations: "-",
  };

  beforeCheckingFiles = (event, {totalLocations}) => {
    this.setState({
      totalLocations
    });
  }

  startCheckingFile = (event, {file}) => {
    this.setState({
      currentFile: `${file.File_dir} ${file.File_name}`,
    });
  }

  endCheckingFile = (event, {file}) => {
    const { checkedLocations } = this.state;
    this.setState({
      checkedLocations: checkedLocations+1
    });
  }

  checkFile = (event, {file}) => {

    this.setState({
      currentFile: `${file.File_dir} ${file.File_name}`
    });
  }

  componentDidMount() {
    ipcRenderer.addListener("SYNC/CHECK_LOCATIONS/BEFORE_CHECKING_FILES", this.beforeCheckingFiles);
    ipcRenderer.addListener("SYNC/CHECK_LOCATIONS/START_CHECKING_FILE", this.startCheckingFile);
    ipcRenderer.addListener("SYNC/CHECK_LOCATIONS/END_CHECKING_FILE", this.endCheckingFile);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener("SYNC/CHECK_LOCATIONS/BEFORE_CHECKING_FILES", this.beforeCheckingFiles);
    ipcRenderer.removeListener("SYNC/CHECK_LOCATIONS/START_CHECKING_FILE", this.startCheckingFile);
    ipcRenderer.removeListener("SYNC/CHECK_LOCATIONS/END_CHECKING_FILE", this.endCheckingFile);
  }

  render() {
    const { currentFile, checkedLocations, totalLocations } = this.state;

    return (
      <>
        <div className="d-block text-center">
          <h5>Check File Locations on Current Computer ({checkedLocations}/{totalLocations})</h5>
          <div>{currentFile}</div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckLocations);
