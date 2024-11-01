import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import PRIVILEGE from "../../services/privileges";


import { connect } from "react-redux";
import {
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changePreloader,
} from "../../store/actions";

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.type !== prevProps.type) {
        this.initMenu();
      }
    }
  }

  checkPrivilege(privName) {
    const p = this.props.personeData;

    if (p.length === 0) return false;

    const result = p.Privileges.find((x) => x.Privilege === privName);

    if (result !== undefined) return true;
    else return false;
  }

  initMenu() {
    new MetisMenu("#side-menu");

    let matchingMenuItem = null;
    let ul = document.getElementById("side-menu");
    let items = ul.getElementsByTagName("a");
    for (let i = 0; i < items.length; ++i) {
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
    if (this.props.personeData === undefined) return <></>;

    const pData = this.props.personeData;

    return (
      <React.Fragment>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">Menu</li>

            <li>
              <Link to="/home" className="waves-effect">
                <i className="ri-dashboard-line"></i>
                {/* <span className="badge badge-pill badge-success float-right">3</span> */}
                <span className="ml-1">Home</span>
              </Link>
            </li>

            {PRIVILEGE.check("SHOW_CASES", pData) && (
              <>
               <li>
              <Link to="/app/case-explorer" className=" waves-effect">
              <i className="  ri-briefcase-4-fill"></i>
                <span className="ml-1">Cases</span>
              </Link>
            </li>
              
              </>
            )}


<>
              <li>
                <Link to="/alldocs" className=" waves-effect">
                  <i className="ri-file-copy-2-line"></i>
                  <span className="ml-1">Documents</span>
                </Link>
              </li>
            </>

            <>
              <li>
                <Link to="/allevents" className=" waves-effect">
                  <i className="ri-calendar-todo-line"></i>
                  <span className="ml-1">Events</span>
                </Link>
              </li>
            </>

            <>
              <li>
                <Link to="/sync" className=" waves-effect">
                  <i className="ri-refresh-line"></i>
                  <span className="ml-1">Synchronization</span>
                </Link>
              </li>
            </>    

            <>
              <li>
                <Link to="/search" className=" waves-effect">
                  <i className="  ri-search-line"></i>
                  <span className="ml-1">Search</span>
                </Link>
              </li>
            </>
           
            <li className="menu-title">Actions</li>
            {/* {PRIVILEGE.check("SHOW_USERS", pData) && (
              <>
                <li>
                  <Link to="/usersmanagement" className=" waves-effect">
                    <i className=" ri-group-fill"></i>
                    <span className="ml-1">
                      Users 
                    </span>
                  </Link>
                </li>
              </>
            )} */}
            {/* {PRIVILEGE.check("SHOW_DEPARTMENTS", pData) && (
              <>
                <li>
                  <Link to="/departments" className=" waves-effect">
                    <i className=" ri-government-fill"></i>
                    <span className="ml-1">Departments</span>
                  </Link>
                </li>
              </>
            )} */}
            {/* {PRIVILEGE.check("PRIVILEGE_MANAGEMENT", pData) && (
              <>
                <li>
                  <Link to="/priviliges" className=" waves-effect">
                    <i className="ri-shield-user-fill"></i>
                    <span className="ml-1">Priviliges</span>
                  </Link>
                </li>
              </>
            )} */}
            
            {/* <li>
              <Link to="/calendars" className=" waves-effect">
                <i className="    ri-calendar-todo-line"></i>
                <span className="ml-1">
                 Calendars 
                </span>
              </Link>
            </li> */}
            {/* {PRIVILEGE.check("SHOW_ACTIVITY_TYPES", pData) && (
              <>
                <li>
                  <Link to="/activity" className=" waves-effect">
                    <i className="  ri-function-fill"></i>
                    <span className="ml-1">
                    Activity Types
                    </span>
                  </Link>
                </li>
              </>
            )} */}

            <li>
              <Link to="/admin/settings" className=" waves-effect">
                <i className="   ri-list-settings-line"></i>
                <span className="ml-1">Admin Actions</span>
              </Link>
            </li>
            <li>
              <Link to="/user/settings" className=" waves-effect">
                <i className="  ri-settings-3-line"></i>
                <span className="ml-1">Your Actions</span>
              </Link>
            </li>

            <li>
              <Link to="/app/settings" className=" waves-effect">
                <i className="ri-terminal-box-fill"></i>
                <span className="ml-1">App Actions</span>
              </Link>
            </li>

          </ul>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    ...state.Layout,
    personeData: state.User.persone,
  };
};

export default withRouter(
  connect(mapStatetoProps, {
    changeLayout,
    changeSidebarTheme,
    changeSidebarType,
    changeLayoutWidth,
    changePreloader,
  })((SidebarContent))
);
