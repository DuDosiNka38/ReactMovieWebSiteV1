import React, { Component } from "react";
import {
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Card,
  Form,
  Row,
  Col,
  CardBody,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonToolbar,
} from "reactstrap";
import {
  Link,
  BrowserRouter,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import { connect } from "react-redux";
import SlideToggle from "react-slide-toggle";

import * as actions from "../../store/user/actions";
import AllCasse from "../AllCases/AllCasse";
import SingleCaseView from "../AllCases/SingleCaseView";
import ActiveCase from "../../components/Cases/ActiveCase";
import ClosedCases from "../../components/Cases/ClosedCases";
import Privileges from "../Privileges/Privileges";
import SingelCase from "../AllCases/SingelCase";
import CreateCase from "../CreateCase/CreateCase";
import CaseInfo from "../AllCases/CaseInfo";
import DocumentsList from "../Ducuments/DocumentsList";
import DocumentView from "../Ducuments/Document/DocumentView";
import Events from "../Events/Events";
import SingleEventView from "../Events/SingleEventView";
import FileView from './../FileView/FileView'

import PreloaderLD from "../../services/preloader-core";
import { toggleRightSidebar } from "../../store/actions";

//Import Editor

//Import Images

class Test extends Component {
  state = {
    isTogled: null,
    update: false,
  };
  Preloader = new PreloaderLD(this);
  setToggleObject = this.setToggleObject.bind(this);

  onToggle = (key, e) => {
    const { isTogled } = this.state;
    isTogled[key] = Date.now();
    isTogled[key.toString() + "_ARROW"] = !isTogled[key.toString() + "_ARROW"];
    this.setState({
      isTogled: isTogled,
    });
    setTimeout(() => this.setState({ update: !this.state.update }), 500);
  };

  setToggleObject(ret = false) {
    if (this.props === null || this.props === undefined) {
      setTimeout(this.setToggleObject, 500);
    } else {
      const { cases, status } = this.props;

      if (cases === undefined || cases === null || !cases.length) {
        setTimeout(this.setToggleObject, 500);
      } else {
        let isTogled = {};

        let closed = cases.filter((x) => x.Status === "CLOSED");
        let active = cases.filter((x) => x.Status === "ACTIVE");

        const menu = [
          {
            title: `Active Cases`,
            link: "/app/case-explorer/active",
            count: active.length,
            collapsed: false,
            child: [],
            style: this.checkLoc("/app/case-explorer/active") === true ? "avtive-link" : ""
          },
          {
            title: `Closed Cases`,
            link: "/app/case-explorer/closed",
            count: closed.length,
            collapsed: true,
            child: [],
            style: this.checkLoc("/app/case-explorer/closed") === true ? "avtive-link" : ""
          },
        ];

        const ACTIVE_CASES = menu[0];
        const CLOSED_CASES = menu[1];

        for (let i in active) {
          const CASE = active[i];

          ACTIVE_CASES.child.push({
            title: CASE.Case_Full_NAME,
            CaseBg: CASE.CaseBg,
            link: `/app/case-explorer/single-case/${CASE.Case_Short_NAME}`,
            child: [
              {
                title: `Documents`,
                link: `/app/case-explorer/case/${CASE.Case_Short_NAME}/documents`,
                count: CASE.Case_Documents.length,
                child: [],
                style: this.checkLoc(`/app/case-explorer/case/${CASE.Case_Short_NAME}/documents`) === true ? "avtive-link" : ""
              },
              {
                title: `Events`,
                link: `/app/case-explorer/case/${CASE.Case_Short_NAME}/events`,
                count: CASE.Case_Events.length,
                child: [],
                style: this.checkLoc(`/app/case-explorer/case/${CASE.Case_Short_NAME}/events`) === true ? "avtive-link" : ""
              },
            ],
            style: this.checkLoc(`/app/case-explorer/single-case/${CASE.Case_Short_NAME}`) === true ? "avtive-link" : ""
          });

          if(this.checkLoc(`/app/case-explorer/case/${CASE.Case_Short_NAME}/documents`) === true 
              || 
              this.checkLoc(`/app/case-explorer/case/${CASE.Case_Short_NAME}/events`) === true
              ||
              this.checkLoc(`/app/case-explorer/single-case/${CASE.Case_Short_NAME}`) === true
              ){
                ACTIVE_CASES.style = "avtive-link";
                ACTIVE_CASES.child[(ACTIVE_CASES.child.length-1)].style = "avtive-link";
          }



          for (let index = 0; index < ACTIVE_CASES.child.length; index++) {
            let k = "0" + index.toString();
            if(ACTIVE_CASES.child[index].style === ""){
              isTogled[k] = false;
              isTogled[k + "_ARROW"] = false;
            } else {
              isTogled[k] = true;
              isTogled[k + "_ARROW"] = true;
            }
            
          }

          let k = ACTIVE_CASES.child.length - 1;

          const Docs = ACTIVE_CASES.child[k].child[0];
          const Events = ACTIVE_CASES.child[k].child[1];

          for (let key in CASE.Case_Documents) {
            const DOC = CASE.Case_Documents[key];

            Docs.child.push({
              title: DOC.DOCUMENT_NAME,
              link: `/app/case-explorer/case/${DOC.Case_NAME}/document/${DOC.DOC_ID}`,
              child: [],
            });

            
            if(this.checkLoc(`/app/case-explorer/case/${DOC.Case_NAME}/document/${DOC.DOC_ID}`) === true){
              ACTIVE_CASES.child[k].style = "avtive-link";
              Docs.style = "avtive-link";
              ACTIVE_CASES.style = "avtive-link";
            }
          }

          for (let key in CASE.Case_Events) {
            const EVENT = CASE.Case_Events[key];

            Events.child.push({
              title: EVENT.Activity_Title,
              link: `/app/case-explorer/case/${CASE.Case_Short_NAME}/event/${EVENT.Activity_Name}`,
              child: [],
            });

            if(this.checkLoc(`/app/case-explorer/case/${CASE.Case_Short_NAME}/event/${EVENT.Activity_Name}`) === true){
              ACTIVE_CASES.style = "avtive-link";
              Events.style = "avtive-link";
            }
          }

          let docKey = "0" + i.toString() + "0";
          if(Docs.style === ""){
            isTogled[docKey] = false;
            isTogled[docKey + "_ARROW"] = false;
          } else {
            isTogled[docKey] = true;
            isTogled[docKey + "_ARROW"] = true;
          }
          let eventKey = "0" + i.toString() + "1";
          if(Events.style === ""){
            isTogled[eventKey] = false;
            isTogled[eventKey + "_ARROW"] = false;
          } else {
            isTogled[eventKey] = true;
            isTogled[eventKey + "_ARROW"] = true;
          }
        }

        for (let i in closed) {
          const CASE = closed[i];

          CLOSED_CASES.child.push({
            title: CASE.Case_Full_NAME,
            CaseBg: CASE.CaseBg,
            link: `/app/case-explorer/single-case/${CASE.Case_Short_NAME}`,
            child: [
              {
                title: `Documents`,
                link: `/app/case-explorer/case/${CASE.Case_Short_NAME}/documents`,
                count: CASE.Case_Documents.length,
                child: [],
              },
              {
                title: `Events`,
                link: `/app/case-explorer/case/${CASE.Case_Short_NAME}/events`,
                count: CASE.Case_Events.length,
                child: [],
              },
            ],
          });

          for (let index = 0; index < CLOSED_CASES.child.length; index++) {
            let k = "1" + index.toString();
            isTogled[k] = false;
            isTogled[k + "_ARROW"] = false;
          }

          let k = CLOSED_CASES.child.length - 1;

          const Docs = CLOSED_CASES.child[k].child[0];
          const Events = CLOSED_CASES.child[k].child[1];

          for (let key in CASE.Case_Documents) {
            const DOC = CASE.Case_Documents[key];

            Docs.child.push({
              title: DOC.DOCUMENT_NAME,
              link: `/app/case-explorer/case/${DOC.Case_NAME}/document/${DOC.DOC_ID}`,
              child: [],
            });
          }

          for (let key in CASE.Case_Events) {
            const EVENT = CASE.Case_Events[key];

            Events.child.push({
              title: EVENT.Activity_Title,
              link: `/app/case-explorer/case/${CASE.Case_Short_NAME}/event/${EVENT.Activity_Name}`,
              child: [],
            });
          }

          let docKey = "1" + i.toString() + "0";
          isTogled[docKey] = false;
          isTogled[docKey + "_ARROW"] = false;
          let eventKey = "1" + i.toString() + "1";
          isTogled[eventKey] = false;
          isTogled[eventKey + "_ARROW"] = false;
        }

        isTogled[0] = true;
        isTogled["0_ARROW"] = true;
        isTogled[1] = false;
        isTogled["1_ARROW"] = false;

        if (ret === false) {
          this.setState({
            isTogled: isTogled,
          });
        }

        if (ret === true) return menu;
      }
    }
  }
  componentDidMount() {
    this.setToggleObject(false);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.update !== prevState.update) {
      this.setState({ update: !prevState.update });
      this.render();
    }
  }

  checkLoc = (loc) => {
    return loc === this.props.location.pathname;
  }

  render() {
    this.Preloader.show();
    if (this.state.isTogled === null) {
      return <>{this.Preloader.get()}</>;
    }
    const { cases, status } = this.props;

    const menu = this.setToggleObject(true);
    // console.log(this.props)
    let pageName = "Case Management";
    const loc = this.props.location.pathname;
    if(loc.includes("documents") ||loc.includes("document") ) {
      pageName = "Documents Management"
    }else if (loc.includes("events")||loc.includes("event") ) {
      pageName = "Events Management"

    }else if  (loc.includes("file") ) {
      pageName = "File View"
    }

  

    return (
      <>
        <div className="page-content">
          <h5 className="mb-3">{pageName}</h5>

          <Card className="email-leftbar ">
            <NavLink
              to="/app/case-explorer/create"
              activeClassName="avtive-link"
            >
              <Button
                type="button"
                color="success"
                block
                className="waves-effect waves-light d-flex align-items-center justify-content-center"
              >
                <i class="ri-file-add-line font-size-20"></i>&nbsp;Create New Case
              </Button>
            </NavLink>
            <div className=" mt-4">
              {/* //ACTIVE || CLOSE */}
              {menu.map((x, index) => (
                <>
                  <div className="listdd d-flex align-items-center justify-content-between">
                    <NavLink
                      to={x.link}
                      className={`link-to-type d-flex ${x.style}`}
                      activeClassName="avtive-link"
                    >
                      {x.title}
                      <div className="link-count small-text">{x.count}</div>
                    </NavLink>

                    {x.child.length > 0 && (
                      <>
                        <span
                          className="toggle toggle-icon"
                          color="info"
                          onClick={(e) => this.onToggle(index, e)}
                        >
                          <i
                            className={
                              this.state.isTogled[
                                index.toString() + "_ARROW"
                              ] === false
                                ? " ri-arrow-drop-down-fill"
                                : " ri-arrow-drop-up-fill"
                            }
                          ></i>
                        </span>
                      </>
                    )}
                  </div>
                  <SlideToggle
                    toggleEvent={this.state.isTogled[index]}
                  >
                    {({ setCollapsibleElement }) => (
                      <div className="my-collapsible">
                        <div
                          className="my-collapsible__content"
                          ref={setCollapsibleElement}
                        >
                          <div className="my-collapsible__content-inner">
                            {/* //CASES */}
                            {x.child.map((e, ind) => (
                              <>
                                <div className="listdd list-cases d-flex align-items-center justify-content-between">
                                  <NavLink
                                    to={e.link}
                                    className={`link-to-case ${e.style}`}
                                    style={{
                                      borderLeftColor: e.CaseBg,
                                      borderLeft: "3px",
                                      borderLeftStyle: "solid",
                                      paddingLeft: "10px",
                                      color: e.CaseBg,
                                      borderRadius: "3px",
                                      maxWidth: "175px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                    activeClassName="avtive-link"
                                    title={e.title}
                                  >
                                    {e.title}
                                  </NavLink>
                                  <span
                                    className="toggle toggle-icon"
                                    color="info"
                                    onClick={(e) =>
                                      this.onToggle(
                                        index.toString() + ind.toString(),
                                        e
                                      )
                                    }
                                  >
                                    <i
                                      className={
                                        this.state.isTogled[
                                          index.toString() +
                                            ind.toString() +
                                            "_ARROW"
                                        ] === false
                                          ? " ri-arrow-drop-down-fill"
                                          : " ri-arrow-drop-up-fill"
                                      }
                                    ></i>
                                  </span>
                                </div>

                                <SlideToggle
                                  // collapsed
                                  collapsed={
                                    e.hasOwnProperty("style") && e.style !== ""
                                      ? false
                                      : true
                                  }
                                  toggleEvent={
                                    this.state.isTogled[
                                      index.toString() + ind.toString()
                                    ]
                                  }
                                >
                                  {({ setCollapsibleElement }) => (
                                    <div className="my-collapsible">
                                      <div
                                        className="my-collapsible__content"
                                        ref={setCollapsibleElement}
                                      >
                                        <div className="my-collapsible__content-inner">
                                          {/* //EVENTS || DOCUMENTS HEADER */}
                                          {x.child[ind].child.map((k, inde) => (
                                            <>
                                              <div className="listdd d-flex align-items-center justify-content-between">
                                                <NavLink
                                                  to={k.link}
                                                  className={`link-to-case-cat d-flex ${k.style}`}
                                                  activeClassName="avtive-link"
                                                >
                                                  {k.title}
                                                  <div className="link-count">
                                                    {k.count}
                                                  </div>
                                                </NavLink>
                                                {x.child[ind].child[inde].child
                                                  .length > 0 && (
                                                  <>
                                                    <span
                                                      className="toggle toggle-icon"
                                                      color="info"
                                                      onClick={(e) =>
                                                        this.onToggle(
                                                          index.toString() +
                                                            ind.toString() +
                                                            inde.toString(),
                                                          e
                                                        )
                                                      }
                                                    >
                                                      <i
                                                        className={
                                                          this.state.isTogled[
                                                            index.toString() +
                                                              ind.toString() +
                                                              inde.toString() +
                                                              "_ARROW"
                                                          ] === false
                                                            ? " ri-arrow-drop-down-fill"
                                                            : " ri-arrow-drop-up-fill"
                                                        }
                                                      ></i>
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                              <SlideToggle
                                                collapsed={
                                                  k.hasOwnProperty("style") && k.style !== ""
                                                    ? false
                                                    : true
                                                }
                                                toggleEvent={
                                                  this.state.isTogled[
                                                    index.toString() +
                                                      ind.toString() +
                                                      inde.toString()
                                                  ]
                                                }
                                              >
                                                {({
                                                  setCollapsibleElement,
                                                }) => (
                                                  <div className="my-collapsible">
                                                    <div
                                                      className="my-collapsible__content"
                                                      ref={
                                                        setCollapsibleElement
                                                      }
                                                    >
                                                      <div className="my-collapsible__content-inner">
                                                        {/* //EVENTS || DOCUMENTS LIST*/}
                                                        {x.child[ind].child[
                                                          inde
                                                        ].child.map((q) => (
                                                          <>
                                                            <div>
                                                              <NavLink
                                                                to={q.link}
                                                                className="link-to-case-subcat"
                                                                activeClassName="avtive-link"
                                                                title={q.title}
                                                              >
                                                                {q.title}
                                                              </NavLink>
                                                            </div>
                                                          </>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </SlideToggle>
                                            </>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </SlideToggle>
                              </>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </SlideToggle>
                </>
              ))}
            </div>
          </Card>
          <Row>
            <Col lg={12}>
              {/* <Route exact path="/allcases" component={AllCasse} /> */}
              <Card className="case-card">
                <CardBody>
                  <Switch>
                    {this.props.location.pathname === "/app/case-explorer" && (
                      <Redirect to="/app/case-explorer/active" />
                    )}

                    <Route
                      exact
                      path="/app/case-explorer/active"
                      component={ActiveCase}
                    />

                    <Route
                      exact
                      path="/app/case-explorer/closed"
                      component={ClosedCases}
                    />

                    <Route
                      exact
                      path="/app/case-explorer/priv"
                      component={Privileges}
                    />
                    <Route
                      path="/app/case-explorer/create"
                      component={CreateCase}
                    />
                    <Route
                      path="/app/case-explorer/cases/:caseId"
                      component={SingelCase}
                    />
                    <Route
                      path="/app/case-explorer/single-case/:caseId"
                      component={SingleCaseView}
                    />

                    <Route
                      path="/app/case-explorer/caseinfo/:caseId"
                      component={CaseInfo}
                    />

                    <Route
                      path="/app/case-explorer/case/:caseId/documents"
                      component={DocumentsList}
                    />

                    <Route
                      path="/app/case-explorer/case/:CaseId/document/:docId"
                      component={DocumentView}
                    />

                    <Route
                      path="/app/case-explorer/case/:caseId/events"
                      component={Events}
                    />
                    <Route
                      path="/app/case-explorer/case/:caseId/event/:eventId"
                      component={SingleEventView}
                    />

                    <Route
                      path="/app/case-explorer/file/:filePath"
                      component={FileView}
                    />
                  </Switch>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    status: state.User.CaseStatuses,
    personeData: state.User.persone,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
