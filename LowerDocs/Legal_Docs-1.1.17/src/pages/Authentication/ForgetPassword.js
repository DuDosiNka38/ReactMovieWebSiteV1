import React, { Component } from "react";
import { Button, Container, Label, FormGroup, Row, Col } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import axios from "./../../services/axios";
import noteWindow from './../../services/notifications'

// Redux
import {  Link } from "react-router-dom";

// import images
import logolight from "../../assets/images/logo-light.png";

class FogotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_email: null,
    //   catchError : null,
    };
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentWillUnmount() {
    document.body.classList.remove("auth-body-bg");
  }

  async resetPassword(event, user) {
    const response = await axios.post(
      "/axios-handler.php",
      {
        handler: "login",
        function: "reset_password",
        data: {
          user_email: user.user_email,
        },
      }
    );
    if (response.data.result) {
        noteWindow.isSuck('Check your mail')
    }
    else if (response.data.result_data.hasOwnProperty("result_error_text")) {
       noteWindow.isError(response.data.result_data.result_error_text)
    } 
      
      else {
    }
    
  }

  render() {
    return (
      <React.Fragment>
        <div className="home-btn d-none d-sm-block">
          <Link to="/">
            <i className="mdi mdi-home-variant h2 text-white"></i>
          </Link>
        </div>

        <div>
          <Container fluid className="p-0">
            <Row className="no-gutters">
              <Col lg={12}>
                <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                  <div className="w-100">
                    <Row className="justify-content-center">
                      <Col lg={4} offset={4}>
                        <div>
                          <div className="text-center">
                            <div>
                              <Link to="/" className="logo">
                                <img src={logolight} height="40" alt="logo" />
                              </Link>
                            </div>
                          </div>
                        </div>

                        <AvForm
                          className="mt-3"
                          onValidSubmit={this.resetPassword}
                        >
                          <h4 className="font-size-18 my-4 text-center">
                            Create New Password
                          </h4>
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

                          <div className="mt-4 text-center">
                            <Button
                              color="primary"
                              className="w-md waves-effect waves-light"
                              type="submit"
                              // onClick = {this.props.checkPass}
                            >
                              Change password
                            </Button>
                          </div>
                        </AvForm>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default FogotPassword;
