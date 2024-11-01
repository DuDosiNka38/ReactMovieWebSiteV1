import React, { Component } from "react";
import ConfigDepartment from "../../components/ConfigDepartment/ConfigDepartment";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import PRIVILEGE from "../../services/privileges";
import { connect } from "react-redux";

// import AvForm from "availity-reactstrap-validation/lib/AvForm";

class AddDepartment extends Component {
  state = {
    modal: false,
    succsess: false,
  };

  closeModal() {
    this.setState({ modal: false });
  }

  switch_modal = this.switch_modal.bind(this);
  switch_modal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
    this.setState({ succsess: !this.state.succsess });
  }
  render() {
    if (this.props.personeData === undefined) return <></>;

    const pData = this.props.personeData;
    return (
      <>
        {PRIVILEGE.check("ADD_DEPARTMENT", pData) && (
          <>
            <Button
              type="button"
              color="success"
              className="waves-effect waves-light align-items-center d-flex mb-3"
              onClick={this.switch_modal}
            >
              <i className="ri-add-fill"></i>
              Add new
            </Button>
          </>
        )}

        <Modal isOpen={this.state.modal} centered={true}>
          <ModalHeader
            toggle={() => this.setState({ modal: false })}
            className="text-center"
          >
            Add new department
          </ModalHeader>
          <ModalBody>
            <ConfigDepartment
              departments={this.props.departments}
              succsess={this.state.succsess}
              switch_modal = {this.switch_modal}
            ></ConfigDepartment>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    personeData: state.User.persone,
  };
};
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AddDepartment);
