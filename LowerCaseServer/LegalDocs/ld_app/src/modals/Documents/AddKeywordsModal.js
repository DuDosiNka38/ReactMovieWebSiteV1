import React, { Component, Suspense, lazy } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
	Label
} from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import * as PreloaderActions from "../../store/preloader/actions";
import * as DocsActions from "../../store/documents/actions";
import DocsApi from "./../../api/DocsApi";
import notification from "./../../services/notification";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";


class AddKeywordsModal extends Component {
	state = {
		KEYWORDS: [],
	}
  // deleteDoc = async () => {
  //   const { Preloader } = this.props;
  //   Preloader.show();
  //   const res = await DocsApi.deleteDocument(this.props.DOC_ID);
  //   if (!res.result) {
  //     notification.isError(res.data.error_message);
  //     Preloader.hide();
  //     return false;
  //   }
  //   if (this.props.onSuccess) {
  //     this.props.onSuccess();
  //   }
  //   notification.isSuck("Document successfully deleted!");
  //   this.props.hideModal();
  //   Preloader.hide();
  // };
	createbleSelectHandler = (newValue, actionMeta) => {
    this.setState({ KEYWORDS: newValue });
  };

	addKeywords = async () => {
    const KEYWORDS = this.state.KEYWORDS.map((x) => (x.value));
    if(this.state.KEYWORDS.length) {
      const { DOC_ID, Preloader } = this.props;
      Preloader.show();
      if(!KEYWORDS.length)
        return false;
  
      const resDocKeywords = await DocsApi.postDocKeywords(KEYWORDS.map((x) => ({KEYWORDS: x, DOC_ID})));
      
      if(typeof this.props.onSuccess === "function")
        this.props.onSuccess(KEYWORDS);
  
      this.setState({KEYWORDS: []})
  
      this.props.hideModal(this.props.type);
      Preloader.hide();
    }else {
      notification.isError("Look like you try send empty field")
    }
	}


  render() {
    const { KEYWORDS } = this.state;

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
              Add Keywords
            </ModalHeader>
            <ModalBody className="w-100 confirm-modal">
              <FormGroup className=" mb-4">
                <Label htmlFor="Keywords">Keywords</Label>
                <CreatableSelect
                  isMulti
                  id="Keywords"
                  name="KEYWORDS"
                  onChange={this.createbleSelectHandler}
                  placeholder="Add keyword and press enter"
                  blurInputOnSelect={false}

                />
              </FormGroup>
            </ModalBody>
            <ModalFooter className= "mfooterGT">
              <Button
                className="ld-button-success"
                type="submit"
                onClick={this.addKeywords}
                disabled={!KEYWORDS.length}
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
const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
	Preloader: {
		show: () => dispatch(PreloaderActions.showPreloader("ADD_NEW_DOC")),
		hide: () => dispatch(PreloaderActions.hidePreloader("ADD_NEW_DOC"))
	},
	fetchAllDocKeywords: () => dispatch(DocsActions.docKeywordsFetchRequested()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddKeywordsModal);
