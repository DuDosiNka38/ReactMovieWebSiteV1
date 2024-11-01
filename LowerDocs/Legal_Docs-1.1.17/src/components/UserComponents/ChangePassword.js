import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import CustomInputPass from "../FormComponents/CustomInputPass";

class UserChangePassword extends Component {
  state = {
    password: "",
    confirmpassword: "",
    modal: false,
  }
  switch_modal = this.switch_modal.bind(this);
  switch_modal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }
  render() {
    return (
      <>
       
         
            <Button
              type="button"
              color="info"
              className="waves-effect waves-light w-100"
              onClick={this.switch_modal}
            >
              Change
            </Button>
         

          <Modal
            isOpen={this.state.modal}
            switch={this.switch_modal}
            centered={true}
          >
            <ModalHeader
              toggle={() => this.setState({ modal: false })}
              className="text-center"
            >
              Change password
            </ModalHeader>
            <ModalBody toggle={() => this.setState({ modal: false })}>
              <AvForm
                className="mt-3"
                onValidSubmit={this.props.userSetNewPassword}
              >
                <CustomInputPass
                  name="old_password"
                  title="Old password"
                  for="old_password"
                  id="oldPassword"
                  placeholder="Password"
                  showScore = {false}
                  validate= {{
                    required: true,
                    minLength: {
                      value: 6,
                      errorMessage:
                        "Password cannot be less than 6 characters",
                    }
                  }}

                />
                <CustomInputPass
                  name="new_password"
                  title="New password"
                  for="new_password"
                  id="NewPassword"
                  placeholder="Password"
                  showScore = {true}
                  validate = {{
                    required: true,
                    minLength: {
                      value: 6,
                      errorMessage:
                        "Password cannot be less than 6 characters",
                    }
                  }}
                />
                <CustomInputPass
                  name="confirm_password"
                  title="Confirm password"
                  for="confirm_password"
                  id="confirmPassword"
                  placeholder="Password"
                  matchTo="new_password"
                  showScore = {false}
                  validate = {
                    {
                      required: true,
                      minLength: {
                        value: 6,
                        errorMessage:
                          "Password cannot be less than 6 characters",
                      },
                      match: {
                        value: "new_password",
                        errorMessage: "Password missmatch",
                      }
                    }
                  }
                />

                <div className="mt-4 text-center">
                  <Button
                    color="info"
                    className="w-md waves-effect waves-light"
                    type="submit"
                    // onClick = {this.props.checkPass}
                  >
                    Change password
                  </Button>
                </div>
              </AvForm>
            </ModalBody>
          </Modal>
      
      </>
    );
  }
}

export default UserChangePassword;
