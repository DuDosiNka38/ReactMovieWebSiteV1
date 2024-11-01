import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";

import { connect } from "react-redux";
import {
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  //   changePreloader
} from "../../store/actions";
import combine from "../../routes/combine";
import { Button } from "reactstrap";
import { ipcRenderer } from "electron";
import CaseSelector from "../Case/CaseSelector";

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if(this.props.Cases === undefined){
      this.props.fetchCases();
    }

    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.type !== prevProps.type) {
        this.initMenu();
      }
    }
  }

  manualSync = () => {
    this.props.showModal("SYNCHRONIZATION");
    // ipcRenderer.send("openModal", {fullscreen: true, openPath: "/modal/synchronization", title: "Manual Synchronization | DBI Legal Docs"});
  }

  initMenu() {
    new MetisMenu("#side-menu");

    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = (item) => {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    const cases = {
      active: this.props.cases.filter((x) => x.Status === "ACTIVE"),
      closed: this.props.cases.filter((x) => x.Status === "CLOSED"),
      length: this.props.cases.length,
    };
    return (
      <React.Fragment>

      <CaseSelector/>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">Menu</li>

            <li>
              <Link to={combine("DASHBOARD")} className="waves-effect">
                <i className="ri-dashboard-line"></i>
                <span className="ml-1">Dashboard</span>
              </Link>
            </li>

            <li>
              <a
          
                className="has-arrow"
              >
                <i className="ri-briefcase-line"></i>
                <span className="ml-1">Cases ({cases.length})</span>
              </a>
              <ul className="sub-menu" aria-expanded="true">
                <li>
                  <Link
                    to="/case/create-new/"
                    onClick={(e) => { e.preventDefault(); this.props.showModal("NEW_CASE")}}
                    className="create-case"
                  >
                    <i className="ri-add-line"></i> Create new
                  </Link>
                </li>
                <li>
                  <a
                    
                    className={cases.active.length > 0 ? "has-arrow" : ""}
                  >
                    Active ({cases.active.length})
                  </a>
                  {cases.active.length > 0 && (
                    <>
                      <ul className="sub-menu" aria-expanded="true">
                        {cases.active.map((c) => (
                          <li>
                            <NavLink
                              to={combine("SINGLE_CASE", {
                                Case_Short_NAME: c.Case_Short_NAME,
                              })}
                            >
                              {c.Case_Full_NAME}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
                <li>
                  <Link
                    to={combine("STATUS_CASES", { Status: "CLOSED" })}
                    className={cases.closed.length > 0 ? "has-arrow" : ""}
                  >
                    Closed ({cases.closed.length})
                  </Link>
                  {cases.closed.length > 0 && (
                    <>
                      <ul className="sub-menu" aria-expanded="true">
                        {cases.closed.map((c) => (
                          <li>
                            <Link
                              to={combine("SINGLE_CASE", {
                                Case_Short_NAME: c.Case_Short_NAME,
                              })}
                            >
                              {c.Case_Full_NAME}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              </ul>
            </li>
            <li>
              <a className="has-arrow">
                <i class="ri-recycle-line"></i>
                <span className="ml-1">Synchronization</span>
              </a>
              <ul className="sub-menu" aria-expanded="true">              
                {/* <li>
                  <Link to="/sync/not-uploaded" onClick={(e) => { e.preventDefault(); this.props.showModal("MANUAL_SYNC")}}>
                    <i class="ri-scan-2-line"></i>
                    <span className="ml-1">Upload Me</span>
                  </Link>
                </li>             */}
                <li>
                  <Link to="/sync/manual" className="create-case" onClick={(e) => { e.preventDefault(); this.manualSync()}}>
                    <div>
                      <i class="ri-scan-2-line"></i>
                      <span className="ml-1">Manual Sync</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to={combine("SYNCHRONIZATION/BOARD")}>
                  <i class="ri-bubble-chart-line"></i>
                    <span className="ml-1">Info Board</span>
                  </Link>
                </li>
                <li>
                  <Link to={combine("SYNCHRONIZATION")}>
                  <i class="ri-file-copy-2-line"></i>
                    <span className="ml-1">Synced Files</span>
                  </Link>
                </li>
                <li>
                  <Link to={combine("SYNCHRONIZATION/LOG")}>
                    <i class="ri-history-line"></i>
                    <span className="ml-1">History</span>
                  </Link>
                </li>
                <li>
                  <Link to={combine("SYNCHRONIZATION/SETTINGS")}>
                    <i class="ri-settings-5-line"></i>
                    <span className="ml-1">Settings</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to={combine("ALL_DOCUMENTS")}  className="waves-effect">
                <i className=" ri-file-word-2-line"></i>
                <span className="ml-1">Documents</span>
              </Link>
            </li>
            <li>
              <Link to={combine("ALL_EVENTS")} className="waves-effect">
                <i class="  ri-calendar-event-line"></i>
                <span className="ml-1">Events</span>
              </Link>
            </li>
            <li>
              <Link to={combine("TIME_LOG")} className="waves-effect">
                <i class="ri-timer-line"></i>
                <span className="ml-1">Time Log</span>
              </Link>
            </li>
            <li>
              <Link to={combine("SETTINGS")} className="waves-effect">
                <i class=" ri-settings-4-line"></i>
                <span className="ml-1">Settings</span>
              </Link>
            </li>
        
            <li> 
             <a  className="has-arrow">
                <i className="ri-tools-line"></i>
                <span className="ml-1">Admin Tools</span>
              </a>
              <ul className="sub-menu" aria-expanded="true">
                <li>
                  <Link to={combine("ADMIN_TOOLS")} >
                    <i className="ri-list-settings-line"></i>
                    <span className="ml-1">All</span>
                  </Link>
                </li>
                <li>
                  <Link to={combine("ADMIN_TOOLS/ERRORS")}>
                    <i className=" ri-code-box-line"></i>
                    <span className="ml-1">Errors</span>
                  </Link>
                </li>
                <li>
                  <Link to={combine("ADMIN_TOOLS/USERS")}>
                    <i className="ri-group-line"></i>
                    <span className="ml-1">Users</span>
                  </Link>
                </li>
                <li>
                  <Link to={combine("ADMIN_TOOLS/DEPARTMENTS")}>
                    <i className="ri-government-line"></i>
                    <span className="ml-1">Departments</span>
                  </Link>
                </li>
                <li>
                  <Link to={combine("ADMIN_TOOLS/PRIVILEGES")}>
                    <i className=" ri-shield-user-line"></i>
                    <span className="ml-1">Privileges</span>
                  </Link>
                </li>
                <li>
                  <Link to={combine("ADMIN_TOOLS/CALENDARS")}>
                    <i className=" ri-calendar-2-line"></i>
                    <span className="ml-1">Calendars</span>
                  </Link>
                </li>
                <li>
                  <Link to={combine("ADMIN_TOOLS/ACTIVITY_TYPES")}>
                    <i className=" ri-auction-line"></i>
                    <span className="ml-1">Activity Types</span>
                  </Link>
                </li>
               
              </ul>
            </li>

          
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  return { ...state.Layout, ...state.Case };
};

const mapDispatchToProps = (dispatch) => ({
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeLayoutWidth,
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  fetchCases: () => dispatch(CaseActions.userCasesFetchRequested()),
});

export default withRouter(
  connect(mapStatetoProps, mapDispatchToProps)(SidebarContent)
);
