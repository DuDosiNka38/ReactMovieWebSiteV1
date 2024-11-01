import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Progress } from "reactstrap";
import { connect } from "react-redux";
import * as ProgressModalActions from "../../store/progress-modal/actions";
import ProgressModal from "./../../components/ProgressModal/ProgressModal"

import notification from "../../services/notification";
import DownloadService from "../../services/Download.service";
import { ipcRenderer } from "electron";
import DocsApi from "../../api/DocsApi";
import md5 from "md5";

class DownloadFile extends Component {
  DS = new DownloadService();
  state = {
    received_bytes: 0,
    total_bytes: 0,

    STEP: "DOWNLOAD_PROCESS",

    savePath: null,

    visibleModal: false,
  }

  componentDidMount() {
    const { downloadUrl, hideProgressModal, _info, Format, fileName, File_id, Person_id, Computer_id } = this.props;
    const { type, _id } = _info;

    console.log(this.props)
    
    this.DS.download(
      {
        downloadUrl,
        Format,
        defaultFileName: fileName,
        _id
      },
      {
        onStart: (args) => {
          const { localFileName, total_bytes } = args;
          this.setState({visibleModal: true, localFileName, total_bytes })
        },
        onProgress: (args) => {
          this.setState({...args});
        },
        onSuccess: async (args) => {
          const { File_name, File_dir, savePath } = args;
          this.setState({STEP: "SUCCEEDED_DOWNLOAD", savePath});
          await DocsApi.postFileLocation({
            File_id,
            Person_id,
            Computer_id,
            File_name,
            File_dir,
            File_path_hash: md5(savePath),
          });
          setTimeout( () => hideProgressModal({type, _id}), 5000);
        },
        onError: (args) => {
          const { result, e } = args;

          if(e.code === "CANCEL_DOWNLOAD"){
            hideProgressModal({type, _id});
            return;
          }

          console.log({Error: args});
        }
      }
    );
  }

  openFile = () => {
    const {savePath } = this.state;
    const { hideProgressModal, _info } = this.props;
    const { type, _id } = _info;

    ipcRenderer.send("openFile", {path: this.state.savePath});
    hideProgressModal({type, _id});

  }


  render() {
    const { fileName } = this.props;
    const { total_bytes, received_bytes, STEP, visibleModal, localFileName } = this.state;

    const Upload_Percent = received_bytes * 100 / total_bytes;

    if(!visibleModal) return null;

    return (
      <>
        <>
          <ProgressModal title={<><i class="ri-file-download-line mr-2 font-weight-light"></i>{`Download Document File`}</>}>
            {STEP === "DOWNLOAD_PROCESS" && (
              <>
                <div className="d-block w-100">
                  {localFileName}<br/>
                  <Progress animated value={Upload_Percent}>{Upload_Percent.toLocaleString()} %</Progress>  
                </div>
              </>
            )}
            {STEP === "SUCCEEDED_DOWNLOAD" && (
              <>
                <div className="d-block w-100 cursor-pointer" onClick={this.openFile}>
                  {localFileName} was successfully downloaded! Click to open it.
                </div>
              </>
            )}
            
          </ProgressModal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  hideProgressModal: ({type, props, _id}) => dispatch(ProgressModalActions.hideModal({type, props, _id})),
});

export default connect(mapStateToProps, mapDispatchToProps)(DownloadFile);
