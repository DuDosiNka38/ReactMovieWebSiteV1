import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import {NavLink} from 'react-router-dom'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import BootstrapTable, {TableHeaderColumn} from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory, {Type} from "react-bootstrap-table2-editor";
import CasePersonalView from "../../components/CasePersonal/CasePersonalView";
import Calendar from "./../../components/Calendar"

const { SearchBar, ClearSearchButton } = Search;

class SingleCaseView extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "All Cases", link: "/allcases" },
      { title: "Case ", link: "#" },
    ],
  };

  getCaseFromArray(ar, el) {
    let sCase = [];
    ar.forEach((e) => {
      if (e.Case_Short_NAME != undefined && e.Case_Short_NAME == el) {
        sCase = e;
      }
    });
    return sCase;
  }

  render() {
    let caseData = this.getCaseFromArray(
      this.props.cases,
      this.props.match.params.caseId
    );
    let caseDocs = [];
    let caseLocation = null
    if (caseData.hasOwnProperty("Case_Documents")) {
      caseDocs = caseData.Case_Documents.result_data;
    }

    function addedLinkToCell (cell, row, rowIndex, formatExtraData) {
      return (
        <NavLink to={`/file/${cell}`}>
              <Button>{ cell }</Button>CREATED_DATE
        </NavLink>
      );
    
    }
 
     const columns = [
        {
          dataField: "DOCUMENT_NAME",
          text: "Document name",
          formatter: addedLinkToCell,
          sort: true,
        },
        {
          dataField: "CREATED_DATE",
          text: "Created data",
          sort: true,
        },
        {
          dataField: "Description",
          text: "Description",
        },
      
      ];
    return (
      <>
        <div className="page-content">
          <Container fluid>
        <Breadcrumbs */}
            <Row>
              <Col lg={12}>
                <p>{caseData.Case_Full_NAME}</p>
              </Col>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    {Array.isArray(caseDocs) ? (
                      <ToolkitProvider
                        bootstrap4
                        keyField="DOC_ID"
                        data={caseDocs}
                        columns={columns}
                        cellEdit={ cellEditFactory({ mode: 'click' }) }
                        search
                      >
                        {(props) => (
                          <div>
                            <Row >
                              <Col lg="8">
                              <SearchBar
                              className="mb-3"
                              onChang={this.handleChange}
                              {...props.searchProps}
                              style={{ width: "400px", height: "40px" }}
                            />
                              </Col>
                             <Col lg={4} >
                             <ClearSearchButton { ...props.searchProps }  className = "btn btn-info" />
                             </Col>
                            </Row>
                            <BootstrapTable
                              {...props.baseProps}
                              filter={filterFactory()}
                              noDataIndication="There is no solution"
                              striped
                              hover
                              condensed
                              
                            />
                          </div>
                        )}
                      </ToolkitProvider>
                    ) : (
                      <p>Sory, but files not found...</p>
                    )}
                  </CardBody>
                </Card>
                <Calendar/>
              </Col>
                      
              <Col lg={4}>
                <CasePersonalView/>
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onCaseLoad: () => dispatch(actions.getCase()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleCaseView);
