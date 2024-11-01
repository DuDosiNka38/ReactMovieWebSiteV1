import React, { Component } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Avatar from "react-avatar";
import * as UserActions from "./../../../store/user/actions";
import * as PreloaderActions from "./../../../store/preloader/actions";
import { connect } from "react-redux";
import AuthService from './../../../services/AuthService'
import { ipcRenderer } from "electron";

// users

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  logOut = () =>{
    this.props.showPreloader();
    AuthService.removeAuthHash();
    ipcRenderer.send("reloadWindow");
  }

  componentDidMount() {
    this.props.requestUser();
  }

  render() {
    const { User } = this.props;
    const userData = User.data;

    return (
      <>
        <div className="d-flex align-items-center">
          <Avatar name={userData.NAME} size="36" round className="mr-4 ml-3" />
          <span className="d-none d-xl-inline-block ml-1 text-transform mr-3">{userData.NAME}</span>
          {/* <Link className="text-danger" href="/logout">
            <i className="ri-shut-down-line align-middle mr-1 text-danger"></i>{" "}
          </Link> */}
          <Dropdown isOpen={this.state.menu} toggle={this.toggle} className="d-inline-block user-dropdown">
            <DropdownToggle tag="button" className="btn header-item waves-effect" id="page-header-user-dropdown">
              <i className="ri-shut-down-line align-middle  text-danger font-size-22 "></i>{" "}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href="#" onClick={this.logOut}>
                <i className=" ri-logout-box-r-line align-middle text-danger"></i> Log Out
              </DropdownItem>
              <DropdownItem href="/lock-screen">
                <i className=" ri-door-lock-box-line align-middle text-danger"></i> Lock Screen
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  requestUser: () => dispatch(UserActions.userFetchRequested()),
  showPreloader: (type) => dispatch(PreloaderActions.showPreloader(type)),
});
const mapStateToProps = (state) => ({
  User: state.User,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
