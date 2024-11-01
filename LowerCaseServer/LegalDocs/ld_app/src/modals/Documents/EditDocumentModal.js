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


class EditDocumentModal extends Component {
  state = {
    DOC_ID: null,
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

  componentDidMount = async() =>  {
    this.props.fetchUserCases();
    this.props.fetchAllDocKeywords();

		const docData = await DocsApi.fetchDocument(this.props.DOC_ID)
		this.setState({...docData});
  }

  editDoc = async () => {
    const { keywords, DOC_ID } = this.state;
    const KEYWORDS = this.state.KEYWORDS.map((x) => (x.value));
    const { user, Preloader } = this.props;
    Preloader.show();

    const docData = filterObj(this.state, (v, i) => {
      return !["Case_Full_NAME", "CaseBg", "KEYWORDS", "keywords", "Description"].includes(i);
    });

    const resPDoc = await DocsApi.putDocument(docData);

    if (!resPDoc.result) {
      notification.isError(resPDoc.data.error_message);
      Preloader.hide();
      return false;
    }

    const NEW_KW = [];
    KEYWORDS.map((x) => !keywords.includes(x) && NEW_KW.push(x));
    const DEL_KW = [];
    keywords.map((x) => !KEYWORDS.includes(x) && DEL_KW.push(x));

    if(NEW_KW.length) await DocsApi.postDocKeywords(NEW_KW.map((x) => ({KEYWORDS: x, DOC_ID})));
    if(DEL_KW.length) await DocsApi.deleteDocKeywords(DEL_KW.map((x) => ({KEYWORDS: x, DOC_ID})));
    
    if(this.props.onSuccess){
      this.props.onSuccess();
    }
    notification.isSuck("Document successfully updated!");
    this.props.hideModal();
    Preloader.hide();
  };

  render() {
    const { cases, Doc_Keywords} = this.props;
    const { CREATED_DATE,  DOCUMENT_NAME, Description, FILED_DATE, Case_NAME, DOC_ID, keywords} = this.state;
    
    if(DOC_ID === null)
      return null;

    return (
      <>
        <Modal
          size="xl"
          isOpen={true}
          centered={true}
          style={{ width: "700px" }}
        >
          <ModalHeader toggle={this.props.hideModal} className="text-center">
            Edit Document
          </ModalHeader>
          <AvForm onValidSubmit={this.editDoc}>
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
											value = {DOCUMENT_NAME}
                      disabled = {true}
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
                        defaultValue={cases.map((x) => ({ value: x.Case_Short_NAME, label: x.Case_Full_NAME })).find((y) => y.value === Case_NAME)}
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
                      onChange={this.createbleSelectHandler}
                      placeholder="Add keyword and press enter"
                      blurInputOnSelect={false}
                      options={Doc_Keywords.map((x) => ({value: x, label: x}))}
                      defaultValue={keywords.map((x) => ({value: x, label: x}))}
                    />
                  </FormGroup>
                </Col>
                {/* <Col lg={12}>
                  <FormGroup className="mb-4 form-textarea">
                    <Textarea
                      maxLen={500}
                      label="Description"
                      name="Description"
                      placeholder="ex. My first Document"
                      onChange={this.handleChange}
											value = {Description}
                    />
                  </FormGroup>
                </Col> */}

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
      show: () => dispatch(PreloaderActions.showPreloader("EDIT_NEW_DOC")),
      hide: () => dispatch(PreloaderActions.hidePreloader("EDIT_NEW_DOC"))
    },
    fetchAllDocKeywords: () => dispatch(DocsActions.docKeywordsFetchRequested()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDocumentModal);

 
