import React, { Component } from "react";
import {
  FormGroup,
  Label,
  Row,
  Col,
  Table,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "reactstrap";
import { AvField } from "availity-reactstrap-validation";
import Select from "react-select";
import { connect } from "react-redux";
import Calendar from "../Calendar/Calendar";
import PRIVILEGE from "../../services/privileges";
import SlideToggle from "react-slide-toggle";

// import activity_type from "./Activity_types.json";
class EventModal extends Component {
  state = {
    docs: undefined,
    isTogled: false,
    toggleChildeEvent: 0,
    toogledocs: false, 
  };

  addRow = this.addRow.bind(this);

  componentDidMount() {
    this.setState({ docs: this.props.docs });
    this.setState({ toggleEvent: Date.now() });

    if (this.props.selectedDocs.length === 0) this.addRow();
  }

  onToggle = () => {
    this.setState({ toggleEvent: Date.now(), isTogled: !this.state.isTogled });
  };
  addRow() {
    const docs = this.props.selectedDocs;
    docs.push({
      DOC_ID: "",
      Relation_type: "",
    });
    this.setState({ selectedDocs: docs });
  }

  render() {
    const { calendars, cases, persone } = this.props;
    if (this.state.docs === "undefined") return <></>;

    if (this.props.relationType === undefined) return <></>;
    const pData = persone;
    let cEvents = [];
    let pEvents = this.props.persone.Events;

    const calendarName = "DEFAULT_CALENDAR";
    if (PRIVILEGE.check("SHOW_CASE_EVENTS", pData)) {
      if (calendars.hasOwnProperty(calendarName)) {
        // let calendar = calendars[calendarName];
        pEvents.forEach(function (v, i, a) {
          let c = cases.find((x) => x.Case_Short_NAME === v.Case_NAME);

          if (c !== undefined) {
            cEvents.push({
              title: v.Activity_Title,
              start: new Date(parseInt(v.Tentative_date + "000")),
              url: `/app/case-explorer/${v.Case_NAME}/event/${v.Activity_Name}`,
              backgroundColor: c.CaseBg,
            });
          }
        });
      }
    }

    // const { calendars } = this.props;

    const owner = [
      { name: "Owner", value: "OFFICE", label: "Office" },
      { name: "Owner", value: "OPPOSITE", label: "Opposite" },
    ];
    const options = this.props.activityTypes.filter((y)=> y.visible !== false).map((o) => ({
      name: "Activity_type",
      value: o.Activity_type,
      label: o.Description,
    }));

    const calendarsList = calendars.All.map((o) => ({
      name: "Tentative_Calendar_name",
      value: o.Calendar_name,
      label: o.Calendar_name,
    }));

    const pan = this.props.events.map((o) => ({
      name: "Parent_Activity_Name",
      value: o.Activity_Name,
      label: o.Activity_Title,
    }));

    const documents = this.props.docs.map((x) => ({
      name: "document",
      value: x.DOC_ID,
      label: x.DOCUMENT_NAME,
    }));

    const rTypes = this.props.relationType.map((x) => ({
      name: "rTypes",
      value: x.RELATION_TYPE,
      label: x.DESCRIPTION,
    }));

    pan.unshift({ name: "Parent_Activity_Name", value: 0, label: "Select" });
    console.log("EBEN BOBEN");
    return (
      <>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <FormGroup className="auth-form-group-custom mb-4">
                  <i className=" ri-hashtag auti-custom-input-icon"></i>
                  <Label htmlFor="username">Activity_Name</Label>
                  <AvField
                    name="Activity_Name"
                    value={this.props.Activity_Name}
                    type="text"
                    className="form-control"
                    id="Activity_Name"
                    onChange={this.props.handleChange}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: "Please enter a name",
                      },
                    }}
                    placeholder="Event Name"
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="">Activity type</Label>
                  <Select
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.props.onSelectChange}
                    value={options.find(
                      (x) => x.value === this.props.Activity_type
                    )}
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="">Owner</Label>
                  <Select
                    // attr-case-name={this.props.caseName}
                    options={owner}
                    // defaultValue = {options[0]}
                    className="basic-multi-select"
                    name="Owner"
                    classNamePrefix="select"
                    onChange={this.props.onSelectChange}
                    value={owner.find((x) => x.value === this.props.Owner)}
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg={12}>
            <Card>
              <CardBody>
                <FormGroup className="mb-4 mt-2">
                  <Label htmlFor="billing-address">Comments</Label>
                  <textarea
                    className="form-control custom-textarea"
                    id="billing-address"
                    rows="3"
                    name="Comments"
                    value={this.props.Comments}
                    placeholder="Enter Comments"
                    onChange={this.props.handleChange}
                  ></textarea>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <FormGroup className="mb-4 mt-2">
                  <Label htmlFor="Tentative_Calendar_name">
                    Tentative Calendar name
                  </Label>
                  <Select
                    options={calendarsList}
                    className="basic-multi-select"
                    name="Parent_Activity_Name"
                    classNamePrefix="select"
                    onChange={this.props.onSelectChange}
                    value={calendarsList.find(
                      (x) => x.value === this.props.Tentative_Calendar_name
                    )}
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <FormGroup className="mb-4 mt-2">
                  <Label htmlFor="Tentative_date">Tentative date</Label>
                  <AvField
                    name="Tentative_date"
                    value={this.props.Tentative_date}
                    type="datetime-local"
                    id="Tentative_date"
                    onChange={this.props.handleChange}
                    placeholder="Event Name"
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <FormGroup className="mb-4 mt-2">
                  <Label htmlFor=""> Parent Activity Name</Label>
                  <Select
                    options={pan}
                    className="basic-multi-select"
                    name="Parent_Activity_Name"
                    classNamePrefix="select"
                    isClearable={true}

                    onChange={this.props.onSelectChange}
                    value={pan.find(
                      (x) => x.value === this.props.Parent_Activity_Name
                    )}
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <FormGroup className="mb-4 mt-2">
                  <Label htmlFor="Time_estimate_days">Time estimate days</Label>
                  <AvField
                    name="Time_estimate_days"
                    value={this.props.Time_estimate_days}
                    type="number"
                    className="form-control"
                    id="case_namber"
                    onChange={this.props.handleChange}
                    validate={{
                      required: {
                        value: true,
                        errorMessage: "Please enter estimate days",
                      },
                      // maxLength: {
                      //   value: 10,
                      //   errorMessage:
                      //     "Your name must be between 1 and 10 characters",
                      // },
                    }}
                    placeholder="Time estimate days"
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <FormGroup>
                  <Label>Notify you about this activity ? </Label>
                  <div className="d-flex align-items-center">
                    <Label className="mr-2">No</Label>
                    <div
                      className="custom-control custom-switch mb-2 d-flex "
                      // dir="ltr"
                    >
                      <Input
                        type="checkbox"
                        className="custom-control-input"
                        id="customSwitch3"
                        defaultChecked ={this.props.notify === true ? true : false}
                      />
                      <Label
                        className="custom-control-label"
                        htmlFor="customSwitch3"
                        onClick={this.props.onToogleChange}
                      >
                        Yes
                      </Label>
                    </div>
                  </div>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          {/* <Col lg={12}>
            <Card>
              <div class="form-check mb-3">
                <input
                  class="form-check-input visible-checkbox"
                  type="checkbox"
                  name="notify"
                  id="notify"
                  checked={this.props.notify}
                  onChange={this.props.onChangeCheckbox}
                />
                <label class="form-check-label" for="notify">
                  Notify Me
                </label>
              </div>
            </Card>
          </Col> */}
        </Row>
        {/* <Row>
          <Col lg={12}>
            <Card>
              <CardHeader onClick={this.onToggle}>
                <div className="d-flex align-items-center">
                  <h5 className="">Calendar</h5>
                  <span className="toggle toggle-icon ml-1" color="info">
                    <i
                      className={
                        this.state.isTogled === false
                          ? " ri-arrow-drop-down-fill"
                          : " ri-arrow-drop-up-fill"
                      }
                    ></i>
                  </span>
                </div>
              </CardHeader>
              <SlideToggle toggleEvent={this.state.toggleEvent} collapsed>
                {({ setCollapsibleElement }) => (
                  <div className="my-collapsible">
                    <div
                      className="my-collapsible__content"
                      ref={setCollapsibleElement}
                    >
                      <div className="my-collapsible__content-inner mt-3">
                        <Calendar calendarEvents={cEvents} />
                      </div>
                    </div>
                  </div>
                )}
              </SlideToggle>
            </Card>
          </Col>
        </Row> */}
        <Row>
        <Col lg={12}>
                <Card>
                  <CardBody>
                  <FormGroup>
                            <Label>Show Documents ? </Label>
                            <div className="d-flex align-items-center">
                              <Label className="mr-2">No</Label>
                              <div
                                className="custom-control custom-switch mb-2 d-flex "
                                // dir="ltr"
                              >
                                <Input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="customSwitch1"
                                  defaultChecked = {false}
                                />
                                <Label
                                  className="custom-control-label"
                                  htmlFor="customSwitch1"
                                  onClick={(e) => {
                                    this.setState({
                                      toogledocs: !this.state.toogledocs,
                                    });
                                  }}
                                >
                                  Yes
                                </Label>
                              </div>
                            </div>
                          </FormGroup>
                          {this.state.toogledocs === true && (
                            <>
                            <div className="table-responsive mb-5 table-sm">
              <h5 className="mb-2"> Select documents</h5>
              {this.props.docs.length <= 0 ? (
                <>
                  <h5>
                    Documents list is empty. Please add any document to Case
                  </h5>
                </>
              ) : (
                <>
                  <Table className="mb-0 table-sm custom-table" >
                    <thead>
                      <tr>
                        <th className="text-center small-w"><i class="ri-close-line font-size-16"></i></th>
                        <th>Document</th>
                        <th>Relation type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.selectedDocs.map((item, index) => (
                        <tr key={index} id={`id${index}`}>
                          <td className="text-center ">
                            <Button
                              row={index}
                              onClick={this.props.deleteRow}
                              color="light"
                              type="button"
                            >
                              <i className="ri-close-line font-size-16"></i>
                            </Button>
                          </td>

                          <td>
                            <Select
                              options={documents}
                              name={index}
                              className="basic-multi-select posrel"
                              classNamePrefix="select"
                              menuPosition="relative"
                              menuPlacement="top"
                              onChange={this.props.onSelectChange}
                              value={documents.find(
                                (x) =>
                                  x.value ===
                                  this.props.selectedDocs[index]["DOC_ID"]
                              )}
                            />
                          </td>
                          <td>
                            <Select
                              options={rTypes}
                              name={index}
                              menuPosition="relative"
                              menuPlacement="top"
                              className="basic-multi-select posrel"
                              classNamePrefix="select"
                              onChange={this.props.onSelectChange}
                              value={rTypes.find(
                                (x) =>
                                  x.value ===
                                  this.props.selectedDocs[index][
                                    "Relation_type"
                                  ]
                              )}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <Button
                      color="success"
                      onClick={this.addRow}
                      className="mt-3 ml-1"
                    >
                      {" "}
                      Add more{" "}
                    </Button>
                  </Table>
                </>
              )}
            </div>
                            </>
                          )}
                  </CardBody>
                </Card>
                </Col>
         
        </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activityTypes: state.User.activityTypes,
    calendars: state.User.calendars,
    persone: state.User.persone,
    cases: state.User.caseData.cases,
  };
};

export default connect(mapStateToProps, null)(EventModal);
