import React, { Component } from "react";
import { Input, Label, Card,  CardHeader } from "reactstrap";
// import Select from "react-select";

// let selectedCaseRole;

class Checkbox extends Component {
  constructor(props, children) {
    super(props);
    this.state = {
      selected: false,
      refresh: false
    };
  }

  handleChange = (e) => {
    const a = e.currentTarget.getAttribute("id");
    this.setState({ selected: e.currentTarget.checked });
    this.props.cases[a]["checked"] = e.currentTarget.checked;
  };

  onChange = (selOptions) => {
    this.props.multiselect(this.props.id, selOptions);
  }

  componentDidMount() {
    let checked = false;
    if(this.props.checked !== undefined)
      checked = this.props.checked;

    this.setState({selected: checked, refresh: !this.state.refresh});  
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.refresh !== prevState.refresh){
      this.setState({refresh: !prevState.refresh});
    }
  }

  render() {
    // const options = [
    //   {cName: this.props.caseName, value: "Read File", label: "Read File" },
    //   {cName: this.props.caseName, value: "Download File", label: "Download File" },
    //   {cName: this.props.caseName, value: "View Case", label: "View Case" },
    //   {cName: this.props.caseName, value: "Edit File", label: "Edit File" },
    //   {cName: this.props.caseName, value: "Other", label: "Other" },
    // ];
    // const caseRole = this.props.rolesList;
    // const caseRolesData = caseRole.map(({ role }) => role);

    return (

      <>
        <Card className="cstmCardSh">
          <CardHeader className="custom_Card_Header">
            {/* <span>{CaseName}</span> */}
            <div className="custom-control custom-checkbox custom-control customFormControl">
              <Input
                className="custom-control-input"
                type="checkbox"
                name={this.props.id}
                value={this.props.caseName}
                checked={this.state.selected}
                id={this.props.id}
                onChange={this.handleChange}
              />
              <Label className="custom-control-label dbi_Chbx_label" htmlFor={this.props.id}>
               <p> Case: {this.props.caseName}</p>
              </Label>
            </div>
          </CardHeader>
          {/* <CardBody className="cstmCardBody">
            <p>Case actions:</p>
            <Select
              attr-case-name={this.props.caseName}
              options={options}
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              closeMenuOnSelect = {false}
              onChange={this.onChange}
              // isDisabled = {true}
            />
          </CardBody> */}
        </Card>
      </>
    );
  }
}

export default Checkbox;
