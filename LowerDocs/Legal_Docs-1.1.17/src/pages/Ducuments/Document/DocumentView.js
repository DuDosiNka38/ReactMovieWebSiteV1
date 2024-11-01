import React, { Component } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Label,
  Table,
  Input,
} from "reactstrap";
import { connect } from "react-redux";
import UploadFile from "../../../components/Files/UploadFile";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import { NavLink } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import PRIVILEGE from "../../../services/privileges";
import { AvField, AvForm } from "availity-reactstrap-validation";
import Select from "react-select";
import noteWindow from "../../../services/notifications";
import axios from "./../../../services/axios";
import * as actions from "./../../../store/user/actions";

let doc;

const SERVER = axios.defaults.baseURL;

const { SearchBar, ClearSearchButton } = Search;

// import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
// let caseFiles;
class DocumentView extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "All Cases", link: "/allcases" },

      {
        title: `${this.props.match.params.caseId}`,
        link: `/caseview/${this.props.match.params.caseId}`,
      },
      // { title: `${doc}`, link: "#" },
    ],
    modal: false,
    modalType: "",
    edit: false,
    editDocData: {},
    tableSearch: "",
    searchFields: [],
    DOC_FILES: null
  };

  closeModal = this.closeModal.bind(this);
  editDocument = this.editDocument.bind(this);

  switch_modal = (e) => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  edit = (e) => {
    this.setState((prevState) => ({
      edit: !prevState.edit,
    }));
  };
  closeModal() {
    this.setState({ modal: false });
  }

  editDocument() {
    const { editDocData } = this.state;
    editDocData.DOC_ID = this.props.match.params.docId;

    const result = axios
      .post("/api/document/update", editDocData)
      .then(function (response) {
        if (response.data.result === true) {
          noteWindow.isSuck("Document successfully updated!");
          return true;
        } else {
          noteWindow.isError(response.data.result_data.result_error_text);
        }
      })
      .catch(function (response) {
        noteWindow.isError("Pizda hana");
        return false;
      });

    if (result) {
      this.setState({ editDocData: {} });
      setTimeout(this.props.onGlobalLoad(), 100);
      setTimeout(this.edit(), 1000);
    }
  }

  handleChange = (e) => {
    const { name, value } = e.currentTarget;
    const { editDocData } = this.state;

    editDocData[name] = value;

    this.setState({ editDocData: editDocData });
  };

  onSelectChange = (e) => {
    const { name, value } = e;
    const { editDocData } = this.state;

    editDocData[name] = value;

    this.setState({ editDocData: editDocData });
  };

  //SEARCH ANG PAG
  tableSearch = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ tableSearch: value });
  };

  clearSearch = () => {
    this.setState({ tableSearch: "" });
  };

  searchFilter = (data) => {
    const { tableSearch, searchFields } = this.state;

    if (tableSearch === "") return data;

    const needle = tableSearch.toLowerCase();

    return data.filter((x) => {
      let result = false;

      for (let k in x) {
        if (
          typeof x[k] === "string" &&
          (searchFields.length > 0 ? searchFields.includes(k) : true)
        ) {
          const tmp = x[k].toLowerCase();
          if (tmp.indexOf(needle) !== -1) {
            result = true;
          }
        }
      }

      return result;
    });
  };

  getPageRows = (name, data) => {
    let { tablePagination, order } = this.state;
    let RESULT = data;

    if (tablePagination.hasOwnProperty(name) && data.length > 10) {
      const { offset, pageLimit } = tablePagination[name];

      RESULT = RESULT.slice(offset, offset + pageLimit);
    }

    return RESULT;
  };

  onPageChanged = (data) => {
    let { tablePagination } = this.state;
    const { currentPage, totalPages, pageLimit, name } = data;
    const offset = (currentPage - 1) * pageLimit;

    tablePagination[name] = {
      currentPage: currentPage,
      offset: offset,
      totalPages: totalPages,
      pageLimit: pageLimit,
    };

    this.setState({ tablePagination: tablePagination });
  };

  orderBy = (e) => {
    const name = e.hasOwnProperty("name")
      ? e.name
      : e.currentTarget.getAttribute("name");
    const orderField = e.hasOwnProperty("value")
      ? e.value
      : e.currentTarget.getAttribute("value");

    let order = this.state.order ?? {
      [name]: { orderField: orderField, orderType: "ASC" },
    };

    if (!order.hasOwnProperty(name)) {
      order[name] = { orderField: orderField, orderType: "ASC" };
    }

    if (order[name].orderField === orderField) {
      order[name].orderType = order[name].orderType === "ASC" ? "DESC" : "ASC";
    } else {
      order[name].orderField = orderField;
      order[name].orderType = "ASC";
    }

    if (order.hasOwnProperty(name)) {
      let RESULT = this.state[name];

      if (RESULT !== null) {
        const { orderType, orderField } = order[name];

        if (orderType === "ASC")
          RESULT = RESULT.sort((a, b) => {
            if (a[orderField] !== null && b[orderField] !== null) {
              return a[orderField] > b[orderField] ? 1 : -1;
            }
            if (a[orderField] === null && b[orderField] !== null) {
              return -1;
            }
            if (a[orderField] !== null && b[orderField] === null) {
              return 1;
            }
            if (a[orderField] === null && b[orderField] === null) {
              return 1;
            }
          });

        if (orderType === "DESC")
          RESULT = RESULT.sort((a, b) => {
            if (a[orderField] !== null && b[orderField] !== null) {
              return a[orderField] < b[orderField] ? 1 : -1;
            }
            if (a[orderField] === null && b[orderField] !== null) {
              return 1;
            }
            if (a[orderField] !== null && b[orderField] === null) {
              return -1;
            }
            if (a[orderField] === null && b[orderField] === null) {
              return 1;
            }
          });

        this.setState({ [name]: RESULT });
      }
    }

    this.setState({ order: order });
  };

  getOrderArrow = (name, field) => {
    const order = this.state.order ?? {
      [name]: { orderField: null, orderType: "ASC" },
    };

    if (!order.hasOwnProperty(name) || order[name].orderField !== field)
      return null;

    const { orderType } = order[name];

    if (orderType === "ASC")
      return (
        <>
          <i class="ri-sort-asc"></i>
        </>
      );

    if (orderType === "DESC")
      return (
        <>
          <i class="ri-sort-desc"></i>
        </>
      );

    return null;
  };
  //SEARCH ANG PAG ENDS

  setData = () => {
    let CId = this.props.match.params.CaseId;
    const thisId = this.props.match.params.docId;
    const { cases, global } = this.props;
    const { Doc_locations } = global;

    if (global.length === 0 || global === undefined) return null;

    const options = this.props.global.Doc_Types.map((o) => ({
      name: "DOCUMENT_TYPE",
      value: o.DOCUMENT_TYPE,
      label: o.TYPE_DESCRIPTION,
    }));

    const currentCase = cases.find((x) => x.Case_Short_NAME === CId);
    let currentDocument = null;

    if (currentCase !== undefined) {
      currentDocument = currentCase.Case_Documents.find(
        (x) => x.DOC_ID === thisId
      );
    }
    
    const Case_Name = currentCase.Case_Full_NAME;

    // if (Case_Doc_Files !== undefined && Case_Doc_Files.length > 0) {
    //   const Doc_Meta = Case_Doc_Files[0].Meta;
    //   if (Doc_Meta === undefined) return <></>;
    // }

    const Case_Doc_Files = currentDocument.Document_Files.map((x) => {
      const loc = Doc_locations.find((y) => y.File_id === x.File_id && y.Computer_id === "SERVER");

      x.File_name = loc.File_name;
      x.Pages = "-";

      const currentFileMeta = x.Meta.find(
        (x) => x.Param_name === "Page Count" || x.Param_name === "Pages"
      );

      if (currentFileMeta !== undefined && currentFileMeta.hasOwnProperty("Value")) {
        x.Pages = currentFileMeta.Value;
      }

      return x;      
    });
    
    this.setState({DOC_FILES: Case_Doc_Files});
  }

  componentDidMount() {
    this.setData();
  }

  render() {
    const {DOC_FILES} = this.state;

    if(DOC_FILES === null)
      return null;

    if (this.props.personeData === undefined) return <></>;
    let CId = this.props.match.params.CaseId;
    const pData = this.props.personeData;
    if (!PRIVILEGE.check("SHOW_CASE_DOCUMENTS", pData))
      return (
        <>
          <div className="page-content">
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <h5>You don't have permissions to see this page!</h5>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      );

    const thisId = this.props.match.params.docId;
    const { cases, global } = this.props;
    const { Doc_locations } = global;

    if (global.length === 0 || global === undefined) return null;

    const options = this.props.global.Doc_Types.map((o) => ({
      name: "DOCUMENT_TYPE",
      value: o.DOCUMENT_TYPE,
      label: o.TYPE_DESCRIPTION,
    }));

    const currentCase = cases.find((x) => x.Case_Short_NAME === CId);
    let currentDocument = null;

    if (currentCase !== undefined) {
      currentDocument = currentCase.Case_Documents.find(
        (x) => x.DOC_ID === thisId
      );
    }

    const Case_Name = currentCase.Case_Full_NAME;

    const Case_Doc_Files = currentDocument.Document_Files;
    if (Case_Doc_Files !== undefined && Case_Doc_Files.length > 0) {
      const Doc_Meta = Case_Doc_Files[0].Meta;
      if (Doc_Meta === undefined) return <></>;
    }

    return (
      <>
        <div className="">
          <Container fluid className="pageWithSearchTable">
            {/* <Breadcrumbs
              title={`Document  "${currentDocument.DOCUMENT_NAME}"  view of Case "${this.props.match.params.caseId}"`}
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            <h5 className="mb-3">{` Case: ${Case_Name}, document:   "${currentDocument.DOCUMENT_NAME}"`}</h5>

            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col lg={4}>
                        <h6>Document Name:</h6>
                        <p>{currentDocument.DOCUMENT_NAME}</p>
                      </Col>
                      <Col lg={4}>
                        <h6>Description:</h6>
                        <p>{currentDocument.Description}</p>
                      </Col>
                      <Col lg={4}>
                        <h6>Created Date:</h6>
                        <p>{currentDocument.CREATED_DATE}</p>
                      </Col>
                      <Col lg={4}>
                        <h6>Document Type:</h6>
                        <p>{currentDocument.DOCUMENT_TYPE}</p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {PRIVILEGE.check("ADD_DOCUMENT_FILE", pData) && (
                <>
                  <Col lg={12}>
                    <Card>
                      <CardBody>
                        <div className="toolbar d-flex case-toolbar ">
                          <Button
                            color="success"
                            onClick={this.switch_modal}
                            name="add"
                            className="d-flex align-items-center"
                          >
                            <i className="  ri-file-add-line font-size-20 mr-1  auti-custom-input-icon "></i>
                            Add new file
                          </Button>
                          <UploadFile
                            modal={this.state.modal}
                            switch_modal={this.switch_modal}
                            Case_NAME={currentDocument.Case_NAME}
                            DOC_ID={currentDocument.DOC_ID}
                          />

                          {currentDocument.DOCUMENT_NAME !==
                            "Unclassified files" &&
                            currentDocument.DOCUMENT_NAME !== "DEFAULT" && (
                              <>
                                <Button
                                  color="info "
                                  className="ml-1"
                                  name="edit"
                                  onClick={this.edit}
                                  className="d-flex align-items-center ml-3"
                                >
                                  <i className=" ri-pencil-line  font-size-20 mr-1  auti-custom-input-icon "></i>
                                  Edit Document
                                </Button>
                              </>
                            )}
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </>
              )}

              <Col lg={12}>
                <Card>
                  <CardBody>
                    {PRIVILEGE.check("SHOW_CASE_FILES", pData) ? (
                      <>
                        {DOC_FILES.length > 0 && (
                          <>
                            <Row className="mb-2 d-flex align-items-center">
                              <Col className="search-row">
                                <Input
                                  className="table-search"
                                  onChange={this.tableSearch}
                                  type="text"
                                  placeholder="Click to Search"
                                />
                                <i
                                  class="ri-close-line"
                                  onClick={this.clearSearch}
                                ></i>
                              </Col>
                            </Row>
                          </>
                        )}
                            <Table className="customTable">
                              <thead>
                                <tr>
                                  <td
                                    className="order-button"
                                    name="DOC_FILES"
                                    value={"File_name"}
                                    onClick={this.orderBy}
                                  >
                                    File name{" "}
                                    {this.getOrderArrow(
                                      "DOC_FILES",
                                      "File_name"
                                    )}
                                  </td>
                                  <td
                                    className="order-button"
                                    name="DOC_FILES"
                                    value={"Form"}
                                    onClick={this.orderBy}
                                  >
                                    Form{" "}
                                    {this.getOrderArrow("DOC_FILES", "Form")}
                                  </td>
                                  <td
                                    className="order-button"
                                    name="DOC_FILES"
                                    value={"Format"}
                                    onClick={this.orderBy}
                                  >
                                    Format{" "}
                                    {this.getOrderArrow("DOC_FILES", "Format")}
                                  </td>
                                  <td
                                    className="order-button"
                                    name="DOC_FILES"
                                    value={"Pages"}
                                    onClick={this.orderBy}
                                  >
                                    Page count{" "}
                                    {this.getOrderArrow("DOC_FILES", "Pages")}
                                  </td>
                                  <td
                                    className="order-button"
                                    name="DOC_FILES"
                                    value={"CREATED_DATE"}
                                    onClick={this.orderBy}
                                  >
                                    Created date{" "}
                                    {this.getOrderArrow(
                                      "DOC_FILES",
                                      "CREATED_DATE"
                                    )}
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {DOC_FILES.length > 0 ?
                                  this.searchFilter(DOC_FILES).map((x) => (
                                    <>
                                      <tr>
                                        <td>
                                          <NavLink
                                            to={`/app/case-explorer/file/${x.File_id}`}
                                            data-tip
                                            data-for={x.File_id}
                                            className="d-flex align-items-center table-link"
                                          >
                                            {x.File_name}
                                            <ReactTooltip id={x.File_id} className="previewFaile">
                                              <div>
                                                <img
                                                  src={`${SERVER + x.Preview_img}`}
                                                  alt="Error"
                                                />
                                              </div>
                                            </ReactTooltip>
                                          </NavLink>
                                        </td>
                                        <td>{x.Form}</td>
                                        <td>{x.Format}</td>
                                        <td>{x.Pages}</td>
                                        <td>{x.CREATED_DATE}</td>
                                      </tr>
                                    </>
                                  ))
                                  :
                                    (<>
                                      <tr>
                                        <td colSpan={5}>
                                          Files list is empty
                                        </td>
                                      </tr>
                                    </>)
                                }
                              </tbody>
                            </Table>
                      </>
                    ) : (
                      <>
                        <h5>
                          You don't have permissions to see document files
                        </h5>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <>
              <Modal
                // size="xl"
                isOpen={this.state.edit}
                switch={this.edit}
                centered={true}
              >
                <ModalHeader toggle={this.edit} className="text-center">
                  Edit {currentDocument.DOCUMENT_NAME}
                </ModalHeader>
                <ModalBody toggle={() => this.setState({ modal: false })}>
                  <AvForm onValidSubmit={this.editDocument}>
                    <Row>
                      <Col lg={12}>
                        <FormGroup className="auth-form-group-custom mb-4">
                          <i className=" ri-hashtag auti-custom-input-icon"></i>
                          <Label htmlFor="username">Document name </Label>
                          <AvField
                            name="DOCUMENT_NAME"
                            value={currentDocument.DOCUMENT_NAME}
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
                        <FormGroup className="mb-4 mt-2">
                          <Label htmlFor="billing-address">Description</Label>
                          <textarea
                            className="form-control custom-textarea"
                            id="Description"
                            rows="3"
                            name="Description"
                            defaultValue={currentDocument.Description}
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
                          defaultValue={options.find(
                            (x) => x.value === currentDocument.DOCUMENT_TYPE
                          )}
                        />
                      </Col>
                      <Col lg={12}>
                        <FormGroup className="mb-4 mt-2">
                          <Label htmlFor="FILED_DATE">FILED DATE</Label>
                          <AvField
                            name="FILED_DATE"
                            type="date"
                            value={this.state.editDocData.FILED_DATE}
                            // defaultValue={currentDocument.FILED_DATE}
                            id="FILED_DATE"
                            onChange={this.handleChange}
                            className="w-100"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="buttons_bar d-flex align-items-center justify-content-end">
                      <Button color="success" className="mr-3" type="submit">
                        Accept
                      </Button>
                      <Button
                        color="danger"
                        type="button"
                        onClick={this.closeModal}
                      >
                        Cancel
                      </Button>
                    </div>
                  </AvForm>
                </ModalBody>
                <ModalFooter></ModalFooter>
              </Modal>
            </>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    personeData: state.User.persone,
    global: state.User.globalData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView);
