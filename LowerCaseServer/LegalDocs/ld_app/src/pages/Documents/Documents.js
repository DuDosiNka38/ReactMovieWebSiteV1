import React, { Component, Suspense } from "react";
import { Container, Row, Col, Card, CardBody, Button, Input, CardHeader, FormGroup, Label } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import AddDocumentModal from "../../modals/Documents/AddDocumentModal";
import PageHeader from "./../../components/PageHader/PageHeader";
import TrotlingBlocks from "../../components/StyledComponents/TrotlingBlocks";
import PageFilters from "../../components/FormComponents/PageFilters/PageFilters";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";
import * as PersonnelActions from "./../../store/personnel/actions";
import * as DocsActions from "./../../store/documents/actions";
import * as PreloaderActions from "../../store/preloader/actions";

import DocApi from "./../../api/DocsApi";
import DocumentBlock from "../../components/Documents/DocumentBlock";
import Pagination from "../../services/Pagination/pagination";
import Preloader from "../../store/preloader/reducer";
import { setCurrentCase } from "../../store/case/functions/userCases";

const md5 = require("md5");

class Documents extends Component {
  state = {
    DocsData: [],
    DocsDataCache: {},
    DocsDataLength: 0,
  };

  isLoadedFromCache = false;

  request = {
    like: null,
    where: {},
    whereIn: [],
    whereBetween: [],
    limit: 9,
    offset: 0,
    order: {
      field: "CREATED_DATE",
      type: "ASC",
    },
  };

  defaults = {
    like: [],
    where: {},
    whereIn: [],
    whereBetween: [],
    order: {
      field: "CREATED_DATE",
      type: "ASC",
    },
  };

  submitDocsFilter = async (data) => {
    const { DOCUMENT_KEYWORDS, DOCUMENT_NAME, DOCUMENT_TEXT, Case_Short_NAME, Person_id, CREATED_DATE, Order_By, Activity_Title, Comments } = data;
    

    this.request = { ...this.request, ...this.defaults };

    if (DOCUMENT_NAME) {
      this.request.like = [...this.request.like, { field: "DOCUMENT_NAME", value: DOCUMENT_NAME }];
    }

    if (DOCUMENT_KEYWORDS) {
      this.request.like = [...this.request.like, { field: "KEYWORDS", value: DOCUMENT_KEYWORDS }];
    }

    if (DOCUMENT_TEXT) {
      this.request.like = [...this.request.like, { field: "Text", value: DOCUMENT_TEXT }];
    }

    if (Activity_Title) {
      this.request.like = [...this.request.like, { field: "Activity_Title", value: Activity_Title }];
    }

    if (Comments) {
      this.request.like = [...this.request.like, { field: "Comments", value: Comments }];
    }

    if(!this.props.match.params.Case_Short_NAME){
      if (Case_Short_NAME) {
        this.request.whereIn = [...this.request.whereIn, { field: "Case_NAME", values: Case_Short_NAME }];
      } else {
        console.log({cases: this.props.cases})
        this.request.whereIn = [...this.request.whereIn, { field: "Case_NAME", values: this.props.cases.map((x) => (x.Case_Short_NAME))}];
      }
    }
    

    if (Person_id) {
      this.request.whereIn = [...this.request.whereIn, { field: "Person_id", values: Person_id }];
    }

    if (CREATED_DATE) {
      this.request.whereBetween = [
        ...this.request.whereBetween,
        { field: "CREATED_DATE", values: [CREATED_DATE.start, CREATED_DATE.end] },
      ];
    }

    if (Order_By) {
      this.request.order = {
        ...this.defaults.order,
        ...Order_By,
      };
    }

    this.loadData({ clearCache: true });
  };

  onPageChanged = async (data) => {
    const { currentPage, totalPages, pageLimit, name } = data;
    this.request.offset = currentPage > 0 ? (currentPage - 1) * pageLimit : 0;
    this.request.limit = pageLimit;
    this.loadData({ clearCache: false });
  };

  loadData = async ({ clearCache = false } = {}) => {
    const { Preloader } = this.props;
    Preloader.show();
    if (clearCache) this.setState({ DocsDataCache: {} });

    const { DocsDataCache } = this.state;
    const requestHash = md5(JSON.stringify({ ...this.request }));

    const DocsData = DocsDataCache[requestHash]
      ? DocsDataCache[requestHash]
      : await DocApi.fetchFilteredDocuments(this.request);

    DocsDataCache[requestHash] = DocsData;

    this.setState({ DocsData: DocsData.data, DocsDataLength: DocsData.length, DocsDataCache });

    setTimeout(() => {
      sessionStorage.setItem('Documents', JSON.stringify({
        state: this.state,
        request: this.request
      }));
    }, 500);

    Preloader.hide();
  };

