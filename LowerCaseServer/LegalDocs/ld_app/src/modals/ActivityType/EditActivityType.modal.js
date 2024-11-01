import React, { Component, Suspense, lazy } from "react";
import { Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import { AvForm, AvField } from "availity-reactstrap-validation";
import EventsApi from "../../api/EventsApi";
import notification from "../../services/notification";
import * as PreloaderActions from "./../../store/preloader/actions";


class EditActivityTypeModal extends Component {
  state = {
    Activity_type: "",
    Description: "",
    isInit: false,
  }

  handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  submit = async () => {
    const { Activity_type, Description } = this.state;
    const { onSubmit, Preloader, hideModal, type } = this.props;

    if(Activity_type === "" || Description === ""){
      notification.isError("You need to fill all fields!");
      return;
    }

    Preloader.show();

    const response = await EventsApi.putActivityType({ Activity_type, Description });

    if (onSubmit && typeof onSubmit === "function") {
      await onSubmit();
    }

    hideModal(type);
    Preloader.hide();
  }

  componentDidMount() {
    const { Activity_type, Description } = this.props;

    this.setState({Activity_type, Description});
  }

  render() {
    const { Activity_type, Description } = this.state;


    return (
      <>
        <>
          <Modal
            isOpen={true}
            centered={true}
            className="delete-case-modal"
            size="xs"
          >
            <ModalHeader
              className="d-flex align-items-center justify-content-center"
              toggle={this.props.hideModal}
            >
            Edit Activity Type
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
                    disabled={true}
                    value={Activity_type}
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
                    value={Description}
                  />
                </FormGroup>
                
              </AvForm>
            </ModalBody>
            <ModalFooter className="mfooterGTO">
              <Button className="ld-button-success" type="submit" onClick={this.submit}>
                Update
              </Button>
            </ModalFooter>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("EDIT_ACTIVITY_TYPE")),
    hide: () => dispatch(PreloaderActions.hidePreloader("EDIT_ACTIVITY_TYPE"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditActivityTypeModal);
