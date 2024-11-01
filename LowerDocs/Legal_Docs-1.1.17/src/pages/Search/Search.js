import React, { Component } from "react";
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Label,
  FormGroup,
  Table,
  CardHeader,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Select from "react-select";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { NavLink } from "react-router-dom";
import axios from "./../../services/axios";
import noteWindow from "../../services/notifications";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import ReactTooltip from "react-tooltip";

const SERVER = axios.defaults.baseURL;

class Search extends Component {
  state = {
    breadcrumbItems: [
      { title: "Legal Docs", link: "/" },
      { title: "Search", link: "#" },
    ],
    searchResult: {},
    searchParams: {},
    visibleFields: {},

    addFilter: {},

    MODAL_ACTION: null,
    modal: false,
  };
  searchQuery = this.searchQuery.bind(this);

  handleChange = (el) => {
    const { searchParams } = this.state;
    const { name, value } = el.currentTarget;

    searchParams[name] = value;

    this.setState({ searchParams });
  };

  onSelectChange = (e, el) => {
    const { value, icon } = e;
    const { name } = el;
    const { addFilter } = this.state;

    addFilter[name] = value;
    addFilter.icon = icon;

    this.setState({addFilter});
  };

  onMultiSelectChange = (e, el) => {
    const { name } = el;
    const { addFilter } = this.state;

    addFilter[name] = e;

    this.setState({addFilter});
  };

  addSearchFilter = () => {
    const { addFilter, searchParams } = this.state;

    searchParams.push({
      table: addFilter.category,
      icon: addFilter.icon,
      fields: addFilter.fields
    });

    this.setState({searchParams, addFilter: {}});

    this.switch_modal();
  }

  async searchQuery() {
    const { searchParams } = this.state;

    console.log(searchParams)
    noteWindow.loading("Searching...");

    axios.post("/api/search/search", searchParams).then((r) => {
      this.setState({searchResult: r.data});
      noteWindow.clear();
    });
  }

  switch_modal = (action) => {
    const { MODAL_ACTION } = this.state;
    this.setState((prevState) => ({
      MODAL_ACTION: action,
      modal:
        action === undefined || action === MODAL_ACTION
          ? !prevState.modal
          : true,
    }));

    this.render();
  };

