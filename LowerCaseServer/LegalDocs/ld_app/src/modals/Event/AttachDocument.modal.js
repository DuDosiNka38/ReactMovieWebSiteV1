import React, { Component, Suspense, lazy, AvField } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, Table, Spinner, Label, Input } from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "../../store/modal/actions";
import DocsApi from "./../../api/DocsApi";
import notification from "./../../services/notification";
import * as PreloaderActions from "../../store/preloader/actions";
import DocumentBlock from "../../components/Documents/DocumentBlock";
import AvForm from "availity-reactstrap-validation/lib/AvForm";
import AvCheckboxGroup from "availity-reactstrap-validation/lib/AvCheckboxGroup";
import AvCheckbox from "availity-reactstrap-validation/lib/AvCheckbox";
import Pagination from "../../services/Pagination/pagination";

class AttachDocument extends Component {
  state = {
    isInit: false,
    Documents: [],
    DocumentsLenght: 0,
    Attached: [],
    limit: 10,
    offset: 0,
    Search: "",
  };

  request = {
    like: null,
    where: {Case_NAME: this.props.Case_NAME},
    whereIn: [],
    whereBetween: [],
    limit: 9,
    offset: 0,
    order: {
      field: "CREATED_DATE",
      type: "ASC",
    },
  };

  attach = (DOC_ID) => {
    const Attached = Object.assign(this.state.Attached);
    Attached.push(DOC_ID);

    this.setState({ Attached });
  };

  disattach = (DOC_ID) => {
    const Attached = Object.assign(this.state.Attached);

    this.setState({ Attached: Attached.filter((x) => x !== DOC_ID) });
  };

  submitAttach = () => {
    const { Attached, Documents } = this.state;
    const { Case_NAME, Activity_Name} = this.props;

    const Docs = Documents.filter((x) => Attached.includes(x.DOC_ID)).map((x) => ({
      DOCUMENT_NAME: x.DOCUMENT_NAME,
      DOC_ID: x.DOC_ID,
      Activity_Name,
      Case_NAME,
      Relation_type: null,
    }))

    this.props.showModal("CHOOSE_DOCS_RELATION", {
      Documents: Docs,
      onClose: () => {
        this.props.hideModal(this.props.type);
      },
      onSuccess: () => {
        const { onSuccess } = this.props;
        if(onSuccess && typeof onSuccess === "function"){
          onSuccess();
        }
      }
    });
  }

  handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  clearInput = () => {
    this.setState({ Search: "" });
  };

  getFilteredDocuments = () => {
    const { Attached, Documents, limit, offset, Search } = this.state;
    const Docs = Documents.filter((x) => !Attached.includes(x.DOC_ID)).filter(
      (x) => Search === "" || x.DOCUMENT_NAME.indexOf(Search) !== -1
    );
    const Part = Docs.slice(offset, offset + limit);
    return { All: Docs, Page: Part, allLength: Docs.length, pageLength: Part.length };
  };

  onPageChanged = async (data) => {
    const { currentPage, totalPages, pageLimit, name } = data;
    const offset = currentPage > 0 ? (currentPage - 1) * pageLimit : 0;
    const limit = pageLimit;
    this.setState({ limit, offset });
  };

  async componentDidMount() {
    // console.log(this.props)
    const AlreadyAttached = this.props.Attached;
    const response = await DocsApi.fetchFilteredDocuments(this.request);

    this.setState({ isInit: true, Documents: response.data.filter((x) => !AlreadyAttached.includes(x.DOC_ID)), DocumentsLenght: response.lenght });
  }

  render() {
    const { isInit, Documents, Attached, limit, offset } = this.state;

    const filteredDocuments = this.getFilteredDocuments();

    return (
      <>
        <>
          <Modal isOpen={true} centered={true} className="delete-case-modal" size="xl">
            <ModalHeader className="d-flex align-items-center justify-content-center" toggle={this.props.hideModal}>
              Attach Documents
            </ModalHeader>
            <ModalBody className="w-100 scrollable-modal confirm-modal d-flex align-items-start justify-content-between">
              {isInit ? (
                <>
                  <div className="w-75">
                    <div className="position-relative attach-docs-search">
                      <i class="ri-search-2-line"></i>
                      <Label htmlFor="Search" className="input-label">
                        Search
                      </Label>
                      <Input
                        name="Search"
                        type="text"
                        className="form-control mb-0"
                        id="Search"
                        // value={this.state.Search}
                        placeholder="Type to search..."
                        onChange={this.handleInputChange}
                      />
                      <i class="ri-close-line" style={{ left: "auto", right: "10px" }} onClick={this.clearInput}></i>
                    </div>
                    <div>
                      {filteredDocuments.allLength} documents found
                    </div>
                    <Pagination
                      name="Documents"
                      totalRecords={filteredDocuments.allLength}
                      pageNeighbours={1}
                      pageLimit={limit}
                      onPageChanged={this.onPageChanged}
                      markupPosition={["bottom"]}
                      size="s"
                      onlyPages={true}
                    >
                      <Table className="customTable mb-0">
                        <thead>
                          <tr>
                            <td colSpan={2}>Document Name</td>
                            <td>Created Date</td>
                          </tr>
                        </thead>
                        <tbody>
                          {Boolean(filteredDocuments.allLength) ? (
                            <>
                              {filteredDocuments.Page.map((Doc) => (
                                <tr>
                                  <td>
                                    <i
                                      className="ri-add-circle-line cursor-pointer"
                                      onClick={() => this.attach(Doc.DOC_ID)}
                                    ></i>
                                  </td>
                                  <td>{Doc.DOCUMENT_NAME}</td>
                                  <td>{Doc.CREATED_DATE}</td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <>
                              <tr>
                                <td colSpan={3}>Documents list is unset.</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </Table>
                    </Pagination>
                  </div>
                  <div className="w-25 h-100 ml-3" style={{ minHeight: "100%" }}>
                    <div className="selected-documents-block">
                      <div className="block-title AccentFont">Selected Documents ({Attached.length})</div>
                      <div className="block-content">
                        {Attached.map((DOC_ID) => {
                          const Doc = Documents.find((x) => x.DOC_ID === DOC_ID);

                          if (!Doc) return null;

                          return (
                            <>
                              <div className="block-item">
                                <i
                                  class="ri-close-line mr-2 cursor-pointer"
                                  onClick={() => this.disattach(DOC_ID)}
                                  title={Doc.DOCUMENT_NAME}
                                ></i>{" "}
                                {Doc.DOCUMENT_NAME}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-center p-5 w-100">
                    <Spinner size="m" />
                  </div>
                </>
              )}
            </ModalBody>
            <ModalFooter className="mfooterGTO">
              <Button className="ld-button-success" type="submit" onClick={this.submitAttach} disabled={Attached.length === 0}>
                {Attached.length ? "Choose Relation Type for Selected Documents" : "Select documents at first!"}
              </Button>
            </ModalFooter>
          </Modal>
        </>
      </>
    );
  }
}
const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("ATTACH_DOCUMENT")),
    hide: () => dispatch(PreloaderActions.hidePreloader("ATTACH_DOCUMENT")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AttachDocument);
