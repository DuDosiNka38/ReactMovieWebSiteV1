import React, { Component } from "react";
import CustomInputPass from "./../../components/FormComponents/CustomInputPass";
import { Col, Label, FormGroup, Card, CardBody} from "reactstrap";
import generator from "generate-password";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { AvField } from "availity-reactstrap-validation";

class RegisterForm extends Component {
  state = {
    // path:  this.props.location
  };

  generatePassword = () => {
    const password = generator.generate({
      length: 12,
      numbers: true,
    });
    this.setState({ randompassword: password });
  };

  copiedSucsess = () => {
    if (this.state.randompassword && this.state.copied === true)
      toastr.success("Password Copied");
  };
  componentDidMount() {
  
  }
  render() {
    return (
      <>
      <Col lg={12}>
        <h3>Add User Information</h3>
      </Col>
     
      <Col lg={6}>
        <Card>
          <CardBody>
          <FormGroup className="auth-form-group-custom">
          <i className=" ri-hashtag auti-custom-input-icon"></i>
          <Label htmlFor="personid">Person ID</Label>
          <AvField
            name="person_id"
            value={this.props.userId}
            disabled ={this.props.dis}
            validate={{ required: true }}
            type="text"
            className="form-control"
            id="person_id"
            placeholder="Enter person id"
          />
        </FormGroup>
          </CardBody>
        </Card>
      </Col>
      <Col lg={6}>
        <Card>
          <CardBody>
          <FormGroup className="auth-form-group-custom">
          <i className="ri-mail-line auti-custom-input-icon"></i>
          <Label htmlFor="useremail">Email</Label>
          <AvField
            name="user_email"
            value={this.props.userMail}
            validate={{ email: true, required: true }}
            type="email"
            className="form-control"
            id="useremail"
            placeholder="Enter email"
          />
        </FormGroup>

          </CardBody>
        </Card>
      </Col>
      <Col lg={6}>
        <Card>
          <CardBody>
          <FormGroup className="auth-form-group-custom">
          <i className="ri-mail-line auti-custom-input-icon"></i>
          <Label htmlFor="user_name">User Name</Label>
          <AvField
            name="user_name"
            value={this.props.userName}
            validate={{ required: true }}
            type="text"
            className="form-control"
            id="user_name"
            placeholder="Enter user name"
          />
        </FormGroup>

          </CardBody>
        </Card>
      </Col>
      <Col lg={6}>
        <Card>
          <CardBody>
          <FormGroup className="auth-form-group-custom">
          <CustomInputPass
          name="user_password"
          title="Password"
          for="password"
          id="userpassword"
          value={this.state.randompassword}
          placeholder="Enter password"
          showScore={true}
          validate={
            this.props.path !== "config"  && (
              {
                required: true,
                minLength: {
                  value: 6,
                  errorMessage: "Password cannot be less than 6 characters",
                },
              }
            )
           }
        />
        </FormGroup>

          </CardBody>
        </Card>
      </Col>
      </>
    );
  }
}

export default RegisterForm;
