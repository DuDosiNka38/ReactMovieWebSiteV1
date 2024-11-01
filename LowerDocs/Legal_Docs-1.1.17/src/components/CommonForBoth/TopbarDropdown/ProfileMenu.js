import React, { Component } from "react";
import { Button } from "reactstrap";
import Avatar from "react-avatar";
import axios from "./../../../services/axios";
import Core from "../../../electron/services/core";
import * as actions from "./../../../store/user/actions";
import { connect } from "react-redux";


import PreloaderLD from "../../../services/preloader-core";

// users

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.Preloader = new PreloaderLD(this);
    this.state = {
      menu: false,
      preloaderState: false,
    };
    this.toggle = this.toggle.bind(this);
    this.userLogout = this.userLogout.bind(this);
  }

  userLogout() {
    this.Preloader.show();
    
    const result = axios
      .post("/api/auth/close", Core.getHash())
      .then((response) => {
        if (response.data.result) {
          Core.closeSession();
          return true;
        } else {
          return false;
        }
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });

    if (result) {
      setTimeout(() => {
        this.props.onGlobalLoad();
        window.history.pushState(null, null, "/login");
      }, 500);
    }
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  render() {
    let username = this.props.userLogin;

    return (
      <React.Fragment>
        {this.Preloader.get()}
        <div className="d-flex align-items-center ml-3">
          <Avatar name={`${username} FBI`} size="36" round />

          <span className="d-none d-xl-inline-block ml-1 text-transform">
            {username}
          </span>
          <Button onClick={this.userLogout} color="default">
            <i className=" ri-logout-box-r-line align-middle mr-1 text-danger"></i>{" "}
          
          </Button>
        </div>
       
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});

export default connect(null, mapDispatchToProps)(ProfileMenu);
