import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import * as CaseActions from "../../store/case/actions";
import CaseApi from "../../api/CaseApi";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#fff' : "#777777",
  }),
}

const LS_ITEM_NAME = "CURRENT_CASE";

class CaseSelector extends Component {
  state = {
    userCases: [],
    currentCaseData: null,
  }

  handleSelectChange = (el, e) => {
    const { action } = e;

    switch (action) {
      case "select-option":
        this.setState({currentCaseData: el.allData});
        this.props.setCurrentCase(el.allData);
        this.saveToLS(el.allData);
        break;

      case "clear":
        this.setState({currentCaseData: null});
        this.props.removeCurrentCase();
        this.saveToLS(null);
        break;
    
      default:
        break;
    }
    
  };

  setCasesList = async () => {
    const userCases = await CaseApi.fetchUserCases();    
    this.setState({userCases});
  }

  saveToLS = (data) => {
    localStorage.setItem(LS_ITEM_NAME, JSON.stringify(data));
  }

  loadFromLS = () => {
    const data = localStorage.getItem(LS_ITEM_NAME);

    if(!data) return;
    this.props.setCurrentCase(JSON.parse(data));
    this.setState({currentCaseData: JSON.parse(data)});
  }

  componentDidMount() {
    this.setCasesList();

    if(!this.props.currentCase){
      this.loadFromLS();
    } else {
      this.setState({currentCaseData: this.props.currentCase});
    } 
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.currentCase !== prevProps.currentCase){
      this.setState({currentCaseData: this.props.currentCase});
    }

    if(prevState.currentCaseData !== this.state.currentCaseData){

    }
  }
  

  render() {
    const { userCases, currentCaseData } = this.state;

    const selectOptions = userCases.map((x) => ({label: x.Case_Full_NAME, value: x.Case_Short_NAME, allData: x}));
    return (
      <div className="case-selector-block">
        <div className="case-selector-header">Current Case Selector</div>
        <div className="case-selector">
          <div className="current-case-color" style={{background: currentCaseData ? `linear-gradient(150deg, rgb(255, 255, 255) 50%, ${currentCaseData.CaseBg} 100%)` : "#d4d4d4"}}>
            {currentCaseData && currentCaseData.Case_Full_NAME[0]}
          </div>
          <Select
            name="Current_Case"
            onChange={this.handleSelectChange}
            options={selectOptions}
            isClearable={true}
            value={currentCaseData ? selectOptions.find((x) => x.value === currentCaseData.Case_Short_NAME) : null}
            className="d-block w-100"
            styles={customStyles}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cases: state.Case.cases,
    currentCase: state.Case.currentCase,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUserCases: () => dispatch(CaseActions.userCasesFetchRequested()),

  setCurrentCase: (data) => dispatch(CaseActions.setCurrentCaseAction(data)),
  removeCurrentCase: () => dispatch(CaseActions.removeCurrentCaseAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CaseSelector);
