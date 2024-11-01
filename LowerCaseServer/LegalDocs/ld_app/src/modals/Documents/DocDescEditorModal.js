import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
// import {Editor, EditorState, RichUtils} from 'draft-js';
import DocsApi from "./../../api/DocsApi"
import notification from './../../services/notification'
import * as PreloaderActions from "../../store/preloader/actions";
// import 'draft-js/dist/Draft.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class DeleteDocumentModal extends Component {
  state = {
    Description: ""
  }

  submit = async () => {
    const { Description } = this.state;
    const { DOC_ID, onSubmit, Preloader, hideModal, type } = this.props;

    Preloader.show();

    const response = await DocsApi.putDocument({DOC_ID, Description});

    if(onSubmit && typeof onSubmit === "function"){
      await onSubmit();
    }

    Preloader.hide();
    
    hideModal(type);

  }
  handleChange = (value, name) => {
    const {[name]:oldValue } = this.state;
    if(value !== oldValue)
      this.setState({ [name]: value });
  };

  componentDidMount() {
    const {description} = this.props
    this.setState({Description: description})
    
  }

  render() {
    const {Description} = this.state
  
    return (
      <>
        <>
          <Modal
            isOpen={true}
            centered={true}
            className="delete-case-modal"
            size="lg"
          >
            <ModalHeader
              className="d-flex align-items-center justify-content-center"
              toggle={this.props.hideModal}
            >
            Edit
            </ModalHeader>
            <ModalBody className="w-100  confirm-modal">
            <ReactQuill theme="snow" value={Description} onChange={(value) => { this.handleChange(value, "Description")}}/>
          
            </ModalBody>
            <ModalFooter className= "mfooterGT">
              <Button
                className="ld-button-success"
                type="submit"
                onClick={this.submit}
              >
                Confirm
              </Button>
              <Button
                className="ld-button-danger"
                type="submit"
                onClick={this.props.hideModal}
              >
                Cancel
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
    show: () => dispatch(PreloaderActions.showPreloader("DEL_DOC")),
    hide: () => dispatch(PreloaderActions.hidePreloader("DEL_DOC"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDocumentModal);
