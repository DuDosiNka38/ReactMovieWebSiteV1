import React, { Component, Suspense, lazy } from "react";
import { Button, Col, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import { AvForm, AvField } from "availity-reactstrap-validation";
import EventsApi from "../../api/EventsApi";
import notification from "../../services/notification";
import * as PreloaderActions from "../../store/preloader/actions";
import Select from "react-select";
import { filterObj } from "../../services/Functions";

class EditActivityRequirementModal extends Component {
  state = {
    Parent_Activity_type: null,
    Child_Activity_type: null,
    Case_Type: null,
    Min_days_before: 0,
    Max_Days_before: 0,
    Min_Days_after: 0,
    Max_Days_after: 0,
  };

  submit = async () => {
    const { onSubmit, hideModal, showModal, type, Preloader } = this.props;

    Preloader.show();

    const response = await EventsApi.putActivityRequirement(this.state);

    if (onSubmit && typeof onSubmit === "function") {
      await onSubmit();
    }
    
    notification.isSuck("Activity Requirement successfully updated!");

    hideModal(type);
    Preloader.hide();
  };

  getFilteredCaseTypes = () => {
    const { CaseTypes } = this.props;

    return CaseTypes;
  };

  getFilteredActivityTypes = () => {
    const { ActivityTypes, Requirements } = this.props;
    const { Case_Type } = this.state;


    return ActivityTypes.filter((x) => !Requirements.find((r) => r.Case_Type === Case_Type && r.Child_Activity_type === x.Activity_type));
  };

  handleSelectChange = (el, e) => {
    const { value } = el;
    const { name } = e;

    if(name === "Case_Type"){
      this.setState({Child_Activity_type: null})
    }
    this.setState({ [name]: value });
  };

  handleInputChange = (e, val) => {
    const { name } = e.currentTarget;

    this.setState({ [name]: val });
  };

  async componentDidMount() {
    const { Parent_Activity_type, data } = this.props;
    
    const filtered = filterObj(data, (v, i) => {
      return this.state.hasOwnProperty(i) ? true : false;
    });
    this.setState({ ...filtered });
  }

  render() {
    const {  CalendarTypes, data, ActivityTypes, CaseTypes } = this.props;
    const { Case_Type, Calendar_Type, Child_Activity_type, Calendar_type} = data;
    const { Parent_Activity_type, Parent_Activity_type_Desc,Min_days_before, Max_Days_before, Min_Days_after, Max_Days_after } = this.state;

    return (
      <>
        <>
          <Modal isOpen={true} centered={true} className="delete-case-modal" size="lg" style={{ maxWidth: "600px" }}>
            <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
              Add New Activity Requirement
            </ModalHeader>
            <ModalBody className="w-100">
              <AvForm className="form-horizontal" onValidSubmit={this.submitNewCaseForm}>
                <FormGroup className="ld-form-group-custom mb-4">
                  <i class="ri-briefcase-line"></i>
                  <Label htmlFor="Parent_Activity_type">Parent Activity Type</Label>
                  <AvField
                    name="Parent_Activity_type"
                    type="text"
                    className="form-control"
                    id="Parent_Activity_type"
                    placeholder="ex. My New Case"
                    readOnly={true}
                    value={Parent_Activity_type_Desc}
                  />
                </FormGroup>

                <FormGroup className="mb-4 text-left">
                  <Label htmlFor="Case_Type">Case Type</Label>
                  <Select
                    name="Case_Type"
                    id="Case_Type"
                    options={CaseTypes.map((x) => ({ value: x.Case_Type, label: x.Description }))}
                    onChange={this.handleSelectChange}
                    required={true}
                    placeholder={"Select..."}
                    readOnly={true}
                    isDisabled={true}
                    value={CaseTypes.map((x) => ({ value: x.Case_Type, label: x.Description })).find((x) => x.value === Case_Type) || null}
                  />
                </FormGroup>

                <FormGroup className="mb-4 text-left">
                  <Label htmlFor="Child_Activity_type">Child Activity Type</Label>
                  <Select
                    name="Child_Activity_type"
                    id="Child_Activity_type"
                    options={ActivityTypes.map((x) => ({
                      value: x.Activity_type,
                      label: x.Description,
                    }))}
                    onChange={this.handleSelectChange}
                    required={true}
                    readOnly={true}
                    isDisabled={true}
                    placeholder={!Case_Type ? "Select Case Type At First!" : "Select..."}
                    value={ActivityTypes.map((x) => ({
                      value: x.Activity_type,
                      label: x.Description,
                    })).find((x) => x.value === Child_Activity_type) || null}
                  />
                </FormGroup>

                <FormGroup className="mb-4 text-left">
                  <Label htmlFor="Calendar_Type">Calendar Type</Label>
                  <Select
                    name="Calendar_Type"
                    id="Calendar_Type"
                    options={CalendarTypes.map((x) => ({ value: x.Calendar_Type, label: x.Description }))}
                    onChange={this.handleSelectChange}
                    value={CalendarTypes.map((x) => ({ value: x.Calendar_Type, label: x.Description })).find((x) => x.value === Calendar_type) || null}
                    required={true}
                    placeholder={"Select..."}
                    readOnly={true}
                    isDisabled={true}
                  />
                </FormGroup>
                <Row>
                  <Col lg={6}>
                    <FormGroup className="mb-4">
                      <Label htmlFor="Min_days_before">Min Days Before</Label>
                      <AvField
                        name="Min_days_before"
                        type="number"
                        defaultValue="0"
                        className="form-control"
                        id="Min_days_before"
                        value={Min_days_before}
                        onChange={this.handleInputChange}
                        required={true}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={6}>
                    <FormGroup className="mb-4">
                      <Label htmlFor="Max_Days_before">Max Days Before</Label>
                      <AvField
                        name="Max_Days_before"
                        type="number"
                        className="form-control"
                        id="Max_Days_before"
                        value={Max_Days_before}
                        defaultValue="0"
                        onChange={this.handleInputChange}
                        required={true}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <FormGroup className="mb-4">
                      <Label htmlFor="Min_Days_after">Min Days After</Label>
                      <AvField
                        name="Min_Days_after"
                        type="number"
                        className="form-control"
                        id="Min_Days_after"
                        value={Min_Days_after}
                        defaultValue="0"
                        onChange={this.handleInputChange}
                        required={true}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={6}>
                    <FormGroup className="mb-4">
                      <Label htmlFor="Max_Days_after">Max Days After</Label>
                      <AvField
                        name="Max_Days_after"
                        type="number"
                        className="form-control"
                        id="Max_Days_after"
                        value={Max_Days_after}
                        defaultValue="0"
                        onChange={this.handleInputChange}
                        onBlur={this.checkAvailability}
                        required={true}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </AvForm>
            </ModalBody>
            <ModalFooter className="mfooterGTO">
              <Button className="ld-button-success" type="submit" onClick={this.submit}>
                Update Activity Requirement
              </Button>
            </ModalFooter>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("DELETE_ACTIVITY_TYPE")),
    hide: () => dispatch(PreloaderActions.hidePreloader("DELETE_ACTIVITY_TYPE")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditActivityRequirementModal);
