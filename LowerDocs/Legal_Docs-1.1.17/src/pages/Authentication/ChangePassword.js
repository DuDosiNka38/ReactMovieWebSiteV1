import React, { Component } from "react";
// import ReactPasswordStrength from "react-password-strength";
import { Button, Container } from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import CustomInputPass from "../../components/FormComponents/CustomInputPass";

///////////////
//E B A N K O//
//B         K//
//A  0   0  N//
//N    |    A//
//K  *---*  B//
//O K N A B E//
///////////////
//Import Breadcrumb
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      comfirmpassword: "",
      passwordValid: true,
    };
  }
  handleChange = (event) => {
    const { name, value } = event.currentTarget;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <AvForm
            className="mt-3"
            onValidSubmit={this.props.userSetNewPassword}
          >
            <h4 className="font-size-18 my-4 text-center">Change password!</h4>
            {/* <FormGroup className="auth-form-group-custom">
              <i className="ri-lock-2-line auti-custom-input-icon"></i>
              <Label htmlFor="userpassword">Password</Label>
              <AvField
                name="password"
                validate={{ required: true, minLength: { value: 6, errorMessage: 'Password cannot be less than 6 characters' }}}
                type="password"
                className="form-control"
                id="userpassword"
                placeholder="Enter password"
              />
            </FormGroup> */}
            <CustomInputPass
              name="password"
              title="New password"
              for="password"
              id="userpassword"
              placeholder="Enter password"
              showScore={true}
              validate={{
                required: true,
                minLength: {
                  value: 6,
                  errorMessage: "Password cannot be less than 6 characters",
                },
              }}
            />
            {/* <FormGroup className="auth-form-group-custom">
              <i className="ri-lock-2-line auti-custom-input-icon"></i>
              <Label htmlFor="userpassword">Password confirm</Label>
              <AvField
                name="passwordConfirm"
                validate={{ required: true, minLength: { value: 6, errorMessage: 'Password cannot be less than 6 characters' }, match: {value: "password", errorMessage: "Password missmatch" }}}
                type="password"
                className="form-control"
                id="user_confirm_password"
                placeholder="Enter password"
              />
            </FormGroup> */}
            <CustomInputPass
              name="passwordConfirm"
              title="Confirm password"
              for="passwordConfirm"
              id="user_confirm_password"
              placeholder="Enter password"
              sshowScore={false}
              validate={{
                required: true,
                minLength: {
                  value: 6,
                  errorMessage: "Password cannot be less than 6 characters",
                },
                match: {
                  value: "password",
                  errorMessage: "Password missmatch",
                },
              }}
            />
            <div className="mt-4 text-center">
              <Button
                color="primary"
                className="w-md waves-effect waves-light"
                type="submit"

              >
                Change password
              </Button>
            </div>
          </AvForm>
        </Container>
      </React.Fragment>
    );
  }
}

export default ChangePassword;

