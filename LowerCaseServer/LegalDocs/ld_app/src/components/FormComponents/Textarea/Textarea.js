import AvInput from "availity-reactstrap-validation/lib/AvInput";
import React, { Component } from "react";

import "./styles.scss";

class Textarea extends Component {
  constructor(props) {
    super(props);

    this.maxLen = props.maxLen || -1;
  }

  state = {
    textareaValue: "",
  };

  handleChange = (e, val) => {
    if (this.maxLen !== -1 && val.length >= this.maxLen){
      e.currentTarget.value = val.substr(0, this.maxLen);
    }

    this.setState({ textareaValue: val });

    if (this.props.hasOwnProperty("onChange")) {
      this.props.onChange(e, val.substr(0, this.maxLen));
    }
  };

  onKeyPress = (e) => {
    const val = e.currentTarget.value;
    if (this.maxLen !== -1 && val.length >= this.maxLen){
      e.currentTarget.value = val.substr(0, this.maxLen);
      this.setState({textareaValue: e.currentTarget.value });
      if(![8, 46].includes(e.keyCode))
        e.preventDefault();
      return false;
    }      
  }

  render() {
    const { textareaValue } = this.state;
    return (
      <>
        <div className="textarea-component" style={{position: "relative"}}>
          <label htmlFor={this.props.name || "custom-textarea"}>{this.props.label || ""}</label>
          <AvInput
            type="textarea"
            name={this.props.name || "custom-textarea"}
            id={this.props.name || "custom-textarea"}
            placeholder={this.props.placeholder || ""}
            required={this.props.required || false}
            onChange={this.handleChange}
            onKeyDown={this.onKeyPress}
            style={{minHeight: "120px", display: "block"}}
            value = {this.props.value || null}
          />
          {this.maxLen != -1 && <div className="taWords" style={{color: (this.maxLen - textareaValue.length) <= 10 ? "red" : "", position: "absolute", top: "85%", right: "1%"}}>Available characters: {this.maxLen - textareaValue.length}</div>}
        </div>
      </>
    );
  }
}

export default Textarea;
