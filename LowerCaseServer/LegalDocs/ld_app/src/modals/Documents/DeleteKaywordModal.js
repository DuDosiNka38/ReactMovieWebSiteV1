import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "./../../api/DocsApi"
import notification from './../../services/notification'


class DeleteKeywordsModal extends Component {



  deleteKeyword = async () => {
		const res = DocsApi.deleteDocKeywords(([{KEYWORDS: this.props.Keyword, DOC_ID:this.props.DOC_ID}]))
		if(res) {
			notification.isSuck(`${this.props.Keyword} deleted`)
			this.props.hideModal(this.props.type)

			if(typeof this.props.onSuccess === "function")
				this.props.onSuccess();
		}
    
  }

  render() {
  
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
            Delete {this.props.Keyword} Keyword
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal">
						Are you sure what you want delete  {this.props.Keyword} ?
            </ModalBody>
            <ModalFooter>
              <Button
                className="ld-button-danger"
                type="submit"
                onClick={this.deleteKeyword}
              >
                Delete
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteKeywordsModal);
