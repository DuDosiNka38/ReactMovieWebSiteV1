import React, { Component } from 'react';
import { Button, CardBody, Modal, ModalBody, ModalFooter, ModalHeader, Card} from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../store/modal/actions";
import SearchForm from './../../components/Search/SearchForm';
import { Link, Redirect, useHistory} from "react-router-dom";

// import notification from "../../services/notification";


class SearchModal extends React.Component {
  state = {

  }

  componentWillUnmount(){
    if(typeof this.props.closeModal === "function")
      this.props.closeModal();
  }
  

  render() { 

   
    return (
      <>
        <Modal
          isOpen={true}
          centered={true}
          className="delete-case-modal"
          size="xl"
        >
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
           Search
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal confirm-modal m-0 p-0">
          <SearchForm/>

          </ModalBody>
          <ModalFooter className= "mfooterGTO">
            {/* <Link to = {combine("SEARCH_PAGE")} className="w-100 m-0 p-0"> */}
            <Button className="ld-button-success w-100" type="submit" onClick={this.props.hideModal}>Search</Button>
            {/* </Link> */}
          </ModalFooter>
        </Modal>
      </>
    ) ;
  }
}
 
const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  
});

export default connect(null, mapDispatchToProps) (SearchModal);