  refreshPage = () => {
    let path = this.props.match.url
    this.props.history.push(path);
  }

  clearCache = async () => {
    this.isLoadedFromCache = false;
    this.request = Object.assign({}, this.defaults);

    await this.loadData({clearCache: true});

    sessionStorage.removeItem('Documents')
  }

  setCurrentCase = () => {
    const { currentCase } = this.props;

    if(!currentCase) return;

    this.request.whereIn = [...this.request.whereIn, { field: "Case_NAME", values: [currentCase.Case_Short_NAME] }];
  }

  componentDidMount = async () => {
    const storageData = sessionStorage.getItem('Documents');
    const { Case_Short_NAME } = this.props.match.params;

    this.setCurrentCase();
    
    // if(storageData){
    //   const parsed = JSON.parse(storageData);
    //   this.setState({...parsed.state});
    //   this.request = parsed.request;
    //   this.isLoadedFromCache = true;
    // } else {
      if (Case_Short_NAME) {
        const arr = [];
        arr.push(Case_Short_NAME);
  
        this.request.whereIn = [...this.request.whereIn.filter((x) => x.field !== "Case_NAME"), { field: "Case_NAME", values: arr }];
      }
      // this.loadData({clearCache: true});
    // }


    

    this.props.fetchUserCases();

    if (!this.props.isPersonnelInit) {
      this.props.fetchPersonnel();
    }

    this.props.fetchDocsInfo();

    // setTimeout( () => {
      // if(!this.props.match.params.Case_Short_NAME)
      //   this.request.whereIn = [...this.request.whereIn, { field: "Case_NAME", values: this.props.cases.map((x) => (x.Case_Short_NAME))}];
      
    // }, 1000);
  
  };

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.currentCase !== this.props.currentCase){
      this.setCurrentCase();
    }
  }
  

  render() {
    const { cases, isCasesInit, Personnel, isPersonnelInit, DocsInfo, isDocumentsInfoInit, currentCase, match } = this.props;
    const { DocsData, DocsDataLength } = this.state;
    let Case_Short_NAME = null;
    if(currentCase && currentCase.Case_Short_NAME) Case_Short_NAME = currentCase.Case_Short_NAME;
    if(match.params.Case_Short_NAME) Case_Short_NAME = match.params.Case_Short_NAME;
    //  || currentCase.Case_Short_NAME || null;

    if (!isCasesInit || !isPersonnelInit || !isDocumentsInfoInit) return null;

    console.log({DocsInfo})

    const PageFilterComponents = {
      Searches: [
        {
          name: "DOCUMENT_NAME",
          placeholder: "ex. My First Document",
          label: "Document Name",
          col: 4
        },
        {
          name: "DOCUMENT_KEYWORDS",
          placeholder: "ex. Autumn",
          label: "Document Keywords",
          col: 4
        },
        {
          name: "DOCUMENT_TEXT",
          placeholder: "ex. In the superior court",
          label: "Document Text",
          col: 4
        },
        {
          name: "Activity_Title",
          placeholder: "ex. My Event",
          label: "Event",
          col: 6
        },
        {
          name: "Comments",
          placeholder: "ex. Information about my Event",
          label: "Event Description",
          col: 6
        },
      ],
      Selects: [
        {
          name: "Case_Short_NAME",
          options: cases.map((x) => ({ value: x.Case_Short_NAME, label: x.Case_Full_NAME })),
          defaultValue: Case_Short_NAME
            ? cases
                .map((x) => ({ value: x.Case_Short_NAME, label: x.Case_Full_NAME }))
                .filter((x) => x.value === Case_Short_NAME)
            : null,
          // disabled: Case_Short_NAME ? true : false,
          label: "Cases",
          isMulti: true,
          col: 3,
        },
        {
          name: "Person_id",
          options: Personnel.map((x) => ({ value: x.Person_id, label: x.NAME })),
          label: "Persons",
          isMulti: true,
          col: 2,
        },
      ],
      OrderBy: {
        name: "Order_By",
        options: [
          { value: "DOC_ID", label: "Doc Id" },
          { value: "DOCUMENT_NAME", label: "Document Name" },
          { value: "CREATED_DATE", label: "Created Date" },
          { value: "FILED_DATE", label: "Filed Date" },
        ],
        value: "CREATED_DATE",
        label: "Order By",
        col: 3,
      },
      // DatePickers: [
      //   {
      //     type: "RANGE",
      //     label: "Created Date",
      //     name: "CREATED_DATE",
      //     col: 4,
      //     start: {
      //       name: "CREATED_DATE",
      //       label: "Created Date",
      //       minDate: new Date(DocsInfo.CREATED_DATE_START || null).setUTCHours(0, 0, 0, 0),
      //       maxDate: new Date(DocsInfo.CREATED_DATE_END || null).setUTCHours(23, 59, 59, 0),
      //       // selectedDate: new Date(DocsInfo.CREATED_DATE_START || null).setUTCHours(0, 0, 0, 0),
      //     },
      //     end: {
      //       name: "CREATED_DATE",
      //       label: "Created Date",
      //       minDate: new Date(DocsInfo.CREATED_DATE_START || null).setUTCHours(0, 0, 0, 0),
      //       maxDate: new Date(DocsInfo.CREATED_DATE_END || null).setUTCHours(23, 59, 59, 0),
      //       // selectedDate: new Date(DocsInfo.CREATED_DATE_END || null).setUTCHours(23, 59, 59, 0),
      //     },
      //   },
      // ],
    };
    

    return (
      <>
        <div className="page-content">
          <Container fluid className="pageWithSearchTable">
            <PageHeader resreshPage  = {this.refreshPage}>
              {this.props.match.path === "/documents" ? "All Documents" : `Case ${Case_Short_NAME} Documents`} 
              
               </PageHeader>
            <Card className="documents-block">
              <CardHeader>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="h4">Search</h4>
                  <div className="d-flex align-items-center justify-content-between">
                    {this.isLoadedFromCache && (
                      <>
                        Loaded From Cache
                        <Button
                          className="d-flex align-items-center ld-button-info text-uppercase ml-2"
                          onClick={this.clearCache}
                        >
                          <i className="ri-add-ca"></i> Clear Cache
                        </Button>
                      </>
                    )}
                    <Button
                      className="d-flex align-items-center ld-button-warning text-uppercase ml-2"
                      onClick={() =>
                        this.props.showModal("ADD_DOC", { onSuccess: () => this.loadData({ clearCache: true }) })
                      }
                    >
                      <i className="ri-add-line"></i> Create new document
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <PageFilters name="Documents" components={{ ...PageFilterComponents }} onSubmit={this.submitDocsFilter} />
            </Card>
            <Pagination
              name="Documents"
              totalRecords={DocsDataLength}
              pageNeighbours={1}
              pageLimit={9}
              onPageChanged={this.onPageChanged}
              markupPosition={["top", "bottom"]}
            >
              <Card>
                <CardBody>
                  <Row>
                    <Suspense fallback={<TrotlingBlocks TRtype="line" />}>
                      {DocsDataLength !== 0 ? (
                        <>
                          {DocsData.map((x) => (
                            <>
                              <Col lg={4}>
                                <DocumentBlock Doc_Data={x} onUpdate={() => this.loadData({ clearCache: true })} onDelete={() => this.loadData({ clearCache: true })} />
                              </Col>
                            </>
                          ))}
                        </>
                      ) : (
                        <>
                          <div
                            className="d-flex align-items-center justify-content-center w-100 font-weight-bold"
                            style={{ fontSize: "16px", color: "#f44336" }}
                          >
                            <i className="ri-file-warning-line mr-2"></i> Nothing found with the specified filters
                          </div>
                        </>
                      )}
                    </Suspense>
                  </Row>
                </CardBody>
              </Card>
            </Pagination>
                
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  modalType: state.Modal.type,
  cases: state.Case.cases,
  currentCase: state.Case.currentCase,

  isCasesInit: state.Case.isInit,
  Personnel: state.Personnel.personnel,
  isPersonnelInit: state.Personnel.isInit,

  DocsInfo: state.Documents.info,
  isDocumentsInfoInit: state.Documents.isInit,
});

const mapDispatchToProps = (dispatch) => ({
  addModals: (modals) => dispatch(ModalActions.addModals(modals)),
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
  fetchPersonnel: () => dispatch(PersonnelActions.personnelFetchRequested()),

  fetchDocsInfo: () => dispatch(DocsActions.documentsInfoFetchRequested()),

  Preloader: {
    show: () => dispatch(PreloaderActions.showPreloader("NEW_PERSON_MODAL")),
    hide: () => dispatch(PreloaderActions.hidePreloader("NEW_PERSON_MODAL")),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
