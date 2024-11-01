import React, { Component } from "react";
import { Card, CardBody, CardHeader, Label, FormGroup } from "reactstrap";
import { AvField } from "availity-reactstrap-validation";

class EventNotification extends React.Component {
  render() {
    return (
      <>
        <Card>
          <CardHeader>Events Settings</CardHeader>
          <CardBody className="w-100">
            <FormGroup className="auth-form-group-custom ">
              <Label>Notify for (days)</Label>
              <i className=" ri-time-line  auti-custom-input-icon"></i>
              <AvField
                value={this.props.notify_time}
                type="number"
                name="notify_time"
                onChange={this.props.onChange}
              ></AvField>
            </FormGroup>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default EventNotification;
