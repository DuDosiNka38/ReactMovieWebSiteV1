import React, { Component } from "react";

import { connect } from "react-redux";
import { Button } from "reactstrap";

import { Link } from "react-router-dom";

// Import menuDropdown
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";


//Import logo Images
import logosmdark from "../../assets/images/logo-sm-dark.png";
import logodark from "../../assets/images/logo-dark.png";
import logosmlight from "../../assets/images/logo-sm-light.png";
import logolight from "../../assets/images/logo-light.png";
import CheckLocations from "../Synchronization/CheckLocations";
import CaseSelector from "../Case/CaseSelector";
import TimeLog from "../TimeLog/TimeLog";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isSearch: false,
      isSocialPf: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }
  /**
   * Toggle sidebar
   */
  toggleMenu() {
    this.props.toggleMenuCallback();
  }

  /**
   * Toggles the sidebar
   */

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

                <Link to="#" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logosmlight} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logolight} alt="" height="20" />
                  </span>
                </Link>
              </div>
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
            </div>

            {/* <TimeLog/> */}
            <div className="d-flex align-items-center">
             
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
              <NotificationDropdown />

              <ProfileMenu />
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

export default Header;
