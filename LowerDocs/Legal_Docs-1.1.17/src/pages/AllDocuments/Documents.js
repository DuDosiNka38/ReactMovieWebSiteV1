import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button, Input } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import AddDocument from "./../../components/Document/AddDocument";
import Pagination from "./../../services/pagination";
class Documents extends Component {
  state = {
    doc_modal: false,

    tableSearch: "",
    searchFields: [],
    tablePagination: {},
  };
  switch_doc_modal = (e) => {
    this.setState((prevState) => ({
      doc_modal: !prevState.doc_modal,
    }));
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


    if (tablePagination.hasOwnProperty(name) && data.length > tablePagination[name].pageLimit) {
      const { offset, pageLimit } = tablePagination[name];

      RESULT = RESULT.slice(offset, offset + pageLimit);
    }

    return RESULT;
  };

  onPageChanged = (data) => {
    let { tablePagination } = this.state;
    const { currentPage, totalPages, pageLimit, name } = data;
    let offset = (currentPage - 1) * pageLimit;
    if(offset < 0) 
      offset = 0;

    tablePagination[name] = {
      currentPage: currentPage,
      offset: offset,
      totalPages: totalPages,
      pageLimit: pageLimit,
    };

    this.setState({ tablePagination: tablePagination });
  };
  //SEARCH ANG PAG ENDS

  render() {
    const { cases } = this.props;
    let docs = [];
    cases.map((x) => {
      docs = docs.concat(x.Case_Documents);
    });

    const sortedDocs = docs.sort((a, b) => (a.DOC_ID < b.DOC_ID ? 1 : -1));

    return (
      <>
        <div className="page-content">
          <Container fluid className="pageWithSearchTable">
            <h5 className="d-flex justify-content-between">
              All Documents ({sortedDocs.length})
            </h5>
            <Card>
              <CardBody>
                <Row className="d-flex justify-content-between align-items-center toolbar case-toolbar">
                  <Col>
                    <Button
                      color="success"
                      className="d-flex align-items-center w-100 text-center"
                      style={{ height: "38px", justifyContent: "center" }}
                      onClick={() =>
                        this.setState((prevState) => ({
                          doc_modal: !prevState.doc_modal,
                        }))
                      }
                    >
                      <i className="ri-file-add-line font-size-20 mr-1  auti-custom-input-icon "></i>
                      Add Document
                    </Button>
                  </Col>
                  <Col lg={10}>
                    <div className="search-row">
                      <Input
                        className="table-search"
                        onChange={this.tableSearch}
                        type="text"
                        placeholder="Click to Search"
                        value={this.state.tableSearch}
                      />
                      <i class="ri-close-line" onClick={this.clearSearch}></i>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row className="mb-3">
              {this.getPageRows("Documents", this.searchFilter(sortedDocs)).map((x) => (
                <Col lg={4} className="doc_block">
                  <NavLink
                          to={`/app/case-explorer/case/${x.Case_NAME}/document/${x.DOC_ID}`}
                          className="align-items-center justify-content-between doc_card"
                        >
                  <Card
                    style={{
                      borderLeftStyle: "solid",
                      borderLeftColor: cases.find(
                        (y) => y.Case_Short_NAME === x.Case_NAME
                      ).CaseBg,
                      borderLeftWidth: "3px",
                    }}
                  >
                    <CardBody>
                      <div className="doc_title">                        
                          {x.DOCUMENT_NAME}
                      </div>
                      <div className="doc_info">
                        <Row className="doc_row">
                          <Col lg={4}>Created date: </Col>
                          <Col lg={8}>{x.CREATED_DATE}</Col>
                        </Row>
                        <Row className="doc_row">
                          <Col>Filed date: </Col>
                          <Col lg={8}>{x.FILED_DATE ?? "Not filed yet"}</Col>
                        </Row>
                        <Row className="doc_row">
                          <Col lg={4}>Description: </Col>
                          <Col lg={8}>{x.Description}</Col>
                        </Row>
                        <Row className="doc_row">
                          <Col lg={4}>Case: </Col>
                          <Col lg={8}>
                            <NavLink
                              to={`/app/case-explorer/single-case/${x.Case_NAME}`}
                              className="d-flex align-items-center justify-content-between"
                            >
                              {
                                cases.find(
                                  (y) => y.Case_Short_NAME === x.Case_NAME
                                ).Case_Full_NAME
                              }
                            </NavLink>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                  </NavLink>
                </Col>
              ))}
              <AddDocument
                modal={this.state.doc_modal}
                switch_modal={this.switch_doc_modal}
                whereopen="inside_docs"
                // keywords={this.props.keywords}
              ></AddDocument>
            </Row>
            <Card>
              <CardBody>
                <Pagination
                  name="Documents"
                  totalRecords={this.searchFilter(sortedDocs).length}
                  pageNeighbours={1}
                  pageLimit={12}
                  onPageChanged={this.onPageChanged}
                />
              </CardBody>
            </Card>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    keywords: state.User.globalKeywords,
  };
};
// const mapDispatchToProps = (dispatch) => {
//   return {
//     setCaseId: () => dispatch(actions.setLocalDocuments (idC)),
//   };
// };

export default connect(mapStateToProps, null)(Documents);
