import React, { Component } from "react";
import {
  Label,
  FormGroup,
  Button,
  CardBody,
  CardHeader,
  Card,
  Col,
  Row,
} from "reactstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import axios from "./../../services/axios";
import noteWindow from "../../services/notifications";
import { connect } from "react-redux";
import * as actions from "../../store/user/actions";
import Select from "react-select";

class ConfigActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Activity_type: null,
      Description: null,
      selectedCaseType: null,
      selectedActType: "DEFAULT",
      Act_Requirements: null,
      update: false
    };
    this.addNewActType = this.addNewActType.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.editActType = this.editActType.bind(this);
  }

  onSelectChange(e) {
    const { Act_Requirements, selectedCaseType, selectedActType } = this.state;

    switch(e.name){
      case "case_type":
        this.setState({ selectedCaseType: e.value, selectedActType: "DEFAULT" });
        break;
      
      case "activity_type":
        this.setState({ selectedActType: e.value });
        break;

      case "Calendar_type":
        Act_Requirements[selectedCaseType][selectedActType].Calendar_type = e.value;
        break;

      default:
        return 1;
        break;

    }

    this.setState({ Act_Requirements: Act_Requirements });
  }

  handleInputChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };

  handleChange = (el) => {
    const { Act_Requirements, selectedCaseType, selectedActType } = this.state;
    const { name, value } = el.currentTarget;

    Act_Requirements[selectedCaseType][selectedActType][name] = value;

    console.log(Act_Requirements)

    this.setState({ Act_Requirements: Act_Requirements });
  };

  getSelectedParent() {
    const { Act_Requirements, selectedCaseType, selectedActType } = this.state;
    return selectedCaseType == null
      ? "DEFAULT"
      : Act_Requirements[selectedCaseType].Parent_Activity_type;
  }

  async addNewActType() {
    const { Act_Requirements, Activity_type, Description } = this.state;

    const response = await axios.post("/api/event/addActivityType", {
      Activity_types: {
        Activity_type: Activity_type,
        Description: Description,
      },
      Act_Requirements: Act_Requirements
    

    });

    if (response.data.result) {
      noteWindow.isSuck("Activity type successfully added!");
      this.props.onGlobalLoad();
      this.props.switch_modal();
    } else if (
      response.data.result_data.hasOwnProperty("result_error_text")
    ) {
      noteWindow.isError(response.data.result_data.result_error_text);
    }
  }

  async editActType(e) {
    const { Act_Requirements, Activity_type, Description } = this.state;

    const response = await axios.post("/api/event/updateActivityType", {
      Activity_types: {
        Activity_type: Activity_type,
        Description: Description,
      },
      Act_Requirements: Act_Requirements
    

    });

    if (response.data.result) {
      noteWindow.isSuck("Activity type successfully updated!");
      this.props.onGlobalLoad();
      this.props.switch_modal();
    } else if (
      response.data.result_data.hasOwnProperty("result_error_text")
    ) {
      noteWindow.isError(response.data.result_data.result_error_text);
    }
  }
  
  setData() {
    const { caseTypes, activityTypes, data } = this.props;
    let { Act_Requirements } = this.state;
    let Activity_type, Description = "";

    Act_Requirements = {};
    const ct = caseTypes
      .filter((x) => x.visible == true)
      .map((x) => ({
        value: x.Case_Type,
        label: x.Description,
        name: "case_type",
      }));

    for (let k in caseTypes) {
      const { Case_Type } = caseTypes[k];
      Act_Requirements[Case_Type] = {};

      activityTypes.map((x) => {
        Act_Requirements[Case_Type][x.Activity_type] = {
          Max_Days_before: "",
          Min_days_before: "",
          Max_Days_after: "",
          Min_Days_after: "",
          Calendar_type: "CALENDAR_DAYS",
        };
      });
    }

    if(data !== undefined){
      Activity_type = data.Activity_type;
      Description = data.Description;

      data.Act_Requirements.map((x) => {
        Act_Requirements[x.Case_Type][x.Parent_Activity_type] = {
          Max_Days_before: x.Max_Days_before,
          Min_days_before: x.Min_days_before,
          Max_Days_after: x.Max_Days_after,
          Min_Days_after: x.Min_Days_after,
          Calendar_type: x.Calendar_type,
        };
      })
    }


    this.setState({
      Act_Requirements: Act_Requirements,
      Activity_type: Activity_type,
      Description: Description,
      selectedActType: activityTypes[0].Activity_type,
      selectedCaseType: ct[0].value 
    });
  }

  componentDidMount() {
    this.setData();
  }

  render() {
    const { Act_Requirements, selectedCaseType, selectedActType } = this.state;
    const { type } = this.props;
    if (this.props.activityTypes == undefined) return <></>;
    if (this.props.caseTypes == undefined) return <></>;
    if(Act_Requirements === null) return null;
    const ct = this.props.caseTypes
      .filter((x) => x.visible == true)
      .map((x) => ({
        value: x.Case_Type,
        label: x.Description,
        name: "case_type",
      }));

    const at = this.props.activityTypes.map((x) => ({
      value: x.Activity_type,
      label: x.Description,
      name: "activity_type",
    }));

    const cant = [{
      name: "Calendar_type",
      value: "BUSINESS_DAYS",
      label: "Business Days"
    },
    {
      name: "Calendar_type",
      value: "CALENDAR_DAYS",
      label: "Calendar Days"
    }
  
  ]
    return (
      <>
        <AvForm onValidSubmit={type === "ADD" ? this.addNewActType : this.editActType}>
          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className=" ri-calendar-event-line auti-custom-input-icon"></i>
                    <Label htmlFor="Department_id">Type Name</Label>

                    <AvField
                      name="Activity_type"
                      value={this.state.Activity_type}
                      type="text"
                      className="form-control"
                      id="Activity_type"
                      onChange={this.handleInputChange}
                      placeholder="Enter Type name"
                      disabled={type === "ADD" ? false : true}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: 'Type Name is required.',
                        },
                      }}
                    />
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className=" ri-input-method-line auti-custom-input-icon"></i>
                    <Label htmlFor="username">Description</Label>

                    <AvField
                      name="Description"
                      value={this.state.Description}
                      type="text"
                      className="form-control"
                      id="Description"
                      onChange={this.handleInputChange}
                      placeholder="Enter Description"
                    />
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Card>
            <CardBody>
              <Row>
                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="">Case Type</Label>
                    <Select
                      name="Case_Type"
                      options={ct}
                      defaultValue={ct[0]}
                      onChange={this.onSelectChange}
                      className="select-cstm"
                      classNamePrefix="select2-selection"
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="">Parent Activity Type</Label>

                    <Select
                      name="Parent_Activity_type"
                      options={at}
                      value={at.find(
                        (x) => x.value == this.getSelectedParent()
                      )}
                      onChange={this.onSelectChange}
                      className="select-cstm"
                      classNamePrefix="select2-selection"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h5>Settings Activity </h5>

              <Row>
                <Col lg={12}>
                <FormGroup>
                  <Label>Calendar Type</Label>
                  <Select
                      name="Calendar_type"
                      options={cant}
                      value={cant.find(
                        (x) => x.value == Act_Requirements[selectedCaseType][selectedActType].Calendar_type
                      )}
                      onChange={this.onSelectChange}
                      className="select-cstm"
                      classNamePrefix="select2-selection"
                      placeholder="Select Calendar Type"
                    />
                </FormGroup>
                </Col>
                {(() => {
                  const x = Act_Requirements[selectedCaseType][selectedActType];
                  return (
                  <>
                    <Col lg={6}>
                      <FormGroup className="auth-form-group-custom mt-1">
                        <i className=" ri-numbers-line auti-custom-input-icon"></i>
                        <Label htmlFor="minDb">Min Days Before</Label>

                        <AvField
                          name="Min_days_before"
                          value={x.Min_days_before}
                          type="number"
                          className="form-control"
                          id="minDb"
                          onChange={this.handleChange}
                          //validate={{ required: true }}
                          placeholder="Min Day Before"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: 'This field cannot be empty.',
                            },
                          }}
                          
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup className="auth-form-group-custom mt-1">
                        <i className=" ri-numbers-line auti-custom-input-icon"></i>
                        <Label htmlFor="maxDb">Max Days Before</Label>

                        <AvField
                          name="Max_Days_before"
                          value={x.Max_Days_before}
                          type="number"
                          className="form-control"
                          id="maxDb"
                          onChange={this.handleChange}
                          //validate={{ required: true }}
                          placeholder="Max Day Before"
                          validate={{
                            required: {
                              value: true,
                              errorMessage: 'This field cannot be empty.',
                            },
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup className="auth-form-group-custom mt-1">
                        <i className=" ri-numbers-line auti-custom-input-icon"></i>
                        <Label htmlFor="minDa">Min Days After</Label>

                        <AvField
                          name="Min_Days_after"
                          value={x.Min_Days_after}
                          type="number"
                          className="form-control"
                          id="minDa"

                          onChange={this.handleChange}
                          validate={{
                            required: {
                              value: true,
                              errorMessage: 'This field cannot be empty.',
                            },
                          }}
                          placeholder="Min Day After"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup className="auth-form-group-custom mt-1">
                        <i className=" ri-numbers-line auti-custom-input-icon"></i>
                        <Label htmlFor="maxDa">Max Days After</Label>

                        <AvField
                          name="Max_Days_after"
                          value={x.Max_Days_after}
                          type="number"
                          className="form-control"
                          id="maxDa"
                          onChange={this.handleChange}
                          validate={{
                            required: {
                              value: true,
                              errorMessage: 'This field cannot be empty.',
                            },
                          }}
                          placeholder="Max Day After"
                        />
                      </FormGroup>
                    </Col>                  
                  </>
                )})()}
                </Row>
            </CardBody>
          </Card>
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              color="success"
              className="mr-2"
         
            >
              Accept
            </Button>
            <Button
              type="button"
              color="primary"
              onClick={() => this.props.switch_modal()}
            >
              Close
            </Button>
          </div>
        </AvForm>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    personeData: state.User.persone,
    activityTypes: state.User.activityTypes,
    caseTypes: state.User.casesTypes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfigActivity);
