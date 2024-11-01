import React, { Component } from "react";

export default class KHuyamSettings extends Component {
  state = {
    _calendarView: null,
  };

  initView = () => {
    this.setState({_calendarView: this.props.calendarView});
  }

  componentDidMount() {
    this.initView();
  }  

  componentDidUpdate(prevProps, prevState) {
    //Reload View Settings
    if(prevProps.calendarView !== this.props.calendarView){
      this.initView();
    }

    //onSettingsChange
    if(prevState._calendarView !== this.state._calendarView){
      const cb = this.props.onChange;

      if(cb && typeof cb === "function"){
        cb(this.state._calendarView);
      }
    }
  }
  

  render() {
    const { _calendarView } = this.state;
    const Settings = _calendarView?.settingsComponent;

    console.log({_calendarView})
    return (
      <>
        {Settings && <Settings/>}
        {/* <div className="calendarNaviTolls"></div>
        <div className="calendarSettings d-flex justify-content-center">
          
          <span
            className="flat-icon user-del font-size-20 text-center"
            title="Settings"
          >
            <i className="ri-settings-5-line"></i>
          </span>
        </div> */}
      </>
    );
  }
}
