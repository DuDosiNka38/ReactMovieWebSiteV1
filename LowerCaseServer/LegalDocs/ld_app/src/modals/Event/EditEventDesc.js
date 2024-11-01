import React, { Component, Suspense, lazy, createRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
// import {Editor, EditorState, RichUtils} from 'draft-js';
import * as PreloaderActions from "../../store/preloader/actions";

import notification from './../../services/notification'
// import 'draft-js/dist/Draft.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EventsApi from "../../api/EventsApi";

class EditEventDesc extends Component {
  state = {
    Comments: "",
    text: ""
  }

  editorBlock = createRef();


  submit = async () => {
    const { Comments } = this.state;
    const { Activity_Name, onSubmit, Preloader, hideModal, type } = this.props;

    Preloader.show();

    const response = await EventsApi.putEvent({Activity_Name, Comments});

    if(onSubmit && typeof onSubmit === "function"){
      await onSubmit();
    }
    
    Preloader.hide();
    hideModal(type);
  

  }
  handleChange = (value, name, editor) => {
    const {[name]:oldValue } = this.state;
    if(value !== oldValue)
      this.setState({ [name]: value });

     
      let editorProps = this.editorBlock.current;  
      let html;
      if (editorProps !== null) {
        html = editorProps.value
        let text = html.replace(/<\/?[^>]+(>|$)/g, " ")
        this.setState({text})
      }
  
  };

  componentDidMount() {
    const {description} = this.props
    this.setState({Comments: description})
    
  }

  render() {
    const {Comments} = this.state
  
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
            <ReactQuill theme="snow" value={Comments} onChange={(value) => { this.handleChange(value, "Comments")}} ref= {this.editorBlock}/>
            
          
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
    show: () => dispatch(PreloaderActions.showPreloader("EDIT_EVENT_DESC")),
    hide: () => dispatch(PreloaderActions.hidePreloader("EDIT_EVENT_DESC"))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEventDesc);
