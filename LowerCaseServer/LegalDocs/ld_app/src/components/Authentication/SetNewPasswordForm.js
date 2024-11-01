import React, { Component } from "react";
import { Button, Alert, Label, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import notify from "./../../services/notification";

import * as RefActions from "../../store/ref/actions";
import axios from "./../../services/axios";
import PreloaderLD from "../Preloader/preloader-core";

class SetNewPasswordForm extends Component {
  state = {
    user_password: null,
    confirm_password: null,
  };

  Preloader = new PreloaderLD(this);

  handleChange = (e, val) => {
    const { name } = e.currentTarget;
    this.setState({ [name]: val });
  };

  setNewPassword = async () => {
    this.Preloader.show();
    const { user_password } = this.state;
    const postData = this.props.reffererData.data;
    postData.checkFirstAuth = false;

    if (postData.user.Password === user_password) {
      notify.isError("Old password typed! Choose another one!");
      this.Preloader.hide();
      return false;
    }

    postData.user.Password = user_password;

    const response = await axios
      .post("/api/user/new-password", {
        Email_address: postData.user.Email_address,
        Password: user_password,
      })
      .then((r) => r.data)
      .catch((e) => e);
    this.Preloader.hide();
    if (response.result) {
      this.props.setReffererData("SIGN_IN_FORM", postData);
      this.props.switchForm("SIGN_IN_FORM");
      return false;
    } else {
      notify.isError(JSON.stringify(response));
      return false;
    }
  };

  render() {
    const { confirm_password, user_password } = this.state;
    return (
      <>
        {this.Preloader.get()}
        <h5 className="h5 text-center text-uppercase">Set a new password</h5>
        <AvForm className="form-horizontal" onValidSubmit={this.setNewPassword}>
          <FormGroup className="auth-form-group-custom mb-4">
            <i className="ri-lock-2-line auti-custom-input-icon"></i>
            <Label htmlFor="userpassword">Password</Label>
            <AvField
              name="user_password"
              validate={{
                required: true,
                minLength: {
                  value: 6,
                  errorMessage: "Password cannot be less than 6 characters",
                },
              }}
              type="password"
              className="form-control"
              id="userpassword"
              placeholder="Enter password"
              value={user_password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup className="auth-form-group-custom mb-4">
            <i className="ri-lock-2-line auti-custom-input-icon"></i>
            <Label htmlFor="confirm_password">Password confirm</Label>
            <AvField
              name="confirm_password"
              validate={{
                required: true,
                minLength: {
                  value: 6,
                  errorMessage: "Password cannot be less than 6 characters",
                },
                match: {
                  value: "user_password",
                  errorMessage: "Password missmatch",
                },
              }}
              type="password"
              className="form-control"
              id="confirm_password"
              placeholder="Enter password"
              value={confirm_password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <div className="text-center">
            <Button
              color="primary"
              className="w-md waves-effect waves-light icon-button"
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <i className="ri-save-line mr-1"></i>Confirm
            </Button>
          </div>
        </AvForm>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setReffererData: (dataFor, data) =>
    dispatch(RefActions.setReffererData(dataFor, data)),
});

const mapStateToProps = (state) => ({
  system: state.Main.system,
  reffererData: state.Ref.reffererData.find(
    (x) => x.dataFor === "SET_NEW_PASSWORD_FORM"
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(SetNewPasswordForm);
