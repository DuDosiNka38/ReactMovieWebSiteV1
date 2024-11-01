import React, { Component} from "react";
import { connect } from "react-redux";

import * as ModalActions from "./../../store/modal/actions";

import combine from "./../../routes/combine";
import Calendar from "./Calendar";
import EventsApi from "../../api/EventsApi";
import KHuyamCalendar from "../KHuyamCalendar";

class DashboardCalendar extends Component {
  state = {
		EventsData: [],
	};

  combine = (...args) => {
    if (this.props.disableLinks) return "#";

    return combine(...args);
  };

  navTo = (link) => {
    this.props.history.push(link);
  }

  loadEvents = async () => {
    const { User } = this.props;
    if(User.Person_id){
      const EventsData = await EventsApi.fetchUserEvents(User.Person_id) || [];
      if(EventsData.hasOwnProperty("result") && !EventsData.result)
        return false;
        
      this.setState({
        EventsData: EventsData.map((x) => (
          {
            title: x.Activity_Title,
            date: new Date(x.Tentative_date),
            
            eventBlockProps: {
              // backgroundColor: x.CaseBg,		
              // myUrl: this.combine("SINGLE_EVENT", {Activity_Name: x.Activity_Name}),
              // event: x,
              EventData: x
            }
          }
        )),
        isInit: true
      });
    }
  };

  async componentDidMount() {
    await this.loadEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.User !== this.props.User){
      this.loadEvents();
    }
  }
  
  render() {
    const { EventsData, isInit } = this.state;

    
    
    return (
      <>
        
        <KHuyamCalendar events={EventsData}/>
        {/* <Calendar EventsData={EventsData} isInit={isInit} loadEvents={this.loadEvents} navTo={this.navTo}/> */}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
});

const mapStateToProps = (state) => ({
  User: state.User.data,
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardCalendar);
