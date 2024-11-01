import React, { Component } from "react";
import { Container, Card, CardBody, Row, Col, Button } from "reactstrap";
import Calendar from "../../components/Calendar/Calendar";
import { connect } from "react-redux";
//Import Breadcrumb
import Log from "../../components/Dasboard/Log";
import SingelCase from "./../AllCases/SingelCase";
import {NavLink} from "react-router-dom"
import PRIVILEGE from "../../services/privileges";
import PreloaderLD from "../../services/preloader-core";
import { act } from "react-dom/test-utils";

class StarterPage extends Component {
  constructor(props) {
    super(props);
    this.Preloader = new PreloaderLD(this);
    this.state = {
      breadcrumbItems: [
        { title: "", link: "#" },
        // { title : "", link : "#" },
      ],
    };
  }

  componentDidMount() {
    this.Preloader.hide();
  }

  render() {
    this.Preloader.show();
    if(this.props.personeData === undefined)
        return (<>{this.Preloader.get()}</>);

    const pData = this.props.personeData;

    const { events, casesData } = this.props;
    const cases = casesData.cases;
    let active = cases.filter((x) => x.Status === "ACTIVE");
    // if(active.length > 1) {
    //   active.slice(0,0)
    // }
   
    const caseCount = active.filter((x) => x.visible === true).length
    const maxCases = 6;
    let cEvents = [];
    if(PRIVILEGE.check("SHOW_CASE_EVENTS", pData)){
      events.forEach(function (v, i, a) {
        let c = cases.find((x) => x.Case_Short_NAME === v.Case_NAME && x.visible);
        let active = cases.filter((x) => x.Status === "ACTIVE");
      
        if(c !== undefined){
          cEvents.push({
            event: v,
            title: v.Activity_Title,
            start: new Date(parseInt(v.Tentative_date_stamp + "000")),
            url: `/app/case-explorer/case/${v.Case_NAME}/event/${v.Activity_Name}`,
            backgroundColor: c.CaseBg,
          });
        }
      });
    }
    let calendarLoc;
    if(this.props.location.pathname.includes('/home')) {
      calendarLoc = "home_calendar"
    }
  

    this.Preloader.hide();
    return (
      <React.Fragment>
        {this.Preloader.get()}
        <div className="page-content">
          <Container fluid>
            {/* <Breadcrumbs
              title="Home"
              breadcrumbItems={this.state.breadcrumbItems}
            /> */}
            {/* <Cases/>  */}
            <Row>
              <Col lg={8}>
                {PRIVILEGE.check("SHOW_DASHBOARD_CASES", pData) &&
                  <> 
                    <Card className="">
                  <h4 className="ml-4 mt-3 h4">Current Cases ({caseCount})</h4>
                    <CardBody className="row mb-0 pb-0 ">
                      {active.length > 0 && (
                        <>
                        {active.slice(0, 6).map(
                        (x,index ) => (
                          <>
                          {x.visible ?
                            <>                         
                              <Col lg={4} key={x.Case_Number}>
                                <SingelCase
                                  caseId={x.Case_id}
                                  caseName={x.Case_Full_NAME}
                                  shortName={x.Case_Short_NAME}
                                  caseNumber={x.Case_Number}
                                  description={x.DESCRIPTION}
                                  class='caseInHome'
                                  cclass='py-1 px-2'
                                  bg={x.CaseBg}
                                />
                              </Col>
                            </>
                            :
                            <>
                            </>
                          }
                        </>
                        )
                      )}
                        </>
                      ) }
                    
                    </CardBody>
                  
                    <NavLink to = "/app/case-explorer">
                      <Button className=" ml-4 mb-4" color="info">
                      View All Cases
                      </Button>
                      </NavLink>
                
                  </Card>
                  </>
                }
                {PRIVILEGE.check("SHOW_DASHBOARD_CALENDAR", pData) &&
                  <>
                    <Calendar calendarEvents = {cEvents} calendarType = {calendarLoc}/>
                  </>
                }
              </Col>
              <Col lg={4}>
                <Log pathname = {this.props.location.pathname} />
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    casesData: state.User.caseData,
    events: state.User.AllEvents,
    personeData: state.User.persone,

  };
};

export default connect(mapStateToProps)(StarterPage);