  render() {
    const { cases, CaseStatuses, casesTypes, departments } = this.props;
    const { searchParams, MODAL_ACTION, modal, addFilter, searchResult } = this.state;

    const searchOptions = [
      {label: "Cases", value: "Cases", icon:"ri-briefcase-4-line"},
      {label: "Case Documents", value: "Documents", icon:"ri-draft-line"},
      {label: "Case Events", value: "Events", icon:'ri-calendar-todo-line'},
      {label: "Document Files", value: "Files", icon:"ri-file-copy-2-line"},
    ]

    const tableFields = {
      "Cases": [
        {label: "Short name", value: "Case_Short_NAME"},
        {label: "Full name", value: "Case_Full_NAME"},
        {label: "Number", value: "Case_Number"},
        {label: "Description", value: "DESCRIPTION"},
        {label: "Type", value: "Case_Type"}
      ],
      "Documents" :[
        {label: "Type", value: "DOCUMENT_TYPE"},
        {label: "Name", value: "DOCUMENT_NAME"},
        {label: "Description", value: "Description"},
        {label: "Case", value: "Case_NAME"},
        {label: "Author", value: "Author_id"},
      ],
      "Events" :[
        {label: "Case", value: "Case_NAME"},
        {label: "Name", value: "Activity_Title"},
        {label: "Type", value: "Activity_Type"},
        {label: "Comments", value: "Comments"}
      ],
      "Files":[
        {label: "Name", value: "File_name"},
        {label: "Text", value: "File_text"},
      ]
    };

    return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="Search"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            <h5 className="mb-3">Search</h5>
            
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <AvForm onValidSubmit={this.searchQuery}>
                      <FormGroup className="auth-form-group-custom mb-4">
                        <i className=" ri-search-line auti-custom-input-icon"></i>
                        <Label htmlFor="username">Search</Label>
                        <AvField
                          name="searchText"
                          value={searchParams.searchText}
                          type="search"
                          className="form-control"
                          id="search"
                          placeholder="Type text to search"
                          onChange={this.handleChange}
                          style={{paddingRight: "15px"}}
                        />
                      </FormGroup>
                      {/* <Row>
                        <Col lg={12}>
                          <div className="searchFilters mb-3">
                            <h6>Search Filters</h6>
                            <Row>
                              <Col lg={3} className="searchFieldsBlock mb-3">
                                <div className="addSearchFilter" onClick={() => this.switch_modal("ADD_SEARCH_FILTER")}>
                                <i class="ri-filter-2-line"></i> Add filter
                                </div>
                              </Col>
                              {searchParams.map((row) => (
                                <>
                                {
                                console.log(row)}
                                  <Col lg={3} className="searchFieldsBlock mb-3">
                                    <div>
                                      <Label className="w-100"><i className={row.icon}></i> {row.table}</Label>
                                      <div style={{fontWeight: "100", textTransform:"uppercase"}}>Search fields:</div>
                                      <div>{row.fields.map((x) => (x.label)).join(", ")}</div>
                                    </div>                                    
                                  </Col>
                                </>
                              ))}
                              
                            </Row>
                            
                          </div>
                        </Col> 
                      </Row> */}
                      <Button type="submit" color="success" className="w-100">
                        Search...
                      </Button>
                    </AvForm>
                  </CardBody>
                </Card>
              </Col>
              {searchResult.Cases !== undefined  && searchResult.Cases.length > 0 &&
                <>
                  <Col lg={12}>
                    <Card>
                      <CardBody>
                      <h5 className="h5">Founded Cases ({searchResult.Cases.length})</h5>

                      <Table className="customTable">
                        <thead>
                          <tr>
                            <td></td>
                            <td>Short Name</td>
                            <td>Full Name</td>
                            <td>Case Number</td>
                            <td>Case Type</td>
                            <td>Description</td>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResult.Cases.map((c) => (
                            <>
                              <tr>
                                <td><NavLink to={`/app/case-explorer/single-case/${c.Case_Short_NAME}`}>Show</NavLink></td>
                                <td>{c.Case_Short_NAME}</td>
                                <td>{c.Case_Full_NAME}</td>
                                <td>{c.Case_Number}</td>
                                <td>{c.Case_Type}</td>
                                <td>{c.DESCRIPTION}</td>
                              </tr>
                            </>
                          ))}                        
                        </tbody>
                      </Table>
                      </CardBody>
                    </Card>
                    
                  </Col>
                </>
              }     
              {searchResult.Documents !== undefined  && searchResult.Documents.length > 0 &&
                <>
                  <Col lg={12}>
                    <Card>
                      <CardBody>
                      <h5 className="h5">Founded Documents ({searchResult.Documents.length})</h5>

                      <Table className="customTable">
                        <thead>
                          <tr>
                            <td> </td>
                            <td>Document Name</td>
                            <td>Document Type</td>
                            <td>Case Name</td>
                            <td>Author</td>
                            <td>Created Date</td>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResult.Documents.map((c) => (
                            <>
                              <tr>
                                <td>
                              <NavLink
                                to={`/app/case-explorer/case/${c.Case_NAME}/document/${c.DOC_ID}`}
                                className="align-items-center justify-content-between doc_card"
                              >Show</NavLink></td>
                                <td>{c.DOCUMENT_NAME}</td>
                                <td>{c.DOCUMENT_TYPE}</td>
                                <td>{cases.find((x) => x.Case_Short_NAME === c.Case_NAME).Case_Full_NAME}</td>
                                <td>{c.Author_id}</td>
                                <td>{c.CREATED_DATE}</td>
                              </tr>
                            </>
                          ))}                        
                        </tbody>
                      </Table>
                      </CardBody>
                    </Card>
                    
