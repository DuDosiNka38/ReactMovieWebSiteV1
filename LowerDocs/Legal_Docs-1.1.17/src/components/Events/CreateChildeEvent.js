import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Select from "react-select";
import { AvForm } from "availity-reactstrap-validation";
import EventModal from "./EventModal";
import { connect } from "react-redux";
import * as actions from "./../../store/user/actions";
import axios from "./../../services/axios"
import noteWindow from "../../services/notifications";


class CreateChildeEvent extends Component {
  state = {
    Case_NAME: this.props.case,
    Activity_Name: "",
    Activity_type: "",
    Owner: "",
    Comments: "",
    Tentative_Calendar_name: "",
    Tentative_date: `${new Date().getFullYear()}-${`${new Date().getMonth() +
      1}`.padStart(2, 0)}-${`${new Date().getDate() + 1}`.padStart(
      2,
      0
    )}T${`${new Date().getHours()}`.padStart(
      2,
      0
    )}:${`${new Date().getMinutes()}`.padStart(2, 0)}`,
    Parent_Activity_Name: "",
    Parent_Activity_type: "",
    Time_estimate_days: "",
    Responsible_Person_id: "",
    Responsible_person_Role: "",
    selectedDocs: [],
    notify: true
  };

  deleteRow = this.deleteRow.bind(this)
  handleChange = (el) => {
    const { name, value } = el.currentTarget;
    this.setState({ [name]: value });
  };

    onChangeCheckbox = (el) => {
    const { name, checked } = el.currentTarget;
    this.setState({ notify: checked });
  }
  onSelectChange = (el, e) => {
    let p = this.state.selectedDocs;
    switch(el.name){
      case "document":
        p[e.name]["DOC_ID"] = el.value;
        this.setState({ selectedDocs: p });
        break;

      case "rTypes":
        p[e.name]["Relation_type"] = el.value;
        this.setState({ selectedDocs: p });
        break;

      case "Parent_Activity_Name":
        const aType = this.props.events.find((x) => x.Activity_Name == el.value);
        if(aType != undefined){
          this.setState({Parent_Activity_type: aType.Activity_type})
        }
        this.setState({ [el.name]: el.value });
        break;

      default:
        this.setState({ [el.name]: el.value });
        break;
    }
  };

  handleTableChange = (e) => {
    const rID = e.currentTarget.getAttribute('row');
    const { name, value } = e.currentTarget;
    let p = this.state.selectedDocs;
    p[rID][name] = value;
    this.setState({ selectedDocs: p });
  };

  deleteRow (e) {
    const delRow = e.currentTarget.getAttribute('row')
    this.state.selectedDocs.splice(delRow,1);
    let state = this.state.selectedDocs.map((st)=>st)
    this.setState({ selectedDocs: state});
   }

 addEvent = async () => {
  let data = new Date(this.state.Tentative_date).getTime()
    const result = axios.post('/api/event/add', {
      Case_NAME: this.state.Case_NAME,
      Activity_Name: this.state.Activity_Name,
      Activity_type: this.state.Activity_type,
      Owner: this.state.Owner,
      Comments: this.state.Comments,
      Tentative_Calendar_name: this.state.Tentative_Calendar_name,
      Tentative_date:data.toString().slice(0, -3) ,
      Parent_Activity_Name: this.state.Parent_Activity_Name ,
      Parent_Activity_type: this.state.Parent_Activity_type,
      Time_estimate_days: this.state.Time_estimate_days,
      // Responsible_Person_id:this.state.Responsible_Person_id,
      // Responsible_person_Role:this.state.Responsible_person_Role,
      Responsible_Person_id: this.props.personeData.Person_id,
      docs: this.state.selectedDocs,
      ADD_ALERT: this.state.notify

    })
    .then(function (response) {
      if (response.data.result) {
        noteWindow.isSuck("Event Added!")

        return true;
      } else {
        noteWindow.isError(response.data.result_data.result_error_text);
        return false;
      }
    })
    .catch((response) => {
      noteWindow.isError(response);
      return false;
    });
    
    
   if (result) {
    this.props.onGlobalLoad();
    // const ev = this.props.events;
    // ev.push({
    //   Case_NAME: this.state.Case_NAME,
    //   Activity_Name: this.state.Activity_Name.replace(/\W/gi,'_'),
    //   Activity_Title: this.state.Activity_Name,
    //   Activity_type: this.state.Activity_type,
    //   Owner: this.state.Owner,
    //   Comments: this.state.Comments,
    //   Tentative_Calendar_name: this.state.Tentative_Calendar_name,
    //   Tentative_date: this.state.Tentative_date,
    //   Parent_Activity_Name: this.state.Parent_Activity_Name ,
    //   Parent_Activity_type: this.state.Parent_Activity_type,
    //   Time_estimate_days: this.state.Time_estimate_days,
    //   // Responsible_Person_id:this.state.Responsible_Person_id,
    //   // Responsible_person_Role:this.state.Responsible_person_Role,
    //   Responsible_Person_id: this.props.personeData.Person_id
    // });
   }
    this.props.switch_modal()

  };


  render() {
    return (
      <>
      
         
              <EventModal
                Case_NAME={this.state.Case_NAME}
                Activity_Name={this.state.Activity_Name}
                Activity_type={this.state.Activity_type}
                Owner={this.state.Owner}
                Comments={this.state.Comments}
                Tentative_Calendar_name={this.state.Tentative_Calendar_name}
                Tentative_date={this.state.Tentative_date}
                Parent_Activity_Name={this.state.Parent_Activity_Name}
                Parent_Activity_type={this.state.Parent_Activity_type}
                Time_estimate_days={this.state.Time_estimate_days}
                Responsible_Person_id={this.state.Responsible_Person_id}
                Responsible_person_Role={this.state.Responsible_person_Role}
                handleChange={this.handleChange}
                onSelectChange={this.onSelectChange}
                calendars = {this.props.calendars}
                events = {this.props.events}
                relationType = {this.props.reltype}
                docs = {this.props.docs}
                selectedDocs = {this.state.selectedDocs}
                handleTableChange = {this.handleTableChange}
                deleteRow = {this.deleteRow}
                onChangeCheckbox = {this.onChangeCheckbox}
                notify = {this.state.notify}
                // case = {this.props.match.params.caseId}
              />
  
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    // events: state.User.localEvents,
    personeData: state.User.persone,
    calendars: state.User.calendars,
    reltype: state.User.relationType

  };
};



const mapDispatchToProps = (dispatch) => {
  return {
    // onCaseLoad: () => dispatch(actions.getCase()),
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateChildeEvent);