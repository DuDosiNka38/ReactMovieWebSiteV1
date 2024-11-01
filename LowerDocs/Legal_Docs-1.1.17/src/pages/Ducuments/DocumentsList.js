import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  CardBody,
  Card,
  Button,
} from "reactstrap";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import { NavLink } from "react-router-dom";
import PRIVILEGE from "../../services/privileges";
const { SearchBar, ClearSearchButton } = Search;

class DocumentsList extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "Departments", link: "#" },
    ],
  };

  componentDidMount() {
    this.props.onCaseLoad();
  }

  addedLinkToCell = (cell, row, rowIndex, formatExtraData) => {
    return (
      <>
        <NavLink to={`/app/case-explorer/case/${this.props.match.params.caseId}/document/${cell}`}>
          <Button color="primary" className="p-0 m-0 w-100">
            View
          </Button>
        </NavLink>
      </>
    );
    // this.setState({})
  };
  render() {
    if(this.props.personeData === undefined)
            return (<></>);

    const pData = this.props.personeData;
    const { cases } = this.props;
    const { caseId } = this.props.match.params;

    const currentCase = cases.find((x) => x.Case_Short_NAME === caseId);
    const ccName = currentCase.Case_Full_NAME;
    if (currentCase === undefined) {
      return <></>;
    }
    const showDocs = currentCase.Case_Documents;

    const columns = [
      {
        dataField: "DOC_ID",
        text: "",
        formatter: this.addedLinkToCell,
      },
      {
        dataField: "DOCUMENT_NAME",
        text: "Document Name",
      },
      {
        dataField: "DOCUMENT_TYPE",
        text: "Document Type",
      },
      {
        dataField: "CREATED_DATE",
        text: "Created Date",
      },
      {
        dataField: "Description",
        text: "Description",
      },
      {
        dataField: "Author_id",
        text: "Author",
      },
    ];

    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <div className="btn-group" role="group">
        {options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? "btn-secondary" : "btn-light"}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    );

    const pagination = {
      sizePerPageRenderer,
    };


    return (
      <>
        <div className="">
          <Container fluid>
            {/* <Breadcrumbs
              title={caseId + " " + "Case " + "Documents"}
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
<h5 className="mb-3">{ccName + " " + "Documents"}</h5>

            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    {PRIVILEGE.check("SHOW_CASE_DOCUMENTS", pData) ?
                      <>
                      
                        <div className="some-table">
                        <ToolkitProvider
                            keyField="DOC_ID"
                            data={showDocs}
                            columns={columns}
                            className="striped"
                            search
                          >
                            {(props) => (
                              <div>
                                <Row className="d-flex align-items-center justify-content-between">
                                  <Col lg="11">
                                    <SearchBar
                                      className="mb-3"
                                      onChang={this.handleChange}
                                      {...props.searchProps}
                                      style={{ width: "400px", height: "40px" }}
                                    />
                                  </Col>

                                  <Col
                                    lg={1}
                                    className="d-flex justify-content-end mb-4"
                                  >
                                    <ClearSearchButton
                                      {...props.searchProps}
                                      className="btn btn-info"
                                    />
                                  </Col>
                                </Row>
                                <div className="">
                                  <BootstrapTable
                                    {...props.baseProps}
                                    filter={filterFactory()}
                                    noDataIndication="There is no solution"
                                    pagination={showDocs.length > 10 && paginationFactory(pagination) }
                                    striped
                                    hover
                                    condensed
                                    className="striped"
                                  />
                                </div>
                              </div>
                            )}
                          </ToolkitProvider>
                        </div>
                      </>
                      :
                      <>
                        <h5>You dont have permissions to see documents</h5>
                      </>
                    }
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    events: state.User.localEvents,
    docs: state.User.localDocument,
    personeData: state.User.persone,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onCaseLoad: () => dispatch(actions.getCase()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsList);
