import React, { Component } from "react";
import Select from "react-select";
import { Input } from "reactstrap";

export default class KHuyamSettingsYear extends Component {
  render() {
    return (
      <div>
        <Input
          name="monthsBefore"
          type="number"
        />
      </div>
    );
  }
}
