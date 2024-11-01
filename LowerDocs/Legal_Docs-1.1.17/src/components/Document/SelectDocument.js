import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Button,
} from "reactstrap";
import { connect } from "react-redux";
import Select from "react-select";
import axios from "./../../services/axios"
import noteWindow from "../../services/notifications"
import * as actions from "./../../store/user/actions";




class SelectDocument extends Component {
  state = {
    Docs:[],
  };

  onSelectChange = this.onSelectChange.bind(this);
  addDocsToCase = this.addDocsToCase.bind(this)

addDocsToCase() {
    const {Docs} = this.state;
    Docs.map((x, i, arr) => {
      const DOC_ID = x.value;
      const result = axios
      .post("/api/event/addDocument", {
        DOC_ID: DOC_ID,
        Relation_type: "DEFAULT",
        Case_NAME: this.props.caseId,
        Activity_Name: this.props.eventName,
        Activity_type: this.props.eventType,

      })
      .then((response) => {
        if (response.data.result) {
          if(i === arr.length-1){
            noteWindow.isSuck("Documents added");

            this.props.select_modal();
          }

          return true;

        } else {
          noteWindow.isError(response.data.result_data.result_error_text);
        }
      })
      .catch((response) => {
        noteWindow.isError(response);
      });
  
      if(result) {
        this.props.onGlobalLoad()
      }
    });

  } 

  onSelectChange(value, el){
    const {name} = el;
    this.setState({[name]: value});
  }
  render() {
    const { cases, caseId, eventName} = this.props;
    const currentEventDocsID = cases.find((x)=> x.Case_Short_NAME === caseId).Case_Events.find((x) => x.Activity_Name === eventName).Docs.map((x) => (x.DOC_ID));
    const currentCaseDocs = cases.find((x)=> x.Case_Short_NAME === caseId).Case_Documents
    const docsFromCase = currentCaseDocs.filter((x) => currentEventDocsID.includes(x.DOC_ID) === false).map((x)=> ({
      name: "Docs", 
      value: x.DOC_ID, 
      label: x.DOCUMENT_NAME
    })) 
    return (
      <>
        <Modal
          isOpen={this.props.modaltype}
          switch={this.props.select_modal}
          centered={true}
          size="xl"
        >
          <ModalHeader toggle={this.props.select_modal} className="text-center">
            Select documents
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor=""> DOCUMENT TYPE</Label>
              <Select
                options={docsFromCase}
                className="basic-multi-select"
                name="Docs"
                classNamePrefix="select"
                onChange={this.onSelectChange}
                value={this.state.Docs}
                isMulti={true}
                closeMenuOnSelect={false}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.addDocsToCase} color="success">Add</Button>
            <Button  onClick={this.props.select_modal} color="danger">Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    docs: state.User.localDocs,
    personeData: state.User.persone,
    global: state.User.globalData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectDocument);
