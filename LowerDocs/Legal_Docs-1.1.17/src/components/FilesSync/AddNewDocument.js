import React, { Component } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { connect } from "react-redux";
import axios from "./../../services/axios";
import * as actions from "./../../store/user/actions";
import {
  Label,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Button
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

class AddNewDocument extends Component {
  state = {};

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

  render() {
    const types = this.props.global.Doc_Types;
    const {cases} = this.props;
    const options = types.map((o) => ({
      name: "DOCUMENT_TYPE",
      value: o.DOCUMENT_TYPE,
      label: o.TYPE_DESCRIPTION,
    }));
    const keywords = this.props.keywords.map((o) => ({
      value: o.KEYWORDS,
      label: o.KEYWORDS,
    }));

    const allCases = cases.map((x)=> ({
      name: "Case", value: x.Case_NAME, label: x.Case_Full_NAME
    }))

    return (
      <>
        <Modal
          // size=""
          isOpen={this.props.modal}
          switch={this.props.switch_modal}
          centered={true}
        >
          <ModalHeader toggle={this.props.switch_modal} className="text-center">
            Add Document
          </ModalHeader>

          <ModalBody>
            <AvForm>
              <Row>
                <Col lg={12}>
                  <FormGroup className="auth-form-group-custom mb-4">
                    <i className=" ri-hashtag auti-custom-input-icon"></i>
                    <Label htmlFor="username">DOCUMENT NAME </Label>
                    <AvField
                      name="DOCUMENT_NAME"
                      value={this.state.DOCUMENT_NAME}
                      type="text"
                      className="form-control"
                      id="DOCUMENT_NAME"
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

                <Col lg={12}>
                  <FormGroup className=" mb-4">
                    <Label htmlFor="username">Select Case </Label>
                    <Select
                    options={allCases}
                    className="basic-multi-select"
                    name="Case"
                    classNamePrefix="select"
                    onChange={this.onSelectChange}
                  />
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <FormGroup className=" mb-4">
                    <Label htmlFor="username">Keywords </Label>
                    <CreatableSelect
                      isMulti
                      onChange={this.createbleSelectHandler}
                      placeholder="Add keyword and press enter"
                      options={keywords}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup className="mb-4 mt-2">
                    <Label htmlFor="billing-address">Description</Label>
                    <textarea
                      className="form-control custom-textarea"
                      id="Description"
                      rows="3"
                      name="Description"
                      value={this.state.Description}
                      placeholder="Enter Description"
                      onChange={this.handleChange}
                    ></textarea>
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <Label htmlFor=""> DOCUMENT TYPE</Label>
                  <Select
                    options={options}
                    className="basic-multi-select"
                    name="Owner"
                    classNamePrefix="select"
                    onChange={this.onSelectChange}
                  />
                </Col>

                <Col lg={6}>
                  <FormGroup className="mb-4 mt-2">
                    <Label htmlFor="CREATED_DATE">CREATED DATE</Label>
                    <AvField
                      name="CREATED_DATE"
                      value={this.state.CREATED_DATE}
                      type="datetime-local"
                      id="CREATED_DATE"
                      onChange={this.handleChange}
                      validate={{
                        required: {
                          value: true,
                        },
                      }}
                      placeholder="Event Name"
                    />
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup className="mb-4 mt-2">
                    <Label htmlFor="FILED_DATE">FILED DATE</Label>
                    <AvField
                      name="FILED_DATE"
                      value={this.state.FILED_DATE}
                      type="datetime-local"
                      // defaultValue="2020-03-14T13:45:00"
                      id="FILED_DATE"
                      onChange={this.handleChange}
                      // validate={{
                      //   required: {
                      //     value: true,
                      //   },
                      // }}
                      placeholder="Event Name"
                    />
                  </FormGroup>
                </Col>
               <Col lg = {12}> 
               <div className="d-flex  w-100 align-items-center justify-content-end">
                <Button className="ml-2">Add</Button>

                <Button>Cancel</Button>
                </div>
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
    keywords: state.User.keywords,
    cases: state.User.caseData.cases,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
 
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewDocument);
