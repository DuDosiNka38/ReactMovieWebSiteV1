import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
class EventsList extends Component {
  state = {};
  render() {
    const { todos, cases, isPast} = this.props;

    if (todos.length <= 0) {
      return <><h5 className="h5">Events list is empty</h5></>;
    }
    return (
      <>
        <ul className="list-unstyled activity-wid">
          {todos.map((x) => (
            <>
              <li className="activity-list " style={isPast !== undefined && isPast === true ? { opacity: 0.6 } : {}}>
                <div className="activity-icon avatar-xs">
                  <span
                    className="avatar-title rounded-circle"
                    style={{ backgroundColor: x.CaseBg }}
                  >
                    <i
                      className=" ri-calendar-event-line"
                      style={{ color: "#fff" }}
                    ></i>
                  </span>
                </div>
                <div>
                  <div>
                    <h5 className="font-size-13">
                      <div className="font-size-14">
                        <Link
                          to={`/app/case-explorer/case/${x.Activities_Case_NAME}/event/${x.Activities_Activity_Name}`}
                          style={{ color: x.CaseBg }}
                        >
                          {x.Activities_Activity_Title}
                        </Link>
                      </div>
                      <br />
                      <div className="font-size-13 activity-type">
                        {" "}
                        {x.Activity_type_desc}
                      </div>
                    </h5>
                  </div>

                  <div>
                    <p className="text-muted mb-1">{x.Comments}</p>
                    <p className="text-muted mb-0"></p>
                    <p className="text-muted mb-1">
                      Case:
                      <Link
                        to={`/app/case-explorer/single-case/${x.Activities_Case_NAME}`}
                        className="ml-1"
                      >
                        <b>
                          {this.props.cases.find(
                            (y) => y.Case_Short_NAME === x.Activities_Case_NAME
                          ) != undefined &&
                            this.props.cases.find(
                              (y) =>
                                y.Case_Short_NAME === x.Activities_Case_NAME
                            ).Case_Full_NAME}
                        </b>
                      </Link>
                    </p>
                  </div>
                </div>
              </li>
            </>
          ))}
        </ul>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cases: state.User.caseData.cases,
  };
};

export default connect(mapStateToProps, null)(EventsList);
