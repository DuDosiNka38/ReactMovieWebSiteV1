import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "./../../api/DocsApi";
import notification from "./../../services/notification";
import * as PreloaderActions from "../../store/preloader/actions";
import Select from "react-select";

import EventsApi from "../../api/EventsApi";

class ChooseDocsRelationModal extends Component {
  state = {
    Documents: [],
    RelationTypes: [],
    isInit: false,
  };

  handleSelectChange = (el, e, DOC_ID) => {
    const { Documents } = this.state;

    const DocumentInd = Documents.findIndex((x) => x.DOC_ID === DOC_ID);

    if(DocumentInd === -1) return ;

    const { value } = el;
    const { name } = e;

    Documents[DocumentInd][name] = value;

    this.setState({ Documents });
  };

  submitDocuments = async () => {
    const { Documents } = this.state;
    const { Preloader, onSuccess } = this.props;

    let isValid = true;

    const prepared = Documents.map((x) => {
      if(x.Relation_type === null){
        isValid = false;
      }

      return ({
        DOC_ID: x.DOC_ID,
        Relation_type: x.Relation_type,
        Case_NAME: x.Case_NAME, 
        Activity_Name: x.Activity_Name
      });
    });

    if(!isValid){
      notification.isError("You need to select relation type for all documents in table!");
      return;
    }
    
    Preloader.show();

    const response = await EventsApi.postEventDocument(prepared);

    Preloader.hide();

    if(response.result){
      if(onSuccess && typeof onSuccess === "function"){
        onSuccess();
      }
    }

    this.props.hideModal(this.props.type);
  }

  componentWillUnmount() {
    const { onClose } = this.props;

    if (onClose && typeof onClose === "function") {
      onClose();
    }
  }

  async componentDidMount() {
    const { Documents } = this.props;

    const RelationTypes = await EventsApi.fetchRelationTypes();

    this.setState({ Documents, RelationTypes, isInit: true });
  }

  render() {
    const { Documents, RelationTypes, isInit } = this.state;
    return (
      <>
        <>
          <Modal isOpen={true} centered={true} className="delete-case-modal" size="xl">
            <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
              Choose Relation Types for Selected Documents
            </ModalHeader>
            <ModalBody className="w-100 p-0">
              <Table className="customTable mb-0">
                <thead>
                  <tr>
                    <td>Document Name</td>
                    <td>Relation Type</td>
                  </tr>
                </thead>
                <tbody>
                  {Documents.length ? (
                    <>
                      {Documents.map((Doc) => (
                        <tr>
                          <td>{Doc.DOCUMENT_NAME}</td>
                          <td>
                            <Select
                              attr-doc-id={Doc.DOC_ID}
                              name="Relation_type"
                              options={RelationTypes.map((x) => ({
                                label: x.DESCRIPTION,
                                value: x.RELATION_TYPE,
                              }))}
                              onChange={(el, e) => this.handleSelectChange(el, e, Doc.DOC_ID)}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      <tr>
                        <td colSpan={3}>Documents list is unset.</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </Table>
            </ModalBody>
            <ModalFooter className="mfooterGTO">
              <Button className="ld-button-success" type="submit" onClick={this.submitDocuments}>
                Attach Documents to Event
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
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("CHOOSE_DOCS_RELATION")),
    hide: () => dispatch(PreloaderActions.hidePreloader("CHOOSE_DOCS_RELATION")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDocsRelationModal);
