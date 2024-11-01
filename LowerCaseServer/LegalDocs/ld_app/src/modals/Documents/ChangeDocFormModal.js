import React, { Component, Suspense, lazy } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "./../../api/DocsApi";
import notification from "./../../services/notification";
import * as PreloaderActions from "../../store/preloader/actions";
import Select from "react-select";
import { connect } from "react-redux";
import * as DocsActions from "./../../store/documents/actions";

class ChangeDocFormModal extends Component {
  state = {
    Doc_forms_opt: [],
  };

  changeForm = async () => {
    const { Preloader } = this.props;
    Preloader.show();
    const res = await DocsApi.putDocument({
      DOC_ID: this.props.DOC_ID,
      Form: this.state.DOCFORM
    });
    if (!res.result) {
      notification.isError(res.data.error_message);
      // Preloader.hide();
      return false;
    }
    if (this.props.onSuccess) {
      this.props.onSuccess();
    }
    notification.isSuck("Form successfully changed!");
    this.props.hideModal();
    Preloader.hide();
  };

  handleSelectChange = (el, e) => {
    const { value } = el;
    const { name } = e;
    this.setState({ [name]: value });
  };
  componentDidMount() {
    this.setState({
      Doc_forms_opt: this.props.Doc_forms.map((x) => ({
        value: x.Form,
        label: `${x.Form} | ${x.Description}`,
      })),
    });
  }

  render() {
    const { Doc_forms_opt } = this.state;
    
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
              Change Document {this.props.DocName} Form
            </ModalHeader>
            <ModalBody className="w-100  confirm-modal">
              <>
                <Select
                  name="DOCFORM"
                  // className="basic-multi-select"
                  // classNamePrefix="select"
                  // placeholder="Choose action for selected files"
                  // isDisabled={chkBoxModel.length === 0}
                  // options={options}
                  options={Doc_forms_opt}
                  // value={
                  //   checkedAction === null
                  //     ? checkedAction
                  //     : options.find(
                  //         (x) => x.value === checkedAction
                  //       )
                  // }
                  onChange={this.handleSelectChange}
                />
              </>
            </ModalBody>
            <ModalFooter className= "mfooterGT">
              <Button
                className="ld-button-success"
                type="submit"
                onClick={this.changeForm}
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
  Doc_forms: state.Documents.Doc_form,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDocForms: () => dispatch(DocsActions.docFormsFetchRequested()),

  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("DEL_DOC")),
    hide: () => dispatch(PreloaderActions.hidePreloader("DEL_DOC")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeDocFormModal);
