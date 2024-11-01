import React, { Component, Suspense, lazy } from "react";
import { Container, Row, Col, Card, CardBody, Button, Input, CardHeader, FormGroup, Label } from "reactstrap";
import { NavLink } from "react-router-dom";
// import Event from "./../../components/Events/Event";
import classnames from "classnames";
// import AddEventFromCalendar from "./../../components/Calendar/AddEventFromCalendar";
import { connect } from "react-redux";
import EventsApi from "./../../api/EventsApi";
import AddEventModal from "../../components/Calendar/modals/AddEventModal";
import Select from "react-select";
import PageHeader from "./../../components/PageHader/PageHeader";
import TrotlingBlocks from "../../components/StyledComponents/TrotlingBlocks";
import AvField from "availity-reactstrap-validation/lib/AvField";
import AvForm from "availity-reactstrap-validation/lib/AvForm";
import PageFilters from "../../components/FormComponents/PageFilters/PageFilters";

import * as ModalActions from "./../../store/modal/actions";
import * as CaseActions from "./../../store/case/actions";
import * as PersonnelActions from "./../../store/personnel/actions";
import * as PreloaderActions from "../../store/preloader/actions";

import DocApi from "./../../api/DocsApi";
import combine from "../../routes/combine";
import DocumentBlock from "../../components/Documents/DocumentBlock";
import EventBlock from "../../components/Events/EventBlock";
import md5 from "md5";

// import Event from "./../../components/Events/Event";

class AllEvents extends Component {
  state = {
    EventsData: [],
    EventsDataLength: 0,
    EventsInfo: {},
    ActivityTypes: [],
  };

  request = {
    like: null,
    where: {},
    whereIn: [],
    whereBetween: [],
    limit: 9,
    offset: 0,
  };

  submitEventsFilter = async (data) => {
    const { Activity_Title, Comments, DOCUMENT_KEYWORDS, DOCUMENT_NAME, DOCUMENT_TEXT, Case_NAME, Person_id, Tentative_date, Order_By, Activity_type } = data;
    const defaults = {
      like: [],
      where: {},
      whereIn: [],
      whereBetween: [],
      order: {
        field: "Tentative_date",
        type: "ASC",
      },
    };

    this.request = { ...this.request, ...defaults };

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

    if (Case_NAME) {
      this.request.whereIn = [...this.request.whereIn, { field: "Case_NAME", values: Case_NAME }];
    } else {
      this.request.whereIn = [...this.request.whereIn, { field: "Case_NAME", values: this.props.cases.map((x) => (x.Case_Short_NAME))}];
    }

    if (Person_id) {
      this.request.whereIn = [...this.request.whereIn, { field: "Responsible_Person_id", values: Person_id }];
    }

    if (Activity_type) {
      this.request.whereIn = [...this.request.whereIn, { field: "Activity_type", values: Activity_type }];
    }

    if (Tentative_date) {
      this.request.whereBetween = [
        ...this.request.whereBetween,
        { field: "Tentative_date", values: [Tentative_date.start, Tentative_date.end] },
      ];
    }

    if (Order_By) {
      this.request.order = {
        ...defaults.order,
        ...Order_By,
      };
    }

    this.loadData({ clearCache: true });
  };

  onPageChanged = async (data) => {
    const { currentPage, totalPages, pageLimit, name } = data;
    this.request.offset = (currentPage - 1) * pageLimit;
    this.request.limit = pageLimit;
    this.loadData();
  };

  loadData = async ({ clearCache = false } = {}) => {
    const { Preloader, User } = this.props;

    Preloader.show();

    if (clearCache) this.setState({ EventsDataCache: {} });

    const { EventsDataCache } = this.state;
    const requestHash = md5(JSON.stringify({ ...this.request }));

    this.request.Current_Person_id = User.Person_id;

    const EventsData = EventsDataCache[requestHash]
      ? EventsDataCache[requestHash]
      : await EventsApi.fetchFilteredEvents(this.request);

    EventsDataCache[requestHash] = EventsData;

      this.setState({ EventsData: EventsData.data, EventsDataLength: EventsData.length, EventsDataCache });
    
    Preloader.hide();
  };

  setCurrentCase = () => {
    const { currentCase } = this.props;

    if(!currentCase) return;

    this.request.whereIn = [...this.request.whereIn, { field: "Case_NAME", values: [currentCase.Case_Short_NAME] }];
  }

