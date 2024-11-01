import React, { Component } from "react";
import {
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import Select from "react-select";
import { connect } from "react-redux";
import axios from 'axios'
import noteWindow from "../../../services/notifications";
import * as actions from "./../../../store/user/actions";
class CalendarSettings extends Component {
  state = {
    modal: false,
    values: [1],
  };
  // rangeChange = this.rangeChange.bind(this);
  switch_modal = this.switch_modal.bind(this);
  calendarViewArg = this.calendarViewArg.bind(this)
  switch_modal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }
  onSelectChange = (el) => {
    this.setState({ [el.name]: el.value });
  };

  calendarViewArg() {
    axios.post('/api/settings/setUser',{
      name: "CALENDAR_VIEW",
      value: this.state.calendarView,
      pid: this.props.personeData.Person_id
    })
    .then((result) => {
      if(result.data.result){
        noteWindow.isSuck("Data successfully updated!");
        this.props.onGlobalLoad();
        this.switch_modal();
      } else {
        noteWindow.isError(result.data.result_data);
      }
    })
    .catch(result => console.log(result))
  }
  
  render() {
    const { values } = this.state;
    const {settings, personeData} = this.props;

    if(!settings.hasOwnProperty("USER") || !personeData.hasOwnProperty("Person_id"))
      return (<></>);

    const uSettings = settings.USER[personeData.Person_id];

    const calendarView = [
      { 
        name: "calendarView", 
        value: "dayGridMonth", 
        label: <><img src="http://dbi-ld.space/app/img/app/month.png" width="100%" title="Month"/></>,
      },
      {
        name: "calendarView",
        value: "timeGridWeek",
        label: <><img src="http://dbi-ld.space/app/img/app/week.png" width="100%" title="Week"/></>,
      },
      {
        name: "calendarView",
        value: "timeGridDay",
        label: <><img src="http://dbi-ld.space/app/img/app/day.png" width="100%" title="Day"/></>,
      },
      {
        name: "calendarView",
        value: "listWeek",
        label: <><img src="http://dbi-ld.space/app/img/app/list.png" width="100%" title="List"/></>,
      },
    ];

    return (
      <>
        <Button
          type="button"
          color="info"
          className="waves-effect waves-light w-100"
          onClick={this.switch_modal}
        >
          Change
        </Button>

        <Modal
          isOpen={this.state.modal}
          switch={this.switch_modal}
          centered={true}
        >
          <ModalHeader
            toggle={() => this.setState({ modal: false })}
            className="text-center"
          >
            Calendar Settings
          </ModalHeader>
          <ModalBody toggle={() => this.setState({ modal: false })}>
            <AvForm onValidSubmit = {this.calendarViewArg}>
              <FormGroup>
                <Label>Default view</Label>
                <Select
                  // attr-case-name={this.props.caseName}
                  options={calendarView}
                  defaultValue = {calendarView.find((x) => x.value === uSettings.CALENDAR_VIEW)}
                  className="basic-multi-select calendar-select"
                  name="calendarView"
                  classNamePrefix="select"
                  onChange={this.onSelectChange}
                  // value={owner.find((x) => x.value == this.props.Owner)}
                />
              </FormGroup>
              <Button color="info" type="submit" className="w-100">
              Confirm
            </Button>
            </AvForm>

          
          </ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.User.settings, 
    personeData: state.User.persone,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onCaseLoad: () => dispatch(actions.getCase()),
    onGlobalLoad: () => dispatch(actions.getGlobalData()),
  };
};


export default connect(mapStateToProps, mapDispatchToProps) (CalendarSettings);