                  </Col>
                </>
              }  
              {searchResult.Events !== undefined  && searchResult.Events.length > 0 &&
                <>
                  <Col lg={12}>
                    <Card>
                      <CardBody>
                      <h5 className="h5">Founded Events ({searchResult.Events.length})</h5>

                      <Table className="customTable">
                        <thead>
                          <tr>
                            <td> </td>
                            <td>Event Name</td>
                            <td>Event Type</td>
                            <td>Case Name</td>
                            <td>Responsible Person</td>
                            <td>Event Date</td>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResult.Events.map((c) => (
                            <>
                              <tr>
                                <td>
                              <NavLink
                                to={`/app/case-explorer/case/${c.Case_NAME}/event/${c.Activity_Name}`}
                                className="align-items-center justify-content-between doc_card"
                              >Show</NavLink></td>
                                <td>{c.Activity_Name}</td>
                                <td>{c.Activity_type}</td>
                                <td>{cases.find((x) => x.Case_Short_NAME === c.Case_NAME).Case_Full_NAME}</td>
                                <td>{c.Responsible_Person_id}</td>
                                <td>{c.Tentative_date}</td>
                              </tr>
                            </>
                          ))}                        
                        </tbody>
                      </Table>
                      </CardBody>
                    </Card>
                    
                  </Col>
                </>
              } 
              {searchResult.Files !== undefined  && searchResult.Files.length > 0 &&
                <>
                  <Col lg={12}>
                    <Card>
                      <CardBody>
                      <h5 className="h5">Founded Files ({searchResult.Files.length})</h5>

                      <Table className="customTable">
                        <thead>
                          <tr>
                            <td> </td>
                            <td>File Name</td>
                            <td>Page Number</td>
                            <td>Format</td>
                            <td>Form</td>
                            <td>Case Name</td>
                            <td>Created date</td>
                            <td>Loaded date</td>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            let prevId = null;
                            let isEqual = false;
                            return searchResult.Files.map((f) => {
                              if(f.File_id === prevId)
                                isEqual = true;

                              prevId = f.File_id;

                              return (
                              <>
                                <tr>
                                  <td style={{opacity: isEqual === true ? 0 : 1}}>
                                <NavLink
                                  to={`/app/case-explorer/file/${f.File_id}`}
                                  className="align-items-center justify-content-between doc_card"
                                >Show</NavLink></td>
                                  <td style={{opacity: isEqual === true ? 0 : 1}}>
                                    <NavLink to="#" data-tip 
                                              data-for={f.File_id}
                                              className="d-flex align-items-center table-link">
                                    {f.Locations.find((x) => x.Computer_id === "SERVER").File_name}
                                    <ReactTooltip id={f.File_id} className="previewFaile">
                                      <div>
                                        <img
                                          src={`${SERVER + f.Preview_img}`}
                                          alt="Error"
                                        />
                                      </div>
                                    </ReactTooltip></NavLink>
                                  </td>
                                  <td>{f.Page_number}</td>
                                  <td>{f.Format}</td>
                                  <td>{f.Form}</td>
                                  <td>{cases.find((x) => x.Case_Short_NAME === f.Case_NAME).Case_Full_NAME}</td>
                                  <td>{f.CREATED_DATE}</td>
                                  <td>{f.loaded_dt}</td>
                                </tr>
                              </>
                              );
                            })
                          })()}                                                 
                        </tbody>
                      </Table>
                      </CardBody>
                    </Card>
                    
                  </Col>
                </>
              }               
            </Row>


            {MODAL_ACTION === "ADD_SEARCH_FILTER" && (
              <>
                <Modal isOpen={modal} centered={true} size="l">
                  <ModalHeader
                    toggle={() => this.setState({ modal: false })}
                    className="text-center"
                  >
                    Add search filter
                  </ModalHeader>
                  <ModalBody>
                    <FormGroup>
                      <Label>Search in</Label>
                      <Select
                        name="category"
                        options={searchOptions.filter((x) => !searchParams.map((y) => y.table).includes(x.value))}
                        closeMenuOnSelect={true}
                        onChange={this.onSelectChange}
                      />
                    </FormGroup>
                    {
                      console.log(tableFields[addFilter.category], tableFields, addFilter)
                    }
                    {addFilter.category !== undefined && addFilter.category !== null && 
                      <>
                        <FormGroup>
                          <Label>Search fields</Label>
                          <Select
                            name="fields"
                            options={tableFields[addFilter.category]}
                            closeMenuOnSelect={false}
                            isMulti={true}
                            onChange={this.onMultiSelectChange}
                          />
                        </FormGroup>
                      </>
  }
                    
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success"  onClick={this.addSearchFilter}>
                      Add
                    </Button>
                  </ModalFooter>
                </Modal>
              </>
            )}
          </Container>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    CaseStatuses: state.User.CaseStatuses,
    casesTypes: state.User.casesTypes,
    departments: state.User.depatmentsData.departments,
  };
};
const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Search);
