import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import DocumentModal from "./DocumentModal";
import axios from "./../../services/axios";
import * as actions from "./../../store/user/actions";
import noteWindow from "../../services/notifications";

class AddDocument extends Component {
  state = {
    Case_NAME: this.props.case,
    DOCUMENT_NAME: "",
    Description: "",
    DOCUMENT_TYPE: "",
    CREATED_DATE: `${new Date().getFullYear()}-${`${
      new Date().getMonth() + 1
    }`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
      2,
      0
    )}T${`${new Date().getHours()}`.padStart(
      2,
      0
    )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
    FILED_DATE: "",
    tags: [],
  };

  createbleSelectHandler = (newValue: any, actionMeta: any) => {
    this.setState({ tags: newValue });
  };

  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };
  onSelectChange = (el) => {
    this.setState({ [el.name]: el.value });
    
  };
 componentDidMount() {
  if(this.props.whereopen === "inside_docs") {
    this.setState({Case_NAME: this.state.Case_NAME})
  }else {
    this.setState({Case_NAME: this.props.case})
  }
}
  
componentDidUpdate(prevProps, prevState) {
  if(prevProps.case !== this.props.case)
    this.setState({Case_NAME: this.props.case})
}

  

  addDoc = async () => {
   
    let tags = this.state.tags.map((x) => {
      return x.value;
    });

    let DOC_ID = null;

    const result = await axios
      .post("/api/document/add", {
        Author_id: this.props.personeData.Person_id,
        Case_NAME: this.state.Case_NAME,
        DOCUMENT_NAME: this.state.DOCUMENT_NAME,
        Description: this.state.Description,
        DOCUMENT_TYPE: this.state.DOCUMENT_TYPE,
        CREATED_DATE: Date.parse(this.state.CREATED_DATE.replace("T", " "))
          .toString()
          .substr(0, 10),
        FILED_DATE: Date.parse(this.state.FILED_DATE.replace("T", " "))
          .toString()
          .substr(0, 10),
        tags: tags,
      })
      .then(function (response) {
        const {result_data} = response.data;
        DOC_ID = result_data.DOC_ID;
        
        noteWindow.isSuck("Document successfully added!");
        return true;
      })
      .catch(function (response) {
        noteWindow.isError("Pizda hana");
        return false;
      });

    if (result) {
      setTimeout(this.props.onGlobalLoad(), 100);
      setTimeout(this.props.switch_modal(), 1000);

      return DOC_ID;
    } else {
    }
  };

  addDocToEvent = async () => {

    const DOC_ID = await this.addDoc();
    const result = axios
      .post("/api/event/addDocument", {
        DOC_ID: DOC_ID,
        Relation_type: "DEFAULT",
        Case_NAME: this.state.Case_NAME,
        Activity_Name: this.props.eventName,
        Activity_type: this.props.eventType,

      })
      .then((response) => {
        const {result , result_data} = response.data;
        if (result) {
          noteWindow.isSuck("Documents added");
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
     

  }

  render() {
    const { global, personeData,  addfromevent} = this.props;
    const types = global.Doc_Types;


    return (
      <>
        <Modal
          size="xl"
          isOpen={this.props.modal}
          switch={this.props.switch_modal}
          centered={true}
        >
          <ModalHeader toggle={this.props.switch_modal} className="text-center">
            Add Document
          </ModalHeader>

          <ModalBody>
            <AvForm onValidSubmit={this.props.addfromevent !== true ? this.addDoc : this.addDocToEvent }>
              <DocumentModal
                Case_NAME={this.state.Case_NAME}
                DOCUMENT_NAME={this.state.DOCUMENT_NAME}
                Description={this.state.Description}
                DOCUMENT_TYPE={this.state.DOCUMENT_TYPE}
                CREATED_DATE={this.state.CREATED_DATE}
                FILED_DATE={this.state.FILED_DATE}
                types={types}
                handleChange={this.handleChange}
                createbleSelectHandler={this.createbleSelectHandler}
                onSelectChange={this.onSelectChange}
                keywords={this.props.keywords}
                whereopen = {this.props.whereopen}
               
                // keywords={}
              />

              <Button className="posAButton docPos" color="success">
                Add <br /> Document
              </Button>
            </AvForm>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    docs: state.User.localDocs,
    global: state.User.globalData,
    personeData: state.User.persone,
    keywords: state.User.globalKeywords,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onCaseLoad: () => dispatch(actions.getCase()),
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocument);
