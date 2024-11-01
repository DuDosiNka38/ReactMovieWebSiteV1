import React, { Component } from "react";
import {
  FormGroup,
  Label,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Row,
  Col,
  Button,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from "react-select";
import { connect } from "react-redux";
import UploadFileHandler from "./UploadFileHandler";
import axios from "./../../services/axios";
import noteWindow from "./../../services/notifications";
import * as actions from "./../../store/user/actions";

class UploadFile extends Component {
  state = {
    File_id: "",
    Status: "",
    Form: "",
    File_Path: [],
  };
  fileUpload = this.fileUpload.bind(this);
  addedFile = this.addedFile.bind(this);
  deleteFile = this.deleteFile.bind(this);


  

  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };
  onSelectChange = (el) => {
    this.setState({ [el.name]: el.value });
  };
  addedFile(file) {
    const { File_Path } = this.state;
    File_Path.push(file);
    this.setState({ File_Path: File_Path });
  }

  async deleteFile(file){
    await axios
    .post("/api/file/delete", {file: file}
    )
    .then((result) => {
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  }

  fileUpload() {
    const {global, Person} = this.props;
    const { File_Path } = this.state;
    if(File_Path.length > 0){
      // const update = this.props.onGlobalLoad();
      noteWindow.loading("Processing");
      File_Path.map((path, i, arr) => {
        const r = axios
        .post("/api/file/add", {
          Person_id: Person.Person_id,
          Case_NAME: this.props.Case_NAME,
          DOC_ID: this.props.DOC_ID,
          Status: "DEFAULT",
          Form: null,
          File_path: path,
        })
        .then(function (response) {
          if (response.data.result) {
            noteWindow.clear();
            // setTimeout(update(), 10);
            noteWindow.isSuck(`File ${path} successfully uploaded!`);
            return true;
          } else {
            noteWindow.clear();
            noteWindow.isError(response.data.result_data.result_error_text);
            return false;
          }
        })
        .catch((response) => {
          noteWindow.clear();
          noteWindow.isError(response);
        });
      this.props.switch_modal();
      
      if(!r)        
        this.deleteFile(this.state.File_Path);
      else
        this.props.onGlobalLoad();
      })
      
        
    }
  }

  render() {
    console.log(this.props.Person);
    const Form = this.props.global.Doc_Form.map((o) => ({
      name: "Form",
      value: o.Form,
      label: `${o.Form}: ${o.Description}`,
    }));

    const Status = this.props.global.File_Statuses.map((o) => ({
      name: "Status",
      value: o.Status_code,
      label: o.Description,
    }));
    return (
      <>
        <Modal
          size="xl"
          isOpen={this.props.modal}
          switch={this.props.switch_modal}
          centered={true}
        >
          <ModalHeader toggle={this.props.switch_modal} className="text-center">
            Add Document Files
          </ModalHeader>
          <ModalBody toggle={() => this.setState({ modal: false })}>
            <AvForm onValidSubmit={this.fileUpload}>
              <Row>
                {/* <Col lg={12}>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className=" ri-hashtag auti-custom-input-icon"></i>
                    <Label htmlFor="username">File Name </Label>
                    <AvField
                      name="File_id"
                      value={this.state.File_id}
                      type="text"
                      className="form-control"
                      id="File_id"
                      onChange={this.handleChange}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: "Please enter a name",
                        },
                        maxLength: {
                          value: 100,
                          errorMessage:
                            "Your name must be between 1 and 10 characters",
                        },
                      }}
                      placeholder="Document Name"
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <Label htmlFor=""> Status</Label>
                  <Select
                    options={Status}
                    className="basic-multi-select"
                    name="Status"
                    classNamePrefix="select"
                    onChange={this.onSelectChange}
                  />
                </Col>
                <Col lg={6}>
                  <Label htmlFor=""> Form</Label>
                  <Select
                    options={Form}
                    className="basic-multi-select"
                    name="Form"
                    classNamePrefix="select"
                    onChange={this.onSelectChange}
                  />
                </Col> */}
                <Col lg={12}>
                  <UploadFileHandler
                    File_Path={this.state.File_Path}
                    addedFile={this.addedFile}
                  />
                </Col>
                <Col lg={12}>
                  <Button color="primary" className="mt-3 w-100">
                    Add File
                  </Button>
                </Col>
              </Row>
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
    global: state.User.globalData,
    Person: state.User.persone,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
