import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { Link } from "react-router-dom";

// Import menuDropdown
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import ScanModule from "./../FilesSync/ScanModule";
import SyncBar from './../FilesSync/SyncBar'

// Redux Store
import { toggleRightSidebar } from "../../store/actions";

//Import logo Images
import logosmdark from "../../assets/images/logo-sm-dark.png";
import logodark from "../../assets/images/logo-dark.png";
import logosmlight from "../../assets/images/logo-sm-light.png";
import logolight from "./../../assets/images/logo-light.png";
import GoBack from "../GoBack/GoBack";
import ParseResult from "../FilesSync/ParseResult";
import * as actions from "./../../store/user/actions";
import { transform } from "typescript";

let minimize = '&#128469;'

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      isSocialPf: false,
      modal: false,
      modalAction: "SCANNED_FILES",
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleRightbar = this.toggleRightbar.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.switch_modal = this.switch_modal.bind(this);
  }

  /**
   * Toggle sidebar
   */
  toggleMenu() {
    this.props.toggleMenuCallback();
  }
  switch_modal() {
    this.setState((prevState) => ({
      blink: false,
      modal: !prevState.modal,
    }));
  }

  toggleRightbar() {
    this.props.toggleRightSidebar();
  }

  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }


  
  render() {
    const {
      isScanned,
      blink,
      modalAction,
      currentUploadingFile,
      uploadingPercent,
      parsing,
      saveUploadedFiles,
      scanStatus
    } = this.state;

    const {personeData} = this.props;

    if(personeData === undefined || personeData.length === 0)
      return null;
      
    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link to="#" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logosmdark} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logodark} alt="" height="20" />
                  </span>
                </Link>

                <Link to="/home" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logosmlight} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logolight} alt="" height="20" />
                  </span>
                </Link>
              </div>
              <GoBack />
              <Button
                size="sm"
                color="none"
                type="button"
                onClick={this.toggleMenu}
                className="px-3 font-size-24 header-item waves-effect"
                id="vertical-menu-btn"
              >
                <i className="ri-menu-2-line align-middle"></i>
              </Button>
              <div className="dropdown d-none d-lg-inline-block ml-1">
                <Button
                  color="none"
                  type="button"
                  className="header-item noti-icon waves-effect"
                  onClick={this.toggleFullscreen}
                >
                  <i className="ri-fullscreen-line"></i>
                </Button>
              </div>
            </div>
            <SyncBar/>          

            <div className="d-flex">
              {/* <Button
                size="sm"
                color="none"
                type="button"
                onClick={isScanned === true ? this.switch_modal : () => {}}
                // onClick={this.switch_modal}
                className={`px-3 font-size-24 header-item waves-effect d-flex align-items-center ${
                  blink === true ? "blink" : ""
                }`}
                id="vertical-menu-btn"
              >
                <i
                  className={`syncIcon ${scanStatus.class} ${scanStatus.icon}`}
                ></i>
                <span
                  style={{
                    fontSize: "12px",
                    marginLeft: "10px",
                    textTransform:"uppercase"
                  }}
                  className={scanStatus.class}
                >
                  {scanStatus.label}
                </span>
              </Button>
              {/* <NotificationDropdown /> */}
              <ProfileMenu userLogin={this.props.personeData.NAME} />
            </div>
          </div>
        </header>
        {modalAction === "SCANNED_FILES" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="xl">
              <ModalHeader
               charCode= "_" 
                toggle={() => this.setState({ modal: false })}
                className="text-center"
              >
                directory scan result
              </ModalHeader>
              <ModalBody toggle={() => this.setState({ modal: false })}>
                <ScanModule data={this.state.scanResult} />
              </ModalBody>
            </Modal>
          </>
        )}

        {modalAction === "ALREADY_UPLOADED" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="xl">
              <ModalHeader
               charCode= "_" 
                toggle={() => this.setState({ modal: false })}
                className="text-center"
              >
                You have already uploaded files
              </ModalHeader>
              <ModalBody toggle={() => this.setState({ modal: false })}>
                <b
                  style={{
                    display: "block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "12px",
                  }}
                >
                  {currentUploadingFile}
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
                      width: `${uploadingPercent}%`,
                      height: "100%",
                      background: "#1cbb8c",
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: "12px",
                      padding: "5px 2px",
                      textAlign: "center",
                    }}
                  >
                    {uploadingPercent}%
                  </div>
                </div>
              </ModalBody>
            </Modal>
          </>
        )}

        {modalAction === "UPLOAD_FILES" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="xl">
              <ModalHeader
               charCode= "_" 
                toggle={() => this.setState({ modal: false })}
                className="text-center"
              >
                Uploading files on server
              </ModalHeader>
              <ModalBody toggle={() => this.setState({ modal: false })}>
                <b
                  style={{
                    display: "block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "12px",
                  }}
                >
                  {currentUploadingFile}
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
                      width: `${uploadingPercent}%`,
                      height: "100%",
                      background: "#1cbb8c",
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: "12px",
                      padding: "5px 2px",
                      textAlign: "center",
                    }}
                  >
                    {uploadingPercent}%
                  </div>
                </div>
              </ModalBody>
            </Modal>
          </>
        )}

        {modalAction === "PARSING_FILES" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="xl">
              <ModalHeader
                toggle={() => this.setState({ modal: false })}
                className="text-center"
                charCode= "_"  >
                Parsing uploaded files
              </ModalHeader>
              <ModalBody toggle={() => this.setState({ modal: false })}>
                <b
                  style={{
                    display: "block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "12px",
                  }}
                >
                  {parsing.file}
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
                      width: `${parsing.percent}%`,
                      height: "100%",
                      background: "#1cbb8c",
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: "12px",
                      padding: "5px 2px",
                      textAlign: "center",
                    }}
                  >
                    {parsing.percent}%
                  </div>
                </div>
              </ModalBody>
            </Modal>
          </>
        )}

        {modalAction === "PARSE_RESULT" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="xl">
              <ModalHeader
                toggle={() => this.setState({ modal: false })}
                className="text-center"
                charCode= "_" 
              >
                Result of parsing files
              </ModalHeader>
              <ModalBody toggle={() => this.setState({ modal: false })}>
                <ParseResult
                  parsed={this.state.parseResult}
                  saveUploadedFiles={this.saveUploadedFiles}
                />
              </ModalBody>
            </Modal>
          </>
        )}

        {modalAction === "SAVE_UPLOADED_FILES" && (
          <>
            <Modal isOpen={this.state.modal} centered={true} size="xl">
              <ModalHeader
                toggle={() => this.setState({ modal: false })}
                className="text-center"
                charCode= "_" 
              >
                Saving uploaded files
              </ModalHeader>
              <ModalBody toggle={() => this.setState({ modal: false })}>
                <b
                  style={{
                    display: "block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "12px",
                  }}
                >
                  {saveUploadedFiles.currentFile}
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
                      width: `${saveUploadedFiles.percent}%`,
                      height: "100%",
                      background: "#1cbb8c",
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: "12px",
                      padding: "5px 2px",
                      textAlign: "center",
                    }}
                  >
                    {saveUploadedFiles.percent}%
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {saveUploadedFiles.percent >= 100 && 
                <>
                  <Button type="button" color="success" onClick={this.switch_modal}>Close</Button>
                </>}
              </ModalFooter>
            </Modal>
          </>
        )}
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  const { layoutType } = state.Layout;

  return {
    layoutType,
    personeData: state.User.persone,
    getGlobal: state.User.globalData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});

export default connect(mapStatetoProps, mapDispatchToProps )(Header);
