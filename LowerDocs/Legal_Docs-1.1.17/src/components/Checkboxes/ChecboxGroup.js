import React, { Component } from 'react'
import { Input, Label} from "reactstrap";

class CheckboxGroup extends Component {
  state = { 
    selected: false
   }

   handleChange = e => {
    let a = e.currentTarget.value;
    this.setState({ selected: e.currentTarget.checked });
    this.props.selectRoles.set(a, e.currentTarget.checked);
  };
  render() { 
    return ( 

     <>
      <div className="custom-control custom-checkbox custom-control" key={this.props.id} >
        
        <Input
          className="custom-control-input"
          key = {this.props.id}
          type="checkbox"
          name={this.props.case + this.props.id}
          value= {this.props.case + this.props.role}
          checked={this.state.selected}
          id={this.props.case + this.props.id}
          onChange={this.handleChange}
       
        />
        <Label className="custom-control-label" htmlFor={this.props.case + this.props.id}  >
         {this.props.role}
        </Label>
      </div>
     </>
     );
  }
}
 
export default CheckboxGroup;