import React, { Component } from "react";
import {Button, Alert, Label, FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input, } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";
import CustomInputPass from "../../components/FormComponents/CustomInputPass";
import HostManager from './../../components/HostManager/HostManager'

class LoginForm extends Component {
  state = {
    disabled:false,
    modal: false,
    MODAL_ACTION: null,
    newHost: "",
    error: "",

    HOSTS_LIST: [],
  }

  

 componentDidUpdate(prevProps) {
  if(this.props.data !== prevProps.data) {
    this.setState({disabled: !this.state.disabled})
  }
 }
  

  render() {
    
    return (
      <>
        

        {this.props.loginError && this.props.loginError ? (
          <Alert color="danger">{this.props.loginError}</Alert>
        ) : null}
        <AvForm
          className="form-horizontal"
          onValidSubmit={ this.props.checkUser}
        >
          <FormGroup className="auth-form-group-custom mb-4" style={{zIndex: "99"}}>
            <HostManager/>  
          </FormGroup>
          <FormGroup className="auth-form-group-custom mb-4">
            <i className="ri-user-2-line auti-custom-input-icon"></i>
            <Label htmlFor="username">Email</Label>
            <AvField
              name="user_email"
              value={this.props.user_email}
              type="text"
              className="form-control"
              id="username"
              validate={{ email: true, required: true }}
              placeholder="Enter username"
              disabled={this.state.disabled}
            />
          </FormGroup>
          <CustomInputPass
              name="user_password"
              title="Password"
              for="password"
              id="userpassword"
              placeholder="Enter password"
              showScore={false}
              value={this.props.user_password}
              validate={{
                required: true,
                minLength: {
                  value: 6,
                  errorMessage: "Password cannot be less than 6 characters",
                },
              }}
            />

          {this.props.data === true && (
            <FormGroup className="auth-form-group-custom mb-4">
              <div className="custom-file">
                <Label
                  className="custom-file-label nospaceFile"
                  htmlFor="customFile"
                >
                  {this.props.handleFileChosen && 'Choose key file' }
                </Label>
                <AvField
                  name="keyfile"
                  type="file"
                  value={this.props.sucssesKey}
                  className="custom-file-input"
                  id="customFile"
                  validate={{ required: true }}
                  accept=".ld"
                  onChange={(event) =>
                    this.props.handleFileChosen(event.target.files[0])
                  }
                />
              </div>
            </FormGroup>
          )}

          {this.props.data ===true ? 
          (<>
          <div className="mt-4 text-center">
              <span to="/forgot-password" className="text-muted cursor-pointer">
                <i className="mdi mdi-lock mr-1"></i> Forgot your secret key ?
              </span>
              </div>
          </>) 
          
          : (

             <>
              <div className="mt-4 text-center">
              <Button
                color="primary"
                className="w-md waves-effect waves-light"
                type="submit"
              >
                Log In
              </Button>
              </div>
              {/* <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-muted">
                <i className="mdi mdi-lock mr-1"></i> Forgot your password?
              </Link>
            </div> */}
             </>
 )}
          

          
        </AvForm>
      </>
    );
  }
}

export default LoginForm;
