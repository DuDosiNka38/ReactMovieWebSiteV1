import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
  Media,
} from "reactstrap";
import { connect } from "react-redux";
import SimpleBar from "simplebar-react";
import ReactTooltip from 'react-tooltip';

//i18b

//Import images


class NotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      
    };
    // this.notifEvent = this.notifEvent.bind(this)
    this.toggle = this.toggle.bind(this);
  }

 

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }
  render() {
    // const {cases} = this.props;
    const pEvents = this.props.alerts;
    let allNotif = pEvents
    if(!Array.isArray(pEvents)) {
        return (<></>)
    }
   const notifEvent = (e) =>  {
      const ind = e.currentTarget.getAttribute('attr-index')
      let currentNot  =  allNotif.find((x)=> x.Alert_id === ind)
      allNotif.splice(currentNot, 1)
    }
    //Activity_Name: "Chupacabra_Cho_Po_chem456"
    // Activity_Title: "Chupacabra Cho Po chem456"
    // Activity_type: "TEST"
    // Case_NAME: "TEST"
    // Comments: "1"
    // Owner: "OFFICE"
    // Parent_Activity_Name: ""
    // Parent_Activity_type: ""
    // Responsible_Person_id: "MaKc_UIshHiK"
    // Responsible_person_Role: "LAWYER"
    // Tentative_Calendar_name: "DEFAULT_CALENDAR"
    // Tentative_date: "1616088180"
    // Time_estimate_days: "1"
    return (
      <React.Fragment>
        <Dropdown
          isOpen={this.state.menu}
          toggle={this.toggle}
          tag="li"
          className="d-inline-block"
        >
          <DropdownToggle
            tag="button"
            className="btn header-item noti-icon waves-effect"
            id="page-header-notifications-dropdown"
          >
            <i className="ri-notification-3-line " data-tip={`New notifications: ${allNotif.length} `}></i>
            <ReactTooltip />
            {pEvents.length > 0 && <span className="noti-dot"></span>}
          </DropdownToggle>
          <DropdownMenu right className="dropdown-menu dropdown-menu-lg p-0">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0"> Notifications </h6>
                </Col>
                <div className="col-auto">
                  <Link to="#" className="small">
                    {" "}
                    View All
                  </Link>
                </div>
              </Row>
            </div>
            <SimpleBar style={{ maxHeight: "230px" }}>
            
              {pEvents.map((x, index)=> (
                                       <>
                                        <Link to="/" className="text-reset notification-item" onClick={notifEvent} attr-index = {x.Alert_id} >
                                        <Media>
                                            <div className="avatar-xs mr-3">
                                                <span className="avatar-title bg-primary rounded-circle font-size-16">
                                                    <i className=" ri-alert-line"></i>
                                                </span>
                                            </div>
                                            <Media body>
                                                <h6 className="mt-0 mb-1" >{x.Alert_text}</h6>
                                                <div className="font-size-12 text-muted">
                                                    <p className="mb-1">Case: <Link to ={`/caseview/${x.Case_NAME}`}><b>{this.props.cases.find((y) => y.Case_Short_NAME === x.Case_NAME).Case_Full_NAME}</b></Link></p>
                                                    <p className="mb-0"><i className="mdi mdi-clock-outline"></i>{x.Alert_Date_human}</p>
                                                </div>
                                            </Media>
                                        </Media>
                                    </Link>
                                       </>
                                   )) }
            
            </SimpleBar>
            <div className="p-2 border-top">
              <Link
                to="#"
                className="btn btn-sm btn-link font-size-14 btn-block text-center"
              >
                <i className="mdi mdi-arrow-right-circle mr-1"></i>View More
              </Link>
            </div>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
    alerts: state.User.alerts,
  };
};


export default connect(mapStateToProps, null)(NotificationDropdown);
