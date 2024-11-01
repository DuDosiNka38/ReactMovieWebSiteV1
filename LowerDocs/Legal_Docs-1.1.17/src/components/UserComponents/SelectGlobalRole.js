import React, { Component } from "react";
// import { connect } from "react-redux";
import Select from "react-select";

class SelectGlobalRole extends Component {
  state = {};

  render() {
    let currentRole = [];
    const options = this.props.roles.map((o)=>(
      {value: o.Role, label: o.DESCRIPTION}
      ));
    
    if(this.props.currentRole !== undefined){
       currentRole = options.filter((x)=> x.value === this.props.currentRole)
      if(currentRole.length === 0)
        return (<></>);
    }

    return (
      <>
        <Select
          options={options}
          defaultValue={this.props.currentRole !== undefined && currentRole[0]  }
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={this.props.onChange}
        />
      </>
    );
  }
}

export default SelectGlobalRole;
