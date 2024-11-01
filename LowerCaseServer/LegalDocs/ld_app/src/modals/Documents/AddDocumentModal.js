import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Row,
  Col,
} from "reactstrap";
import { fadeInUp } from "react-animations";
import Radium, { StyleRoot } from "radium";
import { AvField, AvForm } from "availity-reactstrap-validation";
import Select from "react-select";
import {} from "availity-reactstrap-validation";
import { connect } from "react-redux";
import * as ModalActions from "./../../store/modal/actions";
// import noteWindow from "./../../services/notification";
import CreatableSelect from "react-select/creatable";
import Textarea from "./../../components/FormComponents/Textarea/Textarea";
import * as CaseActions from "./../../store/case/actions";
import DocsApi from "./../../api/DocsApi";
import { filterObj } from "./../../services/Functions";
import notification from "./../../services/notification";
import * as PreloaderActions from "../../store/preloader/actions";
import * as DocsActions from "../../store/documents/actions";
import DatePicker from "react-datepicker";

class AddDocument extends Component {
  state = {
    dt: "",
    Case_NAME: null,
    DOCUMENT_NAME: null,
    Description: null,
    CREATED_DATE: `${new Date().getFullYear()}-${`${
      new Date().getMonth() + 1
    }`.padStart(2, 0)}-${`${new Date().getDate()}`.padStart(
      2,
      0
    )}T${`${new Date().getHours()}`.padStart(
      2,
      0
    )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
    FILED_DATE: null,
    KEYWORDS: [],
  };

  createbleSelectHandler = (newValue, actionMeta) => {
    this.setState({ KEYWORDS: newValue });
  };

  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };
  handleSelectChange = (el, e) => {
    const { value } = el;
    const { name } = e;
    this.setState({ [name]: value });
  };

  handleDateChange = (e, name) => {
    this.setState({ [name]: e ? new Date(e): e });
  };
  componentDidMount() {
    this.props.fetchUserCases();
    this.props.fetchAllDocKeywords();

    if (this.props.whereopen === "inside_docs") {
      this.setState({ Case_NAME: this.state.Case_NAME });
    } else {
      this.setState({ Case_NAME: this.props.case });
    }
    if (this.props.Case_NAME !== null || this.props.Case_NAME !== undefined) {
      this.setState({Case_NAME: this.props.Case_NAME})
    }
  }

  addDoc = async () => {
    const { user, Preloader } = this.props;
    const { KEYWORDS } = this.state;
    Preloader.show();
    const docData = {
      ...filterObj(this.state, (v, i) => {
        return !["dt", "KEYWORDS"].includes(i);
      }),

      Person_id: user.Person_id,
    };

    const resPDoc = await DocsApi.postDocument(docData);

    if (!resPDoc.result) {
      notification.isError(resPDoc.data.error_message);
      Preloader.hide();
      return false;
    }

    const resDocKeywords = await DocsApi.postDocKeywords(KEYWORDS.map((x) => ({KEYWORDS: x.value, DOC_ID: resPDoc.DOC_ID})));
    
    if(this.props.onSuccess){
      this.props.onSuccess();
    }
    notification.isSuck("Document successfully created");
    this.props.hideModal();
    Preloader.hide();
  };

  render() {
    const { CREATED_DATE, FILED_DATE } = this.state;
    const { cases, Doc_Keywords } = this.props;

    return (
      <>
        <Modal
          size="xl"
          isOpen={true}
          centered={true}
          style={{ width: "700px" }}
        >
          <ModalHeader toggle={this.props.hideModal} className="text-center">
            Add Document
          </ModalHeader>
          <AvForm onValidSubmit={this.addDoc}>
            {" "}
            <ModalBody
              toggle={this.props.hideModal}
              className="scrollable-modal"
            >
              <Row>
                <Col lg={12}>
                  <FormGroup className="ld-form-group-custom mb-4">
                    <i class="ri-article-line"></i>
                    <Label htmlFor="DOCUMENT_NAME">Document Name</Label>
                    <AvField
                      name="DOCUMENT_NAME"
                      type="text"
                      className="form-control"
                      id="DOCUMENT_NAME"
                      onChange={this.handleChange}
                      validate={{
                        required: {
                          value: true,
                          errorMessage: "Please enter a Document Name",
                        },
                        maxLength: {
                          value: 100,
                          errorMessage:
                            "Your name must be between 1 and 10 characters",
                        },
                      }}
                      placeholder="ex. My New Document Name"
                    />
                  </FormGroup>
                </Col>

                <>
                  <Col lg={12}>
                    <FormGroup className=" mb-4">
                      <Label htmlFor="Case_NAME">Select Case</Label>
                      <Select
                        name="Case_NAME"
                        options={cases.map((x) => ({
                          label: x.Case_Full_NAME,
                          value: x.Case_Short_NAME,
                        }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleSelectChange}
                        defaultValue={
                          this.props.Case_NAME ?
                          {
                          label: this.props.Case_Full_NAME,
                          value: this.props.Case_NAME,
                          }
                          :
                          null
                        }
                        isDisabled={this.props.Case_Full_NAME && "true"}
                        placeholder="Select Case"
                      />
                    </FormGroup>
                  </Col>
                </>

                <Col lg={12}>
                  <FormGroup className=" mb-4">
                    <Label htmlFor="Keywords">Keywords</Label>
                    <CreatableSelect
                      isMulti
                      id="Keywords"
                      name="KEYWORDS"
                      onChange={this.createbleSelectHandler}
                      placeholder="Add keyword and press enter"
                      options={Doc_Keywords.map((x) => ({value: x, label: x}))}
                      blurInputOnSelect={false}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup className="mb-4 form-textarea">
                    <Textarea
                      maxLen={500}
                      label="Description"
                      name="Description"
                      placeholder="ex. My first Document"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>

                <Col lg={6}>
                  <FormGroup className="datepicker-form mb-4 mt-2">
                    <Label>Created Date</Label>
                    <div className="position-relative">
                      <i class="ri-calendar-2-line"></i>
                      <DatePicker
                        selected={CREATED_DATE ? new Date(CREATED_DATE) : null}
                        onChange={(e) => this.handleDateChange(e, "CREATED_DATE")}
                        dateFormat="MMMM d, yyyy"
                        name="CREATED_DATE"
                        isClearable
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col lg={6}>
                  <FormGroup className="datepicker-form mb-4 mt-2">
                    <Label>Filed Date</Label>
                    <div className="position-relative">
                      <i class="ri-calendar-2-line"></i>
                      <DatePicker
                        selected={FILED_DATE ? new Date(FILED_DATE) : null}
                        onChange={(e) => this.handleDateChange(e, "FILED_DATE")}
                        dateFormat="MMMM d, yyyy"
                        name="FILED_DATE"
                        isClearable
                        placeholderText="Not Filed Yet. Click to select date."
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter className= "mfooterGT">
              <Button className="ld-button-success" type="submit">
                Submit
              </Button>
              <Button className="ld-button-danger" type="button">
                Cancel
              </Button>
            </ModalFooter>
          </AvForm>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // personeData: state.User.persone,
    // keywords: state.User.globalKeywords,
    cases: state.Case.cases,
    Doc_Keywords: state.Documents.Doc_Keywords,
    user: state.User.data,
    isLoading: state.Case.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
    fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
    Preloader: {
      show: () => dispatch(PreloaderActions.showPreloader("ADD_NEW_DOC")),
      hide: () => dispatch(PreloaderActions.hidePreloader("ADD_NEW_DOC"))
    },
    fetchAllDocKeywords: () => dispatch(DocsActions.docKeywordsFetchRequested()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocument);
