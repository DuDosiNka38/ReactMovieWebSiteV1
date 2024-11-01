import React, { Component } from "react";
import {Button, Alert, Label, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import notify from './../../services/notification'

import * as RefActions from "../../store/ref/actions";
import * as PreloaderActions from '../../store/preloader/actions';

import axios from './../../services/axios'
import AuthService from './../../services/AuthService';

class SignInForm extends Component {

  state = {
    user_email: null,
    user_password: null,
  };

  handleChange = (e, val) => {
    const { name } = e.currentTarget;
    this.setState({[name]: val});
  }

  signIn = async (postData) => {
    if(postData === undefined){
      const { system } = this.props;
      let { user_email, user_password } = this.state;
      
      if(user_email.indexOf("@") === -1){
        this.props.showPreloader();
        const userData = await axios.get(`/api/user/${user_email}`).then((r) => (r.data)).catch((e) => (false));

        this.props.hidePreloader();
        //Server is down
        if(!userData){
          notify.isError("Selected host is down!");
          
          return false;
        }

        if(userData !== undefined){
          user_email = userData.Email_address;
        } else {
          notify.isError("User with typed Person identifier is not exists!");
          
          return false;
        }
      }

      postData = {
        user: {
          Email_address: user_email,
          Password: user_password
        },
        computer: {
          Mac_Address: system.uuid.macs[0],
          OS: system.os.platform,
          Computer_user: system.os.hostname
        },
        checkFirstAuth: true,
      }
    }
    
    const response = await axios.post("/api/signin", postData).then((r) => (r.data)).catch((e) => (false));

    //Server is down
    if(!response){
      notify.isError("Selected host is down!");
      return false;
    }

    if(response.result === false && response.data.hasOwnProperty("error_code")){
      notify.isError(response.data.error_message);
    } else {
      if(response.data.isFirstAuth){
        notify.isSuck("You are logging into the system for the first time. You need to change your password to a new one.");
        this.props.setReffererData('SET_NEW_PASSWORD_FORM', postData);
        this.props.switchForm('SET_NEW_PASSWORD_FORM');
        return false;
      }
      if(!response.data.isApprovedComputer){
        if(this.props.reffererData === undefined)
          notify.isSuck("Your computer is not approved by administrator yet. Contact with him!");
        this.props.setReffererData('SIGN_IN_FORM', postData);        
        this.props.switchForm('NOT_APPROVED_PC_FORM');
        return false;
      }

      if(response.data.auth_hash){
        this.props.showPreloader();
        AuthService.setAuthHash(response.data.auth_hash);
      }
    }
  }

  componentDidMount() {
    const { reffererData } = this.props;
    if(reffererData !== undefined){
      this.setState({user_email: reffererData.data.user.Email_address, user_password: reffererData.data.user.Password});
      this.signIn(reffererData.data);
    }
  }

  render() {
    const { user_email, user_password } = this.state;
    return (
      <>
        <AvForm
          className="form-horizontal"
          onValidSubmit={() => this.signIn()}
        >
          <FormGroup className="auth-form-group-custom mb-4"> 
            <i className="ri-user-2-line auti-custom-input-icon"></i>
            <Label htmlFor="username">Email or Person identifier</Label>
            <AvField
              name="user_email"
              value={user_email}
              type="text"
              className="form-control"
              id="username"
              validate={{ required: true }}
              placeholder="Enter username"
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup className="auth-form-group-custom mb-4"> 
            <i className="ri-lock-2-line auti-custom-input-icon"></i>
            <Label htmlFor="password">Password</Label>
            <AvField
              name="user_password"
              value={user_password}
              type="password"
              className="form-control"
              id="user_password"
              validate={{
                required: true,
                minLength: {
                  value: 6,
                  errorMessage: "Password cannot be less than 6 characters",
                },
              }}
              placeholder="Enter password"
              onChange={this.handleChange}
            />
          </FormGroup>

          
          <div className="mt-4 text-center">
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
              <i className="ri-lock-unlock-line mr-1"></i>Sign In
            </Button>
          </div>
        </AvForm>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setReffererData: (dataFor, data) => dispatch(RefActions.setReffererData(dataFor, data)), 
  showPreloader: () => dispatch(PreloaderActions.showPreloader('SIGN_IN_FORM')),
  hidePreloader: () => dispatch(PreloaderActions.hidePreloader('SIGN_IN_FORM')),
});

const mapStateToProps = (state) => ({
  system: state.Main.system,
  reffererData: state.Ref.reffererData.find(
    (x) => x.dataFor === "SIGN_IN_FORM"
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm);
