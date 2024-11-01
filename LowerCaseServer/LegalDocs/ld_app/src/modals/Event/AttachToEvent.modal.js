import React, { Component, Suspense, lazy } from "react";
import { Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "./../../api/DocsApi";
import notification from "./../../services/notification";
import * as PreloaderActions from "../../store/preloader/actions";
import EventsApi from "../../api/EventsApi";
import Select from "react-select";
import { filterObj } from "../../services/Functions";
import { NavLink } from "react-router-dom";
import combine from "../../routes/combine";
import ConnectingAnimation from "../../components/StyledComponents/CoonectingAnimation/ConnectingAnnimation";

class AttachToEventModal extends Component {
  state = {
    RelationTypes: [],
    Events: [],
    isInit: false,
    DocumentEvents: [],
    dbRow: {
      DOC_ID: null,
      Relation_type: null,
      Case_NAME: null,
      Activity_Name: null,
    },
  };
  submit = async () => {
    const { dbRow, DocumentEvents } = this.state;
    const { onSubmit, Preloader } = this.props;
    let isValid = true;

    filterObj(dbRow, (v, i) => {
      if (!v) isValid = false;
    });

    if (!isValid) {
      notification.isError("You need to fill all fileds!");
      return;
    }
    
    if(DocumentEvents.find((x) => x.Activity_Name === dbRow.Activity_Name)){
      notification.isError("Document Already Attached to Selected Event!");
      return;
    }

    Preloader.show();

    const response = await EventsApi.postEventDocument(dbRow);

    Preloader.hide();

    if (!response.result) {
      notification.isError(response.toString());
      return;
    }

    notification.isSuck("Document Successfully Attached to Event!");

    if (onSubmit && typeof onSubmit === "function") {
      onSubmit();
    }

    this.props.hideModal(this.props.type);
  };

  disattachDocument = async (Activity_Name, DOC_ID) => {
    this.props.showModal("CONFIRM_DISATTACH", {
      onSubmit: async () => {
        this.setState({isInit: false});
        const response = await EventsApi.deleteEventDocument(Activity_Name, DOC_ID);
        await this.loadDocumentEvents();
        this.setState({isInit: true});

      },
    });
  };

  handleSelectChange = (el, e) => {
    const { dbRow } = this.state;
    const { value } = el;
    const { name } = e;
    dbRow[name] = value;
    this.setState({ dbRow });
  };

  loadDocumentEvents = async () => {
    const { DOC_ID } = this.props.Doc_Data;
    const DocumentEvents = await DocsApi.fetchDocumentEvents(DOC_ID);
    this.setState({DocumentEvents});
  }

  async componentDidMount() {
    const { DOC_ID, Case_NAME } = this.props.Doc_Data;
    const { dbRow } = this.state;

    dbRow.DOC_ID = DOC_ID;
    dbRow.Case_NAME = Case_NAME;

    const RelationTypes = await EventsApi.fetchRelationTypes();
    const Events = await EventsApi.fetchCaseEvents(Case_NAME);
    await this.loadDocumentEvents();
    this.setState({ RelationTypes, Events, dbRow, isInit: true });
  }

  componentWillUnmount() {
    const { onClose } = this.props;
    if (onClose && typeof onClose === "function") {
      onClose();
    }
  }

  render() {
    const { RelationTypes, Events, DocumentEvents, isInit } = this.state;
    const { Doc_Data, navTo, hideModal, type } = this.props;

    return (
      <>
        <>
          <Modal isOpen={true} centered={true} className="delete-case-modal" size="xs">
            <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
              Attach Document To Event
            </ModalHeader>
            <ModalBody className="w-100">
              <AvForm className="form-horizontal" onValidSubmit={this.submitNewCaseForm}>
                <FormGroup className="ld-form-group-custom mb-4">
                  <i class="ri-article-line"></i>
                  <Label htmlFor="DOCUMENT_NAME">Document Name</Label>
                  <AvField
                    name="DOCUMENT_NAME"
                    type="text"
                    className="form-control"
                    id="DOCUMENT_NAME"
                    disabled={true}
                    value={Doc_Data.DOCUMENT_NAME}
                  />
                </FormGroup>
                <div className="document-already-attached">
                  <div className="block-title">
                    <i class="ri-article-line mr-2"></i>
                    Document Already Attached to Events:
                  </div>
                  <div className="block-content">
                    {isInit ? (
                      <>
                        {DocumentEvents.length ? (
                          <>
                            {DocumentEvents.map((x) => {
                              const Relation = RelationTypes.find((rt) => rt.RELATION_TYPE === x.Relation_type);
                              return (
                                <>
                                  <div className="attached-event d-flex align-items-center">
                                    <i class="ri-close-line mr-2 cursor-pointer" onClick={() => this.disattachDocument(x.Activity_Name, x.DOC_ID)}></i>
                                    <NavLink to="" onClick={(e) => { e.preventDefault(); hideModal(type); navTo(combine("SINGLE_EVENT", {Activity_Name: x.Activity_Name}))}}>{x.Activity_Name}</NavLink><span title="Relation" className="ml-1">({Relation ? Relation.DESCRIPTION : "-"})</span>
                                  </div>
                                </>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            Not attached yet.
                          </>
                        )}                        
                      </>
                    ) : (
                      <>
                        <div className="w-100 d-flex justify-content-center p-2">
                          <Spinner size="s"/>
                          {/* <ConnectingAnimation/> */}
                        </div>
                      </>
                    )}
                    
                  </div>
                </div>
                <FormGroup className="mb-4 text-left">
                  <Label htmlFor="Activity_Name">Event</Label>
                  <Select
                    name="Activity_Name"
                    id="Activity_Name"
                    options={Events.map((x) => ({ value: x.Activity_Name, label: x.Activity_Title }))}
                    onChange={this.handleSelectChange}
                    required={true}
                  />
                </FormGroup>
                <FormGroup className="mb-4 text-left">
                  <Label htmlFor="Department_id">Relation</Label>
                  <Select
                    name="Relation_type"
                    id="Relation_type"
                    options={RelationTypes.map((x) => ({
                      label: x.DESCRIPTION,
                      value: x.RELATION_TYPE,
                    }))}
                    onChange={this.handleSelectChange}
                    required={true}
                  />
                </FormGroup>
              </AvForm>
            </ModalBody>
            <ModalFooter className="mfooterGTO">
              <Button className="ld-button-success" type="submit" onClick={this.submit}>
                Attach
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
    show: () => dispatch(PreloaderActions.showPreloader("ATTACH_TO_EVENT")),
    hide: () => dispatch(PreloaderActions.hidePreloader("ATTACH_TO_EVENT")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AttachToEventModal);
