import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "./../../services/axios";

import * as actions from "./../../store/user/actions";
import {
  Button,
  Label,
  Table,
  FormGroup,
  TabContent,
  TabPane,
  NavLink,
  NavItem,
  CardText,
  Nav,
  Card,
  Row,
  Col,
  CardBody,
  CardHeader,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import {
  AvForm,
  AvField,
  AvInput,
  AvGroup,
  AvCheckbox,
  AvCheckboxGroup,
} from "availity-reactstrap-validation";
import Select from "react-select";
import classnames from "classnames";
import noteWindow from "./../../services/notifications";
import AddNewDocument from "./AddNewDocument";
import fn from "./../../services/functions";

class ParseResult extends Component {
  state = {
    activeTabJustify: null,
    filesData: {},
    doc_modal: false,
  };

  submitSyncFiles = this.submitSyncFiles.bind(this);

  switch_doc_modal = (e) => {
    this.setState((prevState) => ({
      doc_modal: !prevState.doc_modal,
    }));
  };

  onSelectChange = (el, hash) => {
    const { filesData } = this.state;

    filesData[hash][el.name] = el.value;

    this.setState({ filesData: filesData });
  };
  toggleCustomJustified(tab) {
    if (this.state.activeTabJustify !== tab) {
      this.setState({
        activeTabJustify: tab,
      });
    }
  }

  getExtIcon(ext) {
    const icons = {
      ".csv": (
        <>
          <i style={{ color: "#009688" }} class="fas fa-file-csv"></i>
        </>
      ),
      ".doc": (
        <>
          <i style={{ color: "#2196f3" }} class="fas fa-file-word"></i>
        </>
      ),
      ".docx": (
        <>
          <i style={{ color: "#2196f3" }} class="fas fa-file-word"></i>
        </>
      ),
      ".jpeg": (
        <>
          <i style={{ color: "#e69325" }} class="fas fa-file-image"></i>
        </>
      ),
      ".pdf": (
        <>
          <i style={{ color: "#F44336" }} class="fas fa-file-pdf"></i>
        </>
      ),
      ".pdf_ocr": (
        <>
          <i style={{ color: "#F44336" }} class="fas fa-file-pdf"></i>
        </>
      ),
      ".xls": (
        <>
          <i style={{ color: "#009688" }} class="fas fa-file-excel"></i>
        </>
      ),
      ".xlsx": (
        <>
          <i style={{ color: "#009688" }} class="fas fa-file-excel"></i>
        </>
      ),
    };

    if (icons.hasOwnProperty(ext)) return icons[ext];
    else
      return (
        <>
          <i style={{ color: "#808080" }} class="fas fa-file-alt"></i>
        </>
      );
  }

  printCurrentFile(event, args) {
    console.log(args);
  }

  isDataValid(data) {
    let isValid = true;

    const hashs = Object.keys(data);

    for (let hash in data) {
      const fileProps = data[hash];
      for (let key in fileProps) {
        if (fileProps[key] === null || fileProps[key] === "") isValid = false;
      }
    }

    return isValid;
  }

  async submitSyncFiles() {
    const { filesData } = this.state;
    const { parsed } = this.props;

    if (this.isDataValid(filesData) === true) {
      this.props.saveUploadedFiles(filesData, parsed);
    } else {
      noteWindow.isError("All fields in form must be selected!");
    }
  }

  componentDidMount() {
    let { filesData } = this.state;
    const { parsed, cases } = this.props;
    const { FULL_PARSED, PART_PARSED, NOT_PARSED } = parsed;

    FULL_PARSED.forEach((file) => {
      filesData[file.File_hash] = {
        Case: file.Case_NAME,
        Form: file.Form,
        // Document: null
      };
    });

    PART_PARSED.forEach((file) => {
      filesData[file.File_hash] = {
        Case: file.Case_NAME,
        Form: file.Form,
        // Document: ""
      };
    });

    NOT_PARSED.forEach((file) => {
      filesData[file.File_hash] = {
        Case: file.Case_NAME,
        Form: file.Form,
        // Document: ""
      };
    });

    this.setState({ filesData: filesData });
  }

  render() {
    let activeTab = null;
    const { filesData } = this.state;
    const { parsed, cases } = this.props;
    const FullParsed = parsed.FULL_PARSED;
    const PartParsed = parsed.PART_PARSED;
    const NoParsed = parsed.NOT_PARSED;
    const CaseDoc = cases.find((x) => x.Case_Documents);
    const Form = this.props.global.Doc_Form.map((o) => ({
      name: "Form",
      value: o.Form,
      label: `${o.Form}: ${o.Description}`,
    }));

    const Cases = cases.map((x) => ({
      name: "Case",
      value: x.Case_Short_NAME,
      label: x.Case_Full_NAME,
    }));

    const getDocs = (x) => {
      let docs = [];
      let curCase = undefined;

      if (filesData[x.File_hash] !== undefined)
        curCase = cases.find(
          (o) => o.Case_Short_NAME === filesData[x.File_hash].Case
        );
      else curCase = cases.find((o) => o.Case_Short_NAME === x.Case_NAME);

      if (curCase !== undefined) docs = curCase.Case_Documents;

      return docs;
    };

    const files = [
      {data: FullParsed, label: "Completely parsed"},
      {data: PartParsed, label: "Partly parsed"},
      {data: NoParsed, label: "Not parsed"}
    ]

    return (
      <>
        <Card>
          <CardBody>
            <Nav tabs className="nav-tabs-custom nav-justified">
              {files.map((x, i) => (
                <>
                {x.data.length > 0 &&
                <>
                  <span className="d-none">{activeTab = activeTab === null ? i : activeTab}</span>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: this.state.activeTabJustify === null ? activeTab : this.state.activeTabJustify === i,
                      })}
                      onClick={() => {
                        this.toggleCustomJustified(i);
                      }}
                    >
                      <span className="d-none d-sm-block">
                        {x.label} ({x.data.length})
                      </span>
                    </NavLink>
                  </NavItem>
                </>
              }
              </>))}
              {/* <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: this.state.activeTabJustify === "1",
                  })}
                  onClick={() => {
                    this.toggleCustomJustified("1");
                  }}
                >
                  <span className="d-none d-sm-block">
                    Full Parsed ({FullParsed.length})
                  </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: this.state.activeTabJustify === "2",
                  })}
                  onClick={() => {
                    this.toggleCustomJustified("2");
                  }}
                >
                  <span className="d-none d-sm-block">
                    Part ({PartParsed.length})
                  </span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: this.state.activeTabJustify === "3",
                  })}
                  onClick={() => {
                    this.toggleCustomJustified("3");
                  }}
                >
                  <span className="d-none d-sm-block">
                    Not ({NoParsed.length})
                  </span>
                </NavLink>
              </NavItem> */}
            </Nav>

            <TabContent activeTab={this.state.activeTabJustify === null ? activeTab : this.state.activeTabJustify }>
              {files.map((f, i) => (
                <>
                {
                f.data.length > 0 &&
                <>
                  <TabPane tabId={i} className="p-3">
                    <Row>
                      <Col sm="12">
                        <AvForm>
                          <Table
                            className="table d-block table-striped table-hover h-auto table-sm customTable ReqTable"
                            width="100%"
                          >
                            <thead>
                              <tr>
                                <td className="req-file-name">File name</td>
                                <td className="req-case-name">Case name</td>
                                {/* <td className="req-case-doc">Document</td> */}
                                <td className="req-file-form">Form</td>
                              </tr>
                            </thead>
                            <tbody>
                              {f.data.map((x) => (
                                <>
                                  <tr key={x.File_hash}>
                                    <td className="req-file-name pt-15">
                                      {" "}
                                      <span className="fn-ico">
                                        {this.getExtIcon(x.File_info.extname)}
                                      </span>
                                      <a href="#" onClick={() => fn.openFile(x.File_info.abspath)}>{x.File_info.filename}</a>
                                    </td>
                                    <td className="req-case-name ">
                                      <Select
                                        name="Case"
                                        attr-file-hash={x.File_hash}
                                        options={Cases}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={(e) =>
                                          this.onSelectChange(e, x.File_hash)
                                        }
                                        defaultValue={
                                          filesData[x.File_hash] ===
                                            undefined ||
                                          filesData[x.File_hash].Case === null
                                            ? Cases.find(
                                                (o) => o.value === x.Case_NAME
                                              )
                                            : Cases.find(
                                                (o) =>
                                                  o.value ===
                                                  filesData[x.File_hash].Case
                                              )
                                        }
                                      />
                                    </td>
                                    {/* <td className="req-case-doc ">
                                <Select
                                    name="Document"
                                    options={getDocs(x).map((d) => ({
                                      name: "Document",
                                      value: d.DOC_ID,
                                      label: d.Description
                                    }))}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={e => this.onSelectChange(e, x.File_hash)}
                                    defaultValue={getDocs(x).map((d) => ({
                                      name: "Document",
                                      value: d.DOC_ID,
                                      label: d.Description
                                    }))[0]}
                                  />
                                </td> */}
                                    <td className="req-file-form">
                                      <Select
                                        name="Form"
                                        options={Form}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={(e) =>
                                          this.onSelectChange(e, x.File_hash)
                                        }
                                        defaultValue={Form.find(
                                          (y) => y.value === x.Form
                                        )}
                                      />
                                    </td>
                                  </tr>
                                </>
                              ))}
                            </tbody>
                          </Table>
                        </AvForm>
                      </Col>
                    </Row>
                  </TabPane>
                </>
              }</>))}
              
            </TabContent>

            <div className="d-flex align-items-center justify-content-end">
              <Button
                type="submit"
                color="success"
                onClick={this.switch_doc_modal}
                className="mr-2"
              >
                Add New Document
              </Button>

              <Button
                type="submit"
                color="success"
                onClick={this.submitSyncFiles}
              >
                Apply & Save
              </Button>
            </div>
          </CardBody>
        </Card>

        <AddNewDocument
          modal={this.state.doc_modal}
          switch_modal={this.switch_doc_modal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    global: state.User.globalData,
    cases: state.User.caseData.cases,
    personeData: state.User.persone,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ParseResult);
