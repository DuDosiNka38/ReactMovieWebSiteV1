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
import SimpleBar from "simplebar-react";
import { connect } from "react-redux";
import combine from "../../../routes/combine";
import Countdown from "react-countdown";
import * as EventActions from "./../../../store/event/actions";

class NotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  componentDidMount() {
    this.props.fetchUserUpcomingEvents(this.props.User.Person_id);
  }
  render() {
    const { Upcoming_Events } = this.props;
    const currentDate = Date.now();
    const countDays = 30 * 24 * 60 * 60 * 1000;
    // console.log(countDays / 10);
    // console.log(Upcoming_Events);
    //  console.log(currentDate);
    if (
      Upcoming_Events === null ||
      Upcoming_Events === undefined ||
      Upcoming_Events.length < 0 ||(
        Upcoming_Events.hasOwnProperty("result") && !Upcoming_Events.result
      )
    
    )
      return <></>;

    const cd = ({days, hours, minutes}) => {
      return (
        <span>
        {days}d {hours}h {minutes}m
      </span>
      )

    }
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
            <i className="ri-notification-3-line"></i>
            {Upcoming_Events && <span className="noti-dot"></span>}
          </DropdownToggle>
          <DropdownMenu right className="dropdown-menu dropdown-menu-lg p-0">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0"> Notifications </h6>
                </Col>
                {/* <div className="col-auto">
                  <Link to="/all-notifications" className="small">
                    {" "}
                    View All
                  </Link>
                </div> */}
              </Row>
            </div>
            <SimpleBar style={{ maxHeight: "230px" }}>
              {Upcoming_Events ? (
                <>
                  {Upcoming_Events.sort((a, b) =>
                    a.Tentative_date > b.Tentative_date ? 1 : -1
                  ).map((ue) => (
                    <>
                      <Link
                        to={combine("SINGLE_EVENT", {
                          Activity_Name: ue.Activity_Name,
                        })}
                        className="text-reset notification-item"
                      >
                        <Media>
                          <Media body>
                            <div className="">
                              <h6
                                className="mt-0 mb-1"
                                style={{ color: ue.CaseBg }}
                              >
                                {ue.Activity_Title}
                              </h6>
                              <span className="font-size-14">
                                {ue.Tentative_date}
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="warning_block mr-2">
                                {(() => {
                                  if (
                                    countDays / 10 >
                                    Date.parse(ue.Tentative_date) - Date.now()
                                  )
                                    return (
                                      <i className=" ri-alert-line font-size-24  asap_ico"></i>
                                    );

                                  if (
                                    countDays / 5 >
                                    Date.parse(ue.Tentative_date) - Date.now()
                                  )
                                    return (
                                      <i className="  ri-spam-line font-size-24  warning_ico"></i>
                                    );

                                  if (
                                    countDays / 2 >
                                    Date.parse(ue.Tentative_date) - Date.now()
                                  )
                                    return (
                                      <i className="   ri-error-warning-line font-size-24  normal_ico"></i>
                                    );
                                  if (
                                    countDays <
                                    Date.parse(ue.Tentative_date) - Date.now()
                                  )
                                    return (
                                      <i className="   ri-error-warning-line font-size-24  normal_ico"></i>
                                    );
                                })()}
                              </div>

                              <div className="font-size-12 text-muted">
                                <p className="mb-1 noti_text">
                                  Do not forget to prepare for the event.
                                </p>
                                <p className="mb-0">
                                  <i className="mdi mdi-clock-outline"></i>Time
                                  left {""}
                                  <Countdown
                                    date={Date.parse(ue.Tentative_date)} renderer = {cd}
                                  />
                                  
                                </p>
                              </div>
                            </div>
                          </Media>
                        </Media>
                      </Link>
                    </>
                  ))}
                </>
              ) : (
                <div>Nothing to show</div>
              )}
            </SimpleBar>
            <div className="p-2 border-top">
              <Link
                to="#"
                className="btn btn-sm btn-link font-size-14 btn-block text-center"
              >
                <i className="mdi mdi-arrow-right-circle mr-1"></i> View More
              </Link>
            </div>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  Upcoming_Events: state.Event.Upcoming_Events,
  User: state.User.data,
});
const mapDispatchToProps = (dispatch) => ({
  fetchUserUpcomingEvents: (Person_id) =>
    dispatch(EventActions.userUpcomingEventsFetchRequested(Person_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationDropdown);
