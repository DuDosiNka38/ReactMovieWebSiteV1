import React, { Component, Suspense, lazy } from "react";
import { Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import { AvForm, AvField } from "availity-reactstrap-validation";
import EventsApi from "../../api/EventsApi";
import notification from "../../services/notification";
import * as PreloaderActions from "./../../store/preloader/actions";
import CaseApi from "../../api/CaseApi";
import CalendarsApi from "../../api/CalendarsApi";

class AddActivityTypeModal extends Component {
  state = {
    Activity_type: "",
    Description: "",
  }

  handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  submit = async () => {
    const { Activity_type, Description } = this.state;
    const { onSubmit, Preloader, hideModal, showModal, type } = this.props;

    if(Activity_type === "" || Description === ""){
      notification.isError("You need to fill all fields!");
      return;
    }

    Preloader.show();

    const response = await EventsApi.postActivityType(this.state);

    if (onSubmit && typeof onSubmit === "function") {
      await onSubmit();
    }

    showModal("ASK_ADD_ACTIVITY_REQUIREMENTS", {Activity_type, Description, onSubmit: async () => {

      const { onSubmit, showModal } = this.props;

      const Requirements = await EventsApi.fetchActivityRequirements();
      const CaseTypes = await CaseApi.fetchCaseTypes();  
      const CalendarTypes = await CalendarsApi.fetchCalendarTypes();
      const ActivityTypes = await EventsApi.fetchActivityTypes();

      showModal("ADD_NEW_ACTIVITY_REQUIREMENT", {
        Parent_Activity_type: Activity_type,
        Parent_Activity_type_Desc: Description,
        CaseTypes,
        ActivityTypes,
        CalendarTypes,
        Requirements: Requirements.filter((x) => x.Parent_Activity_type === Activity_type),
        onSubmit: async () => {
          if (onSubmit && typeof onSubmit === "function") {
            await onSubmit();
          }
        },
        showActivityRequirements: async () => {
          const ActivityTypes = await EventsApi.fetchActivityTypes();
          showModal("ACTIVITY_TYPE_REQUIREMENTS", {
            forEdit: {Activity_type, Description},
            ActivityTypes,
            onSubmit: async () => {
              await this.props.loadActivityTypes();
            }
          })
        }
      })
    }});

    hideModal(type);
    Preloader.hide();
  };

  render() {
    return (
      <>
        <>
          <Modal isOpen={true} centered={true} className="delete-case-modal" size="xs">
            <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
              Add New Activity Type
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
              <AvForm className="form-horizontal" onValidSubmit={this.submitNewCaseForm}>
                
                <FormGroup className="ld-form-group-custom mb-4">
                  <i class="ri-briefcase-line"></i>
                  <Label htmlFor="Activity_type">Activity Type</Label>
                  <AvField
                    name="Activity_type"
                    type="text"
                    className="form-control"
                    id="Activity_type"
                    placeholder="ex. My New Case"
                    onChange={this.handleInputChange}
                    required={true}
                  />
                </FormGroup>
                <FormGroup className="ld-form-group-custom mb-4">
                  <i class="ri-hashtag"></i>
                  <Label htmlFor="Description">Description</Label>
                  <AvField
                    name="Description"
                    type="text"
                    className="form-control"
                    id="Description"
                    placeholder="ex. 45632578"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
                
              </AvForm>
            </ModalBody>
            <ModalFooter className="mfooterGTO">
              <Button className="ld-button-success" type="submit" onClick={this.submit}>
                Create
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
    show: () => dispatch(PreloaderActions.showPreloader("ADD_ACTIVITY_TYPE")),
    hide: () => dispatch(PreloaderActions.hidePreloader("ADD_ACTIVITY_TYPE"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddActivityTypeModal);
