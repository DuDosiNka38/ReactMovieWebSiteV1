import React, { Component } from "react";
import ConfigActivity from "../../components/Activity/ConfigActivity";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import PRIVILEGE from "../../services/privileges";

import { connect } from "react-redux";


class AddActivityType extends Component {
  state = {
    modal: false,
    succsess: false,

  };
  
  closeModal() {
    this.setState({ modal: false });
  }

  switch_modal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
    this.setState({succsess: !this.state.succsess})
  }
  render() {
    if(this.props.personeData === undefined)
    return (<></>);

const pData = this.props.personeData;
    return (
      <>
        {PRIVILEGE.check("ADD_ACTIVITY_TYPE", pData) && 
            <>
          <Button
          type="button"
          color="success"
          className="waves-effect waves-light mb-3 d-flex align-items-center"
          onClick={this.switch_modal}
        >
          <i className="ri-add-fill"></i>
          Add new 
        </Button>
            </>
  }
       

        <Modal isOpen={this.state.modal} centered={true} size="xl">
          <ModalHeader
            toggle={() => this.setState({ modal: false })}
            className="text-center"
          >
            Add new
          </ModalHeader>
          <ModalBody>
              <ConfigActivity switch_modal={this.switch_modal} succsess={this.state.succsess} type="ADD"></ConfigActivity>
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
const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AddActivityType) ;