  componentDidMount = async () => {
    const { Case_Short_NAME } = this.props.match.params;
    const { Preloader } = this.props;

    this.setCurrentCase();

    Preloader.show();

    if (Case_Short_NAME) {
      const arr = [];
      arr.push(Case_Short_NAME);

      this.request.whereIn = [...this.request.whereIn, { field: "Case_NAME", values: arr }];
    }

    this.props.fetchUserCases();

    if (!this.props.isPersonnelInit) {
      this.props.fetchPersonnel();
    }

    const ActivityTypes = await EventsApi.fetchActivityTypes();
    const EventsInfo = await EventsApi.fetchEventsInfo();
    this.setState({ EventsInfo, ActivityTypes });

    this.request.whereIn = [...this.request.whereIn, { field: "Case_NAME", values: this.props.cases.map((x) => (x.Case_Short_NAME))}];
    this.loadData({clearCache: true});

    Preloader.hide();
  
  };

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.currentCase !== this.props.currentCase){
      this.setCurrentCase();
    }
  }

  render() {
    const { cases, isCasesInit, Personnel, isPersonnelInit, DocsInfo, isDocumentsInfoInit, match, currentCase } =
      this.props;
    const { EventsData, EventsDataLength, EventsInfo, ActivityTypes } = this.state;

    const { MIN_DATE, MAX_DATE } = EventsInfo;

    let Case_Short_NAME = null;
    if(currentCase && currentCase.Case_Short_NAME) Case_Short_NAME = currentCase.Case_Short_NAME;
    if(match.params.Case_Short_NAME) Case_Short_NAME = match.params.Case_Short_NAME;

    const PageFilterComponents = {
      Searches: [
        {
          name: "Activity_Title",
          placeholder: "ex. My Event",
          label: "Event Title",
          col: 6
        },
        {
          name: "Comments",
          placeholder: "ex. Information about my Event",
          label: "Event Description",
          col: 6
        },
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
      ],
      Selects: [
        {
          name: "Case_NAME",
          options: cases.map((x) => ({ value: x.Case_Short_NAME, label: x.Case_Full_NAME })),
          defaultValue: Case_Short_NAME
            ? cases
                .map((x) => ({ value: x.Case_Short_NAME, label: x.Case_Full_NAME }))
                .filter((x) => x.value === Case_Short_NAME)
            : null,
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
        {
          name: "Activity_type",
          options: ActivityTypes.map((x) => ({ value: x.Activity_type, label: x.Description })),
          label: "Event Type",
          isMulti: true,
          col: 2,
        },
      ],
      OrderBy: {
        name: "Order_By",
        options: [
          { value: "Activity_Title", label: "Activity Title" },
          { value: "Tentative_date", label: "Tentative Date" },
        ],
        value: "Tentative_date",
        label: "Order By",
        col: 3,
      },
      // DatePickers: [
      //   {
      //     type: "RANGE",
      //     label: "Tentative Date",
      //     name: "Tentative_date",
      //     col: 4,
      //     start: {
      //       name: "Tentative_date",
      //       label: "Tentative Date",
      //       minDate: new Date(MIN_DATE || null).setUTCHours(0, 0, 0, 0),
      //       maxDate: new Date(MAX_DATE || null).setUTCHours(23, 59, 59, 0),
      //     },
      //     end: {
      //       name: "Tentative_date",
      //       label: "Tentative Date",
      //       minDate: new Date(MIN_DATE || null).setUTCHours(0, 0, 0, 0),
      //       maxDate: new Date(MAX_DATE || null).setUTCHours(23, 59, 59, 0),
      //     },
      //   },
      // ],
    };

    return (
      <>
        <div className="page-content">
          <Container fluid className="pageWithSearchTable">
            <PageHeader>
              {" "}
              {this.props.match.path === "/events"
                ? "All Events"
                : `Case ${this.props.match.params.Case_Short_NAME} Events`}
            </PageHeader>

            <Card className="home-cases-block">
              <CardHeader>
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="h4">Search</h4>
                  <div className="d-flex align-items-center justify-content-between">
                    <Button
                      className="d-flex align-items-center ld-button-warning text-uppercase ml-2"
                      onClick={() =>
                        this.props.showModal("ADD_EVENT", {
                          actualdata: this.state.selectedDay,
                          calendarType: "home_calendar",
                          frombtn: false,
                          onSuccess: () => this.loadData({ clearCache: true }),
                        })
                      }
                    >
                      <i className="ri-add-line"></i> Create new
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <PageFilters components={{ ...PageFilterComponents }} onSubmit={this.submitEventsFilter} />
              <CardBody>
                <Row>
                  {EventsDataLength !== 0 ? (
                    <>
                      {EventsData.map((event) => (
                        <>
                            <Col lg={4}>
                              <EventBlock EventData={event} onSuccededDelete={() => this.loadData({ clearCache: true })} />
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
                </Row>
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
    cases: state.Case.cases,
    currentCase: state.Case.currentCase,
    isLoading: state.Case.loading,
    modalType: state.Modal.type,
    Personnel: state.Personnel.personnel,
    User: state.User.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addModals: (modals) => dispatch(ModalActions.addModals(modals)),
    showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
    fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),
    fetchPersonnel: () => dispatch(PersonnelActions.personnelFetchRequested()),

    Preloader: {
      show: () => dispatch(PreloaderActions.showPreloader("NEW_PERSON_MODAL")),
      hide: () => dispatch(PreloaderActions.hidePreloader("NEW_PERSON_MODAL")),
    },

    //     setCaseId: () => dispatch(actions.setLocalDocuments (idC)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllEvents);
